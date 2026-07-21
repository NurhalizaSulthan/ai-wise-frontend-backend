package repositories

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DeviceRepository interface {
	CreateDevice(model *model.Device)(*model.Device, error)
	UpdateDevice(deviceID, pekerjaID int) (error)
	GetDeviceByPublicID(publicId uuid.UUID) (*model.Device, error)
	GetAll()([]model.Device, error)
}

type DeviceRepositoryImpl struct {
	db *gorm.DB
}

func NewDeviceRepository(db *gorm.DB) DeviceRepository {
	return &DeviceRepositoryImpl{db: db}
}


func (repo *DeviceRepositoryImpl) CreateDevice(model *model.Device)(*model.Device, error) {
	if err := repo.db.Create(model).Error; err != nil {
		return nil, err
	}
	return model, nil
}

func (repo *DeviceRepositoryImpl) UpdateDevice(deviceID, pekerjaID int) (error) {
	return repo.db.Where("internal_id = ?", deviceID).Update("pekerja_id", pekerjaID).Error
}

func (repo *DeviceRepositoryImpl) GetDeviceByPublicID(publicID uuid.UUID) (*model.Device, error){
	device := &model.Device{}

	if err := repo.db.
		Preload("ListAlert").
		Where("public_id = ?", publicID).
		First(&device).
		Error; 
	err != nil {
		return nil, err
	}

	return device, nil
}

func (repo *DeviceRepositoryImpl) GetAll() ([]model.Device, error){
	var devices []model.Device

	if err := repo.db.Find(&devices).Error; err != nil {
		return nil, err
	}

	return devices, nil
}