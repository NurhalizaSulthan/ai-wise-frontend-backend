package controller

import (
	"errors"
	"fmt"

	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/dto"
	response "github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/responses"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/service"
	"github.com/gofiber/fiber/v3"
)

type AuthController interface {
	Login(ctx fiber.Ctx) error
}

type AuthControllerImpl struct {
	p service.PengawasService
}

// Login 		godoc
// @Summary 	Login
// @Description Endpoint untuk login
// @Tags 		Auth
// @Accept		json
// @Produce 	json
// @Param       login 	body 		dto.LoginUser true "Data Login"
// @Success     200 	{object}   	utils.SuccessResponse{status=string, status_code=int, message=string, data=nil}
// @Failure     400 	{object}   	utils.BadRequestResponse{status=string, status_code=int, message=string, error=string}
// @Failure     401 	{object}   	utils.UnauthorizedResponse{status=string, status_code=int, message=string, error=string}
// @Failure     500 	{object}   	utils.InternalErrorResponse{status=string, status_code=int, message=string, error=string}
// @Security    ApiKeyAuth
// @Router 		/auth/v1/login [get]
func (a *AuthControllerImpl) Login(ctx fiber.Ctx) error {
	userLogin := &dto.LoginUser{}

	if err := ctx.Bind().Body(userLogin); err != nil {
		return response.BadRequest(ctx, "Autentikasi gagal", err)
	}

	token, err := a.p.Login(userLogin)

	if err != nil {
		return response.BadRequest(ctx, "Pengawas tidak ditemukan", err)
	}

	if token == "" {
		return response.Unauthorized(ctx, "Nama atau password salah", errors.New("Unauthorized"))
	}

	ctx.Cookie(&fiber.Cookie{
		Name:     "access_token",
		Value:    token,
		HTTPOnly: true,
		Secure:   false,
		SameSite: "Lax",
		Path:     "/",
		MaxAge:   60 * 15,
	})

	return response.Success(ctx, "Login sukses", nil)
}

// Create     	  godoc
// @Summary       Create
// @Description   Endpoint untuk registrasi data pengawas
// @Tags          Auth
// @Accept        json
// @Produce       json
// @Param         device  body  dto.PengawasCreate  true  "Data pengawas"
// @Success       201 {object}  utils.CreationSuccessResponse{status=string, status_code=int, message=string, data=string}
// @Failure       400 {object}  utils.BadRequestResponse{status=string, status_code=int, message=string, error=string}
// @Failure       500 {object}  utils.InternalErrorResponse{status=string, status_code=int, message=string, error=string}
// @Security      ApiKeyAuth
// @Router        /auth/v1/register [post]
func (a *AuthControllerImpl) Create(ctx fiber.Ctx) error {
	userLogin := &dto.PengawasCreate{}

	if err := ctx.Bind().Body(userLogin); err != nil {
		return response.BadRequest(ctx, "Autentikasi gagal", err)
	}

	data, err := a.p.Create(userLogin)

	if err != nil {
		return response.BadRequest(ctx, "Pengawas tidak ditemukan", err)
	}

	message := fmt.Sprintf("Pengawas %s telah terdaftar", data.Nama)
	return response.Success(ctx, "Registrasi Sukses", message)
}

func NewAuthController(p service.PengawasService) AuthController {
	return &AuthControllerImpl{p: p}
}
