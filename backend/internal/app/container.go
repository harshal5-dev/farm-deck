package app

import (
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
	"github.com/harshal5-dev/farm-deck/backend/internal/modules/auth"
	"github.com/harshal5-dev/farm-deck/backend/internal/repository"
)

type Services struct {
	Auth auth.AuthService
}

type Handlers struct {
	Auth auth.AuthHandler
}

type Repositories struct {
	User repository.UserRepo
}

type Container struct {
	Config       config.Config
	Store        db.Store
	Services     Services
	Handlers     Handlers
	Repositories Repositories
}

func NewContainer(cfg config.Config, store db.Store) *Container {
	container := &Container{
		Config: cfg,
		Store:  store,
	}

	container.Repositories = Repositories{
		User: repository.NewUserRepo(store),
	}

	container.Services = Services{
		Auth: auth.NewAuthService(container.Repositories.User, cfg),
	}

	container.Handlers = Handlers{
		Auth: auth.NewAuthHandler(container.Services.Auth, cfg),
	}

	return container
}
