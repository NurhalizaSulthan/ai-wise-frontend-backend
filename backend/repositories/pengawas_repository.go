package repositories

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PengawasRepository interface {
	CreatePengawas(modelBase *model.PengawasCreate) (*model.PengawasBase, error)
	GetPengawasById(internal_id int) (*model.PengawasBase, error)
	GetPengawasByUUID(public_id uuid.UUID) (*model.PengawasBase, error)
}

type PengawasRepositoryImpl struct {
	db *gorm.DB
}

func NewPengawasRepository (db *gorm.DB) PengawasRepository{
	return &PengawasRepositoryImpl{db: db}
}

func (repo PengawasRepositoryImpl)	CreatePengawas(modelBase *model.PengawasCreate) (*model.PengawasBase, error) {
	gormModel := &model.Pengawas{
		Nama: modelBase.Nama,
		PasswordHash: modelBase.PassHash,
	}

	if err := repo.db.Create(&gormModel).Error; err != nil {
		return nil, err
	}

	return gormModel.GormToBase(), nil
}
func (repo PengawasRepositoryImpl)	GetPengawasById(internal_id int) (*model.PengawasBase, error) {
	gormModel := &model.Pengawas{}

	if err := repo.db.
		Preload("ListPekerja").Where("internal_id = ?", internal_id).First(&gormModel).Error; err != nil {
		return nil, err
	}

	return gormModel.GormToBase(), nil
}
func (repo PengawasRepositoryImpl)	GetPengawasByUUID(public_id uuid.UUID) (*model.PengawasBase, error) {
	gormModel := &model.Pengawas{}

	if err := repo.db.
		Preload("ListPekerja").Where("public_id = ?", public_id).First(&gormModel).Error; err != nil {
		return nil, err
	}

	return gormModel.GormToBase(), nil
}

