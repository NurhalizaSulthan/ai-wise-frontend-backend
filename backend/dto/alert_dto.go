package dto

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/enum"
	"github.com/google/uuid"
)

type AlertBase struct {
	PublicID     uuid.UUID `json:"public_id"`
	DeviceID     int       `json:"device_id"`
	JenisAlert   enum.JenisAlert    `json:"jenis_alert"`
	TingkatAlert enum.TingkatKeparahan    `json:"tingkat_alert"`
}

type AlertCreate struct {
	DevicePublicID     uuid.UUID       `json:"device_public_id"`
	JenisAlert   enum.JenisAlert    `json:"jenis_alert"`
	TingkatAlert enum.TingkatKeparahan    `json:"tingkat_alert"`
}