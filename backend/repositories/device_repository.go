package repositories

import (
	"time"

	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/enum"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DeviceRepository interface {
	CreateDevice(tx *gorm.DB, model *model.Device) (*model.Device, error)
	UpdateDevice(tx *gorm.DB, update *model.Device) error
	GetDeviceByPublicID(tx *gorm.DB, publicId uuid.UUID) (*model.Device, error)
	GetAll(tx *gorm.DB) ([]model.Device, error)
	GetWithPagination(tx *gorm.DB, after bool, publicID uuid.UUID, timestamp time.Time) ([]model.Device, error)
	GetFirstPaginatio(tx *gorm.DB) ([]model.Device, error)
}

type DeviceRepositoryImpl struct {
	db *gorm.DB
}

func NewDeviceRepository(db *gorm.DB) DeviceRepository {
	return &DeviceRepositoryImpl{db: db}
}

func (r *DeviceRepositoryImpl) getDB(tx *gorm.DB) *gorm.DB {
	if tx != nil {
		return tx
	}
	return r.db
}

func (repo *DeviceRepositoryImpl) CreateDevice(tx *gorm.DB, model *model.Device) (*model.Device, error) {
	if err := repo.getDB(tx).Create(model).Error; err != nil {
		return nil, err
	}
	return model, nil
}

func (repo *DeviceRepositoryImpl) UpdateDevice(tx *gorm.DB, update *model.Device) error {
	return repo.getDB(tx).Model(&model.Device{}).Where("internal_id = ?", update.InternalID).Updates(update).Error
}

func (repo *DeviceRepositoryImpl) GetDeviceByPublicID(tx *gorm.DB, publicID uuid.UUID) (*model.Device, error) {
	device := &model.Device{}

	if err := repo.getDB(tx).
		// Preload("ListAlert").
		Where("public_id = ?", publicID).
		First(&device).
		Error; err != nil {
		return nil, err
	}

	return device, nil
}

func (repo *DeviceRepositoryImpl) GetAll(tx *gorm.DB) ([]model.Device, error) {
	var devices []model.Device

	if err := repo.getDB(tx).Where("status = ?", enum.Aktif).Find(&devices).Error; err != nil {
		return nil, err
	}

	return devices, nil
}

func (repo *DeviceRepositoryImpl) GetFirstPaginatio(tx *gorm.DB) ([]model.Device, error) {
	var listDevice []model.Device

	if err := repo.getDB(tx).Limit(11).Find(&listDevice).Error; err != nil {
		return nil, err
	}

	return listDevice, nil
}

func (repo *DeviceRepositoryImpl) GetWithPagination(tx *gorm.DB, after bool, publicID uuid.UUID, timestamp time.Time) ([]model.Device, error) {
	var listDevice []model.Device

	if after {
		if err := repo.getDB(tx).Where("(created_at > ?) OR (created_at = ? && public_id > ? )", timestamp, timestamp, publicID).
			Order("created_at ASC").
			Order("public_id ASC").
			Limit(11).
			Find(&listDevice).Error; err != nil {
			return nil, err
		}
	} else {
		if err := repo.getDB(tx).Where("(created_at < ?) OR (created_at = ? && public_id < ?)", timestamp, timestamp, publicID).
			Order("created_at DESC").
			Order("public_id DESC").
			Limit(11).
			Find(&listDevice).Error; err != nil {
			return nil, err
		}
	}

	return listDevice, nil
}
