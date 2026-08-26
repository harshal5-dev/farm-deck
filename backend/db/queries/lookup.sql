-- name: ListFarmTypes :many
SELECT * FROM farm_types ORDER BY name;

-- name: ListSoilTypes :many
SELECT * FROM soil_types ORDER BY name;

-- name: ListZoneTypes :many
SELECT * FROM zone_types ORDER BY name;

-- name: ListHydroSystemTypes :many
SELECT * FROM hydro_system_types  ORDER BY name;
