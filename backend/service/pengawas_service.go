package service

import (
	"errors"

	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/config"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/dto"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/mappers"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/model"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/repositories"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/utils"
	"github.com/google/uuid"
)

type PengawasService interface {
	Create(dto *dto.PengawasCreate) (*dto.PengawasBase, error)
	GetByPublicID(publicID uuid.UUID) (*dto.PengawasBase, error)
	GetAll() ([]dto.PengawasBase, error)
	Login(dto *dto.LoginUser) (string, error)
}

type PengawasServiceImpl struct {
	r repositories.PengawasRepository
}

func NewPengawasService(
	r repositories.PengawasRepository,
) PengawasService {
	return &PengawasServiceImpl{
		r: r,
	}
}

func (s *PengawasServiceImpl) Create(dto *dto.PengawasCreate) (*dto.PengawasBase, error) {
	tx := config.DB.Begin()

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	passHash, err := utils.HashPassword(dto.Pass)

	if err != nil {
		return nil, err
	}

	model := &model.Pengawas{
		Nama:         dto.Nama,
		Role:         dto.Role,
		PasswordHash: passHash,
	}

	data, err := s.r.CreatePengawas(tx, model)

	if err != nil {
		return nil, err
	}

	if err := tx.Commit().Error; err != nil {
		return nil, err
	}
	return mappers.Map(data, mappers.ToPengawasBase), nil
}

func (s *PengawasServiceImpl) GetByPublicID(publicID uuid.UUID) (*dto.PengawasBase, error) {
	data, err := s.r.GetPengawasByUUID(nil, publicID)

	if err != nil {
		return nil, err
	}

	return mappers.Map(data, mappers.ToPengawasBase), nil
}

func (s *PengawasServiceImpl) GetAll() ([]dto.PengawasBase, error) {

	data, err := s.r.GetAll(nil)
	if err != nil {
		return nil, err
	}

	return mappers.MapSlice(data, mappers.ToPengawasBase), nil
}

func (s *PengawasServiceImpl) Login(dto *dto.LoginUser) (string, error) {
	user, err := s.r.GetByPengawasNama(nil, dto.Nama)

	if err != nil {
		return "", err
	}

	if ok := utils.CheckPasswordHash(dto.Password, user.PasswordHash); !ok {
		return "", errors.New("Login Gagal")
	}

	newToken, err := utils.GenerateToken(user.Nama, user.PublicID.String(), string(user.Role))

	if err != nil {
		return "", err
	}

	return newToken, nil
}
