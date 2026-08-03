package controller

import (
	"errors"

	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/constants"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/dto"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/service"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/utils"
	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

type DeviceController interface {
	Create(ctx fiber.Ctx) error
	GetByPublicID(ctx fiber.Ctx) error
	GetAll(ctx fiber.Ctx) error
}

type DeviceControllerImpl struct {
	s service.DeviceService
}

func (a *DeviceControllerImpl) Create(ctx fiber.Ctx) error {
	create := &dto.DeviceCreate{}

	if err := ctx.Bind().Body(create); err != nil {
		return utils.BadRequest(ctx, constants.BodyParsingError, err)
	}

	if _, err := a.s.Create(create); err != nil {
		return utils.InternalError(ctx, constants.CreationError, err)
	}

	return utils.CreationSuccess(ctx, constants.CreationSuccess, nil)
}

func (a *DeviceControllerImpl) GetByPublicID(ctx fiber.Ctx) error {
	publicID := ctx.Params("public_id")
	if publicID == "" {
		return utils.BadRequest(ctx, constants.RetrievalError, errors.New(constants.PublicIDMissingError))
	}

	uid, err := uuid.Parse(publicID)

	if err != nil {
		return utils.BadRequest(ctx, constants.RetrievalError, err)
	}

	data, err := a.s.GetByPublicID(uid)

	if err != nil {
		return utils.InternalError(ctx, constants.RetrievalError, err)
	}

	return utils.SuccessResponse(ctx, constants.DataRetrievalSuccess, data)
}

func (a *DeviceControllerImpl) GetAll(ctx fiber.Ctx) error {
	data, err := a.s.GetAll()
	if err != nil {
		return utils.InternalError(ctx, constants.RetrievalError, err)
	}

	return utils.SuccessResponse(ctx, constants.DataRetrievalSuccess, data)


}

func NewDeviceController(s service.DeviceService) DeviceController {
	return &DeviceControllerImpl{s: s}
}
