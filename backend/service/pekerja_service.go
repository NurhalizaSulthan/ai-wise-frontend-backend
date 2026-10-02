package service

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/dto"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/mappers"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/repositories"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/utils"
	"github.com/google/uuid"
)

type PekerjaService interface {
	Create(dto *dto.PekerjaCreate) (*dto.PekerjaBase, error)
	GetByPublicID(publicID uuid.UUID) (*dto.PekerjaBase, error)
	GetAll() ([]dto.PekerjaBase, error)
	GetPagination(before string, after string) (*dto.PaginationResult, error)
}

type PekerjaServiceImpl struct {
	r  repositories.PekerjaRepository
	pr repositories.PengawasRepository
	dr repositories.DeviceRepository
}

func (s *PekerjaServiceImpl) GetPagination(before string, after string) (*dto.PaginationResult, error) {
	const pageSize = 10

	var data []model.Pekerja
	var err error

	switch {
	case before != "":
		uid, timestamp, decodeErr := utils.DecodeCursor(before)
		if decodeErr != nil {
			return nil, decodeErr
		}

		data, err = s.r.GetWithPagination(
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
			true,
			*uid,
			*timestamp,
		)

	default:
		data, err = s.r.GetFirstPaginatio()
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
			mappers.ToPekerjaBase,
		),

		NextCursor:     &nextCursor,
		PreviousCursor: &previousCursor,
		HasNext:        hasNext,
		HasPrevious:    hasPrevious,
	}, nil
}

func NewPekerjaService(
	r repositories.PekerjaRepository,
	pr repositories.PengawasRepository,
	dr repositories.DeviceRepository,
) PekerjaService {
	return &PekerjaServiceImpl{
		r:  r,
		pr: pr,
		dr: dr,
	}
}

func (s *PekerjaServiceImpl) Create(dto *dto.PekerjaCreate) (*dto.PekerjaBase, error) {
	// pengawas, err := s.pr.GetPengawasByUUID(dto.PengawasPublicID)

	// if err != nil {
	// 	return nil, err
	// }

	model := &model.Pekerja{
		Nama:         dto.Nama,
		TanggalLahir: dto.TanggalLahir,
		JenisKelamin: dto.JenisKelamin,
		// PengawasID: pengawas.InternalID,
	}

	data, err := s.r.CreatePekerja(model)

	if err != nil {
		return nil, err
	}

	device, err := s.dr.GetDeviceByPublicID(dto.DevicePublicID)

	if err != nil {
		return nil, err
	}
	if err := s.dr.UpdateDevice(device.InternalID, data.InternalID); err != nil {
		return nil, err
	}

	return mappers.Map(data, mappers.ToPekerjaBase), nil
}

func (s *PekerjaServiceImpl) GetByPublicID(publicID uuid.UUID) (*dto.PekerjaBase, error) {
	data, err := s.r.GetPekerjaByUUID(publicID)

	if err != nil {
		return nil, err
	}

	return mappers.Map(data, mappers.ToPekerjaBase), nil
}

func (s *PekerjaServiceImpl) GetAll(
// pengawasID *int,
) ([]dto.PekerjaBase, error) {
	// filter := &repositories.PekerjaFilter{}
	// if pengawasID != nil {
	// 	filter.PengawasID = pengawasID

	// }
	data, err := s.r.GetAll(
	// *filter
	)
	if err != nil {
		return nil, err
	}

	return mappers.MapSlice(data, mappers.ToPekerjaBase), nil
}
