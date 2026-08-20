# Database DSN — change here, used by all migrate targets.
DB_DSN = postgres://root:12345@localhost:5432/farm_deck_db?sslmode=disable

.PHONY: help dev build test tidy swagger sqlc create-db drop-db migrate-create migrate-up migrate-down

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

dev: ## Run the API server (go run)
	go run ./cmd/api

prod: ## Run the API server (go run)
	APP_ENV=prod GIN_MODE=release go run ./cmd/api

build: ## Compile the API binary to bin/api
	go build -o bin/api ./cmd/api

test: ## Run all tests
	go test ./...

tidy: ## Run go mod tidy
	go mod tidy

swagger: ## Regenerate OpenAPI docs from annotations
	swag init -g cmd/api/main.go -o docs --parseDependency --parseInternal --useStructName

sqlc: ## Generate Go from SQL queries
	sqlc generate -f db/sqlc.yaml

create-db: ## Create the Postgres database (inside docker container)
	docker exec -it postgres18 createdb --username=root --owner=root farm_deck_db

drop-db: ## Drop the Postgres database (inside docker container)
	docker exec -it postgres18 dropdb farm_deck_db

migrate-create: ## Create a new migration: make migrate-create name=init_schema
	migrate create -ext sql -dir db/migrations -seq $(name)

migrate-up: ## Apply migrations
	migrate -path db/migrations -database "$(DB_DSN)" -verbose up

migrate-down: ## Roll back the last migration
	migrate -path db/migrations -database "$(DB_DSN)" -verbose down
