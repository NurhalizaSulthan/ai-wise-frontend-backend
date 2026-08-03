package utils

import "github.com/gofiber/fiber/v3"

type Response struct {
	Status     string
	StatusCode int
	Message    string
	Data       interface{}
	Error      string
}


// Contoh bentuk response dengan tag untuk dokumentasi swaggo
type BadRequestResponse struct {
  Status  string          `json:"status" example:"400 Bad Request"`
  StatusCode int          `json:"status_code" example:"400"`
  Message    string       `json:"message" example:"Gagal parsing data"`
  Error      string       `json:"error" example:"Diisi dengan kembalian error server"`
}

func (r *BadRequestResponse) CreateRequest(err error) *BadRequestResponse{
  return &BadRequestResponse{
    Status: "400 Bad Request",
    StatusCode: fiber.StatusBadRequest,
    Message: "Gagal parsing data",
    Error: r.Error,
  }
}

type InternalErrorResponse struct {
  Status      string       `json:"status" example:"400 Bad Request"`
  StatusCode  int          `json:"status_code" example:"400"`
  Message     string       `json:"message" example:"Gagal parsing data"`
  Error       string       `json:"error" example:"Diisi dengan kembalian error server"`
}

func (r *InternalErrorResponse) CreateRequest(err error) *InternalErrorResponse{
  return &InternalErrorResponse{
    Status: "500 Internal Error",
    StatusCode: fiber.StatusInternalServerError,
    Message: "Kesalahan pada sisi server",
    Error: r.Error,
  }
}


// Contoh bentuk response dengan tag untuk dokumentasi swaggo
type CreationSuccessResponse struct {
  Status  string          `json:"status" example:"201 Creation Success"`
  StatusCode int          `json:"status_code" example:"201"`
  Message    string          `json:"message" example:"Sukses menambahkan X"`
  Data       interface{}  `json:"data"`
}


// Message
var (
  ParsingError        = "Gagal parsing request"
  DataCreationSuccess = "Sukses menambahkan data"
  DataCreationError   = "Gagal menambahkan data"
)


func BadRequest(ctx fiber.Ctx, message string, err error) error {
	return ctx.Status(fiber.StatusBadRequest).JSON(Response{
		Status: "400 Bad Request",
		StatusCode: fiber.StatusBadRequest,
		Message: message,
		Error: err.Error(),
	})
}

func Unauthorized(ctx fiber.Ctx, message string, err error) error {
	return ctx.Status(fiber.StatusUnauthorized).JSON(Response{
		Status: "401 Unathorized",
		StatusCode: fiber.StatusUnauthorized,
		Message: message,
		Error: err.Error(),
	})
}

func NotFound(ctx fiber.Ctx, message string, err error) error {
	return ctx.Status(fiber.StatusNotFound).JSON(Response{
		Status: "404 Not Found",
		StatusCode: fiber.StatusNotFound,
		Message: message,
		Error: err.Error(),
	})
}

func InternalError(ctx fiber.Ctx, message string, err error) error{
	return ctx.Status(fiber.StatusInternalServerError).JSON(Response{
		Status: "500 Internal Server Error",
		StatusCode: fiber.StatusInternalServerError,
		Message: message,
		Error: err.Error(),
	})
}

func CreationSuccess(ctx fiber.Ctx, message string, data interface{}) error {
	return ctx.Status(fiber.StatusCreated).JSON(Response{
		Status: "201 Status Created",
		StatusCode: fiber.StatusCreated,
		Message: message,
		Data: data,
	})
}

func SuccessResponse(ctx fiber.Ctx, message string, data interface{}) error {
	return ctx.Status(fiber.StatusOK).JSON(Response{
		Status: "200 Status OK",
		StatusCode: fiber.StatusOK,
		Message:  message,
		Data: data,
	})
}

func UnauthorizedReponse(ctx fiber.Ctx, message string, err error) error {
	return ctx.Status(fiber.StatusUnauthorized).JSON(Response{
		Status: "401 Unathorized",
		StatusCode: fiber.StatusUnauthorized,
		Message: message,
		Error: err.Error(),
	})
}
