CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE tenants (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    subdomain   VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(255),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email_id         VARCHAR(255) UNIQUE NOT NULL,
    full_name     VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(55),
    role          VARCHAR(20) NOT NULL DEFAULT 'grower',
    status        VARCHAR(20) NOT NULL DEFAULT 'active', -- pending | active | disabled
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT users_role_chk   CHECK (role   IN ('owner','manager','grower', 'viewer')),
    CONSTRAINT users_status_chk CHECK (status IN ('pending','active','disabled'))
);
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email_id_lower ON users(LOWER(email_id));
CREATE INDEX idx_users_tenant_status ON users(tenant_id, status);

CREATE TABLE credentials (
  user_id       UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email_id      VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_credentials_user_id ON credentials(user_id);

CREATE TABLE refresh_tokens (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID NOT NULL REFERENCES credentials(user_id) ON DELETE CASCADE,
    token_hash   CHAR(64) NOT NULL,          -- sha256 hex (64 chars)
    expires_at   TIMESTAMPTZ NOT NULL,
    revoked_at   TIMESTAMPTZ,
    user_agent   VARCHAR(555),
    ip           VARCHAR(45),
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX uq_refresh_token_hash ON refresh_tokens(token_hash);
CREATE INDEX idx_refresh_user_live ON refresh_tokens(user_id) WHERE revoked_at IS NULL;


CREATE TABLE user_invitations (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    token_hash    CHAR(64) NOT NULL,              -- sha256 hex of the raw invite token
    expires_at    TIMESTAMPTZ NOT NULL,            -- now() + 7 days
    accepted_at   TIMESTAMPTZ,                     -- NULL until user accepts
    revoked_at    TIMESTAMPTZ,                      -- owner cancellation, or re-invite revokes prior
    created_by    UUID NOT NULL REFERENCES users(id),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX uq_invite_token_hash ON user_invitations(token_hash);
CREATE INDEX idx_invite_user_live ON user_invitations(user_id)
    WHERE accepted_at IS NULL AND revoked_at IS NULL;
