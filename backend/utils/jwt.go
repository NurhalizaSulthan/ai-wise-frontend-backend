package utils

import (
	"errors"
	"strconv"
	"time"

	"github.com/NurhalizaSulthan/ai-wise-frontend-backend/backend/config"
	jwtware "github.com/gofiber/contrib/v3/jwt"
	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
)

type AuthContext struct {
	Username string
	PublicID string
	Role     string
}

type UserClaims struct {
	jwt.RegisteredClaims
	Nama     string `json:"nama"`
	PublicID string `json:"nomor_handphone"`
	Role     string `json:"role"`
}

func createClaims(nama, publicID, role string) UserClaims {
	expiryMinute, err := strconv.Atoi(config.AppConfig.JWTTokenExpiry)

	if err != nil {
		expiryMinute = 1800
	}

	login_expiration_duration := time.Now().Add(time.Duration(expiryMinute) * time.Minute)

	return UserClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    "AI-Wise system",
			ExpiresAt: jwt.NewNumericDate(login_expiration_duration),
		},
		Nama:     nama,
		PublicID: publicID,
		Role:     role,
	}
}

func GenerateToken(nama, nomorHP, role string) (string, error) {
	claims := createClaims(nama, nomorHP, role)

	token := jwt.NewWithClaims(
		jwt.SigningMethodHS256,
		claims,
	)

	signedToken, err := token.SignedString([]byte(config.AppConfig.JWTSecret))

	if err != nil {
		return "", err
	}

	return signedToken, nil
}

func VerifyToken(tokenString string) error {
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (any, error) {
		return []byte(config.AppConfig.JWTSecret), nil
	}, jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}))

	if err != nil {
		return err
	}

	if _, ok := token.Claims.(jwt.MapClaims); !ok {
		return errors.New("Authentication Failed, Used Invalid Token")
	}

	return nil
}

func GetNamaClaim(ctx fiber.Ctx) string {
	user := jwtware.FromContext(ctx)
	claims := user.Claims.(jwt.MapClaims)
	return claims["nama"].(string)
}
