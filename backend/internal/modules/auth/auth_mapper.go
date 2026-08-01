package auth

import (
	"github.com/harshal5-dev/farm-deck/backend/internal/domain"
)

func toRegisterUserTxParams(req RegisterUserRequest) domain.RegisterUserTxParams {
	return domain.RegisterUserTxParams{
		UserInfo:   domain.UserInfo{FullName: req.FullName, EmailID: req.EmailID, PasswordHash: req.Password},
		TenantInfo: domain.TenantInfo{Name: req.TenantName, Subdomain: req.TenantName},
	}
}
