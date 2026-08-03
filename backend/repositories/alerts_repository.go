package repositories

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/enum"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AlertFilter struct {
	DeviceID 		*int
	JenisAlert		*enum.JenisAlert
	TingkatAlert 	*enum.TingkatKeparahan
}

type AlertRepositories interface {
	CreateAlert(model *model.Alert) (*model.Alert, error)
	GetAlertByPublicId(publicId uuid.UUID) (*model.Alert, error)
	GetAll(
		// filter AlertFilter
		) ([]model.Alert, error)
}

type AlertRepositoriesImpl struct {
	db *gorm.DB
}

func NewAlertRepository(db *gorm.DB) AlertRepositories {
	return &AlertRepositoriesImpl{db: db}
}

func (repo *AlertRepositoriesImpl) CreateAlert(alert *model.Alert) (*model.Alert, error) {
	if err := repo.db.Create(&alert).Error; err != nil {
		return nil,err
	}

	return alert, nil
}

func (repo *AlertRepositoriesImpl) GetAlertByPublicId(publicID uuid.UUID) (*model.Alert, error) { 
	model := &model.Alert{}

	if err := repo.db.Where("public_id = ?", publicID.String()).First(&model).Error; err != nil {
		return nil, err
	}

	return model, nil
}

func (repo *AlertRepositoriesImpl) GetAll(
	// filter AlertFilter
	) ([]model.Alert, error) {
	var modelList []model.Alert

	query := repo.db.Model(&model.Alert{})

	// if filter.DeviceID != nil {
	// 	query.Where("device_id = ?", filter.DeviceID)
	// }

	// if filter.JenisAlert != nil {
	// 	query.Where("jenis_alert = ?", filter.JenisAlert)
	// }

	// if filter.TingkatAlert != nil {
	// 	query.Where("tingkat_alert = ?", filter.TingkatAlert)
	// }

	if err := query.Find(&modelList).Error; err != nil {
		return nil, err
	}

	return modelList, nil
}