package model

import (
	"github.com/google/uuid"
)


type Alert struct {
	InternalID   int       `json:"internal_id"   gorm:"column:internal_id;primaryKey;autoIncrement"`
	PublicID     uuid.UUID `json:"public_id"     gorm:"column:public_id;unique"`
	DeviceID     int       `json:"device_id"     gorm:"column:device_id"`
	JenisAlert   string    `json:"jenis_alert"   gorm:"column:jenis_alert"`
	TingkatAlert string    `json:"tingkat_alert" gorm:"column:tingkat_alert"`
}

func (Alert) TableName() string {
	return "alerts"
}