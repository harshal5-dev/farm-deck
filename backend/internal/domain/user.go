package domain

import (
	"time"

	"github.com/google/uuid"
)

// UserInfo is the minimum user detail the email layer cares about.
type UserInfo struct {
	FullName string
	EmailID  string
}

type CreateMemberTxParams struct {
	FullName       string
	EmailID        string
	Role           string
	Status         string
	TenantID       uuid.UUID
	ProfilePicture *string

	// Invitation fields (filled in by the service).
	TokenHash string
	ExpiresAt time.Time
	CreatedBy uuid.UUID
}
