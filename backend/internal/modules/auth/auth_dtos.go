package auth

type RegisterUserRequest struct {
	FullName   string `json:"fullName" binding:"required,min=2,max=100"`
	EmailID    string `json:"emailId" binding:"required,email,max=255"`
	Password   string `json:"password" binding:"required,min=8,max=72"`
	TenantName string `json:"tenantName" binding:"required,min=2,max=100"`
}

type LoginRequest struct {
	EmailID  string `json:"emailId" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type LoginResponse struct {
	AccessToken string `json:"accessToken"`
}

type RegisterResponse struct {
	Message string `json:"message"`
}

type SessionMeta struct {
	UserAgent string
	IP        string
}

type TokenPair struct {
	AccessToken  string
	RefreshToken string
}
