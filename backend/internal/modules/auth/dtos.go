package auth

type RegisterUserRequest struct {
	FullName   string `json:"fullName"`
	EmailID    string `json:"emailId"`
	Password   string `json:"password"`
	TenantName string `json:"tenantName"`
}
