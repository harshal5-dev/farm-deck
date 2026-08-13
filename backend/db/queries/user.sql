-- name: CreateUser :one
INSERT INTO users (
    full_name, email_id, role, status, tenant_id
) VALUES (
    $1, $2, $3, $4, $5
) RETURNING *;

-- name: CheckUserExistsByEmailID :one
SELECT EXISTS (SELECT 1 FROM users WHERE email_id = $1);

-- name: GetUserByEmailID :one
SELECT * FROM users WHERE email_id = $1;

-- name: GetUserByID :one
SELECT * FROM users WHERE id = $1;

-- name: GetUserProfileDetails :one
SELECT u.id, u.full_name, u.email_id, u.role, u.profile_picture, u.status, u.created_at, t.id as tenant_id, t.name as tenant_name, t.subdomain, t.description, t.created_at as tenant_created_at FROM users u JOIN tenants t ON u.tenant_id = t.id WHERE u.id = $1;

-- name: UpdateUserProfile :one
UPDATE users SET full_name = $2, profile_picture = $3 WHERE id = $1 RETURNING *;

-- name: CreateMember :one
INSERT INTO users (
    full_name, email_id, role, status, tenant_id, profile_picture
) VALUES (
    $1, $2, $3, $4, $5, $6
) RETURNING *;

-- name: UpdateUserStatus :one
UPDATE users SET status = $2 WHERE id = $1 RETURNING *;
