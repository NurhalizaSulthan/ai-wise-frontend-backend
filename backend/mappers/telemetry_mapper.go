package mappers

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/dto"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
)

func ToTelemetryBase(model *model.Telemetry) *dto.TelemetryBase {
	return &dto.TelemetryBase{
		PublicID:  model.PublicID,
		AccX:      model.AccX,
		AccY:      model.AccY,
		AccZ:      model.AccZ,
		GyroX:     model.GyroX,
		GyroY:     model.GyroY,
		GyroZ:     model.GyroZ,
		Roll:      model.Roll,
		Pitch:     model.Pitch,
		Yaw:       model.Yaw,
		Latitude:  model.Latitude,
		Longitude: model.Longitude,
		CreatedAt: model.CreatedAt,
	}
}

func ToTelemetryModel(dto *dto.TelemetryCreate) *model.Telemetry {
	return &model.Telemetry{
		AccX:      dto.AccX,
		AccY:      dto.AccY,
		AccZ:      dto.AccZ,
		GyroX:     dto.GyroX,
		GyroY:     dto.GyroY,
		GyroZ:     dto.GyroZ,
		Roll:      dto.Roll,
		Pitch:     dto.Pitch,
		Yaw:       dto.Yaw,
		Latitude:  dto.Latitude,
		Longitude: dto.Longitude,
	}
}
