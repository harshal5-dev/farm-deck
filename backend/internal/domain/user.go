package domain

import (
	"time"

	"github.com/google/uuid"
)

// User is the domain-level view of a users row. It mirrors the sqlc-generated
// struct so the domain package doesn't have to import the queries package
// (which would create an import cycle).
type User struct {
	ID             uuid.UUID
	TenantID       uuid.UUID
	EmailID        string
	FullName       string
	ProfilePicture *string
	Role           string
	Status         string
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

// UserInfo is the minimum user detail the email layer cares about.
type UserInfo struct {
	FullName string
	EmailID  string
}

// CreateMemberTxParams is the payload for the transactional create-member flow.
// The password is intentionally NOT set here: the invitee doesn't have a
// credential yet. They get one only after accepting the invitation via
// AcceptInvitation.
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

// CreateMemberTxResult is what CreateMemberTx returns to the caller. The
// invitation row is needed so the caller can hand the raw token (which never
// left the service) off to the email step.
type CreateMemberTxResult struct {
	User       User
	Invitation UserInvitation
}

// UserInvitation is the domain-level view of a user_invitations row. It is
// populated by the repository from the generated sqlc struct.
type UserInvitation struct {
	ID         uuid.UUID
	UserID     uuid.UUID
	TenantID   uuid.UUID
	TokenHash  string
	ExpiresAt  time.Time
	AcceptedAt *time.Time
	RevokedAt  *time.Time
	CreatedBy  uuid.UUID
	CreatedAt  time.Time
}

// AcceptInvitationParams is what the public accept-invite endpoint hands to
// the service. TenantID guards against cross-tenant token replay.
type AcceptInvitationParams struct {
	Token       string
	NewPassword string
	TenantID    uuid.UUID
}
