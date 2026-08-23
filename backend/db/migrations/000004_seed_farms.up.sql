WITH sunrise AS (
    SELECT id FROM tenants WHERE subdomain = 'sunrise-farms.farmdeck.app' LIMIT 1
),
ft AS (
    SELECT name, id FROM farm_types WHERE name IN ('indoor', 'outdoor', 'greenhouse', 'mixed')
)
INSERT INTO farms (name, location, latitude, longitude, total_area, area_unit, notes, tenant_id, farm_type_id)
SELECT v.name, v.location, v.latitude, v.longitude, v.total_area, v.area_unit, v.notes, s.id, f.id
FROM (VALUES
    -- Greenhouse (4) ----------------------------------------------------------
    ('Skagit Valley Greenhouse',          'Mount Vernon, WA',  48.421220, -122.334050,    1.85, 'hectares',
     'Venlo-style glasshouse built 2017 with double-poly roof and thermal screens. Beefsteak tomatoes on the high-wire system September through June. long-English cucumbers on raised troughs during the summer gap. 600 W HPS plus LED inter-lighting supplement low winter light. Biological pest control with Encarsia, Amblyseius, and bumblebees. rainwater cistern on the 3,200 sqm roof supplies roughly 70 percent of annual irrigation demand.',
     'greenhouse'),
    ('Central Valley Greenhouse',         'Fresno, CA',        36.746840, -119.772590,    4.20, 'hectares',
     'Double-poly, 9 m gutter-connected houses on a recirculating NFT system for red, yellow, and orange bell peppers (2.6 ha) plus trellised Italian eggplant (1.2 ha). Roof wash-capture holds 1.8 ML of summer storm water. Four bumblebee hives per house, replaced every 10 weeks. Continuous HPS supplemental lighting lifts winter yield by roughly 30 percent. summer pad-and-fan cooling holds canopy below 28 C when outside hits 42 C.',
     'greenhouse'),
    ('Snake River Greenhouse',            'Twin Falls, ID',    42.562970, -114.460870,    2.40, 'hectares',
     'Three-bay aquaponic greenhouse pairing 18,000 L of tilapia raceways with deep-water-culture rafts carrying butterhead, romaine, and mizuna. Fish waste is mineralised in a moving-bed biofilter and pushed through the rafts. clean water returns to the tanks. A sacrificial catfish tank handles solids. No external fertiliser input. Solar thermal preheats replacement water and cuts boiler runtime roughly 40 percent.',
     'greenhouse'),
    ('Rogue River Greenhouse',            'Grants Pass, OR',   42.439010, -123.328360,    1.65, 'hectares',
     'Cluster of three vented poly-tunnel houses growing Mediterranean culinary herbs (rosemary, thyme, oregano, sage, four basil varieties) plus edible flowers (nasturtium, borage, viola, calendula). Direct-to-restaurant sales weekly to 18 chefs in Ashland and Medford. Saturday farm-stand handles retail overflow. Hand-raked Mediterranean-clay beds under coarse gravel mulch. overhead misting keeps humidity under 60 percent through July. Three honeybee hives supply pollination and a branded wildflower-honey retail line.',
     'greenhouse'),

    -- Outdoor (4) -------------------------------------------------------------
    ('Yakima Apple Orchard',              'Yakima, WA',        46.602070, -120.505890,   32.00, 'acres',
     'Two-variety block established 2015 on M9-337 dwarf rootstock with V-trellis at 3 m by 1 m spacing. Honeycrisp (18 ac) and Gala (14 ac) split between fresh-market packers. Honeycrisp nets installed 2022 to mitigate sunburn and hail. Two-line drip irrigation with inline moisture sensors at 30 cm and 60 cm depths. Frost mitigation runs an under-tree sprinkler plus a 12 m3-per-minute diesel wind machine shared with the neighbour. Soils are sandy loam over basalt. leaf-tissue sampling runs each July.',
     'outdoor'),
    ('Willamette Berry Farm',             'Salem, OR',         44.942900, -123.035100,   18.50, 'acres',
     'Certified organic since 2019 under Oregon Tilth. Three sections of trailing blackberries: 7 ac Marion, 6 ac new Columbia Star plantings, and 5.5 ac split between highbush blueberries (Duke, Liberty) and June-bearing strawberries (Hood, Albion day-neutrals). Drip-irrigated from a 0.5 ac-ft on-site reservoir. spring cover crop of phacelia and clover feeds pollinators and adds 60 lb N per ac. U-pick opens July through September.',
     'outdoor'),
    ('Treasure Valley Onion Farm',        'Caldwell, ID',      43.662940, -116.687510,   64.00, 'acres',
     'Spanish-type yellow sweet onions for fresh-market packing sheds. Three-year rotation: onions, then sweet corn, then winter cover (cereal rye plus vetch). covers are terminated and incorporated two weeks ahead of onion transplant. Overhead wheel-line sprinkler through the first 60 days, switched to surface drip the final 60 to mitigate bacterial bulb rot. Silt-loam over a hardpan broken annually with a subsoiler. curing in-field under windrows for 10 to 14 days.',
     'outdoor'),
    ('Hood River Pear Orchard',           'Hood River, OR',    45.705450, -121.521540,   22.75, 'acres',
     'Comice, Bartlett, and Anjou pears on 8 m by 5 m spacing with an upright-V training system on OHxF 87 rootstock. Historic 1948 planting was topworked to fireblight-resistant selections over 2018 to 2022. Steep 18 to 25 percent south-facing slope plus four 110 kW propane wind machines keeps blossoms above 0 C during radiation-frost nights from April to May. Hand-thin to single-fruit clusters in June, mechanical box-prune in February. yields average 22 t per ac Anjou, 18 t per ac Bartlett.',
     'outdoor'),

    -- Indoor (2) --------------------------------------------------------------
    ('Imperial Valley Indoor Vertical',   'El Centro, CA',     32.792000, -115.563050, 9500.00, 'sq_ft',
     'Containerised four-tier vertical racks under tunable white plus 660 nm red LEDs at 110 umol per m2 per second PPFD on a 16 h photoperiod. Grows 14 SKUs of microgreens (radish, pea shoots, amaranth, broccoli, cilantro, borage) plus culinary herbs (basil, dill, thyme) for direct restaurant and meal-kit distribution. Crop cycle 8 to 14 days. trays are harvested, weighed, and packed in an ISO-7 cleanroom. Closed-loop irrigation cuts water use to one-fifteenth of field equivalents. facility peak draw roughly 85 kW.',
     'indoor'),
    ('Wenatchee Indoor Seedling Nursery', 'Wenatchee, WA',     47.423450, -120.310340, 6200.00, 'sq_ft',
     'Climatised seedling nursery producing containerised bench-grafted trees for the orchard division: Cosmic Crisp, Honeycrisp, WA 38 cherry, and Bartlett pear. Germination chambers run 22 C at 95 percent RH for the first 14 days, then hardening off under retractable shade cloth. Output about 80,000 grafted trees per year. roughly 60 percent retained for Sunrise orchards, 40 percent sold wholesale. On-site tissue-culture lab produces virus-certified rootstock lines. LED top-lighting and bottom-heat mats extend the growing window year-round.',
     'indoor'),

    -- Mixed (2) ----------------------------------------------------------------
    ('Salinas Valley Mixed Crops',        'Salinas, CA',       36.677700, -121.655500,  240.00, 'acres',
     'Cool-season rotation supporting regional leafy-greens processors: 120 ac romaine hearts, 60 ac tender-leaf mixes, 40 ac broccoli rabe, and 20 ac green cabbage under one operations umbrella. Overhead sprinkler germination followed by 30-mile drip tape. planting staggered every 9 days so harvest crews run continuously March through November. Maricopa-Stacy loam soils with 4 to 6 percent organic matter. composted dairy manure applied pre-plant at 8 t per ac. Coastal marine layer knocks midday leaf temperatures down 8 to 10 C through July.',
     'mixed'),
    ('Columbia Basin Mixed Farm',         'Moses Lake, WA',    47.130140, -119.278080,  410.00, 'acres',
     'Three-section centre-pivot rotation: 200 ac soft white winter wheat, 130 ac Russet Burbank potatoes (under contract with a regional processor), and 80 ac sweet corn for the frozen-food chain. Pumped irrigation from the Columbia Basin Project canal. soil-moisture neutron probes automate each pivots start and stop schedules. Annual soil tests drive a prescription blend of N, P, K, and S applied through fertigation. 12 ac are dedicated to a quarter-mile-long headland pollinator strip re-seeded each fall with native yarrow, balsamroot, and blue flax.',
     'mixed')
) AS v(name, location, latitude, longitude, total_area, area_unit, notes, farm_type_name)
JOIN sunrise s ON true
JOIN ft f ON f.name = v.farm_type_name
WHERE NOT EXISTS (
    SELECT 1 FROM farms WHERE farms.tenant_id = s.id AND farms.name = v.name
);
