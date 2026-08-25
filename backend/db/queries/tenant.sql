-- name: CreateTenant :one
INSERT INTO tenants (name, subdomain) VALUES ($1, $2) RETURNING *;

-- name: CheckTenantExistsBySubdomain :one
SELECT EXISTS (SELECT 1 FROM tenants WHERE subdomain = $1);

-- name: UpdateTenant :one
UPDATE tenants SET name = $2, description = $3, updated_at = now() WHERE id = $1 RETURNING *;
