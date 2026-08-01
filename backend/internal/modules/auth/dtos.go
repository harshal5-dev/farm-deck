package auth

import (
	"time"

	"github.com/google/uuid"
)

type RegisterUserRequest struct {
	FullName   string `json:"fullName"`
	EmailID    string `json:"emailId"`
	Password   string `json:"password"`
	TenantName string `json:"tenantName"`
}

type LoginRequest struct {
	EmailID  string `json:"emailId"`
	Password string `json:"password"`
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
