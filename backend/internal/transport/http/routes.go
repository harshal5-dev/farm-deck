package httptransport

import (
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	"github.com/harshal5-dev/farm-deck/backend/internal/middlewares"
	authhttp "github.com/harshal5-dev/farm-deck/backend/internal/modules/auth/http"
	farmhttp "github.com/harshal5-dev/farm-deck/backend/internal/modules/farm/http"
	lookuphttp "github.com/harshal5-dev/farm-deck/backend/internal/modules/lookup/http"
	tenanthttp "github.com/harshal5-dev/farm-deck/backend/internal/modules/tenant/http"
	userhttp "github.com/harshal5-dev/farm-deck/backend/internal/modules/user/http"
	zonehttp "github.com/harshal5-dev/farm-deck/backend/internal/modules/zone/http"
)

func (server *Server) setupRoutes(router *gin.Engine) {
	if server.config.SwaggerEnabled {
		router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	}

	api := router.Group("/api/v1")

	api.Use(middlewares.RateLimitMiddleware(server.globalLimiter, middlewares.IPKey))

	public := api.Group("")
	protected := api.Group("")

	protected.Use(middlewares.AuthMiddleware(server.config.CookieTokenName, server.config.JWTSecret))

	api.GET("/health", server.healthCheck)

	authLimiter := middlewares.RateLimitMiddleware(server.authLimiter, middlewares.IPKey)
	authPublic := public.Group("", authLimiter)
	authProtected := protected.Group("", authLimiter)

	authhttp.Register(authPublic, authProtected, server.container.Handlers.Auth, server.config.AppEnv)
	userhttp.Register(public, protected, server.container.Handlers.User)
	tenanthttp.Register(public, protected, server.container.Handlers.Tenant)
	lookuphttp.Register(public, protected, server.container.Handlers.Lookup)
	farmhttp.Register(public, protected, server.container.Handlers.Farm)
	zonehttp.Register(public, protected, server.container.Handlers.Zone)
}
