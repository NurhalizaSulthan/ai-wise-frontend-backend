package repositories

import (
	"time"

	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DeviceRepository interface {
	CreateDevice(model *model.Device) (*model.Device, error)
	UpdateDevice(update *model.Device) error
	GetDeviceByPublicID(publicId uuid.UUID) (*model.Device, error)
	GetAll() ([]model.Device, error)
	GetWithPagination(after bool, publicID uuid.UUID, timestamp time.Time) ([]model.Device, error)
	GetFirstPaginatio() ([]model.Device, error)
}

type DeviceRepositoryImpl struct {
	db *gorm.DB
}

func NewDeviceRepository(db *gorm.DB) DeviceRepository {
	return &DeviceRepositoryImpl{db: db}
}

func (repo *DeviceRepositoryImpl) GetFirstPaginatio() ([]model.Device, error) {
	var listDevice []model.Device

	if err := repo.db.Limit(11).Find(&listDevice).Error; err != nil {
		return nil, err
	}

	return listDevice, nil
}

func (repo *DeviceRepositoryImpl) GetWithPagination(after bool, publicID uuid.UUID, timestamp time.Time) ([]model.Device, error) {
	var listDevice []model.Device

	if after {
		if err := repo.db.Where("(created_at > ?) OR (created_at = ? && public_id > ? )", timestamp, timestamp, publicID).
			Order("created_at ASC").
			Order("public_id ASC").
			Limit(11).
			Find(&listDevice).Error; err != nil {
			return nil, err
		}
	} else {
		if err := repo.db.Where("(created_at < ?) OR (created_at = ? && public_id < ?)", timestamp, timestamp, publicID).
			Order("created_at DESC").
			Order("public_id DESC").
			Limit(11).
			Find(&listDevice).Error; err != nil {
			return nil, err
		}
	}

	return listDevice, nil
}

func (repo *DeviceRepositoryImpl) CreateDevice(model *model.Device) (*model.Device, error) {
	if err := repo.db.Create(model).Error; err != nil {
		return nil, err
	}
	return model, nil
}

func (repo *DeviceRepositoryImpl) UpdateDevice(update *model.Device) error {
	return repo.db.Model(&model.Device{}).Where("internal_id = ?", update.InternalID).Updates(update).Error
}

func (repo *DeviceRepositoryImpl) GetDeviceByPublicID(publicID uuid.UUID) (*model.Device, error) {
	device := &model.Device{}

	if err := repo.db.
		// Preload("ListAlert").
		Where("public_id = ?", publicID).
		First(&device).
		Error; err != nil {
		return nil, err
	}

	return device, nil
}

func (repo *DeviceRepositoryImpl) GetAll() ([]model.Device, error) {
	var devices []model.Device

	if err := repo.db.Find(&devices).Error; err != nil {
		return nil, err
	}

	return devices, nil
}
