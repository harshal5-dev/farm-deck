package queries

import (
	"context"

	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
)

type CreateMemberTxResult struct {
	User       User
	Invitation UserInvitation
}

func (store *SQLStore) CreateMemberTx(ctx context.Context, arg domain.CreateMemberTxParams) (CreateMemberTxResult, error) {

	var result CreateMemberTxResult

	err := store.execTx(ctx, func(q *Queries) error {
		var err error

		result.User, err = saveMember(ctx, q, arg)
		if err != nil {
			return err
		}

		result.Invitation, err = saveUserInvitation(ctx, q, result.User.ID, arg)
		if err != nil {
			return err
		}

		return nil
	})

	return result, err
}

func saveMember(ctx context.Context, q *Queries, arg domain.CreateMemberTxParams) (User, error) {
	isUserExists, err := q.CheckUserExistsByEmailID(ctx, arg.EmailID)
	if err != nil {
		return User{}, err
	}
	if isUserExists {
		return User{}, domain.ErrUserExists
	}

	user, err := q.CreateMember(ctx, CreateMemberParams{
		FullName:       arg.FullName,
		EmailID:        arg.EmailID,
		Role:           arg.Role,
		Status:         arg.Status,
		TenantID:       arg.TenantID,
		ProfilePicture: arg.ProfilePicture,
	})
	return user, err
}

func saveUserInvitation(ctx context.Context, q *Queries, userID uuid.UUID, arg domain.CreateMemberTxParams) (UserInvitation, error) {
	inv, err := q.CreateUserInvitation(ctx, CreateUserInvitationParams{
		UserID:    userID,
		TenantID:  arg.TenantID,
		TokenHash: arg.TokenHash,
		ExpiresAt: arg.ExpiresAt,
		CreatedBy: arg.CreatedBy,
	})
	if err != nil {
		return UserInvitation{}, err
	}
	return inv, nil
}
