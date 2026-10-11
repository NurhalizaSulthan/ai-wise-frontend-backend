package response

import "github.com/gofiber/fiber/v3"

type Response struct {
	Status     string      `json:"status"`
	StatusCode int         `json:"status_code"`
	Message    string      `json:"message"`
	Data       interface{} `json:"data,omitempty"`
	Error      string      `json:"error,omitempty"`
}

func BadRequest(ctx fiber.Ctx, message string, err error) error {
	return ctx.Status(fiber.StatusBadRequest).JSON(Response{
		Status:     "400 Bad Request",
		StatusCode: fiber.StatusBadRequest,
		Message:    message,
		Error:      err.Error(),
	})
}

func Unauthorized(ctx fiber.Ctx, message string, err error) error {
	return ctx.Status(fiber.StatusUnauthorized).JSON(Response{
		Status:     "401 Unauthorized",
		StatusCode: fiber.StatusUnauthorized,
		Message:    message,
		Error:      err.Error(),
	})
}

func Forbidden(ctx fiber.Ctx, message string, err error) error {
	return ctx.Status(fiber.StatusForbidden).JSON(Response{
		Status:     "403 Forbidden",
		StatusCode: fiber.StatusForbidden,
		Message:    message,
		Error:      err.Error(),
	})
}

func NotFound(ctx fiber.Ctx, message string, err error) error {
	return ctx.Status(fiber.StatusNotFound).JSON(Response{
		Status:     "404 Not Found",
		StatusCode: fiber.StatusNotFound,
		Message:    message,
		Error:      err.Error(),
	})
}

func Conflict(ctx fiber.Ctx, message string, err error) error {
	return ctx.Status(fiber.StatusConflict).JSON(Response{
		Status:     "409 Conflict",
		StatusCode: fiber.StatusConflict,
		Message:    message,
		Error:      err.Error(),
	})
}

func UnprocessableEntity(ctx fiber.Ctx, message string, err error) error {
	return ctx.Status(fiber.StatusUnprocessableEntity).JSON(Response{
		Status:     "422 Unprocessable Entity",
		StatusCode: fiber.StatusUnprocessableEntity,
		Message:    message,
		Error:      err.Error(),
	})
}

func InternalError(ctx fiber.Ctx, message string, err error) error {
	return ctx.Status(fiber.StatusInternalServerError).JSON(Response{
		Status:     "500 Internal Server Error",
		StatusCode: fiber.StatusInternalServerError,
		Message:    message,
		Error:      err.Error(),
	})
}

func CreationSuccess(ctx fiber.Ctx, message string, data interface{}) error {
	return ctx.Status(fiber.StatusCreated).JSON(Response{
		Status:     "201 Created",
		StatusCode: fiber.StatusCreated,
		Message:    message,
		Data:       data,
	})
}

func Success(ctx fiber.Ctx, message string, data interface{}) error {
	return ctx.Status(fiber.StatusOK).JSON(Response{
		Status:     "200 OK",
		StatusCode: fiber.StatusOK,
		Message:    message,
		Data:       data,
	})
}

// 200 OK
type SuccessResponse struct {
	Status     string      `json:"status" example:"200 OK"`
	StatusCode int         `json:"status_code" example:"200"`
	Message    string      `json:"message" example:"Request berhasil"`
	Data       interface{} `json:"data,omitempty"`
}

// 201 Created
type CreationSuccessResponse struct {
	Status     string      `json:"status" example:"201 Created"`
	StatusCode int         `json:"status_code" example:"201"`
	Message    string      `json:"message" example:"Sukses menambahkan data"`
	Data       interface{} `json:"data,omitempty"`
}

// 400 Bad Request
type BadRequestResponse struct {
	Status     string `json:"status" example:"400 Bad Request"`
	StatusCode int    `json:"status_code" example:"400"`
	Message    string `json:"message" example:"Gagal parsing request"`
	Error      string `json:"error,omitempty" example:"Invalid request"`
}

// 401 Unauthorized
type UnauthorizedResponse struct {
	Status     string `json:"status" example:"401 Unauthorized"`
	StatusCode int    `json:"status_code" example:"401"`
	Message    string `json:"message" example:"Unauthorized"`
	Error      string `json:"error,omitempty" example:"Token tidak valid atau sudah kedaluwarsa"`
}

// 403 Forbidden
type ForbiddenResponse struct {
	Status     string `json:"status" example:"403 Forbidden"`
	StatusCode int    `json:"status_code" example:"403"`
	Message    string `json:"message" example:"Forbidden"`
	Error      string `json:"error,omitempty" example:"Anda tidak memiliki akses"`
}

// 404 Not Found
type NotFoundResponse struct {
	Status     string `json:"status" example:"404 Not Found"`
	StatusCode int    `json:"status_code" example:"404"`
	Message    string `json:"message" example:"Data tidak ditemukan"`
	Error      string `json:"error,omitempty" example:"Data tidak ditemukan"`
}

// 409 Conflict
type ConflictResponse struct {
	Status     string `json:"status" example:"409 Conflict"`
	StatusCode int    `json:"status_code" example:"409"`
	Message    string `json:"message" example:"Data mengalami konflik"`
	Error      string `json:"error,omitempty" example:"Data sudah ada"`
}

// 422 Unprocessable Entity
type UnprocessableEntityResponse struct {
	Status     string `json:"status" example:"422 Unprocessable Entity"`
	StatusCode int    `json:"status_code" example:"422"`
	Message    string `json:"message" example:"Unprocessable Entity"`
	Error      string `json:"error,omitempty" example:"Data tidak memenuhi aturan validasi"`
}

// 500 Internal Server Error
type InternalErrorResponse struct {
	Status     string `json:"status" example:"500 Internal Server Error"`
	StatusCode int    `json:"status_code" example:"500"`
	Message    string `json:"message" example:"Kesalahan pada sisi server"`
	Error      string `json:"error,omitempty" example:"Internal server error"`
}
