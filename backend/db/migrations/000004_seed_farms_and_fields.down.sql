-- Zones cascade from farms (ON DELETE CASCADE), which in turn cascade
-- to their zone_soil_details / zone_hydro_details rows — farms alone.
DELETE FROM farms
WHERE name IN (
    'Skagit Valley Greenhouse',
    'Yakima Apple Orchard',
    'Willamette Berry Farm',
    'Salinas Valley Mixed Crops',
    'Imperial Valley Indoor Vertical'
);
