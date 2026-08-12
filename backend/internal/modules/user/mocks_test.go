package user

import (
	"context"

	"github.com/google/uuid"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/repository"
)

// mockUserRepo embeds repository.UserRepo so unused methods are satisfied by
// promotion; only the methods exercised by the service are overridden.
type mockUserRepo struct {
	repository.UserRepo
	getUserProfileDetails func(context.Context, uuid.UUID) (db.GetUserProfileDetailsRow, error)
	getUserByID           func(context.Context, uuid.UUID) (db.User, error)
	updateUserProfile     func(context.Context, db.UpdateUserProfileParams) (db.User, error)
}

func (m *mockUserRepo) GetUserProfileDetails(ctx context.Context, id uuid.UUID) (db.GetUserProfileDetailsRow, error) {
	return m.getUserProfileDetails(ctx, id)
}
func (m *mockUserRepo) GetUserByID(ctx context.Context, id uuid.UUID) (db.User, error) {
	return m.getUserByID(ctx, id)
}
func (m *mockUserRepo) UpdateUserProfile(ctx context.Context, p db.UpdateUserProfileParams) (db.User, error) {
	return m.updateUserProfile(ctx, p)
}

// fakeUserService mocks UserService for handler tests.
type fakeUserService struct {
	updateUserProfile func(context.Context, uuid.UUID, UpdateUserProfileRequest) error
	getMyProfile      func(context.Context, uuid.UUID) (UserProfileResponse, error)
}

func (f *fakeUserService) UpdateUserProfile(ctx context.Context, id uuid.UUID, r UpdateUserProfileRequest) error {
	return f.updateUserProfile(ctx, id, r)
}
func (f *fakeUserService) GetMyProfile(ctx context.Context, id uuid.UUID) (UserProfileResponse, error) {
	return f.getMyProfile(ctx, id)
}
