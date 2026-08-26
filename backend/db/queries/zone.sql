-- name: CreateZone :one
INSERT INTO zones (farm_id, tenant_id, zone_type_id, name, area, area_unit, notes)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;


-- name: UpdateZone :one
UPDATE zones
SET name = $2, area = $3, area_unit = $4, notes = $5, updated_at = now()
WHERE id = $1
RETURNING *;

-- name: ListZones :many
SELECT z.*, zt.display_name AS zone_type_name, zt.cultivation_mode, zt.description FROM zones z
JOIN zone_types zt ON z.zone_type_id = zt.id
WHERE tenant_id = $1
AND is_active = $2
ORDER BY created_at DESC
LIMIT $3
OFFSET $4;

-- name: ToggleZoneIsActive :one
UPDATE zones
SET is_active = $2
WHERE id = $1
RETURNING *;
