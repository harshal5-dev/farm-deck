package queries

import (
	"context"

	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
)

func (store *SQLStore) DeleteMemberTx(ctx context.Context, id uuid.UUID) error {
	return store.execTx(ctx, func(q *Queries) error {
		return deleteMemberAndCredential(ctx, q, id)
	})
}

// deleteMemberAndCredential soft-deletes a member and, when that member is
// active, removes their credential in the same transaction. Invited/suspended
// members have no credential to clean up, so the credential delete is skipped.
func deleteMemberAndCredential(ctx context.Context, q *Queries, id uuid.UUID) error {
	user, err := q.DeleteMember(ctx, id)
	if err != nil {
		return err
	}

	if user.Status == domain.UserStatusActive {
		if err := q.DeleteCredentialByUserID(ctx, id); err != nil {
			return err
		}
	}

	return nil
}
