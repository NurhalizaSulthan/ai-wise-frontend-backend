package repositories

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AlertRepositories interface {
	CreateAlert(model model.AlertBase) (*model.AlertBase, error)
	GetAlertByDevice(deviceId int) ([]model.AlertBase, error)
	GetAlertByPublicId(publicId uuid.UUID) (*model.AlertBase, error)
}

type AlertRepositoriesImpl struct {
	db *gorm.DB
}

func NewAlertRepository(db *gorm.DB) AlertRepositories {
	return &AlertRepositoriesImpl{db: db}
}

func (repo AlertRepositoriesImpl) CreateAlert(alert model.AlertBase) (*model.AlertBase, error) {
	newAlert := &model.Alert{
		DeviceID: alert.DeviceID,
		JenisAlert: alert.JenisAlert,
		TingkatAlert: alert.TingkatAlert,
	}
	if err := repo.db.Create(&newAlert).Error; err != nil {
		return nil,err
	}

	baseAlert := newAlert.GormToBase()

	return baseAlert, nil
}

func (repo AlertRepositoriesImpl) GetAlertByDevice(deviceId int) ([]model.AlertBase, error){
	var gormModel []model.Alert

	if err := repo.db.Where("device_id = ?", deviceId).Find(&gormModel).Error; err != nil {
		return nil, err
	}

	models := make([]model.AlertBase, len(gormModel))

	for i, g := range gormModel {
		models[i] = *g.GormToBase()
	}

	return models, nil
}

func (repo AlertRepositoriesImpl) GetAlertByPublicId(uuid.UUID) (*model.AlertBase, error) { 
	model := &model.Alert{}

	if err := repo.db.Where("public_id = ?", model.PublicID.String()).First(&model).Error; err != nil {
		return nil, err
	}

	modelBase := model.GormToBase()

	return modelBase, nil
}