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
	// The global limiter must be attached before public/protected are
	// derived: gin copies the middleware chain when a group is created.
	api.Use(middlewares.RateLimitMiddleware(server.globalLimiter, middlewares.IPKey))

	public := api.Group("")
	protected := api.Group("")

	protected.Use(middlewares.AuthMiddleware(server.config.CookieTokenName, server.config.JWTSecret))

	api.GET("/health", server.healthCheck)

	// Auth endpoints get a second, stricter limiter on top of the global
	// one (each request costs a token from both buckets) to blunt
	// brute-force attempts against login and invitation acceptance.
	authLimiter := middlewares.RateLimitMiddleware(server.authLimiter, middlewares.IPKey)
	authPublic := public.Group("", authLimiter)
	authProtected := protected.Group("", authLimiter)

	authhttp.Register(authPublic, authProtected, server.container.Handlers.Auth)
	userhttp.Register(public, protected, server.container.Handlers.User)
	tenanthttp.Register(public, protected, server.container.Handlers.Tenant)
}
