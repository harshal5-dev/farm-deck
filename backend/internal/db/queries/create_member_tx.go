package queries

import (
	"context"

	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
)

func (store *SQLStore) CreateMemberTx(ctx context.Context, arg domain.CreateMemberTxParams) (User, error) {

	var user User

	err := store.execTx(ctx, func(q *Queries) error {
		var err error

		user, err = saveMember(ctx, q, arg)
		if err != nil {
			return err
		}

		err = saveMemberCredential(ctx, q, user.ID, arg)
		if err != nil {
			return err
		}

		return nil
	})

	return user, err
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

func saveMemberCredential(ctx context.Context, q *Queries, userID uuid.UUID, arg domain.CreateMemberTxParams) error {
	_, err := q.CreateCredential(ctx, CreateCredentialParams{
		UserID:       userID,
		EmailID:      arg.EmailID,
		PasswordHash: arg.PasswordHash,
	})
	return err
}
