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

type TelemetryController interface {
	Create(ctx fiber.Ctx) error
	GetByPublicID(ctx fiber.Ctx) error
	GetAll(ctx fiber.Ctx) error
	Pagination(ctx fiber.Ctx) error
}

type TelemetryControllerImpl struct {
	s service.TelemetryService
}

// Create     	  godoc
// @Summary       Create
// @Description   Endpoint untuk menambah data telemetry
// @Tags          Telemetry
// @Accept        json
// @Produce       json
// @Param         telemetry  body  dto.TelemetryCreate  true  "Data telemetry"
// @Success       201 {object}   response.CreationSuccessResponse{status=string, status_code=int, message=string, data=dto.TelemetryBase}
// @Failure       400 {object}   response.BadRequestResponse{status=string, status_code=int, message=string, error=string}
// @Failure       500 {object}   response.InternalErrorResponse{status=string, status_code=int, message=string, error=string}
// @Security      ApiKeyAuth
// @Router        /api/v1/telemetry [post]
func (a *TelemetryControllerImpl) Create(ctx fiber.Ctx) error {
	create := &dto.TelemetryCreate{}

	if err := ctx.Bind().Body(create); err != nil {
		return response.BadRequest(ctx, constants.BodyParsingError, err)
	}

	if _, err := a.s.Create(create); err != nil {
		return response.InternalError(ctx, constants.CreationError, err)
	}

	return response.CreationSuccess(ctx, constants.CreationSuccess, nil)
}

// GetDetail 	godoc
// @Summary 	GetDetail
// @Description Endpoint untuk mengambil detail telemetry
// @Tags 		Telemetry
// @Produce 	json
// @Param       public_id query int true "Public ID telemetry"
// @Success     200 {object}   response.SuccessResponse{status=string, status_code=int, message=string, data=dto.TelemetryBase}
// @Failure     400 {object}   response.BadRequestResponse{status=string, status_code=int, message=string, error=string}
// @Failure     500 {object}   response.InternalErrorResponse{status=string, status_code=int, message=string, error=string}
// @Security    ApiKeyAuth
// @Router 		/api/v1/telemetry/detail [get]
func (a *TelemetryControllerImpl) GetByPublicID(ctx fiber.Ctx) error {
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
// @Description Endpoint untuk mengambil semua telemetry
// @Tags 		Telemetry
// @Produce 	json
// @Success     200 {object}   response.SuccessResponse{status=string, status_code=int, message=string, data=[]dto.TelemetryBase}
// @Failure     400 {object}   response.BadRequestResponse{status=string, status_code=int, message=string, error=string}
// @Failure     500 {object}   response.InternalErrorResponse{status=string, status_code=int, message=string, error=string}
// @Security    ApiKeyAuth
// @Router 		/api/v1/telemetry [get]
func (a *TelemetryControllerImpl) GetAll(ctx fiber.Ctx) error {
	data, err := a.s.GetAll()

	if err != nil {
		return response.InternalError(ctx, constants.RetrievalError, err)
	}

	return response.Success(ctx, constants.DataRetrievalSuccess, data)
}

// Pagination     	  godoc
// @Summary       Pagination
// @Description   Endpoint untuk paginasi data telemetry
// @Tags          Telemetry
// @Accept        json
// @Produce       json
// @Param         before  query  string  false  "Cursor untuk data sebelumnya"
// @Param         after   query  string  false  "Cursor untuk data berikutnya"
// @Success       200 {object} response.SuccessResponse{data=dto.PaginationDTO}
// @Failure       400 {object} response.BadRequestResponse{status=string, status_code=int, message=string, error=string}
// @Failure       500 {object} response.InternalErrorResponse{status=string, status_code=int, message=string, error=string}
// @Security      ApiKeyAuth
// @Router        /api/v1/telemetry/pagination [get]
func (a *TelemetryControllerImpl) Pagination(ctx fiber.Ctx) error {

	before := ctx.Query("before")
	after := ctx.Query("after")

	if before != "" && after != "" {
		return response.BadRequest(
			ctx,
			"Parameter before dan after tidak dapat digunakan bersamaan",
			errors.New("Double Query"),
		)
	}

	result, err := a.s.GetPagination(
		before,
		after,
	)

	if err != nil {
		return response.InternalError(
			ctx,
			"Gagal mengambil paginasi",
			err,
		)
	}

	body := &dto.PaginationDTO{
		Data:           result.Data,
		NextCursor:     result.NextCursor,
		PreviousCursor: result.PreviousCursor,
		HasNext:        result.HasNext,
		HasPrevious:    result.HasPrevious,
	}

	return response.Success(
		ctx,
		"Sukses mengambil paginasi",
		body,
	)
}
func NewTelemetryController(s service.TelemetryService) TelemetryController {
	return &TelemetryControllerImpl{s: s}
}
