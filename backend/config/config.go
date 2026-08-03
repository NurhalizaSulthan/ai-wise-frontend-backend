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
	APPPort string
	APPUrl string
	DBHost string
	DBPort string
	DBUser string
	DBPass string
	DBName string
	JWTSecret string
	JWTTokenExpiry string
	JWTRefreshToken string
}

var (
	DB *gorm.DB
	AppConfig *Config
)

func LoadEnv(){
    if err := godotenv.Load(); err != nil {
        log.Println("Gagal memuat file env. Fallback ke environment variable")
    }

    AppConfig = &Config{
        APPPort:          getEnv("APPPORT", "3000"),
        APPUrl:           getEnv("APPURL", "localhost"),
        DBHost:           getEnv("DBHOST", "localhost"),
        DBPort:           getEnv("DBPORT", "5432"),
        DBUser:           getEnv("DBUSER", "postgres_user"),
        DBPass:           getEnv("DBPASS", "postgres_pass"),
        DBName:           getEnv("DBNAME", "postgres_db"),
        JWTSecret:        getEnv("JWTSECRET", "secretkey"),
        JWTTokenExpiry:  getEnv("JWTTOKENEXPIRY", "900"),
        JWTRefreshToken: getEnv("JWTREFRESHTOKEN", "1800"),
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

func ConnectToDB(){
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