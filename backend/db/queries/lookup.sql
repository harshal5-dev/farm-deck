-- name: ListFarmTypes :many
SELECT * FROM farm_types ORDER BY display_order;

-- name: ListSoilTypes :many
SELECT * FROM soil_types ORDER BY display_order;

-- name: ListZoneTypes :many
SELECT * FROM zone_types ORDER BY display_order;

-- name: ListHydroSystemTypes :many
SELECT * FROM hydro_system_types  ORDER BY display_order;
