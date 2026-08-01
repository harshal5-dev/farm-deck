package queries

import (
	"context"

	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
)

type RegisterUserTxResult struct {
	User   User
	Tenant Tenant
}

func (store *SQLStore) RegisterUserTx(ctx context.Context, arg domain.RegisterUserTxParams) (RegisterUserTxResult, error) {
	var result RegisterUserTxResult

	err := store.execTx(ctx, func(q *Queries) error {
		var err error

		result.Tenant, err = saveTenant(ctx, q, arg.TenantInfo)
		if err != nil {
			return err
		}

		result.User, err = saveUser(ctx, q, arg.UserInfo, result.Tenant.ID)
		if err != nil {
			return err
		}

		return nil
	})

	return result, err
}

func saveTenant(ctx context.Context, q *Queries, arg domain.TenantInfo) (Tenant, error) {
	isTenantExists, err := q.CheckTenantExistsBySubdomain(ctx, arg.Subdomain)
	if err != nil {
		return Tenant{}, err
	}
	if isTenantExists {
		return Tenant{}, domain.ErrTenantExists
	}

	tenant, err := q.CreateTenant(ctx, CreateTenantParams{
		Name:      arg.Name,
		Subdomain: arg.Subdomain,
	})
	return tenant, err
}

func saveUser(ctx context.Context, q *Queries, arg domain.UserInfo, tenantID uuid.UUID) (User, error) {
	isUserExists, err := q.CheckUserExistsByEmailID(ctx, arg.EmailID)
	if err != nil {
		return User{}, err
	}
	if isUserExists {
		return User{}, domain.ErrUserExists
	}

	user, err := q.CreateUser(ctx, CreateUserParams{
		FullName:     arg.FullName,
		EmailID:      arg.EmailID,
		PasswordHash: arg.PasswordHash,
		Role:         domain.UserRoleOwner,
		Status:       domain.UserStatusActive,
		TenantID:     tenantID,
	})
	return user, err
}
