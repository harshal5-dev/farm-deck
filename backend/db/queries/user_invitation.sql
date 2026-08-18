-- name: CreateUserInvitation :one
INSERT INTO user_invitations (
    user_id, tenant_id, token_hash, expires_at, created_by
) VALUES (
    $1, $2, $3, $4, $5
) RETURNING *;

-- name: GetUserInvitationByTokenHash :one
SELECT * FROM user_invitations WHERE token_hash = $1;

-- name: MarkUserInvitationAccepted :one
UPDATE user_invitations
SET accepted_at = now()
WHERE id = $1
  AND accepted_at IS NULL
  AND revoked_at IS NULL
  AND expires_at > now()
RETURNING *;

-- name: GetInvitationDetailsByTokenHash :one
SELECT i.*, u.full_name, u.email_id, u.role, t.name AS tenant_name
FROM user_invitations i
JOIN users u ON u.id = i.user_id
JOIN tenants t ON t.id = i.tenant_id
WHERE i.token_hash = $1;
