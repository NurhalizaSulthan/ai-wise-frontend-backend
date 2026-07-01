package repositories

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type PekerjaRepository interface {
	CreatePekerja(modelBase *model.PekerjaBase) (*model.PekerjaBase, error)
	GetPekerjaById(internal_id int) (*model.PekerjaBase, error)
	GetPekerjaByUUID(public_id uuid.UUID) (*model.PekerjaBase, error)
	GetPekerjasByPengawasId(pengawas_id int) ([]model.PekerjaBase, error)
}

type PekerjaRepositoryImpl struct {
	db *gorm.DB
}

func NewPekerjaRepository(db *gorm.DB) PekerjaRepository {
	return &PekerjaRepositoryImpl{db: db}
}

func (repo PekerjaRepositoryImpl) CreatePekerja(modelBase *model.PekerjaBase) (*model.PekerjaBase, error){
	gormModel := &model.Pekerja{
		Nama: modelBase.Nama,
		TanggalLahir: modelBase.TanggalLahir,
		JenisKelamin: modelBase.JenisKelamin,
		PengawasID: modelBase.PengawasID,
	}

	if err := repo.db.Create(&gormModel).Error; err != nil {
		return nil, err
	}

	return gormModel.GormToBase(), nil
}

func (repo PekerjaRepositoryImpl) GetPekerjaById(internal_id int) (*model.PekerjaBase, error){
	gormModel := &model.Pekerja{}

	if err := repo.db.
		Preload("Device").
		Where("internal_id = ?", internal_id).
		First(&gormModel).Error ; err != nil {
		return nil, err
	}

	model := gormModel.GormToBase()

	return model, nil
}

func (repo PekerjaRepositoryImpl) GetPekerjaByUUID(public_id uuid.UUID) (*model.PekerjaBase, error){
	gormModel := &model.Pekerja{}

	if err := repo.db.
			Preload("Device").
			Where("public_id = ?", public_id.String()).
			First(&gormModel).
			Error; 
			err != nil {
		return nil, err
	}

	modelBase := gormModel.GormToBase()
	
	return modelBase, nil
}

func (repo PekerjaRepositoryImpl) GetPekerjasByPengawasId(pengawas_id int) ([]model.PekerjaBase, error){
	var gormModels []model.Pekerja

	if err := repo.db.
		Where("pengawas_id = ?", pengawas_id).
		Find(&gormModels).
		Error; 
		err != nil {
			return nil, err
	}

	modelBase := make([]model.PekerjaBase, len(gormModels))

	for i, g := range gormModels{
		modelBase[i] = *g.GormToBase()
	}
	
	return modelBase, nil
}