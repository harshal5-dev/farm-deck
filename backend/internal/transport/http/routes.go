package httptransport

import (
	"github.com/gin-gonic/gin"
	authhttp "github.com/harshal5-dev/farm-deck/backend/internal/modules/auth/http"
)

func (server *Server) setupRoutes(router *gin.Engine) {
	api := router.Group("/api/v1")
	public := api.Group("")
	protected := api.Group("")

	api.GET("/health", server.healthCheck)

	authhttp.Register(public, protected, server.container.Handlers.Auth)

}
