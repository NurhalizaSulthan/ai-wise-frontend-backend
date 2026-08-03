package service

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/dto"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/mappers"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/repositories"
	"github.com/google/uuid"
)

type PekerjaService interface {
	Create(dto *dto.PekerjaCreate)(*dto.PekerjaBase, error)
	GetByPublicID(publicID uuid.UUID) (*dto.PekerjaBase, error)
	GetAll(
		// pengawasID *int
		)([]dto.PekerjaBase, error)
}

type PekerjaServiceImpl struct {
	r repositories.PekerjaRepository
	pr repositories.PengawasRepository
	dr repositories.DeviceRepository
}

func NewPekerjaService(
		r repositories.PekerjaRepository,
		pr repositories.PengawasRepository,
		dr repositories.DeviceRepository,
	) PekerjaService {
	return &PekerjaServiceImpl{
		r: r,
		pr: pr,
		dr: dr,
	}
}


func (s *PekerjaServiceImpl) Create(dto *dto.PekerjaCreate)(*dto.PekerjaBase, error) {
	pengawas, err := s.pr.GetPengawasByUUID(dto.PengawasPublicID)

	if err != nil {
		return nil, err
	}

	model := &model.Pekerja{
		Nama: dto.Nama,
		TanggalLahir: dto.TanggalLahir,
		JenisKelamin: dto.JenisKelamin,
		PengawasID: pengawas.InternalID,
		}

	data, err := s.r.CreatePekerja(model)

	if err != nil {
		return nil, err
	}

	device, err := s.dr.GetDeviceByPublicID(dto.DevicePublicID)

	if err != nil {
		return nil, err
	}
	if err := s.dr.UpdateDevice(device.InternalID, data.InternalID);err != nil {
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
)([]dto.PekerjaBase, error) {
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