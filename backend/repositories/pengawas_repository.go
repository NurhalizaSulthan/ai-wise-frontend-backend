package repositories

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PengawasRepository interface {
	CreatePengawas(model *model.Pengawas) (*model.Pengawas, error)
	GetPengawasByUUID(public_id uuid.UUID) (*model.Pengawas, error)
	GetByPengawasNama(nama string)(*model.Pengawas, error)
	GetAll() ([]model.Pengawas, error)

}

type PengawasRepositoryImpl struct {
	db *gorm.DB
}

func NewPengawasRepository (db *gorm.DB) PengawasRepository{
	return &PengawasRepositoryImpl{db: db}
}

func (repo *PengawasRepositoryImpl)	CreatePengawas(model *model.Pengawas) (*model.Pengawas, error) {

	if err := repo.db.Create(&model).Error; err != nil {
		return nil, err
	}

	return model, nil
}

func (repo *PengawasRepositoryImpl) GetPengawasByUUID(public_id uuid.UUID) (*model.Pengawas, error) {
	gormModel := &model.Pengawas{}

	if err := repo.db.
		Preload("ListPekerja").Where("public_id = ?", public_id).First(&gormModel).Error; err != nil {
		return nil, err
	}

	return gormModel, nil
}

func (repo *PengawasRepositoryImpl) GetByPengawasNama(nama string)(*model.Pengawas, error) {
	gormModel := &model.Pengawas{}

	if err := repo.db.Where("nama = ?", nama).First(gormModel).Error; err != nil {
		return nil, err
	}

	return gormModel, nil
}

func (repo *PengawasRepositoryImpl) GetAll() ([]model.Pengawas, error) {
	var list []model.Pengawas

	if err := repo.db.Find(&list).Error; err != nil {
		return nil, err
	}

	return list, nil
} 

