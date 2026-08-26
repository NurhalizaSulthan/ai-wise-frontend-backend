package dto

import (
	"time"

	"github.com/google/uuid"
)

type TelemetryBase struct {
	PublicID uuid.UUID `json:"public_id"`

	AccX float64 `json:"acc_x"`
	AccY float64 `json:"acc_y"`
	AccZ float64 `json:"acc_z"`

	GyroX float64 `json:"gyro_x"`
	GyroY float64 `json:"gyro_y"`
	GyroZ float64 `json:"gyro_z"`

	Roll  float64 `json:"roll"`
	Pitch float64 `json:"pitch"`
	Yaw   float64 `json:"yaw"`

	Latitude  float64   `json:"latitude"`
	Longitude float64   `json:"longitude"`
	CreatedAt time.Time `json:"created_at"`
}

type TelemetryCreate struct {
	AccX float64 `json:"acc_x"`
	AccY float64 `json:"acc_y"`
	AccZ float64 `json:"acc_z"`

	GyroX float64 `json:"gyro_x"`
	GyroY float64 `json:"gyro_y"`
	GyroZ float64 `json:"gyro_z"`

	Roll  float64 `json:"roll"`
	Pitch float64 `json:"pitch"`
	Yaw   float64 `json:"yaw"`

	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}
