package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

type Config struct {
	APP_Port string
	APP_Url string
	DB_Host string
	DB_Port string
	DB_User string
	DB_Pass string
	DB_Name string
	JWT_Secret string
	JWT_Token_Expiry string
	JWT_Refresh_Token string
}

var (
	DB *gorm.DB
)

func LoadEnv() *Config {
    if err := godotenv.Load(); err != nil {
        log.Println("Gagal memuat file env. Fallback ke environment variable")
    }

    return &Config{
        APP_Port:          getEnv("APP_PORT", "3000"),
        APP_Url:           getEnv("APP_URL", "localhost"),
        DB_Host:           getEnv("DB_HOST", "localhost"),
        DB_Port:           getEnv("DB_PORT", "5432"),
        DB_User:           getEnv("DB_USER", "postgres_user"),
        DB_Pass:           getEnv("DB_PASS", "postgres_pass"),
        DB_Name:           getEnv("DB_NAME", "postgres_db"),
        JWT_Secret:        getEnv("JWT_SECRET", "secret_key"),
        JWT_Token_Expiry:  getEnv("JWT_TOKEN_EXPIRY", "900"),
        JWT_Refresh_Token: getEnv("JWT_REFRESH_TOKEN", "1800"),
    }
}

func getEnv(key string, fallback string) string {
	value, exist := os.LookupEnv(key)
	if exist {
		return value
	} else {
		return fallback
	}
}