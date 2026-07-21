package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)


type Pekerja struct {
	InternalID   int            `gorm:"column:internal_id;primaryKey;autoIncrement"`
	PublicID     uuid.UUID      `gorm:"column:public_id;default:gen_random_uuid()"`
	Nama         string         `gorm:"column:nama"`
	TanggalLahir time.Time      `gorm:"column:tanggal_lahir"`
	JenisKelamin string         `gorm:"column:jenis_kelamin"`
	
	PengawasID   int            `gorm:"column:pengawas_id"`

	DeviceID	int				`gorm:"column:device_id"`
	Device     	*Device        	`gorm:"foreignKey:PekerjaID"`

	CreatedAt 	time.Time      	`gorm:"column:created_at"`
	UpdatedAt 	time.Time      	`gorm:"column:updated_at"`
	DeletedAt 	gorm.DeletedAt 	`gorm:"column:deleted_at"`
}

func (Pekerja) TableName() string {
	return "pekerjas"
}

