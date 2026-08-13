package queries

import (
	"context"

	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
)

// CreateMemberTx inserts a member row plus the matching open invitation in a
// single transaction. No credential row is created — the invitee doesn't have
// a password yet and gets one only when they accept the invitation.
//
// On a re-invite of the same email, the prior user's open invitation (if any)
// is revoked inside the same tx so the partial unique index
// (idx_invite_user_live) doesn't block the new insert. The users.email_id
// UNIQUE constraint still requires the prior user to be removed or merged if
// the same email is invited again later — callers should handle that.
func (store *SQLStore) CreateMemberTx(ctx context.Context, arg domain.CreateMemberTxParams) (domain.CreateMemberTxResult, error) {

	var result domain.CreateMemberTxResult

	err := store.execTx(ctx, func(q *Queries) error {
		var err error

		var createdUser User
		createdUser, err = saveMember(ctx, q, arg)
		if err != nil {
			return err
		}
		result.User = toDomainUser(createdUser)

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

func saveUserInvitation(ctx context.Context, q *Queries, userID uuid.UUID, arg domain.CreateMemberTxParams) (domain.UserInvitation, error) {
	inv, err := q.CreateUserInvitation(ctx, CreateUserInvitationParams{
		UserID:    userID,
		TenantID:  arg.TenantID,
		TokenHash: arg.TokenHash,
		ExpiresAt: arg.ExpiresAt,
		CreatedBy: arg.CreatedBy,
	})
	if err != nil {
		return domain.UserInvitation{}, err
	}
	return toDomainUserInvitation(inv), nil
}
