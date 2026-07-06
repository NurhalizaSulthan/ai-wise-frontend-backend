package dto

import (
	"time"

	"github.com/google/uuid"
)

type PekerjaBase struct {
	PublicID     uuid.UUID   `json:"public_id"`
	Nama         string      `json:"nama"`
	TanggalLahir time.Time   `json:"tanggal_lahir"`
	JenisKelamin string      `json:"jenis_kelamin"`
	PengawasID   int         `json:"pengawas_id"`
	Device       DeviceBase `json:"device"`
}
