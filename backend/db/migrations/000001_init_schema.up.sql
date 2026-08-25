CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE tenants (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    subdomain   VARCHAR(300) UNIQUE NOT NULL,
    description VARCHAR(500),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT tenants_subdomain_slug_chk CHECK (subdomain ~ '^[a-z0-9-]+$')
);

CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email_id         VARCHAR(255) UNIQUE NOT NULL,
    full_name     VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(55),
    role          VARCHAR(20) NOT NULL DEFAULT 'grower',
    status        VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_active_at TIMESTAMPTZ,
    deleted_at   TIMESTAMPTZ,
    CONSTRAINT users_role_chk   CHECK (role   IN ('owner','manager','grower', 'viewer')),
    CONSTRAINT users_status_chk CHECK (status IN ('invited','active'))
);
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email_id_lower ON users(LOWER(email_id));
CREATE INDEX idx_users_tenant_status ON users(tenant_id, status);
CREATE INDEX idx_users_tenant_last_active
    ON users (tenant_id, last_active_at DESC NULLS LAST);

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

CREATE TABLE farm_types (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name         VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description  VARCHAR(1000)
);

CREATE TABLE farms (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    farm_type_id  UUID NOT NULL REFERENCES farm_types(id),
    name          VARCHAR(255) NOT NULL,
    location      VARCHAR(255),
    latitude      NUMERIC(9,6),
    longitude     NUMERIC(9,6),
    total_area    NUMERIC(12,2),
    area_unit     VARCHAR(20) NOT NULL DEFAULT 'sq_m',
    notes         VARCHAR(1000),
    is_active     BOOLEAN NOT NULL DEFAULT true,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT farms_lat_chk CHECK (latitude  IS NULL OR (latitude  BETWEEN -90 AND 90)),
    CONSTRAINT farms_lng_chk CHECK (longitude IS NULL OR (longitude BETWEEN -180 AND 180)),
    CONSTRAINT farms_area_chk CHECK (total_area IS NULL OR total_area > 0)
);
CREATE INDEX idx_farms_tenant_active ON farms(tenant_id) WHERE is_active = true;
CREATE INDEX idx_farms_tenant_all    ON farms(tenant_id);
