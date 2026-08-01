package config

import (
	"fmt"
	"maps"
	"os"
	"strings"
	"time"

	"github.com/caarlos0/env/v11"
)

const (
	filePath = "configs/.env"
)

type Config struct {
	CookieSecure   bool `env:"COOKIE_SECURE" envDefault:"true"`
	CookieHttpOnly bool `env:"COOKIE_HTTP_ONLY" envDefault:"true"`
	CookieTokenAge int  `env:"COOKIE_TOKEN_AGE" envDefault:"15"`

	ServerAddress      string `env:"SERVER_ADDRESS" envDefault:":8083"`
	DatabaseURL        string `env:"DATABASE_URL,required"`
	LogLevel           string `env:"LOG_LEVEL" envDefault:"info"`
	CORSAllowedOrigins string `env:"CORS_ALLOWED_ORIGINS,required"`

	JWTSecret string `env:"JWT_SECRET,required"`
	JWTIssuer string `env:"JWT_ISSUER,required"`

	CookieDomain    string `env:"COOKIE_DOMAIN" envDefault:"localhost"`
	CookieTokenName string `env:"COOKIE_TOKEN_NAME" envDefault:"access_token"`

	AccessTokenDuration  time.Duration `env:"ACCESS_TOKEN_DURATION,required"`
	RefreshTokenDuration time.Duration `env:"REFRESH_TOKEN_DURATION,required"`
}

func Load() (Config, error) {
	var cfg Config

	values := collectFromFilesThenEnv()

	if err := env.ParseWithOptions(&cfg, env.Options{Environment: values}); err != nil {
		return cfg, err
	}

	return cfg, nil
}

func collectFromFilesThenEnv() map[string]string {
	merged := make(map[string]string)

	files := []string{filePath}

	if appEnv := os.Getenv("APP_ENV"); appEnv != "" {
		files = append(files, fmt.Sprintf("%s.%s", filePath, appEnv))
	}

	for _, name := range files {
		src, err := parseEnvFile(name)
		if err != nil {
			continue
		}
		maps.Copy(merged, src)
	}

	for _, e := range os.Environ() {
		k, v, _ := strings.Cut(e, "=")
		merged[k] = v
	}

	return merged
}

/*
parseEnvFile reads a simple KEY=VALUE file.
Ignores blank lines and lines starting with #.
*/
func parseEnvFile(name string) (map[string]string, error) {
	data, err := os.ReadFile(name)
	if err != nil {
		return nil, err
	}
	result := make(map[string]string)
	for line := range strings.SplitSeq(string(data), "\n") {
		line = strings.TrimSpace(line)
		if line == "" || line[0] == '#' {
			continue
		}
		k, v, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}
		k = strings.TrimSpace(k)
		v = strings.TrimSpace(v)
		v = strings.Trim(v, `"`)
		result[k] = v
	}
	return result, nil
}
