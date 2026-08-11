package app

import (
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/auth"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/email"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/tenant"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/user"
	"github.com/harshal5-dev/farm-deck/backend/internal/repository"
	"github.com/harshal5-dev/farm-deck/backend/pkg/mailer"
)

type Services struct {
	Auth   auth.AuthService
	Email  email.EmailService
	User   user.UserService
	Tenant tenant.TenantService
}

type Handlers struct {
	Auth   auth.AuthHandler
	User   user.UserHandler
	Tenant tenant.TenantHandler
}

type Repositories struct {
	Credential   repository.CredentialRepo
	User         repository.UserRepo
	RefreshToken repository.RefreshTokenRepo
	Tenant       repository.TenantRepo
}

type Container struct {
	Config       config.Config
	Store        db.Store
	Services     Services
	Handlers     Handlers
	Repositories Repositories
	Mailer       *mailer.AsyncMailer
}

func NewContainer(cfg config.Config, store db.Store) *Container {
	container := &Container{
		Config: cfg,
		Store:  store,
	}

	container.Repositories = Repositories{
		Credential:   repository.NewCredentialRepo(store),
		User:         repository.NewUserRepo(store),
		RefreshToken: repository.NewRefreshTokenRepo(store),
		Tenant:       repository.NewTenantRepo(store),
	}

	container.Mailer = mailer.NewAsyncMailer(
		mailer.NewSMTPMailer(
			cfg.SMTPHost,
			cfg.SMTPPort,
			cfg.SMTPUsername,
			cfg.SMTPPassword,
			cfg.MailFromAddress,
		),
	)

	emailService := email.NewEmailService(cfg, container.Mailer)

	container.Services = Services{
		Auth:   auth.NewAuthService(container.Repositories.Credential, container.Repositories.RefreshToken, cfg, emailService),
		Email:  emailService,
		User:   user.NewUserService(container.Repositories.User),
		Tenant: tenant.NewTenantService(container.Repositories.Tenant),
	}

	container.Handlers = Handlers{
		Auth:   auth.NewAuthHandler(container.Services.Auth, cfg),
		User:   user.NewUserHandler(container.Services.User),
		Tenant: tenant.NewTenantHandler(container.Services.Tenant),
	}

	return container
}
