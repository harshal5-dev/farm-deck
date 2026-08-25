package auth

import (
	"time"

	"github.com/google/uuid"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/harshal5-dev/farm-deck/backend/pkg/jwt"
	"github.com/harshal5-dev/farm-deck/backend/pkg/slug"
)

func toRegisterUserTxParams(req RegisterUserRequest, hashedPassword string) domain.RegisterUserTxParams {
	return domain.RegisterUserTxParams{
		UserInfo:   domain.UserInfo{FullName: req.FullName, EmailID: req.EmailID},
		TenantInfo: domain.TenantInfo{Name: req.TenantName, Subdomain: slug.GenerateTenantSlug(req.TenantName)},
		Credential: domain.Credential{PasswordHash: hashedPassword, EmailID: req.EmailID},
	}
}

func toRotateParams(oldHash, newHash string, meta SessionMeta, ttl time.Duration) domain.RotateRefreshTokenTxParams {
	ua, ip := stringPtr(meta.UserAgent), stringPtr(meta.IP)
	return domain.RotateRefreshTokenTxParams{
		OldTokenHash: oldHash,
		NewTokenHash: newHash,
		NewExpiresAt: time.Now().Add(ttl),
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

func toJwtUserDetailsFromEmail(user db.GetCredentialByEmailRow) jwt.UserDetails {
	return jwt.UserDetails{UserId: user.UserID, TenantId: user.TenantID, Role: user.Role}
}

func toJwtUserDetailsFromUserID(user db.GetCredentialByUserIDRow) jwt.UserDetails {
	return jwt.UserDetails{UserId: user.UserID, TenantId: user.TenantID, Role: user.Role}
}

func toJwtUserDetailsFromUser(user db.User) jwt.UserDetails {
	return jwt.UserDetails{UserId: user.ID, TenantId: user.TenantID, Role: user.Role}
}

func toVerifyInvitationResponse(invitation db.GetInvitationDetailsByTokenHashRow) VerifyInvitationResponse {
	return VerifyInvitationResponse{
		FullName:   invitation.FullName,
		EmailID:    invitation.EmailID,
		Role:       invitation.Role,
		TenantName: invitation.TenantName,
		ExpiresAt:  invitation.ExpiresAt,
	}
}

func stringPtr(s string) *string {
	if s == "" {
		return nil
	}
	return &s
}
