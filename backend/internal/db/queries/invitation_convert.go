package queries

import (
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
)

// toDomainUserInvitation lifts a sqlc-generated row into the domain type so
// callers don't import the generated package directly.
func toDomainUserInvitation(i UserInvitation) domain.UserInvitation {
	return domain.UserInvitation{
		ID:         i.ID,
		UserID:     i.UserID,
		TenantID:   i.TenantID,
		TokenHash:  i.TokenHash,
		ExpiresAt:  i.ExpiresAt,
		AcceptedAt: i.AcceptedAt,
		RevokedAt:  i.RevokedAt,
		CreatedBy:  i.CreatedBy,
		CreatedAt:  i.CreatedAt,
	}
}

// toDomainUser lifts a sqlc-generated user row into the domain type. This is
// the boundary that lets the domain package stay free of database imports.
func toDomainUser(u User) domain.User {
	return domain.User{
		ID:             u.ID,
		TenantID:       u.TenantID,
		EmailID:        u.EmailID,
		FullName:       u.FullName,
		ProfilePicture: u.ProfilePicture,
		Role:           u.Role,
		Status:         u.Status,
		CreatedAt:      u.CreatedAt,
		UpdatedAt:      u.UpdatedAt,
	}
}
