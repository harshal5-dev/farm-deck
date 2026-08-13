package user

import (
	"github.com/gin-gonic/gin"
	"github.com/harshal5-dev/farm-deck/backend/internal/httperr"
	"github.com/harshal5-dev/farm-deck/backend/internal/response"
	"github.com/harshal5-dev/farm-deck/backend/pkg/ctxutil"
	"github.com/harshal5-dev/farm-deck/backend/pkg/validate"
)

type UserHandler interface {
	GetCurrentProfile(ctx *gin.Context)
	UpdateProfile(ctx *gin.Context)
	CreateMember(ctx *gin.Context)
}

type UserHandlerImpl struct {
	userService UserService
}

func NewUserHandler(userService UserService) *UserHandlerImpl {
	return &UserHandlerImpl{
		userService: userService,
	}
}

// GetCurrentProfile godoc
// @Summary      Get current user profile
// @Description  Returns the profile of the currently authenticated user.
// @Tags         user
// @Produce      json
// @Security     CookieAuth
// @Success      200 {object} UserProfileResponse "user profile"
// @Failure      401 {object} response.APIError "authentication required or invalid token"
// @Failure      404 {object} response.APIError "user not found"
// @Failure      500 {object} response.APIError "internal server error"
// @Router       /users/me [get]
func (h *UserHandlerImpl) GetCurrentProfile(ctx *gin.Context) {
	userID, err := ctxutil.GetUserID(ctx)
	if err != nil {
		response.Unauthorized(ctx, "authentication required")
		return
	}

	user, err := h.userService.GetMyProfile(ctx, userID)
	if err != nil {
		httperr.HandleError(ctx, err)
		return
	}
	response.OK(ctx, user)
}

// UpdateProfile godoc
// @Summary      Update current user profile
// @Tags         user
// @Accept       json
// @Produce      json
// @Security     CookieAuth
// @Param        request body UpdateUserProfileRequest true "Profile update payload"
// @Success      200 {object} response.APIResponse "profile updated successfully"
// @Failure      400 {object} response.APIError "validation error"
// @Failure      401 {object} response.APIError "authentication required"
// @Failure      500 {object} response.APIError "internal server error"
// @Router       /users/me [patch]
func (h *UserHandlerImpl) UpdateProfile(ctx *gin.Context) {
	userID, err := ctxutil.GetUserID(ctx)
	if err != nil {
		response.Unauthorized(ctx, "authentication required")
		return
	}

	var req UpdateUserProfileRequest
	if !validate.Bind(ctx, &req) {
		return
	}

	if err := h.userService.UpdateUserProfile(ctx, userID, req); err != nil {
		httperr.HandleError(ctx, err)
		return
	}
	response.OK(ctx, "profile updated successfully")
}

func (h *UserHandlerImpl) CreateMember(ctx *gin.Context) {
	tenantID, err := ctxutil.GetTenantID(ctx)
	if err != nil {
		response.Unauthorized(ctx, "authentication required")
		return
	}

	inviterID, err := ctxutil.GetUserID(ctx)
	if err != nil {
		response.Unauthorized(ctx, "authentication required")
		return
	}

	var req CreateMemberRequest
	if !validate.Bind(ctx, &req) {
		return
	}

	result, err := h.userService.CreateMember(ctx, tenantID, inviterID, req)
	if err != nil {
		httperr.HandleError(ctx, err)
		return
	}
	response.OK(ctx, result)
}
