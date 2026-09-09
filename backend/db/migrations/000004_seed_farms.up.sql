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
