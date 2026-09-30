package repositories

import (
	"time"

	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TelemetryRepository interface {
	Create(model *model.HyperTelemetry) (*model.HyperTelemetry, error)
	BatchCreate(models []model.HyperTelemetry) error
	GetDetail(public_id uuid.UUID) (*model.HyperTelemetry, error)
	GetAll() ([]model.HyperTelemetry, error)
	GetPagination(publicID uuid.UUID, timestamp time.Time, after bool) ([]model.HyperTelemetry, error)
	GetFirstPagination() ([]model.HyperTelemetry, error)
}

type TelemetryRepositoryImpl struct {
	db *gorm.DB
}

func NewTelemetryRepository(db *gorm.DB) TelemetryRepository {
	return &TelemetryRepositoryImpl{db: db}
}

func (repo *TelemetryRepositoryImpl) Create(model *model.HyperTelemetry) (*model.HyperTelemetry, error) {

	if err := repo.db.Create(&model).Error; err != nil {
		return nil, err
	}

	return model, nil
}

func (repo *TelemetryRepositoryImpl) BatchCreate(
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

func (repo *TelemetryRepositoryImpl) GetDetail(public_id uuid.UUID) (*model.HyperTelemetry, error) {
	gormModel := &model.HyperTelemetry{}

	if err := repo.db.Where("public_id = ?", public_id).First(&gormModel).Error; err != nil {
		return nil, err
	}

	return gormModel, nil
}

func (repo *TelemetryRepositoryImpl) GetAll() ([]model.HyperTelemetry, error) {
	var list []model.HyperTelemetry

	if err := repo.db.Find(&list).Error; err != nil {
		return nil, err
	}

	return list, nil
}

func (repo *TelemetryRepositoryImpl) GetPagination(
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
func (repo *TelemetryRepositoryImpl) GetFirstPagination() ([]model.HyperTelemetry, error) {
	var list []model.HyperTelemetry

	err := repo.db.
		Order("created_at ASC").
		Order("public_id ASC").
		Limit(11).
		Find(&list).Error

	return list, err
}
