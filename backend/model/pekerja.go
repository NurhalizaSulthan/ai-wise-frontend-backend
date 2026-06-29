package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PekerjaBase struct {
	PublicID     uuid.UUID  `json:"public_id"`
	Nama         string     `json:"nama"`
	TanggalLahir time.Time  `json:"tanggal_lahir"`
	JenisKelamin string     `json:"jenis_kelamin"`
	PengawasID   int        `json:"pengawas_id"`
	Device       DeviceBase `json:"device"`
}

type Pekerja struct {
	InternalID   int            `json:"internal_id"   gorm:"column:internal_id;primaryKey;autoIncrement"`
	PublicID     uuid.UUID      `json:"public_id"     gorm:"column:public_id;unique"`
	Nama         string         `json:"nama"          gorm:"column:nama"`
	TanggalLahir time.Time      `json:"tanggal_lahir" gorm:"column:tanggal_lahir"`
	JenisKelamin string         `json:"jenis_kelamin" gorm:"column:jenis_kelamin"`
	PengawasID   int            `json:"pengawas_id"   gorm:"column:pengawas_id"`
	Device       Device         `json:"device"        gorm:"foreignKey:PekerjaID"`

	CreatedAt time.Time      `json:"created_at"    gorm:"column:created_at"`
	UpdatedAt time.Time      `json:"updated_at"    gorm:"column:updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at"    gorm:"column:deleted_at"`
}

func (Pekerja) TableName() string {
	return "workers"
}

func (p Pekerja) GormToBase() *PekerjaBase {
	return &PekerjaBase{
		PublicID:     p.PublicID,
		Nama:         p.Nama,
		TanggalLahir: p.TanggalLahir,
		JenisKelamin: p.JenisKelamin,
		PengawasID:   p.PengawasID,
		Device:       *p.Device.GormToBase(),
	}
}