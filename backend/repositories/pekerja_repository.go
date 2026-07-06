package repositories

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/dto"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/mappers"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PekerjaRepository interface {
	CreatePekerja(modelBase *dto.PekerjaBase) (*dto.PekerjaBase, error)
	GetPekerjaById(internal_id int) (*dto.PekerjaBase, error)
	GetPekerjaByUUID(public_id uuid.UUID) (*dto.PekerjaBase, error)
	GetPekerjasByPengawasId(pengawas_id int) ([]dto.PekerjaBase, error)
}

type PekerjaRepositoryImpl struct {
	db *gorm.DB
}

func NewPekerjaRepository(db *gorm.DB) PekerjaRepository {
	return &PekerjaRepositoryImpl{db: db}
}

func (repo PekerjaRepositoryImpl) CreatePekerja(modelBase *dto.PekerjaBase) (*dto.PekerjaBase, error){
	gormModel := mappers.Map(modelBase, mappers.ToPekerjaModel)

	if err := repo.db.Create(&gormModel).Error; err != nil {
		return nil, err
	}

	base := mappers.Map(gormModel, mappers.ToPekerjaBase)

	return base, nil
}

func (repo PekerjaRepositoryImpl) GetPekerjaById(internal_id int) (*dto.PekerjaBase, error){
	gormModel := &model.Pekerja{}

	if err := repo.db.
		Preload("Device").
		Where("internal_id = ?", internal_id).
		First(&gormModel).Error ; err != nil {
		return nil, err
	}

	model := mappers.Map(gormModel, mappers.ToPekerjaBase)

	return model, nil
}

func (repo PekerjaRepositoryImpl) GetPekerjaByUUID(public_id uuid.UUID) (*dto.PekerjaBase, error){
	gormModel := &model.Pekerja{}

	if err := repo.db.
			Preload("Device").
			Where("public_id = ?", public_id.String()).
			First(&gormModel).
			Error; 
			err != nil {
		return nil, err
	}

	modelBase := mappers.Map(gormModel, mappers.ToPekerjaBase)
	
	return modelBase, nil
}

func (repo PekerjaRepositoryImpl) GetPekerjasByPengawasId(pengawas_id int) ([]dto.PekerjaBase, error){
	var gormModels []model.Pekerja

	if err := repo.db.
		Where("pengawas_id = ?", pengawas_id).
		Find(&gormModels).
		Error; 
		err != nil {
			return nil, err
	}

	modelBase := mappers.MapSlice(gormModels, mappers.ToPekerjaBase)
	
	return modelBase, nil
}