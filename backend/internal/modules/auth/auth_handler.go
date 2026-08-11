package auth

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
	"github.com/harshal5-dev/farm-deck/backend/internal/httperr"
	"github.com/harshal5-dev/farm-deck/backend/internal/response"
	"github.com/harshal5-dev/farm-deck/backend/pkg/cookie"
	"github.com/harshal5-dev/farm-deck/backend/pkg/validate"
)

type AuthHandler interface {
	Register(ctx *gin.Context)
	Login(ctx *gin.Context)
	Refresh(ctx *gin.Context)
	Logout(ctx *gin.Context)
}

type AuthHandlerImpl struct {
	authService AuthService
	cfg         config.Config
}

func NewAuthHandler(authService AuthService, cfg config.Config) AuthHandler {
	return &AuthHandlerImpl{authService: authService, cfg: cfg}
}

func (h *AuthHandlerImpl) cookieCfg() cookie.Config {
	return cookie.Config{
		CookieSecure:           h.cfg.CookieSecure,
		CookieHttpOnly:         h.cfg.CookieHttpOnly,
		CookieDomain:           h.cfg.CookieDomain,
		CookieTokenName:        h.cfg.CookieTokenName,
		CookieRefreshTokenName: h.cfg.CookieRefreshTokenName,
	}
}

func (h *AuthHandlerImpl) sessionMeta(ctx *gin.Context) SessionMeta {
	return SessionMeta{
		UserAgent: ctx.GetHeader("User-Agent"),
		IP:        ctx.ClientIP(),
	}
}

func (h *AuthHandlerImpl) setTokenCookies(ctx *gin.Context, pair TokenPair) {
	cfg := h.cookieCfg()
	cookie.SetAuthCookie(ctx, pair.AccessToken, h.cfg.AccessTokenDuration, cfg)
	cookie.SetRefreshCookie(ctx, pair.RefreshToken, h.cfg.RefreshTokenDuration, cfg)
}

func (h *AuthHandlerImpl) clearTokenCookies(ctx *gin.Context) {
	cfg := h.cookieCfg()
	cookie.ClearAuthCookie(ctx, cfg)
	cookie.ClearRefreshCookie(ctx, cfg)
}

// Register godoc
// @Summary      Register a new user and tenant
// @Description  Creates a new tenant and the first owner user, then sends a welcome email.
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        request body RegisterUserRequest true "Registration payload"
// @Success      200 {object} RegisterResponse "user registered successfully"
// @Failure      400 {object} response.APIError "validation error or bad request"
// @Failure      409 {object} response.APIError "user or tenant already exists"
// @Failure      500 {object} response.APIError "internal server error"
// @Router       /auth/register [post]
func (h *AuthHandlerImpl) Register(ctx *gin.Context) {
	var req RegisterUserRequest
	if !validate.Bind(ctx, &req) {
		return
	}
	if err := h.authService.RegisterUser(ctx, req); err != nil {
		httperr.HandleError(ctx, err)
		return
	}
	response.OK(ctx, RegisterResponse{Message: "user registered successfully"})
}

// Login godoc
// @Summary      Log in
// @Tags         auth
// @Accept       json
// @Produce      json
// @Param        request body LoginRequest true "Login payload"
// @Success      200 {object} LoginResponse "login successful"
// @Failure      400 {object} response.APIError "validation error"
// @Failure      401 {object} response.APIError "invalid email or password"
// @Failure      500 {object} response.APIError "internal server error"
// @Router       /auth/login [post]
func (h *AuthHandlerImpl) Login(ctx *gin.Context) {
	var req LoginRequest
	if !validate.Bind(ctx, &req) {
		return
	}
	pair, err := h.authService.LoginUser(ctx, req, h.sessionMeta(ctx))
	if err != nil {
		httperr.HandleError(ctx, err)
		return
	}
	h.setTokenCookies(ctx, pair)
	response.OK(ctx, LoginResponse{AccessToken: pair.AccessToken})
}

// Refresh godoc
// @Summary      Refresh access token
// @Description  Uses the httpOnly refresh_token cookie to issue a new access token (and rotates the refresh token).
// @Tags         auth
// @Produce      json
// @Success      200 {object} LoginResponse "tokens refreshed"
// @Failure      401 {object} response.APIError "refresh token missing, invalid, or expired"
// @Failure      500 {object} response.APIError "internal server error"
// @Router       /auth/refresh [post]
func (h *AuthHandlerImpl) Refresh(ctx *gin.Context) {
	raw, err := ctx.Cookie(h.cfg.CookieRefreshTokenName)
	if err != nil || raw == "" {
		response.Unauthorized(ctx, "refresh token missing")
		return
	}
	pair, err := h.authService.RefreshTokens(ctx, raw, h.sessionMeta(ctx))
	if err != nil {
		httperr.HandleError(ctx, err)
		return
	}
	h.setTokenCookies(ctx, pair)
	response.OK(ctx, LoginResponse{AccessToken: pair.AccessToken})
}

// Logout godoc
// @Summary      Log out
// @Description  Revokes the current refresh token and clears auth cookies.
// @Tags         auth
// @Produce      json
// @Success      200 {object} RegisterResponse "logged out"
// @Failure      500 {object} response.APIError "internal server error"
// @Router       /auth/logout [post]
func (h *AuthHandlerImpl) Logout(ctx *gin.Context) {
	raw, _ := ctx.Cookie(h.cfg.CookieRefreshTokenName)
	if err := h.authService.Logout(ctx, raw); err != nil {
		httperr.HandleError(ctx, err)
		return
	}
	h.clearTokenCookies(ctx)
	response.OK(ctx, RegisterResponse{Message: "logged out"})
}
