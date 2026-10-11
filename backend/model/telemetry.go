package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Telemetry struct {
	InternalID int       `gorm:"column:internal_id;primaryKey;autoIncrement"`
	PublicID   uuid.UUID `gorm:"column:public_id;default:gen_random_uuid()"`
	DeviceID   int       `gorm:"column:device_id"`

	AccX float64 `gorm:"column:acc_x"`
	AccY float64 `gorm:"column:acc_y"`
	AccZ float64 `gorm:"column:acc_z"`

	GyroX float64 `gorm:"column:gyro_x"`
	GyroY float64 `gorm:"column:gyro_y"`
	GyroZ float64 `gorm:"column:gyro_z"`

	Roll  float64 `gorm:"column:roll"`
	Pitch float64 `gorm:"column:pitch"`
	Yaw   float64 `gorm:"column:yaw"`

	Latitude  float64 `gorm:"column:latitude"`
	Longitude float64 `gorm:"column:longitude"`

	CreatedAt time.Time      `gorm:"column:created_at"`
	UpdatedAt time.Time      `gorm:"column:updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"column:deleted_at"`
}

func (t *Telemetry) TableName() string {
	return "telemetries"
}
