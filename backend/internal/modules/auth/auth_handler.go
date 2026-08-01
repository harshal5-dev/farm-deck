package auth

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
	"github.com/harshal5-dev/farm-deck/backend/internal/ctxutil"
	"github.com/harshal5-dev/farm-deck/backend/pkg/cookie"
)

type AuthHandler interface {
	Register(ctx *gin.Context)
	Login(ctx *gin.Context)
	GetCurrentProfile(ctx *gin.Context)
}

type AuthHandlerImpl struct {
	authService AuthService
	cfg         config.Config
}

func NewAuthHandler(authService AuthService, cfg config.Config) AuthHandler {
	return &AuthHandlerImpl{authService: authService, cfg: cfg}
}

func (h *AuthHandlerImpl) Register(ctx *gin.Context) {
	var req RegisterUserRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}
	if err := h.authService.RegisterUser(ctx, req); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(200, gin.H{"message": "user registered successfully"})
}

func (h *AuthHandlerImpl) Login(ctx *gin.Context) {
	var req LoginRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}
	loginRes, err := h.authService.LoginUser(ctx, req)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	cookieCfg := cookie.CookieConfig{
		CookieSecure:    h.cfg.CookieSecure,
		CookieHttpOnly:  h.cfg.CookieHttpOnly,
		CookieTokenAge:  h.cfg.CookieTokenAge,
		CookieDomain:    h.cfg.CookieDomain,
		CookieTokenName: h.cfg.CookieTokenName,
	}
	cookie.SetAuthCookie(ctx, loginRes.Token, cookieCfg)
	ctx.JSON(200, loginRes)
}

func (h *AuthHandlerImpl) GetCurrentProfile(ctx *gin.Context) {
	userID, err := ctxutil.GetUserID(ctx)
	if err != nil {
		ctx.JSON(401, gin.H{"error": "Unauthorized: " + err.Error()})
		return
	}

	user, err := h.authService.GetMyProfile(ctx, userID)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(200, user)
}
