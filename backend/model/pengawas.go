package model

import (
	"time"

	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/enum"
	"github.com/google/uuid"
	"gorm.io/gorm"
)



type Pengawas struct {
	InternalID   int           `json:"internal_id"    gorm:"column:internal_id;primaryKey;autoIncrement"`
	PublicID     uuid.UUID      `json:"public_id"      gorm:"column:public_id;unique;default:gen_random_uuid()"`
	Nama         string         `json:"nama"           gorm:"column:nama"`
	Role		enum.PengawasRole	`gorm:"column:role"`
	PasswordHash string         `json:"pass_hash"      gorm:"column:pass_hash"`
	ListPekerja  []Pekerja      `json:"daftar_pekerja" gorm:"foreignKey:PengawasID;references:InternalID"`

	CreatedAt time.Time      `json:"created_at"     gorm:"column:created_at"`
	UpdatedAt time.Time      `json:"updated_at"     gorm:"column:updated_at"`
	DeletedAt gorm.DeletedAt `json:"deleted_at"     gorm:"column:deleted_at"`
}

func (Pengawas) TableName() string {
	return "pengawas"
}
