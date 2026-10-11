package mappers

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/dto"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
)

func ToDeviceBase(d *model.Device) *dto.DeviceBase {

	if d == nil {
		return nil
	}

	base := &dto.DeviceBase{
		PublicID:   d.PublicID,
		Nama:       d.Nama,
		PekerjaID:  d.PekerjaID,
		MacAddress: d.MacAddress,
		Status:     d.Status,
	}

	if telemetry := MapSlice(d.Telemetry, ToTelemetryBase); telemetry != nil {
		base.Telemetry = telemetry
	}

	// if alert := MapSlice(d.ListAlert, ToAlertBase); alert != nil {
	// 	base.ListAlert = alert
	// }

	return base

}

func ToDeviceModel(d *dto.DeviceBase) *model.Device {
	if d == nil {
		return nil
	}

	model := &model.Device{
		PekerjaID: d.PekerjaID,
	}

	return model
}
