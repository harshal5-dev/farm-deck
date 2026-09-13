-- name: CreateZone :one
INSERT INTO zones (farm_id, tenant_id, zone_type_id, name, area, area_unit, notes)
VALUES ($1, $2, $3, $4, $5, $6, $7)
ON CONFLICT (farm_id, name) WHERE is_active DO NOTHING
RETURNING *;


-- name: UpdateZone :one
UPDATE zones
SET name = $2, area = $3, area_unit = $4, notes = $5, updated_at = now()
WHERE id = $1
RETURNING *;

-- name: ListZones :many
SELECT z.*, zt.name AS zone_type_name, zt.cultivation_mode, zt.display_name AS zone_type_display_name,
f.name AS farm_name,
zsd.soil_type_id, st.display_name AS soil_type_display_name,
st.water_retention AS soil_water_retention, st.drainage AS soil_drainage,
zhd.hydro_system_type_id, hst.display_name AS hydro_system_type_display_name,
zhd.grow_medium, zhd.reservoir_volume_liters, zhd.number_of_slots
FROM zones z
JOIN zone_types zt ON z.zone_type_id = zt.id
JOIN farms f ON z.farm_id = f.id
LEFT JOIN zone_soil_details zsd ON zsd.zone_id = z.id
LEFT JOIN soil_types st ON st.id = zsd.soil_type_id
LEFT JOIN zone_hydro_details zhd ON zhd.zone_id = z.id
LEFT JOIN hydro_system_types hst ON hst.id = zhd.hydro_system_type_id
WHERE z.tenant_id = $1
  AND (sqlc.narg('farm_id')::uuid IS NULL OR z.farm_id = sqlc.narg('farm_id'))
  AND (sqlc.narg('zone_type_id')::uuid IS NULL OR z.zone_type_id = sqlc.narg('zone_type_id'))
  AND (sqlc.narg('is_active')::bool IS NULL OR z.is_active = sqlc.narg('is_active'))
  AND (sqlc.narg('search')::text IS NULL
       OR z.name ILIKE '%' || sqlc.narg('search') || '%'
       OR f.name ILIKE '%' || sqlc.narg('search') || '%')
ORDER BY z.updated_at DESC
LIMIT $2
OFFSET $3;

-- name: CountZonesByStatus :one
SELECT count(*) FILTER (WHERE is_active)                              AS active,
       count(*) FILTER (WHERE NOT is_active)                          AS inactive,
       count(*)                                                       AS total,
       count(*) FILTER (WHERE zone_type_id = sqlc.narg('zone_type_id')::uuid)                AS by_type  -- or GROUP BY for all chips
FROM zones WHERE tenant_id = $1 AND (sqlc.narg('farm_id')::uuid IS NULL OR farm_id = sqlc.narg('farm_id'));

-- name: ToggleZoneIsActive :one
UPDATE zones
SET is_active = $2
WHERE id = $1
RETURNING *;
