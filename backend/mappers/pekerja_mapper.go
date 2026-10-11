package mappers

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/dto"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
)

func ToPekerjaBase(p *model.Pekerja) *dto.PekerjaBase {
	if p == nil {
		return nil
	}

	base := &dto.PekerjaBase{
		PublicID:     p.PublicID,
		Nama:         p.Nama,
		TanggalLahir: p.TanggalLahir,
		JenisKelamin: p.JenisKelamin,
		PengawasID:   p.PengawasID,
	}

	if device := Map(p.Device, ToDeviceBase); device != nil {
		base.Device = device
	}

	return base
}

func ToPekerjaModel(p *dto.PekerjaBase) *model.Pekerja {
	if p == nil {
		return nil
	}

	base := &model.Pekerja{
		Nama:         p.Nama,
		TanggalLahir: p.TanggalLahir,
		JenisKelamin: p.JenisKelamin,
		PengawasID:   p.PengawasID,
	}

	return base
}
