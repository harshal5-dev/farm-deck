package httptransport

import (
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	"github.com/harshal5-dev/farm-deck/backend/internal/middlewares"
	authhttp "github.com/harshal5-dev/farm-deck/backend/internal/modules/auth/http"
	tenanthttp "github.com/harshal5-dev/farm-deck/backend/internal/modules/tenant/http"
	userhttp "github.com/harshal5-dev/farm-deck/backend/internal/modules/user/http"
)

func (server *Server) setupRoutes(router *gin.Engine) {
	if server.config.SwaggerEnabled {
		router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	}

	api := router.Group("/api/v1")
	public := api.Group("")
	protected := api.Group("")

	protected.Use(middlewares.AuthMiddleware(server.config.CookieTokenName, server.config.JWTSecret))

	api.GET("/health", server.healthCheck)
	authhttp.Register(public, protected, server.container.Handlers.Auth)
	userhttp.Register(public, protected, server.container.Handlers.User)
	tenanthttp.Register(public, protected, server.container.Handlers.Tenant)
}
