package auth

import (
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
)

func toRegisterUserTxParams(req RegisterUserRequest) domain.RegisterUserTxParams {
	return domain.RegisterUserTxParams{
		UserInfo:   domain.UserInfo{FullName: req.FullName, EmailID: req.EmailID, PasswordHash: req.Password},
		TenantInfo: domain.TenantInfo{Name: req.TenantName, Subdomain: generateTenantDomain(req.TenantName)},
	}
}

func toUserProfileResponse(user db.User) UserProfileResponse {
	return UserProfileResponse{
		ID:        user.ID,
		FullName:  user.FullName,
		EmailID:   user.EmailID,
		Role:      user.Role,
		TenantID:  user.TenantID,
		CreatedAt: user.CreatedAt,
	}
}
