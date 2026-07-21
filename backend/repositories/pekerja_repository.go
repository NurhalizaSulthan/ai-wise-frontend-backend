package repositories

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PekerjaFilter struct {
	PengawasID *int
}

type PekerjaRepository interface {
	CreatePekerja(modelBase *model.Pekerja) (*model.Pekerja, error)
	GetPekerjaByUUID(public_id uuid.UUID) (*model.Pekerja, error)
	GetAll(filter PekerjaFilter) ([]model.Pekerja, error)
}

type PekerjaRepositoryImpl struct {
	db *gorm.DB
}

func NewPekerjaRepository(db *gorm.DB) PekerjaRepository {
	return &PekerjaRepositoryImpl{db: db}
}

func (repo PekerjaRepositoryImpl) CreatePekerja(modelBase *model.Pekerja) (*model.Pekerja, error){

	if err := repo.db.Create(&modelBase).Error; err != nil {
		return nil, err
	}

	return modelBase, nil
}

func (repo *PekerjaRepositoryImpl) GetPekerjaByUUID(public_id uuid.UUID) (*model.Pekerja, error){
	gormModel := &model.Pekerja{}

	if err := repo.db.
			Preload("Device").
			Where("public_id = ?", public_id.String()).
			First(&gormModel).
			Error; 
			err != nil {
		return nil, err
	}
	
	return gormModel, nil
}

func (repo *PekerjaRepositoryImpl) GetAll(filter PekerjaFilter) ([]model.Pekerja, error) {
	var list []model.Pekerja
	query := repo.db.Model(&model.Pekerja{})

	if filter.PengawasID != nil {
		query.Where("pengawas_id = ?", filter.PengawasID)
	}

	if err := query.Find(&list).Error; err != nil {
		return nil, err
	}

	return list, nil
}