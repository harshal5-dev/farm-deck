package repository

import (
	"context"

	"github.com/google/uuid"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
)

// mockStore is a configurable test double for db.Store.
//
// It embeds the db.Store interface so every method is satisfied by promotion;
// any promoted method invoked while the embedded field is nil panics, which is
// the desired "this method was not expected to be called" signal. The methods
// actually exercised by the repositories are overridden below with per-test
// function fields.
type mockStore struct {
	db.Store // embedded nil interface; promoted methods panic if called.

	createTenant             func(ctx context.Context, params db.CreateTenantParams) (db.Tenant, error)
	updateTenant             func(ctx context.Context, params db.UpdateTenantParams) (db.Tenant, error)
	registerUserTx           func(ctx context.Context, params domain.RegisterUserTxParams) (db.RegisterUserTxResult, error)
	getCredentialByEmail     func(ctx context.Context, emailID string) (db.GetCredentialByEmailRow, error)
	getUserByEmailID         func(ctx context.Context, emailID string) (db.User, error)
	getUserByID              func(ctx context.Context, id uuid.UUID) (db.User, error)
	getUserProfileDetails    func(ctx context.Context, id uuid.UUID) (db.GetUserProfileDetailsRow, error)
	updateUserProfile        func(ctx context.Context, arg db.UpdateUserProfileParams) (db.User, error)
	listMembers              func(ctx context.Context, arg db.ListMembersParams) ([]db.User, error)
	touchUserLastActive      func(ctx context.Context, id uuid.UUID) error
	createRefreshTokenTx     func(ctx context.Context, arg db.CreateRefreshTokenParams) (db.RefreshToken, error)
	getRefreshTokenByHash    func(ctx context.Context, tokenHash string) (db.RefreshToken, error)
	revokeRefreshTokenByHash func(ctx context.Context, tokenHash string) error
	rotateRefreshTokenTx     func(ctx context.Context, arg domain.RotateRefreshTokenTxParams) (db.RotateRefreshTokenTxResult, error)
	createFarm         func(ctx context.Context, params db.CreateFarmParams) (db.Farm, error)
	listFarms          func(ctx context.Context, tenantID uuid.UUID) ([]db.Farm, error)
	updateFarm         func(ctx context.Context, params db.UpdateFarmParams) (db.Farm, error)
	toggleFarmIsActive func(ctx context.Context, params db.ToggleFarmIsActiveParams) (db.Farm, error)
}

func (m *mockStore) CreateTenant(ctx context.Context, params db.CreateTenantParams) (db.Tenant, error) {
	return m.createTenant(ctx, params)
}

func (m *mockStore) UpdateTenant(ctx context.Context, params db.UpdateTenantParams) (db.Tenant, error) {
	return m.updateTenant(ctx, params)
}

func (m *mockStore) RegisterUserTx(ctx context.Context, params domain.RegisterUserTxParams) (db.RegisterUserTxResult, error) {
	return m.registerUserTx(ctx, params)
}

func (m *mockStore) GetCredentialByEmail(ctx context.Context, emailID string) (db.GetCredentialByEmailRow, error) {
	return m.getCredentialByEmail(ctx, emailID)
}

func (m *mockStore) GetUserByEmailID(ctx context.Context, emailID string) (db.User, error) {
	return m.getUserByEmailID(ctx, emailID)
}

func (m *mockStore) GetUserByID(ctx context.Context, id uuid.UUID) (db.User, error) {
	return m.getUserByID(ctx, id)
}

func (m *mockStore) GetUserProfileDetails(ctx context.Context, id uuid.UUID) (db.GetUserProfileDetailsRow, error) {
	return m.getUserProfileDetails(ctx, id)
}

func (m *mockStore) UpdateUserProfile(ctx context.Context, arg db.UpdateUserProfileParams) (db.User, error) {
	return m.updateUserProfile(ctx, arg)
}

func (m *mockStore) ListMembers(ctx context.Context, arg db.ListMembersParams) ([]db.User, error) {
	return m.listMembers(ctx, arg)
}

func (m *mockStore) TouchUserLastActive(ctx context.Context, id uuid.UUID) error {
	return m.touchUserLastActive(ctx, id)
}

func (m *mockStore) CreateRefreshTokenTx(ctx context.Context, arg db.CreateRefreshTokenParams) (db.RefreshToken, error) {
	return m.createRefreshTokenTx(ctx, arg)
}

func (m *mockStore) GetRefreshTokenByHash(ctx context.Context, tokenHash string) (db.RefreshToken, error) {
	return m.getRefreshTokenByHash(ctx, tokenHash)
}

func (m *mockStore) RevokeRefreshTokenByHash(ctx context.Context, tokenHash string) error {
	return m.revokeRefreshTokenByHash(ctx, tokenHash)
}

func (m *mockStore) RotateRefreshTokenTx(ctx context.Context, arg domain.RotateRefreshTokenTxParams) (db.RotateRefreshTokenTxResult, error) {
	return m.rotateRefreshTokenTx(ctx, arg)
}

func (m *mockStore) CreateFarm(ctx context.Context, params db.CreateFarmParams) (db.Farm, error) {
	return m.createFarm(ctx, params)
}

func (m *mockStore) ListFarms(ctx context.Context, tenantID uuid.UUID) ([]db.Farm, error) {
	return m.listFarms(ctx, tenantID)
}

func (m *mockStore) UpdateFarm(ctx context.Context, params db.UpdateFarmParams) (db.Farm, error) {
	return m.updateFarm(ctx, params)
}

func (m *mockStore) ToggleFarmIsActive(ctx context.Context, params db.ToggleFarmIsActiveParams) (db.Farm, error) {
	return m.toggleFarmIsActive(ctx, params)
}

func uuidMust(s string) uuid.UUID { return uuid.MustParse(s) }
