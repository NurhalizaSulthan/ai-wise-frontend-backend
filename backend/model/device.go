package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)



type Device struct {
	InternalID int            `gorm:"column:internal_id;primaryKey;autoIncrement"`
	PublicID   uuid.UUID      `gorm:"column:public_id;default:gen_random_uuid()"`
	PekerjaID  *int            `gorm:"column:pekerja_id;unique"`
	ListAlert  []Alert        `gorm:"foreignKey:DeviceID"`

	CreatedAt time.Time      `gorm:"column:created_at"`
	UpdatedAt time.Time      `gorm:"column:updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"column:deleted_at"`
}

func (Device) TableName() string {
	return "devices"
}