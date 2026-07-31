package app

import (
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
	db "github.com/harshal5-dev/farm-deck/backend/internal/db/queries"
)

type Services struct {
}

type Handlers struct {
}

type Repositories struct {
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

	container.Repositories = Repositories{}

	container.Services = Services{}

	container.Handlers = Handlers{}

	return container
}
