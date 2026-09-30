package mqttclient

import (
	"encoding/json"
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/repositories"
	mqtt "github.com/eclipse/paho.mqtt.golang"
)

const MaxBatchSize = 500
const FlushInterval = 5 * time.Second

type MQTTClient struct {
	client         mqtt.Client
	topics         map[string]*MQTTTopic
	telemetryQueue chan []model.HyperTelemetry

	mu sync.RWMutex

	repo repositories.TelemetryRepository
}

type MQTTTopic struct {
	DeviceID int
	Topic    string

	Buffer []model.HyperTelemetry

	MessageHandler mqtt.MessageHandler
	OnBatchReady   func([]model.HyperTelemetry)

	done chan struct{}

	mu sync.Mutex
}

func NewMQTTClient(
	broker string,
	clientID string,
	repo repositories.TelemetryRepository,
) *MQTTClient {

	opts := mqtt.NewClientOptions()

	opts.AddBroker(broker)
	opts.SetClientID(clientID)
	opts.SetAutoReconnect(true)

	m := &MQTTClient{
		topics: make(map[string]*MQTTTopic),

		telemetryQueue: make(
			chan []model.HyperTelemetry,
			10,
		),

		repo: repo,
	}

	opts.OnConnectionLost = m.ConnectionLostHandler
	opts.OnConnect = m.OnConnect

	m.client = mqtt.NewClient(opts)

	return m
}

func (m *MQTTClient) AddTopic(
	deviceID int,
	topic string,
) error {

	m.mu.Lock()

	if _, exists := m.topics[topic]; exists {
		m.mu.Unlock()

		return fmt.Errorf(
			"topic %s already exists",
			topic,
		)
	}

	m.mu.Unlock()

	mqttTopic := NewMQTTTopic(
		deviceID,
		topic,
		func(batch []model.HyperTelemetry) {
			m.telemetryQueue <- batch
		},
	)

	m.mu.Lock()

	if _, exists := m.topics[topic]; exists {
		m.mu.Unlock()

		mqttTopic.Stop()

		return fmt.Errorf(
			"topic %s already exists",
			topic,
		)
	}

	m.topics[topic] = mqttTopic

	m.mu.Unlock()

	if m.client.IsConnected() {
		token := m.client.Subscribe(
			topic,
			1,
			mqttTopic.MessageHandler,
		)

		if token.Wait() && token.Error() != nil {
			m.mu.Lock()
			delete(m.topics, topic)
			m.mu.Unlock()

			mqttTopic.Stop()

			return token.Error()
		}

		log.Printf(
			"Subscribed to %s for device %d",
			topic,
			deviceID,
		)
	}

	log.Printf(
		"Topic %s added for device %d",
		topic,
		deviceID,
	)

	return nil
}

func (m *MQTTClient) Connect() error {
	token := m.client.Connect()

	if token.Wait() && token.Error() != nil {
		return token.Error()
	}

	return nil
}

func (m *MQTTClient) StartTelemetryWorker() {
	go func() {
		for batch := range m.telemetryQueue {
			if err := m.repo.BatchCreate(batch); err != nil {
				log.Printf(
					"failed to insert telemetry batch: %v",
					err,
				)
			}
		}
	}()
}

func (m *MQTTClient) ConnectionLostHandler(
	client mqtt.Client,
	err error,
) {
	log.Printf("MQTT connection lost: %v", err)

	m.mu.RLock()
	defer m.mu.RUnlock()

	for _, topic := range m.topics {
		log.Printf(
			"Device %d affected by connection loss",
			topic.DeviceID,
		)
	}
}

func (m *MQTTClient) OnConnect(client mqtt.Client) {
	log.Println("MQTT connected")

	m.mu.RLock()

	topics := make(map[string]*MQTTTopic, len(m.topics))

	for topic, mqttTopic := range m.topics {
		topics[topic] = mqttTopic
	}

	m.mu.RUnlock()

	for topic, mqttTopic := range topics {
		token := client.Subscribe(
			topic,
			1,
			mqttTopic.MessageHandler,
		)

		if token.Wait() && token.Error() != nil {
			log.Printf(
				"failed to subscribe to %s: %v",
				topic,
				token.Error(),
			)

			continue
		}

		log.Printf(
			"Subscribed to %s for device %d",
			topic,
			mqttTopic.DeviceID,
		)
	}
}

func (m *MQTTClient) RemoveTopic(topic string) error {
	m.mu.Lock()

	mqttTopic, exists := m.topics[topic]

	if !exists {
		m.mu.Unlock()

		return fmt.Errorf(
			"topic %s does not exist",
			topic,
		)
	}

	delete(m.topics, topic)

	m.mu.Unlock()

	mqttTopic.Stop()

	if m.client.IsConnected() {
		token := m.client.Unsubscribe(topic)

		if token.Wait() && token.Error() != nil {
			return token.Error()
		}
	}

	log.Printf(
		"Topic %s removed for device %d",
		topic,
		mqttTopic.DeviceID,
	)

	return nil
}
func NewMQTTTopic(
	deviceID int,
	topic string,
	onBatchReady func([]model.HyperTelemetry),
) *MQTTTopic {

	t := &MQTTTopic{
		DeviceID:     deviceID,
		Topic:        topic,
		Buffer:       make([]model.HyperTelemetry, 0, MaxBatchSize),
		OnBatchReady: onBatchReady,
		done:         make(chan struct{}),
	}

	t.MessageHandler = func(
		client mqtt.Client,
		message mqtt.Message,
	) {
		telemetry := &model.HyperTelemetry{}

		if err := json.Unmarshal(
			message.Payload(),
			telemetry,
		); err != nil {
			log.Printf(
				"error receiving telemetry from %s: %v",
				topic,
				err,
			)
			return
		}

		telemetry.DeviceID = deviceID

		batch := t.AddTelemetry(*telemetry)

		if batch == nil {
			return
		}

		if t.OnBatchReady != nil {
			t.OnBatchReady(batch)
		}

		log.Printf(
			"Topic %s reached %d records",
			topic,
			len(batch),
		)
	}

	go t.startFlushWorker()
	return t
}

func (t *MQTTTopic) AddTelemetry(
	telemetry model.HyperTelemetry,
) []model.HyperTelemetry {

	t.mu.Lock()
	defer t.mu.Unlock()

	t.Buffer = append(t.Buffer, telemetry)

	if len(t.Buffer) < MaxBatchSize {
		return nil
	}

	batch := make([]model.HyperTelemetry, len(t.Buffer))
	copy(batch, t.Buffer)

	t.Buffer = t.Buffer[:0]

	return batch
}

func (t *MQTTTopic) Flush() []model.HyperTelemetry {
	t.mu.Lock()
	defer t.mu.Unlock()

	if len(t.Buffer) == 0 {
		return nil
	}

	batch := make([]model.HyperTelemetry, len(t.Buffer))
	copy(batch, t.Buffer)

	t.Buffer = t.Buffer[:0]

	return batch
}

func (t *MQTTTopic) startFlushWorker() {
	ticker := time.NewTicker(FlushInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			batch := t.Flush()

			if batch == nil {
				continue
			}

			if t.OnBatchReady != nil {
				t.OnBatchReady(batch)
			}

			log.Printf(
				"Time flush: topic %s sent %d records",
				t.Topic,
				len(batch),
			)

		case <-t.done:
			return
		}
	}
}

func (t *MQTTTopic) Stop() {
	close(t.done)
}
