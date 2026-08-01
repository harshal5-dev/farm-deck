-- name: CreateUser :one
INSERT INTO users (
    full_name, email_id, password_hash, role, status, tenant_id
) VALUES (
    $1, $2, $3, $4, $5, $6
) RETURNING *;

-- name: CheckUserExistsByEmailID :one
SELECT EXISTS (SELECT 1 FROM users WHERE email_id = $1);
