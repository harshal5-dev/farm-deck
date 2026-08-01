package ctxutil

import (
	"errors"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

const (
	UserIDKey   = "userId"
	TenantIDKey = "tenantId"
)

var (
	ErrUserIDNotFound   = errors.New("user id not found in context")
	ErrTenantIDNotFound = errors.New("tenant id not found in context")
	ErrInvalidType      = errors.New("invalid type in context")
)

func GetUserID(ctx *gin.Context) (uuid.UUID, error) {
	rawID, exists := ctx.Get(UserIDKey)
	if !exists {
		return uuid.Nil, ErrUserIDNotFound
	}

	userID, ok := rawID.(uuid.UUID)
	if !ok {
		return uuid.Nil, ErrInvalidType
	}

	return userID, nil
}

func GetTenantID(ctx *gin.Context) (uuid.UUID, error) {
	rawID, exists := ctx.Get(TenantIDKey)
	if !exists {
		return uuid.Nil, ErrTenantIDNotFound
	}

	tenantID, ok := rawID.(uuid.UUID)
	if !ok {
		return uuid.Nil, ErrInvalidType
	}

	return tenantID, nil
}
