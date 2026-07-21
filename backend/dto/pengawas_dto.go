package dto

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/enum"
	"github.com/google/uuid"
)

type PengawasBase struct {
	PublicID    uuid.UUID     `json:"public_id"`
	Nama        string        `json:"nama"`
	Role		enum.PengawasRole	`json:"role"`
	ListPekerja []PekerjaBase `json:"daftar_pekerja"`
}

type PengawasCreate struct {
	Nama	string				`json:"nama"`
	Role	enum.PengawasRole	`json:"role"`
	Pass	string				`json:"password"`
}