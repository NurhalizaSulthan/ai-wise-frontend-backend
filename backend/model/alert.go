package model

import "github.com/google/uuid"

type AlertBase struct {
	PublicID     uuid.UUID `json:"public_id"`
	DeviceID     int       `json:"device_id"`
	JenisAlert   string    `json:"jenis_alert"`
	TingkatAlert string    `json:"tingkat_alert"`
}

type Alert struct {
	InternalID   int       `json:"internal_id"   gorm:"column:internal_id;primaryKey;autoIncrement"`
	PublicID     uuid.UUID `json:"public_id"     gorm:"column:public_id;unique"`
	DeviceID     int       `json:"device_id"     gorm:"column:device_id"`
	JenisAlert   string    `json:"jenis_alert"   gorm:"column:jenis_alert"`
	TingkatAlert string    `json:"tingkat_alert" gorm:"column:tingkat_alert"`
}

func (a Alert) GormToBase() *AlertBase {
	return &AlertBase{
		PublicID:     a.PublicID,
		DeviceID:     a.DeviceID,
		JenisAlert:   a.JenisAlert,
		TingkatAlert: a.TingkatAlert,
	}
}

func (Alert) TableName() string {
	return "alerts"
}