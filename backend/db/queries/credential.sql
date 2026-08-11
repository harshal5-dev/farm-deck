-- name: CreateCredential :one
INSERT INTO credentials (
    user_id, email_id, password_hash
) VALUES (
    $1, $2, $3
) RETURNING *;

-- name: GetCredentialByEmail :one
SELECT c.user_id, c.email_id, c.password_hash, u.full_name, u.role, u.tenant_id FROM credentials c JOIN users u ON c.user_id = u.id WHERE c.email_id = $1;

-- name: GetCredentialByUserID :one
SELECT c.user_id, c.email_id, c.password_hash, u.full_name, u.role, u.tenant_id FROM credentials c JOIN users u ON c.user_id = u.id WHERE c.user_id = $1;
