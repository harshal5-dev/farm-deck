-- name: CreatePasswordReset :one
INSERT INTO password_resets (user_id, otp_hash, expires_at)
VALUES ($1, $2, $3) RETURNING *;
