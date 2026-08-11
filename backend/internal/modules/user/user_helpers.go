package user

import (
	"github.com/google/uuid"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
)

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
