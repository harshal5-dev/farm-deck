package user

import (
	"github.com/google/uuid"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
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

func toCreateMemberTxParams(tenantID uuid.UUID, passwordHash string, req CreateMemberRequest) domain.CreateMemberTxParams {
	return domain.CreateMemberTxParams{
		FullName:       req.FullName,
		EmailID:        req.EmailID,
		TenantID:       tenantID,
		Role:           req.Role,
		Status:         domain.UserStatusInvited,
		ProfilePicture: req.ProfilePicture,
		PasswordHash:   passwordHash,
	}
}
