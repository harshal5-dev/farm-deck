package app

import (
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/auth"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/email"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/farm"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/lookup"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/tenant"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/user"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/zone"
	"github.com/harshal5-dev/farm-deck/backend/internal/repository"
	"github.com/harshal5-dev/farm-deck/backend/pkg/mailer"
)

type Services struct {
	Auth   auth.AuthService
	Email  email.MailService
	User   user.UserService
	Tenant tenant.TenantService
	Lookup lookup.LookupService
	Farm   farm.FarmService
	Zone   zone.ZoneService
}

type Handlers struct {
	Auth   auth.AuthHandler
	User   user.UserHandler
	Tenant tenant.TenantHandler
	Lookup lookup.LookupHandler
	Farm   farm.FarmHandler
	Zone   zone.ZoneHandler
}

type Repositories struct {
	Credential   repository.CredentialRepo
	User         repository.UserRepo
	RefreshToken repository.RefreshTokenRepo
	Tenant       repository.TenantRepo
	Invitation   repository.InvitationRepo
	Lookup       repository.LookupRepo
	Farm         repository.FarmRepo
	Zone         repository.ZoneRepo
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
		Invitation:   repository.NewInvitationRepo(store),
		Lookup:       repository.NewLookupRepo(store),
		Farm:         repository.NewFarmRepo(store),
		Zone:         repository.NewZoneRepo(store),
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
		Auth:   auth.NewAuthService(container.Repositories.Credential, container.Repositories.RefreshToken, container.Repositories.Invitation, cfg, emailService),
		Email:  emailService,
		User:   user.NewUserService(container.Repositories.User, emailService, cfg),
		Tenant: tenant.NewTenantService(container.Repositories.Tenant),
		Lookup: lookup.NewLookupService(container.Repositories.Lookup),
		Farm:   farm.NewFarmService(container.Repositories.Farm),
		Zone:   zone.NewZoneService(container.Repositories.Zone),
	}

	container.Handlers = Handlers{
		Auth:   auth.NewAuthHandler(container.Services.Auth, cfg),
		User:   user.NewUserHandler(container.Services.User),
		Tenant: tenant.NewTenantHandler(container.Services.Tenant),
		Lookup: lookup.NewLookupHandler(container.Services.Lookup),
		Farm:   farm.NewFarmHandler(container.Services.Farm),
		Zone:   zone.NewZoneHandler(container.Services.Zone),
	}

	return container
}
