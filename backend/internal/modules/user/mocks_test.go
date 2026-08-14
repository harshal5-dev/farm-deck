package user

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/harshal5-dev/farm-deck/backend/internal/repository"
)

// mockUserRepo embeds repository.UserRepo so unused methods are satisfied by
// promotion; only the methods exercised by the service are overridden.
type mockUserRepo struct {
	repository.UserRepo
	getUserProfileDetails func(context.Context, uuid.UUID) (db.GetUserProfileDetailsRow, error)
	getUserByID           func(context.Context, uuid.UUID) (db.User, error)
	updateUserProfile     func(context.Context, db.UpdateUserProfileParams) (db.User, error)
	createMember          func(context.Context, domain.CreateMemberTxParams) (db.CreateMemberTxResult, error)
	listMembers           func(context.Context, uuid.UUID, uuid.UUID) ([]db.User, error)
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
func (m *mockUserRepo) CreateMember(ctx context.Context, p domain.CreateMemberTxParams) (db.CreateMemberTxResult, error) {
	return m.createMember(ctx, p)
}
func (m *mockUserRepo) ListMembers(ctx context.Context, tenantID, excludeID uuid.UUID) ([]db.User, error) {
	return m.listMembers(ctx, tenantID, excludeID)
}

// fakeEmailService stubs email.EmailService for service-level tests.
type fakeEmailService struct {
	sendWelcome     func(to, name string) error
	sendInvitation  func(to, name, tenantName, acceptURL string) error
	welcomeCalls    int
	invitationCalls int
	lastInvitation  invitationCall
}

type invitationCall struct {
	To         string
	Name       string
	TenantName string
	AcceptURL  string
}

func (f *fakeEmailService) SendWelcomeEmail(to, name string) error {
	f.welcomeCalls++
	return f.sendWelcome(to, name)
}

func (f *fakeEmailService) SendInvitationEmail(to, name, tenantName, acceptURL string) error {
	f.invitationCalls++
	f.lastInvitation = invitationCall{To: to, Name: name, TenantName: tenantName, AcceptURL: acceptURL}
	return f.sendInvitation(to, name, tenantName, acceptURL)
}

// fakeUserService mocks UserService for handler tests.
type fakeUserService struct {
	updateUserProfile func(context.Context, uuid.UUID, UpdateUserProfileRequest) error
	getMyProfile      func(context.Context, uuid.UUID) (UserProfileResponse, error)
	createMember      func(context.Context, uuid.UUID, uuid.UUID, CreateMemberRequest) (CreateMemberResponse, error)
	listMember        func(context.Context, uuid.UUID, uuid.UUID) (ListMembersResponse, error)
}

func (f *fakeUserService) UpdateUserProfile(ctx context.Context, id uuid.UUID, r UpdateUserProfileRequest) error {
	return f.updateUserProfile(ctx, id, r)
}
func (f *fakeUserService) GetMyProfile(ctx context.Context, id uuid.UUID) (UserProfileResponse, error) {
	return f.getMyProfile(ctx, id)
}
func (f *fakeUserService) CreateMember(ctx context.Context, tenantID, inviterID uuid.UUID, req CreateMemberRequest) (CreateMemberResponse, error) {
	return f.createMember(ctx, tenantID, inviterID, req)
}
func (f *fakeUserService) ListMember(ctx context.Context, tenantID, excludeID uuid.UUID) (ListMembersResponse, error) {
	return f.listMember(ctx, tenantID, excludeID)
}

// testServiceCfg returns a Config sufficient for the user service to compute
// invitation URLs and durations.
func testServiceCfg() config.Config {
	return config.Config{
		AppURL:                  "http://localhost:5173",
		InvitationTokenDuration: 168 * time.Hour,
	}
}
