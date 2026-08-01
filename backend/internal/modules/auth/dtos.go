package auth

import (
	"time"

	"github.com/google/uuid"
)

type RegisterUserRequest struct {
	FullName   string `json:"fullName" binding:"required,min=2,max=100"`
	EmailID    string `json:"emailId" binding:"required,email,max=255"`
	Password   string `json:"password" binding:"required,min=8,max=15"`
	TenantName string `json:"tenantName" binding:"required,min=2,max=100"`
}

type LoginRequest struct {
	EmailID  string `json:"emailId" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

type UserProfileResponse struct {
	FullName  string    `json:"fullName"`
	EmailID   string    `json:"emailId"`
	Role      string    `json:"role"`
	ID        uuid.UUID `json:"id"`
	TenantID  uuid.UUID `json:"tenantId"`
	CreatedAt time.Time `json:"createdAt"`
}
