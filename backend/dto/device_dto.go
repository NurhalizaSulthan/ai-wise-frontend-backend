package dto

import "github.com/google/uuid"

type DeviceBase struct {
	PublicID  uuid.UUID `json:"public_id"`
	PekerjaID *int      `json:"pekerja_id"`
	// ListAlert []AlertBase `json:"daftar_alert"`
	Telemetry []TelemetryBase `json:"telemetry,omitempty"`
}
type DeviceCreate struct {
	PekerjaPublicID uuid.UUID `json:"pekerja_public_id"`
}
