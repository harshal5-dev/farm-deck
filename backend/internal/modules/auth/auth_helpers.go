package auth

import (
	"errors"
	"time"

	"github.com/google/uuid"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/jackc/pgx/v5"
)

type dbUser = db.User

func toRegisterUserTxParams(req RegisterUserRequest) domain.RegisterUserTxParams {
	return domain.RegisterUserTxParams{
		UserInfo:   domain.UserInfo{FullName: req.FullName, EmailID: req.EmailID, PasswordHash: req.Password},
		TenantInfo: domain.TenantInfo{Name: req.TenantName, Subdomain: generateTenantDomain(req.TenantName)},
	}
}

func toUserProfileResponse(user db.GetUserProfileDetailsRow) UserProfileResponse {
	return UserProfileResponse{
		ID:             user.ID,
		FullName:       user.FullName,
		EmailID:        user.EmailID,
		Role:           user.Role,
		Status:         user.Status,
		ProfilePicture: user.ProfilePicture,
		CreatedAt:      user.CreatedAt,
		TenantDetails: TenantDetails{
			Name:        user.TenantName,
			Subdomain:   user.Subdomain,
			Description: user.Description,
			ID:          user.TenantID,
			CreatedAt:   user.TenantCreatedAt,
		},
	}
}

func toUpdateUserProfileParams(userId uuid.UUID, req UpdateUserProfileRequest) db.UpdateUserProfileParams {
	return db.UpdateUserProfileParams{
		ID:             userId,
		FullName:       req.FullName,
		ProfilePicture: req.ProfilePicture,
	}
}

func toRotateParams(old db.RefreshToken, newHash string, meta SessionMeta, ttl time.Duration) db.RotateRefreshTokenTxParams {
	ua, ip := stringPtr(meta.UserAgent), stringPtr(meta.IP)
	return db.RotateRefreshTokenTxParams{
		OldTokenHash: tHash(old),
		NewTokenHash: newHash,
		NewExpiresAt: time.Now().Add(ttl),
		UserID:       old.UserID,
		UserAgent:    ua,
		Ip:           ip,
	}
}

func toCreateRefreshTokenParams(userID uuid.UUID, hash string, ttl time.Duration, ua, ip *string) db.CreateRefreshTokenParams {
	return db.CreateRefreshTokenParams{
		UserID:    userID,
		TokenHash: hash,
		ExpiresAt: time.Now().Add(ttl),
		UserAgent: ua,
		Ip:        ip,
	}
}

func toUpdateTenantParams(tenantID uuid.UUID, req UpdateTenantRequest) db.UpdateTenantParams {
	return db.UpdateTenantParams{
		ID:          tenantID,
		Name:        req.Name,
		Description: req.Description,
		Subdomain:   generateTenantDomain(req.Name),
	}
}

func userFromRefresh(t db.RefreshToken) dbUser {
	return dbUser{ID: t.UserID}
}

func tHash(t db.RefreshToken) string { return t.TokenHash }

func pgxNoRows(err error) error {
	if errors.Is(err, pgx.ErrNoRows) {
		return pgx.ErrNoRows
	}
	return err
}

func stringPtr(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}
