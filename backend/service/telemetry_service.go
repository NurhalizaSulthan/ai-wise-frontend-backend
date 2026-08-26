package service

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/dto"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/mappers"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/repositories"
	"github.com/google/uuid"
)

type TelemetryService interface {
	Create(dto *dto.TelemetryCreate) (*dto.TelemetryBase, error)
	GetByPublicID(publicID uuid.UUID) (*dto.TelemetryBase, error)
	GetAll() ([]dto.TelemetryBase, error)
}

type TelemetryServiceImpl struct {
	r repositories.TelemetryRepository
}

func NewTelemetryService(
	r repositories.TelemetryRepository,
) TelemetryService {
	return &TelemetryServiceImpl{
		r: r,
	}
}

func (s *TelemetryServiceImpl) Create(dto *dto.TelemetryCreate) (*dto.TelemetryBase, error) {
	model := mappers.Map(dto, mappers.ToTelemetryModel)

	telemetry, err := s.r.Create(model)

	if err != nil {
		return nil, err
	}

	return mappers.Map(telemetry, mappers.ToTelemetryBase), nil
}

func (s *TelemetryServiceImpl) GetByPublicID(publicID uuid.UUID) (*dto.TelemetryBase, error) {
	data, err := s.r.GetDetail(publicID)

	if err != nil {
		return nil, err
	}

	return mappers.Map(data, mappers.ToTelemetryBase), nil
}

func (s *TelemetryServiceImpl) GetAll() ([]dto.TelemetryBase, error) {
	data, err := s.r.GetAll()
	if err != nil {
		return nil, err
	}
	return mappers.MapSlice(data, mappers.ToTelemetryBase), nil
}
