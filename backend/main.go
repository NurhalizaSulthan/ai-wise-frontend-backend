package main

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/config"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/controller"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/repositories"
	route "github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/routes"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/service"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/log"
	"github.com/gofiber/fiber/v3/middleware/cors"
)

func main() {
	config.LoadEnv()
	config.ConnectToDB()

	app := fiber.New()

	if config.AppConfig == nil {
		log.Error("Menemukan masalah saat memuat environtment variable: Config bernilai nil")
	}

	app.Use(cors.New(
		cors.Config{
			AllowOrigins:     []string{config.AppConfig.APPUrl},
			AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
			AllowCredentials: true,
		},
	))

	alertRepo := repositories.NewAlertRepository(config.DB)
	deviceRepo := repositories.NewDeviceRepository(config.DB)
	pekerjRepo := repositories.NewPekerjaRepository(config.DB)
	pengawRepo := repositories.NewPengawasRepository(config.DB)
	tlmtryRepo := repositories.NewTelemetryRepository(config.DB)

	alertServ := service.NewAlertService(alertRepo, deviceRepo)
	deviceServ := service.NewDeviceService(deviceRepo, pekerjRepo)
	pekerjServ := service.NewPekerjaService(pekerjRepo, pengawRepo, deviceRepo)
	pengawServ := service.NewPengawasService(pengawRepo)
	tlmtryServ := service.NewTelemetryService(tlmtryRepo)

	authCont := controller.NewAuthController(pengawServ)
	alertCont := controller.NewAlertController(alertServ)
	deviceCont := controller.NewDeviceController(deviceServ)
	pekerjCont := controller.NewPekerjaController(pekerjServ)
	pengawCont := controller.NewPengawasController(pengawServ)
	tlmtryCont := controller.NewTelemetryController(tlmtryServ)

	route.Setup(
		app,
		authCont,
		pengawCont,
		pekerjCont,
		deviceCont,
		alertCont,
		tlmtryCont,
	)

	port := config.AppConfig.APPPort
	log.Fatal(app.Listen(":" + port))
}
