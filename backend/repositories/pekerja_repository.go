package repositories

import (
	"time"

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
	GetAll() ([]model.Pekerja, error)
	GetWithPagination(after bool, publicID uuid.UUID, timestamp time.Time) ([]model.Pekerja, error)
	GetFirstPaginatio() ([]model.Pekerja, error)
	Update(update *model.Pekerja) error
}

type PekerjaRepositoryImpl struct {
	db *gorm.DB
}

func (repo *PekerjaRepositoryImpl) GetFirstPaginatio() ([]model.Pekerja, error) {
	var listPekerja []model.Pekerja

	if err := repo.db.Limit(11).Find(&listPekerja).Error; err != nil {
		return nil, err
	}

	return listPekerja, nil
}

func (repo *PekerjaRepositoryImpl) GetWithPagination(after bool, publicID uuid.UUID, timestamp time.Time) ([]model.Pekerja, error) {
	var listPekerja []model.Pekerja

	if after {
		if err := repo.db.Where("(created_at > ?) OR (created_at = ? && public_id > ? )", timestamp, timestamp, publicID).
			Order("created_at ASC").
			Order("public_id ASC").
			Limit(11).
			Find(&listPekerja).Error; err != nil {
			return nil, err
		}
	} else {
		if err := repo.db.Where("(created_at < ?) OR (created_at = ? && public_id < ?)", timestamp, timestamp, publicID).
			Order("created_at DESC").
			Order("public_id DESC").
			Limit(11).
			Find(&listPekerja).Error; err != nil {
			return nil, err
		}
	}

	return listPekerja, nil
}

func NewPekerjaRepository(db *gorm.DB) PekerjaRepository {
	return &PekerjaRepositoryImpl{db: db}
}

func (repo PekerjaRepositoryImpl) CreatePekerja(modelBase *model.Pekerja) (*model.Pekerja, error) {

	if err := repo.db.Create(&modelBase).Error; err != nil {
		return nil, err
	}

	return modelBase, nil
}

func (repo *PekerjaRepositoryImpl) GetPekerjaByUUID(public_id uuid.UUID) (*model.Pekerja, error) {
	gormModel := &model.Pekerja{}

	if err := repo.db.
		Preload("Device").
		Where("public_id = ?", public_id.String()).
		First(&gormModel).
		Error; err != nil {
		return nil, err
	}

	return gormModel, nil
}

func (repo *PekerjaRepositoryImpl) GetAll(
// filter PekerjaFilter
) ([]model.Pekerja, error) {
	var list []model.Pekerja
	query := repo.db.Model(&model.Pekerja{})

	// if filter.PengawasID != nil {
	// 	query.Where("pengawas_id = ?", filter.PengawasID)
	// }

	if err := query.Find(&list).Error; err != nil {
		return nil, err
	}

	return list, nil
}

func (repo *PekerjaRepositoryImpl) Update(update *model.Pekerja) error {
	return repo.db.Model(&model.Pekerja{}).Where("internal_id = ?", update.InternalID).Updates(update).Error
}
