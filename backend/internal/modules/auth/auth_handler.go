package auth

import "github.com/gin-gonic/gin"

type AuthHandler interface {
	RegisterUser(ctx *gin.Context)
}

type AuthHandlerImpl struct {
	authService AuthService
}

func NewAuthHandler(authService AuthService) AuthHandler {
	return &AuthHandlerImpl{authService: authService}
}

func (h *AuthHandlerImpl) RegisterUser(ctx *gin.Context) {
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
