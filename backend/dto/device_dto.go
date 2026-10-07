package dto

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/enum"
	"github.com/google/uuid"
)

type DeviceBase struct {
	PublicID   uuid.UUID         `json:"public_id"`
	PekerjaID  *int              `json:"pekerja_id"`
	MacAddress string            `json:"mac_address"`
	Status     enum.DeviceStatus `json:"status"`
	// ListAlert []AlertBase `json:"daftar_alert"`
	Telemetry []TelemetryBase `json:"telemetry,omitempty"`
}
type DeviceCreate struct {
	PekerjaPublicID uuid.UUID `json:"pekerja_public_id"`
}

type DeviceUpdate struct {
	PublicID   uuid.UUID          `json:"public_id"`
	PekerjaID  *int               `json:"pekerja_id"`
	MacAddress *string            `json:"mac_address"`
	Status     *enum.DeviceStatus `json:"status"`
}
