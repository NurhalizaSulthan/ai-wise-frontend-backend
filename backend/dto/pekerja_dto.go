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
	Device       *DeviceBase `json:"device,omitempty"`
}

type PekerjaCreate struct {
	Nama             string    `json:"nama"`
	TanggalLahir     time.Time `json:"tanggal_lahir"`
	JenisKelamin     string    `json:"jenis_kelamin"`
	PengawasPublicID uuid.UUID `json:"pengawas_public_id"`
	DevicePublicID   uuid.UUID `json:"device_public_id"`
}

type PekerjaUpdate struct {
	PublicID       *uuid.UUID `json:"public_id"`
	Nama           *string    `json:"nama"`
	TanggalLahir   *time.Time `json:"tanggal_lahir"`
	JenisKelamin   *string    `json:"jenis_kelamin"`
	DevicePublicID *uuid.UUID `json:"device_public_id"`
}
