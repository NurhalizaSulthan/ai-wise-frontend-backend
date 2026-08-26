package model

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/enum"
	"github.com/google/uuid"
)


type Alert struct {
	InternalID   int       				`gorm:"column:internal_id;primaryKey;autoIncrement"`
	PublicID     uuid.UUID 				`gorm:"column:public_id;default:gen_random_uuid()"`
	DeviceID     int       				`gorm:"column:device_id"`
	JenisAlert   enum.JenisAlert    	`gorm:"column:jenis_alert"`
	TingkatAlert enum.TingkatKeparahan  `gorm:"column:tingkat_alert"`
}

func (Alert) TableName() string {
	return "alerts"
}