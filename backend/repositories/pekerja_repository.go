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
	CreatePekerja(tx *gorm.DB, modelBase *model.Pekerja) (*model.Pekerja, error)
	GetPekerjaByUUID(tx *gorm.DB, public_id uuid.UUID) (*model.Pekerja, error)
	GetAll(tx *gorm.DB) ([]model.Pekerja, error)
	GetWithPagination(tx *gorm.DB, after bool, publicID uuid.UUID, timestamp time.Time) ([]model.Pekerja, error)
	GetFirstPaginatio(tx *gorm.DB) ([]model.Pekerja, error)
	Update(tx *gorm.DB, update *model.Pekerja) error
}

type PekerjaRepositoryImpl struct {
	db *gorm.DB
}

func (r *PekerjaRepositoryImpl) getDB(tx *gorm.DB) *gorm.DB {
	if tx != nil {
		return tx
	}
	return r.db
}

func (repo PekerjaRepositoryImpl) CreatePekerja(tx *gorm.DB, modelBase *model.Pekerja) (*model.Pekerja, error) {

	if err := repo.getDB(tx).Create(&modelBase).Error; err != nil {
		return nil, err
	}

	return modelBase, nil
}

func (repo *PekerjaRepositoryImpl) GetPekerjaByUUID(tx *gorm.DB, public_id uuid.UUID) (*model.Pekerja, error) {
	gormModel := &model.Pekerja{}

	if err := repo.getDB(tx).
		Preload("Device").
		Where("public_id = ?", public_id.String()).
		First(&gormModel).
		Error; err != nil {
		return nil, err
	}

	return gormModel, nil
}

func (repo *PekerjaRepositoryImpl) GetAll(
	tx *gorm.DB,
) ([]model.Pekerja, error) {
	var list []model.Pekerja
	query := repo.getDB(tx).Model(&model.Pekerja{})

	if err := query.Find(&list).Error; err != nil {
		return nil, err
	}

	return list, nil
}

func (repo *PekerjaRepositoryImpl) GetFirstPaginatio(tx *gorm.DB) ([]model.Pekerja, error) {
	var listPekerja []model.Pekerja

	if err := repo.getDB(tx).Limit(11).Find(&listPekerja).Error; err != nil {
		return nil, err
	}

	return listPekerja, nil
}

func (repo *PekerjaRepositoryImpl) GetWithPagination(tx *gorm.DB, after bool, publicID uuid.UUID, timestamp time.Time) ([]model.Pekerja, error) {
	var listPekerja []model.Pekerja

	if after {
		if err := repo.getDB(tx).Where("(created_at > ?) OR (created_at = ? && public_id > ? )", timestamp, timestamp, publicID).
			Order("created_at ASC").
			Order("public_id ASC").
			Limit(11).
			Find(&listPekerja).Error; err != nil {
			return nil, err
		}
	} else {
		if err := repo.getDB(tx).Where("(created_at < ?) OR (created_at = ? && public_id < ?)", timestamp, timestamp, publicID).
			Order("created_at DESC").
			Order("public_id DESC").
			Limit(11).
			Find(&listPekerja).Error; err != nil {
			return nil, err
		}
	}

	return listPekerja, nil
}

func (repo *PekerjaRepositoryImpl) Update(tx *gorm.DB, update *model.Pekerja) error {
	return repo.getDB(tx).Model(&model.Pekerja{}).Where("internal_id = ?", update.InternalID).Updates(update).Error
}

func NewPekerjaRepository(db *gorm.DB) PekerjaRepository {
	return &PekerjaRepositoryImpl{db: db}
}
