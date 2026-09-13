WITH sunrise AS (
    SELECT id FROM tenants WHERE subdomain = 'sunrise-farms' LIMIT 1
),
ft AS (
    SELECT name, id FROM farm_types WHERE name IN ('indoor', 'outdoor', 'greenhouse', 'mixed')
)
INSERT INTO farms (name, location, latitude, longitude, total_area, area_unit, notes, tenant_id, farm_type_id)
SELECT v.name, v.location, v.latitude, v.longitude, v.total_area, v.area_unit, v.notes, s.id, f.id
FROM (VALUES
    -- Greenhouse (1) ----------------------------------------------------------
    ('Skagit Valley Greenhouse',          'Mount Vernon, WA',  48.421220, -122.334050,    1.85, 'hectares',
     'Venlo-style glasshouse built 2017 with double-poly roof and thermal screens. Beefsteak tomatoes on the high-wire system September through June. long-English cucumbers on raised troughs during the summer gap. 600 W HPS plus LED inter-lighting supplement low winter light. Biological pest control with Encarsia, Amblyseius, and bumblebees. rainwater cistern on the 3,200 sqm roof supplies roughly 70 percent of annual irrigation demand.',
     'greenhouse'),

    -- Outdoor (2) -------------------------------------------------------------
    ('Yakima Apple Orchard',              'Yakima, WA',        46.602070, -120.505890,   32.00, 'acres',
     'Two-variety block established 2015 on M9-337 dwarf rootstock with V-trellis at 3 m by 1 m spacing. Honeycrisp (18 ac) and Gala (14 ac) split between fresh-market packers. Honeycrisp nets installed 2022 to mitigate sunburn and hail. Two-line drip irrigation with inline moisture sensors at 30 cm and 60 cm depths. Frost mitigation runs an under-tree sprinkler plus a 12 m3-per-minute diesel wind machine shared with the neighbour. Soils are sandy loam over basalt. leaf-tissue sampling runs each July.',
     'outdoor'),
    ('Willamette Berry Farm',             'Salem, OR',         44.942900, -123.035100,   18.50, 'acres',
     'Certified organic since 2019 under Oregon Tilth. Three sections of trailing blackberries: 7 ac Marion, 6 ac new Columbia Star plantings, and 5.5 ac split between highbush blueberries (Duke, Liberty) and June-bearing strawberries (Hood, Albion day-neutrals). Drip-irrigated from a 0.5 ac-ft on-site reservoir. spring cover crop of phacelia and clover feeds pollinators and adds 60 lb N per ac. U-pick opens July through September.',
     'outdoor'),

    -- Indoor (1) --------------------------------------------------------------
    ('Imperial Valley Indoor Vertical',   'El Centro, CA',     32.792000, -115.563050, 9500.00, 'sq_ft',
     'Containerised four-tier vertical racks under tunable white plus 660 nm red LEDs at 110 umol per m2 per second PPFD on a 16 h photoperiod. Grows 14 SKUs of microgreens (radish, pea shoots, amaranth, broccoli, cilantro, borage) plus culinary herbs (basil, dill, thyme) for direct restaurant and meal-kit distribution. Crop cycle 8 to 14 days. trays are harvested, weighed, and packed in an ISO-7 cleanroom. Closed-loop irrigation cuts water use to one-fifteenth of field equivalents. facility peak draw roughly 85 kW.',
     'indoor'),

    -- Mixed (1) ----------------------------------------------------------------
    ('Salinas Valley Mixed Crops',        'Salinas, CA',       36.677700, -121.655500,  240.00, 'acres',
     'Cool-season rotation supporting regional leafy-greens processors: 120 ac romaine hearts, 60 ac tender-leaf mixes, 40 ac broccoli rabe, and 20 ac green cabbage under one operations umbrella. Overhead sprinkler germination followed by 30-mile drip tape. planting staggered every 9 days so harvest crews run continuously March through November. Maricopa-Stacy loam soils with 4 to 6 percent organic matter. composted dairy manure applied pre-plant at 8 t per ac. Coastal marine layer knocks midday leaf temperatures down 8 to 10 C through July.',
     'mixed')
) AS v(name, location, latitude, longitude, total_area, area_unit, notes, farm_type_name)
JOIN sunrise s ON true
JOIN ft f ON f.name = v.farm_type_name
WHERE NOT EXISTS (
    SELECT 1 FROM farms WHERE farms.tenant_id = s.id AND farms.name = v.name
);

-- ============================================================================
-- Fields (zones) — six zones of every zone type on ONE farm: the mixed
-- crops farm (the only "mixed" farm type) demos soil, hydro, aquaponic
-- and mushroom side by side. Zone rows first, then the soil / hydro
-- detail halves keyed by (farm name, zone name). Idempotent.
--
-- NOTE: keep semicolons out of string literals AND comments in these
-- migration files. The startup migrator (golang-migrate with the pgx
-- MultiStatement splitter) breaks statements on semicolons without
-- quote or comment awareness, so a stray semicolon inside a note or a
-- comment fails the migration with an unterminated-quoted-string error.
-- ============================================================================

WITH sunrise AS (
    SELECT id FROM tenants WHERE subdomain = 'sunrise-farms' LIMIT 1
),
zt AS (
    SELECT name, id FROM zone_types WHERE name IN ('soil', 'hydro', 'aquaponic', 'mushroom')
),
fm AS (
    SELECT name, id FROM farms WHERE tenant_id = (SELECT id FROM sunrise)
),
seed AS (
    SELECT * FROM (VALUES
        -- Salinas Valley Mixed Crops — all four zone types on one farm --
        ('Salinas Valley Mixed Crops', 'Romaine Hearts North', 'soil', 60.00, 'acres',
         'North romaine hearts planting, first in the 9-day stagger. Overhead germination then drip tape.'),
        ('Salinas Valley Mixed Crops', 'Tender-Leaf Mix', 'soil', 60.00, 'acres',
         'Spring mix and baby spinach beds, harvested by band saw rigs at dawn before the marine layer lifts.'),
        ('Salinas Valley Mixed Crops', 'NFT Herb Greenhouse', 'hydro', 0.30, 'hectares',
         'Glasshouse NFT channels carrying basil, dill, and chives for the processing lines. Pump duty watched through peak summer heat.'),
        ('Salinas Valley Mixed Crops', 'DWC Greens Pond', 'hydro', 0.12, 'hectares',
         'Raft pond for butterhead and oakleaf lettuce. Air stones on dual circuits with a DO target above 5 mg per L.'),
        ('Salinas Valley Mixed Crops', 'Aquaponic Loop', 'aquaponic', 0.15, 'hectares',
         'Tilapia tanks feeding raft beds of lettuce and basil in one recirculating loop. Biofilter and ammonia checks daily.'),
        ('Salinas Valley Mixed Crops', 'Mushroom Fruit Room', 'mushroom', 800.00, 'sq_ft',
         'Insulated fruiting room cycling oyster and shiitake blocks at 85 percent RH with CO2-controlled fresh air.')
    ) AS v(farm_name, zone_name, zone_type_name, area, area_unit, notes)
)
INSERT INTO zones (farm_id, tenant_id, zone_type_id, name, area, area_unit, notes)
SELECT fm.id, (SELECT id FROM sunrise), zt.id, seed.zone_name, seed.area, seed.area_unit, seed.notes
FROM seed
JOIN fm ON fm.name = seed.farm_name
JOIN zt ON zt.name = seed.zone_type_name
WHERE NOT EXISTS (
    SELECT 1 FROM zones z WHERE z.farm_id = fm.id AND z.name = seed.zone_name
);

-- Soil halves for the soil-mode zones above -------------------------------
WITH soilmap AS (
    SELECT * FROM (VALUES
        ('Salinas Valley Mixed Crops', 'Romaine Hearts North', 'loamy'),
        ('Salinas Valley Mixed Crops', 'Tender-Leaf Mix',      'silt')
    ) AS v(farm_name, zone_name, soil_type_name)
)
INSERT INTO zone_soil_details (zone_id, soil_type_id)
SELECT z.id, st.id
FROM zones z
JOIN farms f ON f.id = z.farm_id
JOIN soilmap m ON m.farm_name = f.name AND m.zone_name = z.name
JOIN soil_types st ON st.name = m.soil_type_name
WHERE NOT EXISTS (
    SELECT 1 FROM zone_soil_details d WHERE d.zone_id = z.id
);

-- Hydro halves for the hydro-mode zones above -----------------------------
WITH hydromap AS (
    SELECT * FROM (VALUES
        ('Salinas Valley Mixed Crops', 'NFT Herb Greenhouse', 'nft', NULL,      1800.00,  960),
        ('Salinas Valley Mixed Crops', 'DWC Greens Pond',     'dwc', NULL,      5400.00, 1200)
    ) AS v(farm_name, zone_name, hydro_system_type_name, grow_medium, reservoir_volume_liters, number_of_slots)
)
INSERT INTO zone_hydro_details (zone_id, hydro_system_type_id, grow_medium, reservoir_volume_liters, number_of_slots)
SELECT z.id, hst.id, m.grow_medium, m.reservoir_volume_liters, m.number_of_slots
FROM zones z
JOIN farms f ON f.id = z.farm_id
JOIN hydromap m ON m.farm_name = f.name AND m.zone_name = z.name
JOIN hydro_system_types hst ON hst.name = m.hydro_system_type_name
WHERE NOT EXISTS (
    SELECT 1 FROM zone_hydro_details d WHERE d.zone_id = z.id
);
