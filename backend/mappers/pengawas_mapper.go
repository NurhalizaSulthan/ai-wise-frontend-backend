package mappers

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/dto"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
)

func ToPengawasBase(p *model.Pengawas) *dto.PengawasBase {
	if p == nil{
		return nil
	}

	base := &dto.PengawasBase{
		PublicID:    p.PublicID,
		Nama:        p.Nama,
	}

	if pekerja := MapSlice(p.ListPekerja, ToPekerjaBase); pekerja != nil {
		base.ListPekerja = pekerja
	}

	return base
}

func ToPengawasModel(p *dto.PengawasCreate) *model.Pengawas {
	if p == nil {
		return nil
	}

	model := &model.Pengawas{
		Nama: p.Nama,
		PasswordHash: p.PassHash,
	}

	return model
}