package httptransport

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/app"
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
	"github.com/harshal5-dev/farm-deck/backend/internal/middlewares"
)

type Server struct {
	config    config.Config
	container *app.Container
	router    *gin.Engine
}

func NewServer(container *app.Container) *Server {
	server := &Server{
		config:    container.Config,
		container: container,
	}

	router := gin.Default()
	router.Use(middlewares.CorsMiddleware(server.config))

	server.setupRoutes(router)
	server.router = router

	return server
}

func (server *Server) Start() error {
	return server.router.Run(server.config.ServerAddress)
}
