package app

import (
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/auth"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/email"
	"github.com/harshal5-dev/farm-deck/backend/internal/repository"
	"github.com/harshal5-dev/farm-deck/backend/pkg/mailer"
)

type Services struct {
	Auth  auth.AuthService
	Email email.EmailService
}

type Handlers struct {
	Auth auth.AuthHandler
}

type Repositories struct {
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
		Auth:  auth.NewAuthService(container.Repositories.User, container.Repositories.RefreshToken, container.Repositories.Tenant, cfg, emailService),
		Email: emailService,
	}

	container.Handlers = Handlers{
		Auth: auth.NewAuthHandler(container.Services.Auth, cfg),
	}

	return container
}
