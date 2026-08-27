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

type PekerjaController interface {
	Create(ctx fiber.Ctx) error
	GetByPublicID(ctx fiber.Ctx) error
	GetAll(ctx fiber.Ctx) error
}

type PekerjaControllerImpl struct {
	s service.PekerjaService
}

// Create     	  godoc
// @Summary       Create
// @Description   Endpoint untuk menambah data pekerja
// @Tags          Pekerja
// @Accept        json
// @Produce       json
// @Param         pekerja  body  dto.PekerjaCreate  true  "Data pekerja"
// @Success       201 {object}   response.CreationSuccessResponse{status=string, status_code=int, message=string, data=dto.PekerjaBase}
// @Failure       400 {object}   response.BadRequestResponse{status=string, status_code=int, message=string, error=string}
// @Failure       500 {object}   response.InternalErrorResponse{status=string, status_code=int, message=string, error=string}
// @Security      ApiKeyAuth
// @Router        /api/v1/pekerja [post]
func (a *PekerjaControllerImpl) Create(ctx fiber.Ctx) error {
	create := &dto.PekerjaCreate{}

	if err := ctx.Bind().Body(create); err != nil {
		return response.BadRequest(ctx, constants.BodyParsingError, err)
	}

	if _, err := a.s.Create(create); err != nil {
		return response.InternalError(ctx, constants.CreationError, err)
	}

	return response.CreationSuccess(ctx, constants.CreationSuccess, nil)
}

// GetDetail 		godoc
// @Summary 		GetDetail
// @Description 	Endpoint untuk mengambil detail pekerja
// @Tags 			Pekerja
// @Produce 		json
// @Param         	public_id query int true "Public ID anak"
// @Success       	200 {object}   response.SuccessResponse{status=string, status_code=int, message=string, data=dto.PekerjaBase}
// @Failure       	400 {object}   response.BadRequestResponse{status=string, status_code=int, message=string, error=string}
// @Failure       	500 {object}   response.InternalErrorResponse{status=string, status_code=int, message=string, error=string}
// @Security      	ApiKeyAuth
// @Router 			/api/v1/pekerja/detail [get]
func (a *PekerjaControllerImpl) GetByPublicID(ctx fiber.Ctx) error {
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

// GetAll 		godoc
// @Summary 	GetAll
// @Description Endpoint untuk mengambil semua pekerja
// @Tags 		Pekerja
// @Produce 	json
// @Success     200 {object}   response.SuccessResponse{status=string, status_code=int, message=string, data=[]dto.PekerjaBase}
// @Failure     400 {object}   response.BadRequestResponse{status=string, status_code=int, message=string, error=string}
// @Failure     500 {object}   response.InternalErrorResponse{status=string, status_code=int, message=string, error=string}
// @Security    ApiKeyAuth
// @Router 		/api/v1/pekerja [get]
func (a *PekerjaControllerImpl) GetAll(ctx fiber.Ctx) error {
	data, err := a.s.GetAll()

	if err != nil {
		return response.InternalError(ctx, constants.RetrievalError, err)
	}

	return response.Success(ctx, constants.DataRetrievalSuccess, data)
}

func NewPekerjaController(s service.PekerjaService) PekerjaController {
	return &PekerjaControllerImpl{s: s}
}
