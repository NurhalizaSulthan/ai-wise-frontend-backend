package controller

import (
	"errors"

	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/dto"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/service"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/utils"
	"github.com/gofiber/fiber/v3"
)

type AuthController interface {
	Login(ctx fiber.Ctx) error
}

type AuthControllerImpl struct {
	p service.PengawasService
}

// Login implements [AuthController].
func (a *AuthControllerImpl) Login(ctx fiber.Ctx) error {
	userLogin := &dto.LoginUser{}
	
	if err := ctx.Bind().Body(userLogin); err != nil {
		return utils.BadRequest(ctx, "Autentikasi gagal", err)
	}

	token, err := a.p.Login(userLogin)

	if err != nil {
		return utils.BadRequest(ctx, "Pengawas tidak ditemukan", err)
	}

	if token == "" {
		return utils.Unauthorized(ctx, "Nama atau password salah", errors.New("Unauthorized"))
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

	return utils.SuccessResponse(ctx, "Login sukses", nil)
}

func NewAuthController(p service.PengawasService) AuthController {
	return &AuthControllerImpl{p: p}
}
