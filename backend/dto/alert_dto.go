package dto

import "github.com/google/uuid"

type AlertBase struct {
	PublicID     uuid.UUID `json:"public_id"`
	DeviceID     int       `json:"device_id"`
	JenisAlert   string    `json:"jenis_alert"`
	TingkatAlert string    `json:"tingkat_alert"`
}
