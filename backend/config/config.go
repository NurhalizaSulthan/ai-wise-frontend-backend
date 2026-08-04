package config

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Config struct {
	APPPort         string
	APPUrl          string
	DBHost          string
	DBPort          string
	DBUser          string
	DBPass          string
	DBName          string
	JWTSecret       string
	JWTTokenExpiry  string
	JWTRefreshToken string
}

var (
	DB        *gorm.DB
	AppConfig *Config
)

func LoadEnv() {
	if err := godotenv.Load(".env"); err != nil {
		log.Println("Gagal memuat file env. Fallback ke environment variable")
	}

	AppConfig = &Config{
		APPPort:         getEnv("APP_PORT", "3000"),
		APPUrl:          getEnv("APP_URL", "localhost"),
		DBHost:          getEnv("DB_HOST", "localhost"),
		DBPort:          getEnv("DB_PORT", "5432"),
		DBUser:          getEnv("DB_USER", "postgres_user"),
		DBPass:          getEnv("DB_PASS", "postgres_pass"),
		DBName:          getEnv("DB_NAME", "postgres_db"),
		JWTSecret:       getEnv("JWT_SECRET", "secretkey"),
		JWTTokenExpiry:  getEnv("JWT_TOKEN_EXPIRY", "900"),
		JWTRefreshToken: getEnv("JWT_REFRESH_TOKEN", "1800"),
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

func ConnectToDB() {
	cfg := AppConfig
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", cfg.DBHost, cfg.DBPort, cfg.DBUser, cfg.DBPass, cfg.DBName)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Gagal tersambung ke postgres: ", err)
	}

	sqlDB, err := db.DB()

	if err != nil {
		log.Fatal("Gagal mengambil database: ", err)
	}

	sqlDB.SetMaxIdleConns(10)
	sqlDB.SetMaxOpenConns(100)
	sqlDB.SetConnMaxLifetime(time.Hour)

	DB = db
}
