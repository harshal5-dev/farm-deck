package httptransport

import (
	"github.com/gin-gonic/gin"
)

func (server *Server) setupRoutes(router *gin.Engine) {
	api := router.Group("/api/v1")
	// public := api.Group("")
	// protected := api.Group("")

	api.GET("/health", server.healthCheck)

}
