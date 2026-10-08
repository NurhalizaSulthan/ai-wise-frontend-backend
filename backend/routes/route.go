package route

import (
	"log"

	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/controller"
	websocketutils "github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/ws_config"
	"github.com/gofiber/contrib/v3/websocket"
	"github.com/gofiber/fiber/v3"
	"github.com/joho/godotenv"
)

func Setup(
	app *fiber.App,
	userCont controller.AuthController,
	awasCont controller.PengawasController,
	kerjaCont controller.PekerjaController,
	deviceCont controller.DeviceController,
	alertCont controller.AlertController,
	tlmtryCont controller.TelemetryController,
	wsContr *websocketutils.WSController,
) {
	err := godotenv.Load(".env")
	if err != nil {
		log.Println("File ENV tidak ditemukan menggunakan konfigurasi awal")
	}

	auth := app.Group("/auth/v1")
	auth.Post("/login", userCont.Login)
	auth.Post("/register", awasCont.Create)

	api := app.Group("/api/v1")

	// api.Use(jwtware.New(jwtware.Config{
	// 	SigningKey: jwtware.SigningKey{Key: []byte(config.AppConfig.JWTSecret)},
	// 	Extractor:  extractors.FromCookie("access_token"),
	// 	SuccessHandler: func(c fiber.Ctx) error {
	// 		// nama := utils.GetNamaClaim(c)
	// 		nama := "Sample"
	// 		role := "Sample"
	// 		uid, err := uuid.NewUUID()
	// 		if err != nil {
	// 			log.Println("Error making uid")
	// 		}
	// 		userCred := &utils.AuthContext{
	// 			Username: nama,
	// 			Role:     role,
	// 			PublicID: uid.String(),
	// 		}
	// 		c.Locals("auth", userCred)
	// 		return c.Next()
	// 	},
	// 	ErrorHandler: func(c fiber.Ctx, err error) error {
	// 		return response.Unauthorized(c, "User unauthorized", err)
	// 	},
	// }))

	api.Get("/pengawas", awasCont.GetAll)
	api.Get("/pengawas/detail", awasCont.GetByPublicID)
	api.Post("/pengawas", awasCont.Create)

	// Pekerja endpoint
	api.Get("/pekerja", kerjaCont.GetAll)
	api.Get("/pekerja/detail", kerjaCont.GetByPublicID)
	api.Post("/pekerja", kerjaCont.Create)
	api.Get("/pekerja/pagination", kerjaCont.Pagination)
	api.Put("/pekerja", kerjaCont.Update)

	// Device endpoint
	api.Get("/device", deviceCont.GetAll)
	api.Get("/device/detail", deviceCont.GetByPublicID)
	api.Post("/device", deviceCont.Create)
	api.Get("/device/pagination", deviceCont.Pagination)
	api.Put("/device", deviceCont.Update)

	api.Get("/alert", alertCont.GetAll)
	api.Post("/alert", alertCont.Create)
	api.Post("/alert/detail", alertCont.GetByPublicID)

	api.Get("/telemetry", tlmtryCont.GetAll)
	api.Post("/telemetry", tlmtryCont.Create)
	api.Get("/telemetry/detail", tlmtryCont.GetByPublicID)
	api.Get("/telemetry/pagination", tlmtryCont.Pagination)

	api.Get("/ws/mobile/:mac_address", wsContr.HandleSession, websocket.New(wsContr.HandleSessionWS))
}
