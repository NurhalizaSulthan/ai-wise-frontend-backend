package model

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PengawasBase struct {
	PublicID    uuid.UUID    `json:"public_id"`
	Nama        string       `json:"nama"`
	ListPekerja []PekerjaBase `json:"daftar_pekerja"`
}

type PengawasCreate struct {
	PublicID    uuid.UUID
	Nama        string  
	PassHash	string		
	ListPekerja []PekerjaBase
}

type Pengawas struct {
	InternalID   uint           `json:"internal_id"    gorm:"column:internal_id;primaryKey;autoIncrement"`
	PublicID     uuid.UUID      `json:"public_id"      gorm:"column:public_id;unique;type:uuid"`
	Nama         string         `json:"nama"           gorm:"column:nama"`
	PasswordHash string         `json:"pass_hash"      gorm:"column:pass_hash"`
	ListPekerja  []Pekerja      `json:"daftar_pekerja" gorm:"foreignKey:PengawasID"`

	CreatedAt time.Time      `json:"created_at"     gorm:"column:created_at"`
	UpdatedAt time.Time      `json:"updated_at"     gorm:"column:updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at"     gorm:"column:deleted_at"`
}

func (Pengawas) TableName() string {
	return "observers"
}

func (p Pengawas) GormToBase() *PengawasBase {
	pekerjas := make([]PekerjaBase, len(p.ListPekerja))
	for i, w := range p.ListPekerja {
		pekerjas[i] = *w.GormToBase()
	}
	return &PengawasBase{
		PublicID:    p.PublicID,
		Nama:        p.Nama,
		ListPekerja: pekerjas,
	}
}