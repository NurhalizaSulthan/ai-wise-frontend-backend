package repositories

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DeviceRepository interface {
	GetDeviceByPublicID(publicId uuid.UUID) (*model.DeviceBase, error)
	GetDeviceByByUserID(userId int)(*model.DeviceBase, error)
	GetDevice()([]model.DeviceBase, error)
}

type DeviceRepositoryImpl struct {
	db *gorm.DB
}

func NewDeviceRepository(db *gorm.DB) DeviceRepository {
	return &DeviceRepositoryImpl{db: db}
}

func (repo DeviceRepositoryImpl) GetDeviceByPublicID(publicID uuid.UUID) (*model.DeviceBase, error){
	device := &model.Device{}

	if err := repo.db.Where("public_id = ?", publicID).First(&device).Error; err != nil {
		return nil, err
	}

	deviceBase := device.GormToBase()

	return deviceBase, nil
}

func (repo DeviceRepositoryImpl) GetDeviceByByUserID(userId int) (*model.DeviceBase, error) {
	device := &model.Device{}

	if err := repo.db.Where("pekerja_id = ?", userId).First(&device).Error; err != nil {
		return nil, err
	}

	deviceBase := device.GormToBase()

	return deviceBase, nil
}

func (repo DeviceRepositoryImpl) GetDevice() ([]model.DeviceBase, error){
	var devices []model.Device

	if err := repo.db.Find(&devices).Error; err != nil {
		return nil, err
	}

	devicesBase := make([]model.DeviceBase, len(devices))

	for i, g := range devices {
		devicesBase[i] = *g.GormToBase()
	}

	return devicesBase, nil
}