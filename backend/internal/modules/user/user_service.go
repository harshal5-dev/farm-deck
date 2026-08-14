package user

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/email"
	"github.com/harshal5-dev/farm-deck/backend/internal/repository"
	"github.com/harshal5-dev/farm-deck/backend/pkg/invitetoken"
)

type UserService interface {
	UpdateUserProfile(ctx context.Context, userID uuid.UUID, req UpdateUserProfileRequest) error
	GetMyProfile(ctx context.Context, userID uuid.UUID) (UserProfileResponse, error)
	CreateMember(ctx context.Context, tenantID, inviterID uuid.UUID, req CreateMemberRequest) (CreateMemberResponse, error)
}

type UserServiceImpl struct {
	userRepo     repository.UserRepo
	emailService email.EmailService
	cfg          config.Config
}

func NewUserService(userRepo repository.UserRepo, emailService email.EmailService, cfg config.Config) UserService {
	return &UserServiceImpl{
		userRepo:     userRepo,
		emailService: emailService,
		cfg:          cfg,
	}
}

func (s *UserServiceImpl) GetMyProfile(ctx context.Context, userID uuid.UUID) (UserProfileResponse, error) {
	user, err := s.userRepo.GetUserProfileDetails(ctx, userID)
	if err != nil {
		return UserProfileResponse{}, fmt.Errorf("get profile: %w", err)
	}
	return toUserProfileResponse(user), nil
}

func (s *UserServiceImpl) UpdateUserProfile(ctx context.Context, userID uuid.UUID, req UpdateUserProfileRequest) error {
	_, err := s.userRepo.GetUserByID(ctx, userID)
	if err != nil {
		return fmt.Errorf("update profile: get user: %w", err)
	}

	if _, err := s.userRepo.UpdateUserProfile(ctx, toUpdateUserProfileParams(userID, req)); err != nil {
		return fmt.Errorf("update profile: update user: %w", err)
	}
	return nil
}

// CreateMember inserts the member row + open invitation in one DB transaction,
// then fires the invitation email asynchronously. The raw token only exists
// in memory between token generation and the email call — it is never
// returned in the API response and never persisted.
func (s *UserServiceImpl) CreateMember(
	ctx context.Context,
	tenantID, inviterID uuid.UUID,
	req CreateMemberRequest,
) (CreateMemberResponse, error) {
	if err := checkRole(req.Role); err != nil {
		return CreateMemberResponse{}, fmt.Errorf("create member: %w", err)
	}

	rawToken, tokenHash, err := invitetoken.Generate()
	if err != nil {
		return CreateMemberResponse{}, fmt.Errorf("create member: generate token: %w", err)
	}

	expiresAt := time.Now().Add(s.cfg.InvitationTokenDuration)

	result, err := s.userRepo.CreateMember(
		ctx,
		toCreateMemberTxParams(tenantID, inviterID, tokenHash, expiresAt, req),
	)
	if err != nil {
		return CreateMemberResponse{}, fmt.Errorf("create member: %w", err)
	}

	acceptURL := buildAcceptURL(s.cfg.AppURL, rawToken)
	tenantName := ""

	_ = s.emailService.SendInvitationEmail(result.User.EmailID, result.User.FullName, tenantName, acceptURL)

	return CreateMemberResponse{
		UserID:       result.User.ID,
		InvitationID: result.Invitation.ID,
		ExpiresAt:    result.Invitation.ExpiresAt,
	}, nil
}

func buildAcceptURL(appURL, rawToken string) string {
	return appURL + "/accept-invite?token=" + rawToken
}

// ---------------- Private Functions ------------------

func checkRole(role string) error {
	if role != domain.UserRoleGrower && role != domain.UserRoleManager && role != domain.UserRoleViewer {
		return fmt.Errorf("invalid role: %s", role)
	}
	return nil
}
