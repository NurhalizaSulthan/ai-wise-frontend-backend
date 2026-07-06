package repositories

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/dto"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/mappers"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DeviceRepository interface {
	GetDeviceByPublicID(publicId uuid.UUID) (*dto.DeviceBase, error)
	GetDeviceByByUserID(userId int)(*dto.DeviceBase, error)
	GetDevice()([]dto.DeviceBase, error)
}

type DeviceRepositoryImpl struct {
	db *gorm.DB
}

func NewDeviceRepository(db *gorm.DB) DeviceRepository {
	return &DeviceRepositoryImpl{db: db}
}

func (repo DeviceRepositoryImpl) GetDeviceByPublicID(publicID uuid.UUID) (*dto.DeviceBase, error){
	device := &model.Device{}

	if err := repo.db.Where("public_id = ?", publicID).First(&device).Error; err != nil {
		return nil, err
	}

	deviceBase := mappers.Map(device, mappers.ToDeviceBase)

	return deviceBase, nil
}

func (repo DeviceRepositoryImpl) GetDeviceByByUserID(userId int) (*dto.DeviceBase, error) {
	device := &model.Device{}

	if err := repo.db.Where("pekerja_id = ?", userId).First(&device).Error; err != nil {
		return nil, err
	}

	deviceBase := mappers.Map(device, mappers.ToDeviceBase)

	return deviceBase, nil
}

func (repo DeviceRepositoryImpl) GetDevice() ([]dto.DeviceBase, error){
	var devices []model.Device

	if err := repo.db.Find(&devices).Error; err != nil {
		return nil, err
	}

	devicesBase := mappers.MapSlice(devices, mappers.ToDeviceBase)

	return devicesBase, nil
}