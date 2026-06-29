package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DeviceBase struct {
	PublicID  uuid.UUID   `json:"public_id"`
	PekerjaID int         `json:"pekerja_id"`
	ListAlert []AlertBase `json:"daftar_alert"`
}

type Device struct {
	InternalID int            `json:"internal_id" gorm:"column:internal_id;primaryKey;autoIncrement"`
	PublicID   uuid.UUID      `json:"public_id"   gorm:"column:public_id;unique"`
	PekerjaID  int            `json:"pekerja_id"  gorm:"column:pekerja_id;unique"`
	ListAlert  []Alert        `json:"daftar_alert" gorm:"foreignKey:DeviceID"`

	CreatedAt time.Time      `json:"created_at"  gorm:"column:created_at"`
	UpdatedAt time.Time      `json:"updated_at"  gorm:"column:updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at"  gorm:"column:deleted_at"`
}

func (Device) TableName() string {
	return "devices"
}

func (d Device) GormToBase() *DeviceBase {
	alerts := make([]AlertBase, len(d.ListAlert))
	for i, a := range d.ListAlert {
		alerts[i] = *a.GormToBase()
	}
	return &DeviceBase{
		PublicID:  d.PublicID,
		PekerjaID: d.PekerjaID,
		ListAlert: alerts,
	}
}