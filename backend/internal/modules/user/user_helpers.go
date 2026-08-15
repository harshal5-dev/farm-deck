package user

import (
	"time"

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
		LastActiveAt:   user.LastActiveAt,
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

func toCreateMemberTxParams(tenantID, inviterID uuid.UUID, tokenHash string, expiresAt time.Time, req CreateMemberRequest) domain.CreateMemberTxParams {
	return domain.CreateMemberTxParams{
		FullName:       req.FullName,
		EmailID:        req.EmailID,
		TenantID:       tenantID,
		Role:           req.Role,
		Status:         domain.UserStatusInvited,
		ProfilePicture: req.ProfilePicture,
		TokenHash:      tokenHash,
		ExpiresAt:      expiresAt,
		CreatedBy:      inviterID,
	}
}

func toMemberResponse(user db.User) MemberResponse {
	return MemberResponse{
		ID:             user.ID,
		FullName:       user.FullName,
		EmailID:        user.EmailID,
		Role:           user.Role,
		ProfilePicture: user.ProfilePicture,
		CreatedAt:      user.CreatedAt,
		Status:         user.Status,
		LastActiveAt:   user.LastActiveAt,
	}
}

func mapToListMemberResponse(users []db.User) ListMembersResponse {
	activeCount, invitedCount := 0, 0
	total := len(users)
	members := make([]MemberResponse, total)

	for index, user := range users {
		switch user.Status {
		case domain.UserStatusActive:
			activeCount++
		case domain.UserStatusInvited:
			invitedCount++
		}
		members[index] = toMemberResponse(user)
	}

	return ListMembersResponse{
		Members:      members,
		Total:        total,
		ActiveCount:  activeCount,
		InvitedCount: invitedCount,
	}
}

func toUpdateMemberParams(id uuid.UUID, req UpdateMemberRequest) db.UpdateMemberParams {
	return db.UpdateMemberParams{
		ID:             id,
		FullName:       req.FullName,
		Role:           req.Role,
		ProfilePicture: req.ProfilePicture,
	}
}
