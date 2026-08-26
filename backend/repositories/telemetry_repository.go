package repositories

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TelemetryRepository interface {
	Create(model *model.Telemetry) (*model.Telemetry, error)
	GetDetail(public_id uuid.UUID) (*model.Telemetry, error)
	GetAll() ([]model.Telemetry, error)
}

type TelemetryRepositoryImpl struct {
	db *gorm.DB
}

func NewTelemetryRepository(db *gorm.DB) TelemetryRepository {
	return &TelemetryRepositoryImpl{db: db}
}

func (repo *TelemetryRepositoryImpl) Create(model *model.Telemetry) (*model.Telemetry, error) {

	if err := repo.db.Create(&model).Error; err != nil {
		return nil, err
	}

	return model, nil
}

func (repo *TelemetryRepositoryImpl) GetDetail(public_id uuid.UUID) (*model.Telemetry, error) {
	gormModel := &model.Telemetry{}

	if err := repo.db.Where("public_id = ?", public_id).First(&gormModel).Error; err != nil {
		return nil, err
	}

	return gormModel, nil
}

func (repo *TelemetryRepositoryImpl) GetAll() ([]model.Telemetry, error) {
	var list []model.Telemetry

	if err := repo.db.Find(&list).Error; err != nil {
		return nil, err
	}

	return list, nil
}
