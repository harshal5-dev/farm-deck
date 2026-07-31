.PHONY: dev create-db drop-db migrate-create migrate-up migrate-down sqlc

dev:
	go run ./cmd/api

create-db:
	docker exec -it postgres18 createdb --username=root --owner=root farm_deck_db

drop-db:
	docker exec -it postgres18 dropdb farm_deck_db

migrate-create:
	migrate create -ext sql -dir db/migrations -seq $(name)
	# make migrate-create name=init_schema

migrate-up:
	migrate -path db/migrations -database "postgres://root:12345@localhost:5432/farm_deck_db?sslmode=disable" -verbose up

migrate-down:
	migrate -path db/migrations -database "postgres://root:12345@localhost:5432/farm_deck_db?sslmode=disable" -verbose down

sqlc:
	sqlc generate -f db/sqlc.yaml
