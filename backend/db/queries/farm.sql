-- name: CreateFarm :one
INSERT INTO farms (name, location, latitude, longitude, total_area, area_unit, notes, tenant_id, farm_type_id)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *;

-- name: ListFarms :many
SELECT * FROM farms
WHERE tenant_id = $1
AND is_active = $2
ORDER BY created_at DESC;

-- name: UpdateFarm :one
UPDATE farms
SET name = $2, location = $3, latitude = $4, longitude = $5, total_area = $6, area_unit = $7, notes = $8, updated_at = now()
WHERE id = $1
RETURNING *;

-- name: ToggleFarmIsActive :one
UPDATE farms
SET is_active = $2
WHERE id = $1
RETURNING *;
