package httptransport

import (
	"github.com/gin-gonic/gin"
	"golang.org/x/time/rate"

	"github.com/harshal5-dev/farm-deck/backend/internal/app"
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
	"github.com/harshal5-dev/farm-deck/backend/internal/middlewares"
	"github.com/harshal5-dev/farm-deck/backend/pkg/ratelimit"
)

type Server struct {
	config        config.Config
	container     *app.Container
	router        *gin.Engine
	globalLimiter *ratelimit.Limiter
	authLimiter   *ratelimit.Limiter
}

func NewServer(container *app.Container) *Server {
	server := &Server{
		config:    container.Config,
		container: container,
	}

	server.globalLimiter = ratelimit.NewLimiter(ratelimit.Config{
		Rate:  rate.Limit(container.Config.RateLimitPerMinute) / 60,
		Burst: container.Config.RateLimitBurst,
	})
	server.authLimiter = ratelimit.NewLimiter(ratelimit.Config{
		Rate:  rate.Limit(container.Config.AuthRateLimitPerMinute) / 60,
		Burst: container.Config.AuthRateLimitBurst,
	})

	router := gin.Default()
	router.Use(middlewares.CorsMiddleware(server.config))

	server.setupRoutes(router)
	server.router = router

	return server
}

func (server *Server) Start() error {
	return server.router.Run(server.config.ServerAddress)
}

func (server *Server) Shutdown() {
	server.globalLimiter.Stop()
	server.authLimiter.Stop()
}
