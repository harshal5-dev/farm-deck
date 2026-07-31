package middlewares

import (
	"fmt"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
)

var defaultCORSAllowedOrigins = []string{
	"",
}

func CorsMiddleware(cfg config.Config) gin.HandlerFunc {
	fmt.Println("CORS Allowed Origins:", parseAllowedOrigins(cfg.CORSAllowedOrigins))
	return cors.New(cors.Config{
		AllowOrigins:     parseAllowedOrigins(cfg.CORSAllowedOrigins),
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	})
}

func parseAllowedOrigins(value string) []string {
	if strings.TrimSpace(value) == "" {
		return defaultCORSAllowedOrigins
	}

	origins := strings.Split(value, ",")
	allowedOrigins := make([]string, 0, len(origins))
	for _, origin := range origins {
		origin = strings.TrimSpace(origin)
		if origin == "" {
			continue
		}

		allowedOrigins = append(allowedOrigins, origin)
	}

	if len(allowedOrigins) == 0 {
		return defaultCORSAllowedOrigins
	}

	return allowedOrigins
}
