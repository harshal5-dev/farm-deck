-- name: CreateUserInvitation :one
INSERT INTO user_invitations (
    user_id, tenant_id, token_hash, expires_at, created_by
) VALUES (
    $1, $2, $3, $4, $5
) RETURNING *;

-- name: GetUserInvitationByTokenHash :one
SELECT * FROM user_invitations WHERE token_hash = $1;

-- name: GetUserInvitationByID :one
SELECT * FROM user_invitations WHERE id = $1;

-- name: MarkUserInvitationAccepted :one
UPDATE user_invitations
SET accepted_at = now()
WHERE id = $1
RETURNING *;

-- name: RevokeUserInvitationByID :exec
UPDATE user_invitations SET revoked_at = now() WHERE id = $1;

-- name: RevokeOpenUserInvitationsByUserID :exec
UPDATE user_invitations
SET revoked_at = now()
WHERE user_id = $1 AND accepted_at IS NULL AND revoked_at IS NULL;
