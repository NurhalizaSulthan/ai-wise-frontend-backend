package main

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/config"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/controller"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/repositories"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/route"
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
			AllowOrigins:     []string{"http://localhost:3000"},
			AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
			AllowCredentials: true,
		},
	))

	alertRepo := repositories.NewAlertRepository(config.DB)
	deviceRepo := repositories.NewDeviceRepository(config.DB)
	pekerjRepo := repositories.NewPekerjaRepository(config.DB)
	pengawRepo := repositories.NewPengawasRepository(config.DB)

	alertServ := service.NewAlertService(alertRepo, deviceRepo)
	deviceServ := service.NewDeviceService(deviceRepo, pekerjRepo)
	pekerjServ := service.NewPekerjaService(pekerjRepo, pengawRepo, deviceRepo)
	pengawServ := service.NewPengawasService(pengawRepo)

	authCont := controller.NewAuthController(pengawServ)
	alertCont := controller.NewAlertController(alertServ)
	deviceCont := controller.NewDeviceController(deviceServ)
	pekerjCont := controller.NewPekerjaController(pekerjServ)
	pengawCont := controller.NewPengawasController(pengawServ)

	route.Setup(
		app,
		authCont,
		pengawCont,
		pekerjCont,
		deviceCont,
		alertCont,
	)

	port := config.AppConfig.APPPort
	log.Fatal(app.Listen(":" + port))
}
