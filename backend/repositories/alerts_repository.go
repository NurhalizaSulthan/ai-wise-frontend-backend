package repositories

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/enum"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AlertFilter struct {
	DeviceID     *int
	JenisAlert   *enum.JenisAlert
	TingkatAlert *enum.TingkatKeparahan
}

type AlertRepositories interface {
	CreateAlert(tx *gorm.DB, model *model.Alert) (*model.Alert, error)
	GetAlertByPublicId(tx *gorm.DB, publicId uuid.UUID) (*model.Alert, error)
	GetAll(tx *gorm.DB) ([]model.Alert, error)
}

type AlertRepositoriesImpl struct {
	db *gorm.DB
}

func NewAlertRepository(db *gorm.DB) AlertRepositories {
	return &AlertRepositoriesImpl{db: db}
}

func (r *AlertRepositoriesImpl) getDB(tx *gorm.DB) *gorm.DB {
	if tx != nil {
		return tx
	}
	return r.db
}

func (repo *AlertRepositoriesImpl) CreateAlert(tx *gorm.DB, alert *model.Alert) (*model.Alert, error) {
	if err := repo.getDB(tx).Create(&alert).Error; err != nil {
		return nil, err
	}

	return alert, nil
}

func (repo *AlertRepositoriesImpl) GetAlertByPublicId(tx *gorm.DB, publicID uuid.UUID) (*model.Alert, error) {
	model := &model.Alert{}

	if err := repo.getDB(tx).Where("public_id = ?", publicID.String()).First(&model).Error; err != nil {
		return nil, err
	}

	return model, nil
}

func (repo *AlertRepositoriesImpl) GetAll(
	tx *gorm.DB,
	// filter AlertFilter
) ([]model.Alert, error) {
	var modelList []model.Alert

	query := repo.getDB(tx).Model(&model.Alert{})

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
