package service

import (
	"fmt"

	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/dto"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/mappers"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	mqttclient "github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/mqtt_client"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/repositories"
	"github.com/google/uuid"
)

type DeviceService interface {
	Create(dto *dto.DeviceCreate) (*dto.DeviceBase, error)
	GetByPublicID(publicID uuid.UUID) (*dto.DeviceBase, error)
	GetAll() ([]dto.DeviceBase, error)
}

type DeviceServiceImpl struct {
	r          repositories.DeviceRepository
	pr         repositories.PekerjaRepository
	mqttClient *mqttclient.MQTTClient
}

func NewDeviceService(
	r repositories.DeviceRepository,
	pr repositories.PekerjaRepository,
	mqttClient *mqttclient.MQTTClient,
) DeviceService {
	return &DeviceServiceImpl{
		r:          r,
		pr:         pr,
		mqttClient: mqttClient,
	}
}

func (s *DeviceServiceImpl) Create(dto *dto.DeviceCreate) (*dto.DeviceBase, error) {
	pekerja, err := s.pr.GetPekerjaByUUID(dto.PekerjaPublicID)

	if err != nil {
		return nil, err
	}

	model := &model.Device{
		PekerjaID: &pekerja.InternalID,
	}

	data, err := s.r.CreateDevice(model)

	if err != nil {
		return nil, err
	}

	topicString := fmt.Sprintf("telemetry/%s", data.PublicID)
	s.mqttClient.AddTopic(data.InternalID, topicString)

	return mappers.Map(data, mappers.ToDeviceBase), nil
}

func (s *DeviceServiceImpl) GetByPublicID(publicID uuid.UUID) (*dto.DeviceBase, error) {
	data, err := s.r.GetDeviceByPublicID(publicID)

	if err != nil {
		return nil, err
	}

	return mappers.Map(data, mappers.ToDeviceBase), nil
}

func (s *DeviceServiceImpl) GetAll() ([]dto.DeviceBase, error) {
	data, err := s.r.GetAll()
	if err != nil {
		return nil, err
	}
	return mappers.MapSlice(data, mappers.ToDeviceBase), nil
}
