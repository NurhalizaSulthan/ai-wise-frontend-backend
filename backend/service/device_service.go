package service

import (
	"fmt"

	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/config"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/dto"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/mappers"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	mqttclient "github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/mqtt_client"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/repositories"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/utils"
	"github.com/google/uuid"
)

type DeviceService interface {
	Create(dto *dto.DeviceCreate) (*dto.DeviceBase, error)
	GetByPublicID(publicID uuid.UUID) (*dto.DeviceBase, error)
	GetAll() ([]dto.DeviceBase, error)
	GetPagination(before string, after string) (*dto.PaginationResult, error)
	Update(dto dto.DeviceUpdate) (*dto.DeviceBase, error)
}

type DeviceServiceImpl struct {
	r          repositories.DeviceRepository
	pr         repositories.PekerjaRepository
	mqttClient *mqttclient.MQTTClient
}

func (s *DeviceServiceImpl) GetPagination(before string, after string) (*dto.PaginationResult, error) {
	const pageSize = 10

	var data []model.Device
	var err error

	switch {
	case before != "":
		uid, timestamp, decodeErr := utils.DecodeCursor(before)
		if decodeErr != nil {
			return nil, decodeErr
		}

		data, err = s.r.GetWithPagination(
			nil,
			false,
			*uid,
			*timestamp,
		)

	case after != "":
		uid, timestamp, decodeErr := utils.DecodeCursor(after)
		if decodeErr != nil {
			return nil, decodeErr
		}

		data, err = s.r.GetWithPagination(
			nil,
			true,
			*uid,
			*timestamp,
		)

	default:
		data, err = s.r.GetFirstPaginatio(nil)
	}

	if err != nil {
		return nil, err
	}

	hasExtra := len(data) > pageSize

	hasNext := false
	hasPrevious := false

	switch {
	case before != "":
		hasNext = true
		hasPrevious = hasExtra

	case after != "":
		hasNext = hasExtra
		hasPrevious = true

	default:
		hasNext = hasExtra
		hasPrevious = false
	}

	if hasExtra {
		data = data[:pageSize]
	}

	if before != "" {
		for i, j := 0, len(data)-1; i < j; i, j = i+1, j-1 {
			data[i], data[j] = data[j], data[i]
		}
	}

	if len(data) == 0 {
		return &dto.PaginationResult{
			Data:           []dto.DeviceBase{},
			NextCursor:     nil,
			PreviousCursor: nil,
			HasNext:        false,
			HasPrevious:    false,
		}, nil
	}

	first := data[0]

	previousCursor := utils.EncodeCursor(
		first.PublicID,
		first.CreatedAt,
	)

	last := data[len(data)-1]

	nextCursor := utils.EncodeCursor(
		last.PublicID,
		last.CreatedAt,
	)

	return &dto.PaginationResult{
		Data: mappers.MapSlice(
			data,
			mappers.ToDeviceBase,
		),

		NextCursor:     &nextCursor,
		PreviousCursor: &previousCursor,
		HasNext:        hasNext,
		HasPrevious:    hasPrevious,
	}, nil
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
	tx := config.DB.Begin()

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	pekerja, err := s.pr.GetPekerjaByUUID(tx, dto.PekerjaPublicID)

	if err != nil {
		return nil, err
	}

	model := &model.Device{
		PekerjaID: &pekerja.InternalID,
	}

	data, err := s.r.CreateDevice(tx, model)

	if err != nil {
		return nil, err
	}

	topicString := fmt.Sprintf("telemetry/%s", data.PublicID)
	s.mqttClient.AddTopic(data.InternalID, topicString)

	if err := tx.Commit().Error; err != nil {
		return nil, err
	}
	return mappers.Map(data, mappers.ToDeviceBase), nil
}

func (s *DeviceServiceImpl) GetByPublicID(publicID uuid.UUID) (*dto.DeviceBase, error) {
	data, err := s.r.GetDeviceByPublicID(nil, publicID)

	if err != nil {
		return nil, err
	}

	return mappers.Map(data, mappers.ToDeviceBase), nil
}

func (s *DeviceServiceImpl) GetAll() ([]dto.DeviceBase, error) {
	data, err := s.r.GetAll(nil)
	if err != nil {
		return nil, err
	}
	return mappers.MapSlice(data, mappers.ToDeviceBase), nil
}

func (s *DeviceServiceImpl) Update(dto dto.DeviceUpdate) (*dto.DeviceBase, error) {
	tx := config.DB.Begin()

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	device, err := s.r.GetDeviceByPublicID(tx, dto.PublicID)

	if err != nil {
		return nil, err
	}

	if dto.MacAddress != nil {
		device.MacAddress = *dto.MacAddress
	}

	if dto.Status != nil {
		device.Status = *dto.Status
	}

	if dto.PekerjaID != nil {
		device.PekerjaID = dto.PekerjaID
	}

	err = s.r.UpdateDevice(tx, device)

	if err != nil {
		return nil, err
	}

	if err := tx.Commit().Error; err != nil {
		return nil, err
	}
	return mappers.Map(device, mappers.ToDeviceBase), nil
}
