-- name: CreateTenant :one
INSERT INTO tenants (name, subdomain) VALUES ($1, $2) RETURNING *;

-- name: CheckTenantExistsBySubdomain :one
SELECT EXISTS (SELECT 1 FROM tenants WHERE subdomain = $1);
