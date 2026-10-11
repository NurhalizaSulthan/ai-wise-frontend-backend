package repositories

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PengawasRepository interface {
	CreatePengawas(tx *gorm.DB, model *model.Pengawas) (*model.Pengawas, error)
	GetPengawasByUUID(tx *gorm.DB, public_id uuid.UUID) (*model.Pengawas, error)
	GetByPengawasNama(tx *gorm.DB, nama string) (*model.Pengawas, error)
	GetAll(tx *gorm.DB) ([]model.Pengawas, error)
}

type PengawasRepositoryImpl struct {
	db *gorm.DB
}

func (r *PengawasRepositoryImpl) getDB(tx *gorm.DB) *gorm.DB {
	if tx != nil {
		return tx
	}
	return r.db
}

func NewPengawasRepository(db *gorm.DB) PengawasRepository {
	return &PengawasRepositoryImpl{db: db}
}

func (repo *PengawasRepositoryImpl) CreatePengawas(tx *gorm.DB, model *model.Pengawas) (*model.Pengawas, error) {

	if err := repo.getDB(tx).Create(&model).Error; err != nil {
		return nil, err
	}

	return model, nil
}

func (repo *PengawasRepositoryImpl) GetPengawasByUUID(tx *gorm.DB, public_id uuid.UUID) (*model.Pengawas, error) {
	gormModel := &model.Pengawas{}

	if err := repo.getDB(tx).
		Preload("ListPekerja").Where("public_id = ?", public_id).First(&gormModel).Error; err != nil {
		return nil, err
	}

	return gormModel, nil
}

func (repo *PengawasRepositoryImpl) GetByPengawasNama(tx *gorm.DB, nama string) (*model.Pengawas, error) {
	gormModel := &model.Pengawas{}

	if err := repo.getDB(tx).Where("nama = ?", nama).First(gormModel).Error; err != nil {
		return nil, err
	}

	return gormModel, nil
}

func (repo *PengawasRepositoryImpl) GetAll(tx *gorm.DB) ([]model.Pengawas, error) {
	var list []model.Pengawas

	if err := repo.getDB(tx).Find(&list).Error; err != nil {
		return nil, err
	}

	return list, nil
}
