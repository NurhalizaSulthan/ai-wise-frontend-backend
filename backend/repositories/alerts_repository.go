package repositories

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/dto"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/mappers"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AlertRepositories interface {
	CreateAlert(dto dto.AlertBase) (*dto.AlertBase, error)
	GetAlertByDevice(deviceId int) ([]dto.AlertBase, error)
	GetAlertByPublicId(publicId uuid.UUID) (*dto.AlertBase, error)
}

type AlertRepositoriesImpl struct {
	db *gorm.DB
}

func NewAlertRepository(db *gorm.DB) AlertRepositories {
	return &AlertRepositoriesImpl{db: db}
}

func (repo AlertRepositoriesImpl) CreateAlert(alert dto.AlertBase) (*dto.AlertBase, error) {
	newAlert := mappers.ToAlertModel(&alert)
	if err := repo.db.Create(&newAlert).Error; err != nil {
		return nil,err
	}

	baseAlert := mappers.ToAlertBase(newAlert)

	return baseAlert, nil
}

func (repo AlertRepositoriesImpl) GetAlertByDevice(deviceId int) ([]dto.AlertBase, error){
	var model []model.Alert

	if err := repo.db.Where("device_id = ?", deviceId).Find(&model).Error; err != nil {
		return nil, err
	}

	dtos := mappers.MapSlice(model, mappers.ToAlertBase)

	return dtos, nil
}

func (repo AlertRepositoriesImpl) GetAlertByPublicId(publicID uuid.UUID) (*dto.AlertBase, error) { 
	model := &model.Alert{}

	if err := repo.db.Where("public_id = ?", publicID.String()).First(&model).Error; err != nil {
		return nil, err
	}

	dtoBase := mappers.Map(model, mappers.ToAlertBase)

	return dtoBase, nil
}