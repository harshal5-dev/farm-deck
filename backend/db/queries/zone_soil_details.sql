-- name: CreateZoneSoilDetails :one
INSERT INTO zone_soil_details (zone_id, soil_type_id)
VALUES ($1, $2)
RETURNING *;

-- name: UpdateZoneSoilDetails :one
UPDATE zone_soil_details
SET
    soil_type_id = $2
WHERE zone_id = $1
RETURNING *;
