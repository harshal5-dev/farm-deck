package domain

import "time"

type Credential struct {
	EmailID      string
	PasswordHash string
}

type RegisterUserTxParams struct {
	UserInfo   UserInfo
	TenantInfo TenantInfo
	Credential Credential
}

type RotateRefreshTokenTxParams struct {
	OldTokenHash string
	NewTokenHash string
	UserAgent    *string
	Ip           *string
	NewExpiresAt time.Time
}
