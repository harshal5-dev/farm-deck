-- name: CreateTenant :one
INSERT INTO tenants (name, subdomain) VALUES ($1, $2) RETURNING *;
