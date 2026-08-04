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
