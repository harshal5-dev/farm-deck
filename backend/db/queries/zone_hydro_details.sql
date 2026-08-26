-- name: CreateZoneHydroDetails :one
INSERT INTO zone_hydro_details (
    zone_id,
    hydro_system_type_id,
    grow_medium,
    reservoir_volume_liters,
    number_of_slots
) VALUES (
    $1,
    $2,
    $3,
    $4,
    $5
) RETURNING *;

-- name: UpdateZoneHydroDetails :one
UPDATE zone_hydro_details
SET
    hydro_system_type_id = $2,
    grow_medium = $3,
    reservoir_volume_liters = $4,
    number_of_slots = $5
WHERE zone_id = $1
RETURNING *;
