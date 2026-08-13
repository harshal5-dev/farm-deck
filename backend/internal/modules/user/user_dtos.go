package user

import (
	"time"

	"github.com/google/uuid"
)

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

type CreateMemberRequest struct {
	FullName       string  `json:"fullName" binding:"required,min=2,max=100"`
	EmailID        string  `json:"emailId" binding:"required,email,max=255"`
	Role           string  `json:"role" binding:"required"`
	ProfilePicture *string `json:"profilePicture"`
}
