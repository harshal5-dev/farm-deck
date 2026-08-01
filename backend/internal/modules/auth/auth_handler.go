package auth

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
	"github.com/harshal5-dev/farm-deck/backend/internal/ctxutil"
	"github.com/harshal5-dev/farm-deck/backend/internal/httperr"
	"github.com/harshal5-dev/farm-deck/backend/pkg/cookie"
	"github.com/harshal5-dev/farm-deck/backend/internal/response"
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
// @Description  Authenticates the user with email and password, sets the auth cookie, and returns a JWT.
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
	loginRes, err := h.authService.LoginUser(ctx, req)
	if err != nil {
		httperr.HandleError(ctx, err)
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
	response.OK(ctx, loginRes)
}

// GetCurrentProfile godoc
// @Summary      Get current user profile
// @Description  Returns the profile of the currently authenticated user.
// @Tags         auth
// @Produce      json
// @Security     CookieAuth
// @Success      200 {object} UserProfileResponse "user profile"
// @Failure      401 {object} response.APIError "authentication required or invalid token"
// @Failure      404 {object} response.APIError "user not found"
// @Failure      500 {object} response.APIError "internal server error"
// @Router       /auth/profile [get]
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
