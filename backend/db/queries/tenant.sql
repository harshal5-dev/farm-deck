-- name: CreateTenant :one
INSERT INTO tenants (name, subdomain) VALUES ($1, $2) RETURNING *;

-- name: CheckTenantExistsBySubdomain :one
SELECT EXISTS (SELECT 1 FROM tenants WHERE subdomain = $1);

-- name: UpdateTenant :one
UPDATE tenants SET name = $2, subdomain = $3, description = $4, updated_at = now() WHERE id = $1 RETURNING *;
