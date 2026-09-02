package domain

import "errors"

var (
	// ErrInvalidCredentials ---- auth errors ---------
	ErrInvalidCredentials = errors.New("invalid email or password")
	ErrUnauthorized       = errors.New("authentication required")

	// ErrCredentialNotFound ---- credential errors ---------
	ErrCredentialNotFound = errors.New("credential not found")

	// ErrTenantExists ---- tenant errors ---------
	ErrTenantExists      = errors.New("tenant already exists")
	ErrTenantNotFound    = errors.New("tenant not found")
	ErrInvalidTenantName = errors.New("tenant name must contain a letter or number")

	// ErrUserExists ---- user errors ---------
	ErrUserExists   = errors.New("user already exists")
	ErrUserNotFound = errors.New("user not found")

	// ErrRefreshTokenInvalid ---- refresh token errors ---------
	ErrRefreshTokenInvalid = errors.New("refresh token is invalid")
	ErrRefreshTokenExpired = errors.New("refresh token has expired")

	// Role Access errors
	ErrRoleAccessDenied = errors.New("role access denied")

	// Invitation errors
	ErrInvitationInvalid  = errors.New("invitation is invalid")
	ErrInvitationExpired  = errors.New("invitation has expired")
	ErrInvitationRevoked  = errors.New("invitation has been revoked")
	ErrInvitationAccepted = errors.New("invitation already accepted")

	// Permission errors
	ErrForbidden = errors.New("forbidden")

	// Farm errors
	ErrFarmNotFound = errors.New("farm not found")
)
