package service

import (
	"errors"

	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/config"
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
	Update(update *dto.PekerjaUpdate) (*dto.PekerjaBase, error)
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
			Data:           []dto.PekerjaBase{},
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
	pengawas, err := s.pr.GetPengawasByUUID(nil, dto.PengawasPublicID)

	if err != nil {
		return nil, err
	}

	tx := config.DB.Begin()
	if tx.Error != nil {
		return nil, tx.Error
	}

	committed := false

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			panic(r)
		}
		if !committed {
			tx.Rollback()
		}
	}()

	model := &model.Pekerja{
		Nama:         dto.Nama,
		TanggalLahir: dto.TanggalLahir,
		JenisKelamin: dto.JenisKelamin,
		PengawasID:   pengawas.InternalID,
	}

	data, err := s.r.CreatePekerja(tx, model)

	if err != nil {
		return nil, err
	}

	device, err := s.dr.GetDeviceByPublicID(tx, dto.DevicePublicID)

	if err != nil {
		return nil, err
	}

	device.PekerjaID = &data.InternalID

	if err := s.dr.UpdateDevice(tx, device); err != nil {
		return nil, err
	}

	data.Device = device

	if err := tx.Commit().Error; err != nil {
		return nil, err
	}

	committed = true

	return mappers.Map(data, mappers.ToPekerjaBase), nil
}

func (s *PekerjaServiceImpl) GetByPublicID(publicID uuid.UUID) (*dto.PekerjaBase, error) {
	data, err := s.r.GetPekerjaByUUID(nil, publicID)

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
		nil,
	// *filter
	)
	if err != nil {
		return nil, err
	}

	return mappers.MapSlice(data, mappers.ToPekerjaBase), nil
}

func (s *PekerjaServiceImpl) Update(
	update *dto.PekerjaUpdate,
) (*dto.PekerjaBase, error) {
	tx := config.DB.Begin()
	if tx.Error != nil {
		return nil, tx.Error
	}

	committed := false

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			panic(r)
		}
		if !committed {
			tx.Rollback()
		}
	}()

	model, err := s.r.GetPekerjaByUUID(tx, *update.PublicID)

	if err != nil {
		return nil, err
	}

	if model == nil {
		return nil, errors.New("Pekerja not found")
	}

	if update.DevicePublicID != nil {
		if model.Device == nil ||
			model.Device.PublicID != *update.DevicePublicID {

			if model.Device != nil {
				model.Device.PekerjaID = nil

				if err := s.dr.UpdateDevice(tx, model.Device); err != nil {
					return nil, err
				}
			}

			device, err := s.dr.GetDeviceByPublicID(
				tx,
				*update.DevicePublicID,
			)
			if err != nil {
				return nil, err
			}

			device.PekerjaID = &model.InternalID

			if err := s.dr.UpdateDevice(tx, device); err != nil {
				return nil, err
			}

			model.Device = device
		}
	}
	if update.Nama != nil {
		model.Nama = *update.Nama
	}

	if update.TanggalLahir != nil {
		model.TanggalLahir = *update.TanggalLahir
	}

	if update.JenisKelamin != nil {
		model.JenisKelamin = *update.JenisKelamin
	}

	if err = s.r.Update(tx, model); err != nil {
		return nil, err
	}

	if err := tx.Commit().Error; err != nil {
		return nil, err
	}

	committed = true

	return mappers.Map(model, mappers.ToPekerjaBase), nil

}
