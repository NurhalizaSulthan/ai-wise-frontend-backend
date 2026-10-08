package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type HyperTelemetry struct {
	InternalID int       `json:"internal_id,omitempty" gorm:"column:internal_id;primaryKey;autoIncrement"`
	PublicID   uuid.UUID `json:"public_id,omitempty" gorm:"column:public_id;default:gen_random_uuid()"`
	DeviceID   int       `json:"device_id,omitempty" gorm:"column:device_id"`

	Time int `json:"time" gorm:"column:time"`

	AccX float64 `json:"x" gorm:"column:x"`
	AccY float64 `json:"y" gorm:"column:y"`
	AccZ float64 `json:"z" gorm:"column:z"`

	GyroX float64 `json:"gx" gorm:"column:gx"`
	GyroY float64 `json:"gy" gorm:"column:gy"`
	GyroZ float64 `json:"gz" gorm:"column:gz"`

	Total float64 `json:"total" gorm:"total"`

	Roll  float64 `json:"roll" gorm:"column:roll"`
	Pitch float64 `json:"pitch" gorm:"column:pitch"`
	Yaw   float64 `json:"yaw" gorm:"column:yaw"`

	Status string `gorm:"column:status"`

	// Latitude  float64 `gorm:"column:latitude"`
	// Longitude float64 `gorm:"column:longitude"`

	CreatedAt time.Time      `gorm:"column:created_at"`
	UpdatedAt time.Time      `gorm:"column:updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"column:deleted_at"`
}

func (t *HyperTelemetry) TableName() string {
	return "hyper_telemetries"
}
