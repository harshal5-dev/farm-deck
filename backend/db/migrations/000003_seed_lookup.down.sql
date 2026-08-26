DELETE FROM farm_types
WHERE name IN ('indoor', 'outdoor', 'greenhouse', 'mixed');

DELETE FROM zone_types
WHERE name IN ('soil', 'hydro', 'aquaponic', 'mushroom');

DELETE FROM soil_types
WHERE name IN ('loamy', 'sandy', 'clay', 'silt', 'sandy_loam', 'clay_loam');

DELETE FROM hydro_system_types
WHERE name IN ('nft', 'dwc', 'ebb_flow', 'aeroponics', 'drip', 'kratky');
