// Package main is the entrypoint for the farm-deck API server.
//
// @title           Farm Deck API
// @version         1.0
// @description     Farm management multi-tenant API.
// @description     All responses follow a standard envelope (see Schemas).
//
// @contact.name    Farm Deck Support
// @contact.email   harshalganbote55@gmail.com
//
// @license.name    Proprietary
//
// @host            localhost:8083
// @BasePath        /api/v1
// @schemes         http https
//
// @securityDefinitions.apikey  CookieAuth
// @in                          cookie
// @name                        access_token
// @description                 JWT set by POST /auth/login.
package main

import (
	"log"

	_ "github.com/harshal5-dev/farm-deck/backend/docs"
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
