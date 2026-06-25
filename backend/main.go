package main

import (
	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/config"
	"github.com/gofiber/fiber/v3/log"
)

func main() {
	APPConfig := config.LoadEnv()

	if APPConfig == nil {
		log.Error("Menemukan masalah saat memuat environtment variable: Config bernilai nil")
	}
}