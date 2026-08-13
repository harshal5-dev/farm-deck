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
	SMTPPort       int  `env:"SMTP_PORT" envDefault:"587"`

	ServerAddress      string `env:"SERVER_ADDRESS" envDefault:":8083"`
	DatabaseURL        string `env:"DATABASE_URL,required"`
	LogLevel           string `env:"LOG_LEVEL" envDefault:"info"`
	CORSAllowedOrigins string `env:"CORS_ALLOWED_ORIGINS,required"`

	JWTSecret string `env:"JWT_SECRET,required"`
	JWTIssuer string `env:"JWT_ISSUER,required"`

	CookieDomain           string `env:"COOKIE_DOMAIN" envDefault:"localhost"`
	CookieTokenName        string `env:"COOKIE_TOKEN_NAME" envDefault:"access_token"`
	CookieRefreshTokenName string `env:"COOKIE_REFRESH_TOKEN_NAME" envDefault:"refresh_token"`

	AppURL string `env:"APP_URL" envDefault:"http://localhost:5173"`

	// SwaggerEnabled controls whether the OpenAPI/Swagger UI is served
	// at /swagger/*any. Disable in production with SWAGGER_ENABLED=false.
	SwaggerEnabled bool `env:"SWAGGER_ENABLED" envDefault:"true"`

	// Mail configuration (SMTP).
	MailFromAddress string `env:"MAIL_FROM_ADDRESS,required"`

	// SMTP
	SMTPHost     string `env:"SMTP_HOST" envDefault:"smtp.gmail.com"`
	SMTPUsername string `env:"SMTP_USERNAME,required"`
	SMTPPassword string `env:"SMTP_PASSWORD,required"`

	AccessTokenDuration  time.Duration `env:"ACCESS_TOKEN_DURATION,required"`
	RefreshTokenDuration time.Duration `env:"REFRESH_TOKEN_DURATION,required"`

	// InvitationTokenDuration controls how long a freshly created invitation
	// stays valid before the accept endpoint starts rejecting it. Defaults
	// to 168h (7 days) to match the user_invitations migration comment.
	InvitationTokenDuration time.Duration `env:"INVITATION_TOKEN_DURATION" envDefault:"168h"`
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
		v = strings.Trim(v, `"'`)
		result[k] = v
	}
	return result, nil
}
