package controller

import (
	"errors"

	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/constants"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/dto"
	response "github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/responses"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/service"
	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

type PengawasController interface {
	Create(ctx fiber.Ctx) error
	GetByPublicID(ctx fiber.Ctx) error
	GetAll(ctx fiber.Ctx) error
}

type PengawasControllerImpl struct {
	s service.PengawasService
}

// Create     godoc
// @Summary       Create
// @Description   Endpoint untuk menambah data pengawas
// @Tags          Pengawas
// @Accept        json
// @Produce       json
// @Param         pengawas  body  dto.PengawasCreate  true  "Data pengawas"
// @Success       201 {object}   utils.CreationSuccessResponse{status=string, status_code=int, message=string, data=dto.PengawasBase}
// @Failure       400 {object}   utils.BadRequestResponse{status=string, status_code=int, message=string, error=string}
// @Failure       500 {object}   utils.InternalErrorResponse{status=string, status_code=int, message=string, error=string}
// @Security      ApiKeyAuth
// @Router        /api/v1/pengawas [post]
func (a *PengawasControllerImpl) Create(ctx fiber.Ctx) error {
	create := &dto.PengawasCreate{}

	if err := ctx.Bind().Body(create); err != nil {
		return response.BadRequest(ctx, constants.BodyParsingError, err)
	}

	if _, err := a.s.Create(create); err != nil {
		return response.InternalError(ctx, constants.CreationError, err)
	}

	return response.CreationSuccess(ctx, constants.CreationSuccess, nil)
}

// GetDetail godoc
// @Summary GetDetail
// @Description Endpoint untuk mengambil detail pengawas
// @Tags Pengawas
// @Produce json
// @Param         public_id query int true "Public ID anak"
// @Success       200 {object}   utils.SuccessResponse{status=string, status_code=int, message=string, data=dto.PengawasBase}
// @Failure       400 {object}   utils.BadRequestResponse{status=string, status_code=int, message=string, error=string}
// @Failure       500 {object}   utils.InternalErrorResponse{status=string, status_code=int, message=string, error=string}
// @Security      ApiKeyAuth
// @Router /api/v1/pengawas/detail [get]
func (a *PengawasControllerImpl) GetByPublicID(ctx fiber.Ctx) error {
	publicID := ctx.Params("public_id")
	if publicID == "" {
		return response.BadRequest(ctx, constants.RetrievalError, errors.New(constants.PublicIDMissingError))
	}

	uid, err := uuid.Parse(publicID)

	if err != nil {
		return response.BadRequest(ctx, constants.RetrievalError, err)
	}

	data, err := a.s.GetByPublicID(uid)

	if err != nil {
		return response.InternalError(ctx, constants.RetrievalError, err)
	}

	return response.Success(ctx, constants.DataRetrievalSuccess, data)
}

// GetAll godoc
// @Summary GetAll
// @Description Endpoint untuk mengambil semua pengawas
// @Tags Pengawas
// @Produce json
// @Success       200 {object}   utils.SuccessResponse{status=string, status_code=int, message=string, data=[]dto.PengawasBase}
// @Failure       400 {object}   utils.BadRequestResponse{status=string, status_code=int, message=string, error=string}
// @Failure       500 {object}   utils.InternalErrorResponse{status=string, status_code=int, message=string, error=string}
// @Security      ApiKeyAuth
// @Router /api/v1/pengawas [get]
func (a *PengawasControllerImpl) GetAll(ctx fiber.Ctx) error {
	data, err := a.s.GetAll()

	if err != nil {
		return response.InternalError(ctx, constants.RetrievalError, err)
	}

	return response.Success(ctx, constants.DataRetrievalSuccess, data)
}

func NewPengawasController(s service.PengawasService) PengawasController {
	return &PengawasControllerImpl{s: s}
}
