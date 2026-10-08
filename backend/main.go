package main

import (
	"fmt"

	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/config"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/controller"
	_ "github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/docs"
	mqttclient "github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/mqtt_client"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/repositories"
	route "github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/routes"
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/service"
	websocketutils "github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/ws_config"
	fiberprometheus "github.com/gofiber/contrib/v3/prometheus"
	"github.com/gofiber/contrib/v3/swaggo"
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/log"
	"github.com/gofiber/fiber/v3/middleware/cors"
)

// File utama project
// @title           Rikub Backend
// @version         1.0.0
// @description     API sistem rikub
// @termsOfService  http://swagger.io/terms/

// @contact.name   API Support
// @contact.url    http://www.swagger.io/support
// @contact.email  support@swagger.io

// @license.name  Apache 2.0
// @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

// @host      localhost:4000
// @BasePath  /

// @externalDocs.description  OpenAPI
// @externalDocs.url          https://swagger.io/resources/open-api/
func main() {

	config.LoadEnv()
	config.ConnectToDB()

	app := fiber.New()

	if config.AppConfig == nil {
		log.Error("Menemukan masalah saat memuat environtment variable: Config bernilai nil")
	}

	app.Get("/swagger/*", swaggo.HandlerDefault)
	app.Get("/docs/*", swaggo.New(swaggo.Config{
		URL:               "http://example.com/doc.json",
		DeepLinking:       false,
		DocExpansion:      "none",
		OAuth2RedirectUrl: fmt.Sprintf("http://localhost:%s/swagger/oauth2-redirect.html", config.AppConfig.APPPort),
	}))

	app.Use(cors.New(
		cors.Config{
			AllowOrigins:     []string{config.AppConfig.APPUrl},
			AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
			AllowCredentials: true,
		},
	))

	prometheusConfig := fiberprometheus.Config{
		ServiceName:         "backend-service",
		MetricsPath:         "/metrics",
		UnmatchedRouteLabel: "/__unmatched__",
	}

	prometheus := fiberprometheus.New(prometheusConfig)

	app.Use(prometheus)

	alertRepo := repositories.NewAlertRepository(config.DB)
	deviceRepo := repositories.NewDeviceRepository(config.DB)
	pekerjRepo := repositories.NewPekerjaRepository(config.DB)
	pengawRepo := repositories.NewPengawasRepository(config.DB)
	tlmtryRepo := repositories.NewTelemetryRepository(config.DB)

	wsHub := websocketutils.NewHub()
	go wsHub.Run()

	wsController := websocketutils.NewWSController(wsHub)

	brokerString := fmt.Sprintf("tcp://%s:%s", config.AppConfig.MQTT_HOST, config.AppConfig.MQTT_PORT)
	mqttClient := mqttclient.NewMQTTClient(
		brokerString,
		config.AppConfig.MQTT_CLIENT,
		tlmtryRepo,
		deviceRepo,
		wsHub,
	)

	mqttClient.StartTelemetryWorker()

	if err := mqttClient.Connect(); err != nil {
		log.Fatalf("Gagal terhubung ke MQTT broker: %v", err)
	}
	alertServ := service.NewAlertService(alertRepo, deviceRepo)
	deviceServ := service.NewDeviceService(deviceRepo, pekerjRepo, mqttClient)
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
		wsController,
	)

	port := config.AppConfig.APPPort
	log.Fatal(app.Listen(":" + port))
}
