package service

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/dto"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/mappers"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/repositories"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/utils"
	"github.com/google/uuid"
)

type TelemetryService interface {
	Create(dto *dto.TelemetryCreate) (*dto.TelemetryBase, error)
	GetByPublicID(publicID uuid.UUID) (*dto.TelemetryBase, error)
	GetAll() ([]dto.TelemetryBase, error)
	GetPagination(before string, after string) (*dto.PaginationResult, error)
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

func (s *TelemetryServiceImpl) GetPagination(
	before string,
	after string,
) (*dto.PaginationResult, error) {

	const pageSize = 10

	var data []model.Telemetry
	var err error

	switch {
	case before != "":
		uid, timestamp, decodeErr := utils.DecodeCursor(before)
		if decodeErr != nil {
			return nil, decodeErr
		}

		data, err = s.r.GetPagination(
			*uid,
			*timestamp,
			false,
		)

	case after != "":
		uid, timestamp, decodeErr := utils.DecodeCursor(after)
		if decodeErr != nil {
			return nil, decodeErr
		}

		data, err = s.r.GetPagination(
			*uid,
			*timestamp,
			true,
		)

	default:
		data, err = s.r.GetFirstPagination()
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
			Data:           []dto.TelemetryBase{},
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
			mappers.ToTelemetryBase,
		),

		NextCursor:     &nextCursor,
		PreviousCursor: &previousCursor,
		HasNext:        hasNext,
		HasPrevious:    hasPrevious,
	}, nil
}
