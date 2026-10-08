package repositories

import (
	"time"

	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TelemetryRepository interface {
	Create(tx *gorm.DB, model *model.HyperTelemetry) (*model.HyperTelemetry, error)
	BatchCreate(tx *gorm.DB, models []model.HyperTelemetry) error
	GetDetail(tx *gorm.DB, public_id uuid.UUID) (*model.HyperTelemetry, error)
	GetAll(tx *gorm.DB) ([]model.HyperTelemetry, error)
	GetPagination(tx *gorm.DB, publicID uuid.UUID, timestamp time.Time, after bool) ([]model.HyperTelemetry, error)
	GetFirstPagination(tx *gorm.DB) ([]model.HyperTelemetry, error)
}

type TelemetryRepositoryImpl struct {
	db *gorm.DB
}

func (r *TelemetryRepositoryImpl) getDB(tx *gorm.DB) *gorm.DB {
	if tx != nil {
		return tx
	}
	return r.db
}

func NewTelemetryRepository(db *gorm.DB) TelemetryRepository {
	return &TelemetryRepositoryImpl{db: db}
}

func (repo *TelemetryRepositoryImpl) Create(tx *gorm.DB, model *model.HyperTelemetry) (*model.HyperTelemetry, error) {

	if err := repo.db.Create(&model).Error; err != nil {
		return nil, err
	}

	return model, nil
}

func (repo *TelemetryRepositoryImpl) BatchCreate(
	tx *gorm.DB,
	models []model.HyperTelemetry,
) error {

	if len(models) == 0 {
		return nil
	}

	return repo.db.CreateInBatches(
		&models,
		500,
	).Error
}

func (repo *TelemetryRepositoryImpl) GetDetail(tx *gorm.DB, public_id uuid.UUID) (*model.HyperTelemetry, error) {
	gormModel := &model.HyperTelemetry{}

	if err := repo.db.Where("public_id = ?", public_id).First(&gormModel).Error; err != nil {
		return nil, err
	}

	return gormModel, nil
}

func (repo *TelemetryRepositoryImpl) GetAll(tx *gorm.DB) ([]model.HyperTelemetry, error) {
	var list []model.HyperTelemetry

	if err := repo.db.Find(&list).Error; err != nil {
		return nil, err
	}

	return list, nil
}

func (repo *TelemetryRepositoryImpl) GetPagination(
	tx *gorm.DB,
	publicID uuid.UUID,
	timestamp time.Time,
	after bool,
) ([]model.HyperTelemetry, error) {

	var list []model.HyperTelemetry

	if after {
		err := repo.db.
			Where(
				"(created_at > ?) OR (created_at = ? AND public_id > ?)",
				timestamp,
				timestamp,
				publicID,
			).
			Order("created_at ASC").
			Order("public_id ASC").
			Limit(11).
			Find(&list).Error

		if err != nil {
			return nil, err
		}
	} else {
		err := repo.db.
			Where(
				"(created_at < ?) OR (created_at = ? AND public_id < ?)",
				timestamp,
				timestamp,
				publicID,
			).
			Order("created_at DESC").
			Order("public_id DESC").
			Limit(11).
			Find(&list).Error

		if err != nil {
			return nil, err
		}
	}

	return list, nil
}
func (repo *TelemetryRepositoryImpl) GetFirstPagination(tx *gorm.DB) ([]model.HyperTelemetry, error) {
	var list []model.HyperTelemetry

	err := repo.db.
		Order("created_at ASC").
		Order("public_id ASC").
		Limit(11).
		Find(&list).Error

	return list, err
}
