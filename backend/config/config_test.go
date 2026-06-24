package config

import (
	"os"
	"testing"
)

func TestLoadEnv_NotNil(t *testing.T) {
    cfg := LoadEnv()
    if cfg == nil {
        t.Error("LoadEnv() seharusnya tidak mengembalikan nil")
    }
}

func TestLoadEnv_UsesEnvVars(t *testing.T) {
    t.Setenv("DB_HOST", "192.168.1.1")
    t.Setenv("APP_PORT", "8080")

    cfg := LoadEnv()

    if cfg.DB_Host != "192.168.1.1" {
        t.Errorf("DB_Host = %q, seharusnya %q", cfg.DB_Host, "192.168.1.1")
    }
    if cfg.APP_Port != "8080" {
        t.Errorf("APP_Port = %q, seharusnya %q", cfg.APP_Port, "8080")
    }
}

func TestLoadEnv_UsesDefaults(t *testing.T) {
    original, exists := os.LookupEnv("APP_PORT")
    os.Unsetenv("APP_PORT")
    t.Cleanup(func() {
        if exists {
            os.Setenv("APP_PORT", original)
        } else {
            os.Unsetenv("APP_PORT")
        }
    })

    cfg := LoadEnv()
    if cfg.APP_Port != "3000" {
        t.Errorf("APP_Port = %q, seharusnya default %q", cfg.APP_Port, "3000")
    }
}

func TestGetEnvCorrect(t *testing.T){
	value := "127.0.0.0"
	t.Setenv("APP_URL", value)
	
	sample := getEnv("APP_URL", "localhost")

	if sample != value {
		t.Errorf(`getEnv("APP_URL", "localhost") = %q, seharusnya %q`, sample, value)
	}
}

func TestGetEnvError(t *testing.T){
	fallback := "fallback"
	value := getEnv("APP_DOCK", fallback)

	if value != fallback {
		t.Errorf(`"getEnv("APP_DOCK", fallback) = %q, seharusnya %q`, value, fallback)
	}
}