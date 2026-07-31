package main

import (
	"log"

	"github.com/harshal5-dev/farm-deck/backend/internal/app"
	"github.com/harshal5-dev/farm-deck/backend/internal/config"
	"github.com/harshal5-dev/farm-deck/backend/internal/db"
	httptransport "github.com/harshal5-dev/farm-deck/backend/internal/transport/http"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("cannot load config:", err)
	}

	store, err := db.Init(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("cannot connect to database:", err)
	}
	defer store.Close()

	container := app.NewContainer(cfg, store)
	server := httptransport.NewServer(container)

	if err := server.Start(); err != nil {
		log.Fatal("server not started:", err)
	}

}
