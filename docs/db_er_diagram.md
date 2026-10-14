# FarmDeck — Database ER Diagram

Generated from [`backend/db/migrations/000001_init_schema.sql`](../backend/db/migrations/000001_init_schema.sql).
Migrations `000002`–`000004` are seed data only (tenants, users, lookups, farms/zones) and add no schema.

```mermaid
erDiagram
    TENANTS {
        uuid id PK
        varchar name
        varchar subdomain UK "slug, lowercase-digits-hyphens only"
        varchar description
        timestamptz created_at
        timestamptz updated_at
    }

    USERS {
        uuid id PK
        uuid tenant_id FK
        varchar email_id UK
        varchar full_name
        varchar profile_picture
        varchar role "owner | manager | grower | viewer"
        varchar status "invited | active"
        timestamptz created_at
        timestamptz updated_at
        timestamptz last_active_at
        timestamptz deleted_at "soft delete"
    }

    CREDENTIALS {
        uuid user_id PK, FK
        varchar email_id UK
        varchar password_hash
        timestamptz created_at
        timestamptz updated_at
    }

    REFRESH_TOKENS {
        uuid id PK
        uuid user_id FK "references credentials.user_id"
        char64 token_hash UK "sha256 hex"
        timestamptz expires_at
        timestamptz revoked_at
        varchar user_agent
        varchar ip
        timestamptz created_at
    }

    USER_INVITATIONS {
        uuid id PK
        uuid user_id FK "invited user"
        uuid tenant_id FK
        char64 token_hash UK "sha256 hex of raw invite token"
        timestamptz expires_at "now() + 7 days"
        timestamptz accepted_at
        timestamptz revoked_at
        uuid created_by FK "inviter (users.id)"
        timestamptz created_at
    }

    FARM_TYPES {
        uuid id PK
        varchar name UK
        varchar display_name
        integer display_order
        varchar description
    }

    FARMS {
        uuid id PK
        uuid tenant_id FK
        uuid farm_type_id FK
        varchar name "unique per tenant while active"
        varchar location
        numeric latitude "-90 .. 90"
        numeric longitude "-180 .. 180"
        numeric total_area "must be > 0"
        varchar area_unit "default sq_m"
        varchar notes
        boolean is_active "default true"
        timestamptz created_at
        timestamptz updated_at
    }

    ZONE_TYPES {
        uuid id PK
        varchar name UK
        varchar display_name
        varchar cultivation_mode "soil | hydro | other"
        varchar description
        integer display_order
    }

    SOIL_TYPES {
        uuid id PK
        varchar name UK
        varchar display_name
        varchar water_retention "low | medium | high"
        varchar drainage
        varchar description
        integer display_order
    }

    HYDRO_SYSTEM_TYPES {
        uuid id PK
        varchar name UK
        varchar display_name
        varchar description
        integer display_order
    }

    ZONES {
        uuid id PK
        uuid farm_id FK
        uuid tenant_id FK
        uuid zone_type_id FK
        varchar name "unique per farm while active"
        numeric area "must be > 0"
        varchar area_unit "default sq_m"
        varchar notes
        boolean is_active "default true"
        timestamptz created_at
        timestamptz updated_at
    }

    ZONE_SOIL_DETAILS {
        uuid zone_id PK, FK
        uuid soil_type_id FK
    }

    ZONE_HYDRO_DETAILS {
        uuid zone_id PK, FK
        uuid hydro_system_type_id FK
        varchar grow_medium "rockwool, coco, LECA, perlite..."
        numeric reservoir_volume_liters "must be > 0"
        integer number_of_slots "must be > 0"
    }

    %% ── Tenancy & identity ────────────────────────────────────────────
    TENANTS         ||--o{ USERS           : "owns"
    USERS           |o--o| CREDENTIALS     : "authenticates with"
    CREDENTIALS     ||--o{ REFRESH_TOKENS  : "issues"
    TENANTS         ||--o{ USER_INVITATIONS: "scopes"
    USERS           ||--o{ USER_INVITATIONS: "invited as"
    USERS           ||--o{ USER_INVITATIONS: "created by"

    %% ── Farm hierarchy ────────────────────────────────────────────────
    TENANTS         ||--o{ FARMS           : "owns"
    FARM_TYPES      ||--o{ FARMS           : "classifies"
    TENANTS         ||--o{ ZONES           : "scopes"
    FARMS           ||--o{ ZONES           : "contains"
    ZONE_TYPES      ||--o{ ZONES           : "classifies"

    %% ── Zone detail (one-per-zone, mode-dependent) ────────────────────
    ZONES           |o--o| ZONE_SOIL_DETAILS   : "soil mode"
    ZONES           |o--o| ZONE_HYDRO_DETAILS  : "hydro mode"
    SOIL_TYPES      ||--o{ ZONE_SOIL_DETAILS   : "classifies"
    HYDRO_SYSTEM_TYPES ||--o{ ZONE_HYDRO_DETAILS : "classifies"
```

## Relationship summary

| Parent | Child | Cardinality | FK | ON DELETE |
|---|---|---|---|---|
| tenants | users | 1 → N | `users.tenant_id` | CASCADE |
| users | credentials | 1 → 0..1 | `credentials.user_id` (PK) | CASCADE |
| credentials | refresh_tokens | 1 → N | `refresh_tokens.user_id` | CASCADE |
| tenants | user_invitations | 1 → N | `user_invitations.tenant_id` | CASCADE |
| users | user_invitations | 1 → N | `user_invitations.user_id` (invitee) | CASCADE |
| users | user_invitations | 1 → N | `user_invitations.created_by` (inviter) | NO ACTION |
| tenants | farms | 1 → N | `farms.tenant_id` | CASCADE |
| farm_types | farms | 1 → N | `farms.farm_type_id` | NO ACTION |
| tenants | zones | 1 → N | `zones.tenant_id` | CASCADE |
| farms | zones | 1 → N | `zones.farm_id` | CASCADE |
| zone_types | zones | 1 → N | `zones.zone_type_id` | NO ACTION |
| zones | zone_soil_details | 1 → 0..1 | `zone_soil_details.zone_id` (PK) | CASCADE |
| soil_types | zone_soil_details | 1 → N | `zone_soil_details.soil_type_id` | NO ACTION |
| zones | zone_hydro_details | 1 → 0..1 | `zone_hydro_details.zone_id` (PK) | CASCADE |
| hydro_system_types | zone_hydro_details | 1 → N | `zone_hydro_details.hydro_system_type_id` | NO ACTION |

## Notes

- **Multi-tenancy**: `tenants` is the root; users, farms, zones, and invitations all denormalize `tenant_id` for scoped queries and cascade deletes.
- **Zone detail tables are exclusive by cultivation mode**: `zone_types.cultivation_mode` (`soil` / `hydro` / `other`) drives which detail table is used; `other` modes (aquaponic, mushroom) use neither.
- **Composite-FK anchor (D11)**: `zones` has `UNIQUE (id, farm_id)` so detail/log tables can reference `(zone_id, farm_id)` composite foreign keys in future migrations.
- **Soft delete / soft archive**: `users.deleted_at` soft-deletes users; `farms.is_active` / `zones.is_active` archive records, with partial unique indexes enforcing name uniqueness only among live rows.
- **Lookup tables** (`farm_types`, `zone_types`, `soil_types`, `hydro_system_types`) are seeded in `000003_seed_lookup.sql` and referenced with `NO ACTION` deletes.
