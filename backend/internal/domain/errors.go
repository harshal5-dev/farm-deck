package domain

import "errors"

var (
	// ---- tenant errors ---------
	ErrTenantExists   = errors.New("tenant already exists")
	ErrTenantNotFound = errors.New("tenant not found")

	// ---- user errors ---------
	ErrUserExists   = errors.New("user already exists")
	ErrUserNotFound = errors.New("user not found")

	// ---- auth errors ---------
	ErrInvalidCredentials = errors.New("invalid email or password")

	// ---- refresh token errors ---------
	ErrRefreshTokenInvalid = errors.New("refresh token is invalid")
	ErrRefreshTokenExpired = errors.New("refresh token has expired")
)
