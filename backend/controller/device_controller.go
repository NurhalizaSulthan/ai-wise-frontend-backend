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

type DeviceController interface {
	Create(ctx fiber.Ctx) error
	GetByPublicID(ctx fiber.Ctx) error
	GetAll(ctx fiber.Ctx) error
	Pagination(ctx fiber.Ctx) error
}

type DeviceControllerImpl struct {
	s service.DeviceService
}

// Create     	  godoc
// @Summary       Create
// @Description   Endpoint untuk menambah data device
// @Tags          Device
// @Accept        json
// @Produce       json
// @Param         device  body  dto.DeviceCreate  true  "Data device"
// @Success       201 {object}   response.CreationSuccessResponse{status=string, status_code=int, message=string, data=dto.DeviceBase}
// @Failure       400 {object}   response.BadRequestResponse{status=string, status_code=int, message=string, error=string}
// @Failure       500 {object}   response.InternalErrorResponse{status=string, status_code=int, message=string, error=string}
// @Security      ApiKeyAuth
// @Router        /api/v1/device [post]
func (a *DeviceControllerImpl) Create(ctx fiber.Ctx) error {
	create := &dto.DeviceCreate{}

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
// @Description Endpoint untuk mengambil detail device
// @Tags 		Device
// @Produce 	json
// @Param       public_id query int true "Public ID anak"
// @Success     200 {object}   response.SuccessResponse{status=string, status_code=int, message=string, data=dto.DeviceBase}
// @Failure     400 {object}   response.BadRequestResponse{status=string, status_code=int, message=string, error=string}
// @Failure     500 {object}   response.InternalErrorResponse{status=string, status_code=int, message=string, error=string}
// @Security    ApiKeyAuth
// @Router 		/api/v1/device/detail [get]
func (a *DeviceControllerImpl) GetByPublicID(ctx fiber.Ctx) error {
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
// @Description Endpoint untuk mengambil semua device
// @Tags 		Device
// @Produce 	json
// @Success     200 {object}   response.SuccessResponse{status=string, status_code=int, message=string, data=[]dto.DeviceBase}
// @Failure     400 {object}   response.BadRequestResponse{status=string, status_code=int, message=string, error=string}
// @Failure     500 {object}   response.InternalErrorResponse{status=string, status_code=int, message=string, error=string}
// @Security    ApiKeyAuth
// @Router 		/api/v1/device [get]
func (a *DeviceControllerImpl) GetAll(ctx fiber.Ctx) error {
	data, err := a.s.GetAll()
	if err != nil {
		return response.InternalError(ctx, constants.RetrievalError, err)
	}

	return response.Success(ctx, constants.DataRetrievalSuccess, data)

}

// Pagination     godoc
// @Summary       Pagination
// @Description   Endpoint untuk paginasi data device
// @Tags          Device
// @Accept        json
// @Produce       json
// @Param         before  query  string  false  "Cursor untuk data sebelumnya"
// @Param         after   query  string  false  "Cursor untuk data berikutnya"
// @Success       200 {object} response.SuccessResponse{data=dto.PaginationDTO}
// @Failure       400 {object} response.BadRequestResponse{status=string, status_code=int, message=string, error=string}
// @Failure       500 {object} response.InternalErrorResponse{status=string, status_code=int, message=string, error=string}
// @Security      ApiKeyAuth
// @Router        /api/v1/device/pagination [get]
func (a *DeviceControllerImpl) Pagination(ctx fiber.Ctx) error {

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

func NewDeviceController(s service.DeviceService) DeviceController {
	return &DeviceControllerImpl{s: s}
}
