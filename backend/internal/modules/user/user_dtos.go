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
	LastActiveAt   *time.Time    `json:"lastActiveAt"`
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

type CreateMemberResponse struct {
	UserID       uuid.UUID `json:"userId"`
	InvitationID uuid.UUID `json:"invitationId"`
	ExpiresAt    time.Time `json:"expiresAt"`
}

type MemberResponse struct {
	ID             uuid.UUID  `json:"id"`
	FullName       string     `json:"fullName"`
	EmailID        string     `json:"emailId"`
	Role           string     `json:"role"`
	ProfilePicture *string    `json:"profilePicture"`
	CreatedAt      time.Time  `json:"createdAt"`
	Status         string     `json:"status"`
	LastActiveAt   *time.Time `json:"lastActiveAt"`
}

type ListMembersResponse struct {
	Members      []MemberResponse `json:"members"`
	Total        int              `json:"total"`
	ActiveCount  int              `json:"activeCount"`
	InvitedCount int              `json:"invitedCount"`
}

type UpdateMemberRequest struct {
	FullName       string  `json:"fullName" binding:"required,min=2,max=100"`
	Role           string  `json:"role" binding:"required"`
	ProfilePicture *string `json:"profilePicture"`
}
