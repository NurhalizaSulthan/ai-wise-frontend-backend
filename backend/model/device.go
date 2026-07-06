package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)



type Device struct {
	InternalID int            `json:"internal_id" gorm:"column:internal_id;primaryKey;autoIncrement"`
	PublicID   uuid.UUID      `json:"public_id"   gorm:"column:public_id;unique"`
	PekerjaID  int            `json:"pekerja_id"  gorm:"column:pekerja_id;unique"`
	ListAlert  []Alert        `json:"daftar_alert" gorm:"foreignKey:DeviceID;references:InternalID"`

	CreatedAt time.Time      `json:"created_at"  gorm:"column:created_at"`
	UpdatedAt time.Time      `json:"updated_at"  gorm:"column:updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at"  gorm:"column:deleted_at"`
}

func (Device) TableName() string {
	return "devices"
}