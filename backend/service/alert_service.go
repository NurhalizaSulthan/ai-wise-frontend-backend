package service

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/dto"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/mappers"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/repositories"
	"github.com/google/uuid"
)

type AlertService interface {
	Create(dto *dto.AlertCreate)(*dto.AlertBase, error)
	GetByPublicID(publicID uuid.UUID) (*dto.AlertBase, error)
	GetAll(
		// deviceID *int, 
		// jenisAlert *enum.JenisAlert, 
		// tingkatAlert *enum.TingkatKeparahan
		)([]dto.AlertBase, error)
}

type AlertServiceImpl struct {
	r repositories.AlertRepositories
	dr repositories.DeviceRepository
}

func NewAlertService(
		r repositories.AlertRepositories,
		dr repositories.DeviceRepository,
	) AlertService {
	return &AlertServiceImpl{
		r: r,
		dr: dr,
	}
}


func (s *AlertServiceImpl) Create(dto *dto.AlertCreate)(*dto.AlertBase, error) {
	device, err := s.dr.GetDeviceByPublicID(dto.DevicePublicID)
	if err != nil {
		return nil, err
	} 

	model := &model.Alert{
		DeviceID: device.InternalID,
		JenisAlert: dto.JenisAlert,
		TingkatAlert: dto.TingkatAlert,
	}

	data, err := s.r.CreateAlert(model)

	if err != nil {
		return nil, err
	}

	return mappers.Map(data, mappers.ToAlertBase), nil
}

func (s *AlertServiceImpl) GetByPublicID(publicID uuid.UUID) (*dto.AlertBase, error) {
	data, err := s.r.GetAlertByPublicId(publicID)

	if err != nil {
		return nil, err
	}

	return mappers.Map(data, mappers.ToAlertBase), nil
}

func (s *AlertServiceImpl) GetAll(
	// deviceID *int, 
	// jenisAlert *enum.JenisAlert,
	// tingkatAlert *enum.TingkatKeparahan
	 )([]dto.AlertBase, error) {
	// filter := &repositories.AlertFilter{
	// 	DeviceID: deviceID,
	// 	JenisAlert: jenisAlert,
	// 	TingkatAlert: tingkatAlert,
	// }

	data, err := s.r.GetAll(
		// *filter
	)
	if err != nil {
		return nil, err
	}

	return mappers.MapSlice(data, mappers.ToAlertBase), nil
}