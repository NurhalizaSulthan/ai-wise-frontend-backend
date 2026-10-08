package websocketutils

import (
	"encoding/json"
	"log"
	"strings"
	"sync"

	"github.com/gofiber/contrib/v3/websocket"
)

type WebSocketClient struct {
	SessionRegistration string
	SessionMacAddress   string
	WSConnection        *websocket.Conn

	writeMu sync.Mutex
}

func NewWebSocketClient(SessionRegistration string, conn *websocket.Conn) *WebSocketClient {
	sessionMacAddress := strings.Split(SessionRegistration, "+")[0]

	return &WebSocketClient{
		SessionRegistration: SessionRegistration,
		SessionMacAddress:   sessionMacAddress,
		WSConnection:        conn,
	}
}

type Hub struct {
	clients []*WebSocketClient
	mu      sync.RWMutex
}

func NewHub() *Hub {
	return &Hub{
		clients: make([]*WebSocketClient, 0, 10),
	}
}

func (h *Hub) Register(sessionRegistration string, conn *websocket.Conn) {
	h.mu.Lock()
	defer h.mu.Unlock()

	key := sessionRegistration
	newClient := NewWebSocketClient(sessionRegistration, conn)
	h.clients = append(h.clients, newClient)
	log.Printf("WS client registered for mac address %s", key)
}

func (h *Hub) Unregister(sessionRegistration string, conn *websocket.Conn) {
	h.mu.Lock()
	defer h.mu.Unlock()

	for i, client := range h.clients {
		if client.SessionRegistration == sessionRegistration &&
			client.WSConnection == conn {

			h.clients = append(h.clients[:i], h.clients[i+1:]...)

			log.Printf(
				"WS client unregistered from session %s",
				sessionRegistration,
			)

			return
		}
	}

	log.Printf(
		"WS client for session %s already unregistered",
		sessionRegistration,
	)
}

func (h *Hub) Broadcast(macAddress string, payload any) {
	h.mu.RLock()

	var clients []*WebSocketClient

	for _, client := range h.clients {
		if client.SessionMacAddress == macAddress {
			clients = append(clients, client)
		}
	}

	h.mu.RUnlock()

	if len(clients) == 0 {
		return
	}

	data, err := json.Marshal(payload)
	if err != nil {
		log.Printf("WS failed to marshal broadcast payload: %v", err)
		return
	}

	for _, client := range clients {
		client.writeMu.Lock()

		err := client.WSConnection.WriteMessage(1, data)

		client.writeMu.Unlock()

		if err != nil {
			log.Printf(
				"WS failed to write to session %s: %v",
				client.SessionRegistration,
				err,
			)
		}
	}
}

func (h *Hub) BroadcastFinished(macAddress string) {
	type finishedEvent struct {
		Event string `json:"event"`
	}

	data, err := json.Marshal(finishedEvent{
		Event: "finished",
	})
	if err != nil {
		log.Printf("WS failed to marshal finished event: %v", err)
		return
	}

	h.mu.Lock()
	defer h.mu.Unlock()

	remainingClients := h.clients[:0]
	disconnectedCount := 0

	for _, client := range h.clients {
		if client.SessionMacAddress != macAddress {
			remainingClients = append(remainingClients, client)
			continue
		}

		client.writeMu.Lock()

		if err := client.WSConnection.WriteMessage(1, data); err != nil {
			log.Printf(
				"WS failed to write finished event to session %s: %v",
				client.SessionRegistration,
				err,
			)
		}

		client.writeMu.Unlock()

		if err := client.WSConnection.Close(); err != nil {
			log.Printf(
				"WS failed to close session %s: %v",
				client.SessionRegistration,
				err,
			)
		}

		disconnectedCount++
	}

	h.clients = remainingClients

	log.Printf(
		"WS device %s finished, disconnected %d client(s)",
		macAddress,
		disconnectedCount,
	)
}

func (h *Hub) Run() {
	log.Println("WS hub running")
	select {}
}
