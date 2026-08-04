package auth

import (
	"time"

	"github.com/google/uuid"
)

type RegisterUserRequest struct {
	FullName   string `json:"fullName" binding:"required,min=2,max=100"`
	EmailID    string `json:"emailId" binding:"required,email,max=255"`
	Password   string `json:"password" binding:"required,min=8,max=72"`
	TenantName string `json:"tenantName" binding:"required,min=2,max=100"`
}

type LoginRequest struct {
	EmailID  string `json:"emailId" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	AccessToken string `json:"accessToken"`
}

type RegisterResponse struct {
	Message string `json:"message"`
}

type UserProfileResponse struct {
	FullName       string        `json:"fullName"`
	EmailID        string        `json:"emailId"`
	Role           string        `json:"role"`
	Status         string        `json:"status"`
	ProfilePicture *string       `json:"profilePicture"`
	ID             uuid.UUID     `json:"id"`
	CreatedAt      time.Time     `json:"createdAt"`
	TenantDetails  TenantDetails `json:"tenantDetails"`
}

type TenantDetails struct {
	Name        string    `json:"name"`
	Description *string   `json:"description"`
	Subdomain   string    `json:"subdomain"`
	ID          uuid.UUID `json:"id"`
	CreatedAt   time.Time `json:"createdAt"`
}

type UpdateUserProfileRequest struct {
	FullName       string  `json:"fullName" binding:"required,min=2,max=100"`
	ProfilePicture *string `json:"profilePicture"`
}

type UpdateTenantRequest struct {
	Name        string  `json:"name" binding:"required,min=2,max=100"`
	Description *string `json:"description"`
}

type SessionMeta struct {
	UserAgent string
	IP        string
}

type TokenPair struct {
	AccessToken  string
	RefreshToken string
}
