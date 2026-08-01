package auth

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
	"github.com/harshal5-dev/farm-deck/backend/internal/ctxutil"
	"github.com/harshal5-dev/farm-deck/backend/internal/httperr"
	"github.com/harshal5-dev/farm-deck/backend/pkg/cookie"
	"github.com/harshal5-dev/farm-deck/backend/pkg/response"
	"github.com/harshal5-dev/farm-deck/backend/pkg/validate"
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
	if !validate.Bind(ctx, &req) {
		return
	}
	if err := h.authService.RegisterUser(ctx, req); err != nil {
		httperr.HandleError(ctx, err)
		return
	}
	response.OK(ctx, gin.H{"message": "user registered successfully"})
}

func (h *AuthHandlerImpl) Login(ctx *gin.Context) {
	var req LoginRequest
	if !validate.Bind(ctx, &req) {
		return
	}
	loginRes, err := h.authService.LoginUser(ctx, req)
	if err != nil {
		httperr.HandleError(ctx, err)
		return
	}
	cookieCfg := toCookieConfig(h.cfg)
	cookie.SetAuthCookie(ctx, loginRes.Token, cookieCfg)
	response.OK(ctx, loginRes)
}

func (h *AuthHandlerImpl) GetCurrentProfile(ctx *gin.Context) {
	userID, err := ctxutil.GetUserID(ctx)
	if err != nil {
		response.Unauthorized(ctx, "authentication required")
		return
	}

	user, err := h.authService.GetMyProfile(ctx, userID)
	if err != nil {
		httperr.HandleError(ctx, err)
		return
	}
	response.OK(ctx, user)
}
