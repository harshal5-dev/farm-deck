package queries

import "context"

func (store *SQLStore) CreateRefreshTokenTx(ctx context.Context, arg CreateRefreshTokenParams) (RefreshToken, error) {
	var result RefreshToken

	err := store.execTx(ctx, func(q *Queries) error {
		var err error
		result, err = q.CreateRefreshToken(ctx, arg)
		if err != nil {
			return err
		}

		if err := q.TouchUserLastActive(ctx, arg.UserID); err != nil {
			return err
		}

		return nil
	})

	return result, err
}
