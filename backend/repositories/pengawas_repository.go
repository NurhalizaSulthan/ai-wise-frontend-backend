package repositories

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/dto"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/mappers"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PengawasRepository interface {
	CreatePengawas(modelBase *dto.PengawasCreate) (*dto.PengawasBase, error)
	GetPengawasById(internal_id int) (*dto.PengawasBase, error)
	GetPengawasByUUID(public_id uuid.UUID) (*dto.PengawasBase, error)
}

type PengawasRepositoryImpl struct {
	db *gorm.DB
}

func NewPengawasRepository (db *gorm.DB) PengawasRepository{
	return &PengawasRepositoryImpl{db: db}
}

func (repo PengawasRepositoryImpl)	CreatePengawas(modelBase *dto.PengawasCreate) (*dto.PengawasBase, error) {
	gormModel := mappers.Map(modelBase, mappers.ToPengawasModel)

	if err := repo.db.Create(&gormModel).Error; err != nil {
		return nil, err
	}

	return mappers.Map(gormModel, mappers.ToPengawasBase), nil
}
func (repo PengawasRepositoryImpl)	GetPengawasById(internal_id int) (*dto.PengawasBase, error) {
	gormModel := &model.Pengawas{}

	if err := repo.db.
		Preload("ListPekerja").Where("internal_id = ?", internal_id).First(&gormModel).Error; err != nil {
		return nil, err
	}

	return mappers.Map(gormModel, mappers.ToPengawasBase), nil
}
func (repo PengawasRepositoryImpl)	GetPengawasByUUID(public_id uuid.UUID) (*dto.PengawasBase, error) {
	gormModel := &model.Pengawas{}

	if err := repo.db.
		Preload("ListPekerja").Where("public_id = ?", public_id).First(&gormModel).Error; err != nil {
		return nil, err
	}

	return mappers.Map(gormModel, mappers.ToPengawasBase), nil
}

