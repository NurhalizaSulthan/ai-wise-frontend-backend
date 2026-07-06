package mappers

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/dto"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
)

func ToAlertBase(a *model.Alert) *dto.AlertBase {
	if a == nil{
		return nil
	}

	return &dto.AlertBase{
		PublicID:     a.PublicID,
		DeviceID:     a.DeviceID,
		JenisAlert:   a.JenisAlert,
		TingkatAlert: a.TingkatAlert,
	}
}

func ToAlertModel(a *dto.AlertBase) *model.Alert {
	if a == nil {
		return nil
	}

	return &model.Alert{
		DeviceID: a.DeviceID,
		JenisAlert: a.JenisAlert,
		TingkatAlert: a.TingkatAlert,
	}
}