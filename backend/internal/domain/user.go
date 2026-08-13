package domain

import "github.com/google/uuid"

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
	PasswordHash   string
}
