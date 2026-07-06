package dto

import "github.com/google/uuid"

type PengawasBase struct {
	PublicID    uuid.UUID     `json:"public_id"`
	Nama        string        `json:"nama"`
	ListPekerja []PekerjaBase `json:"daftar_pekerja"`
}

type PengawasCreate struct {
	PublicID    uuid.UUID
	Nama        string
	PassHash    string
	ListPekerja []PekerjaBase
}