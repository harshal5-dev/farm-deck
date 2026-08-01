const farmTypes = [
  {
    id: "1dee7bbc-5d46-4b49-becb-4bd502ca3d02",
    name: "outdoor",
    displayName: "Outdoor / Open Field",
    description:
      "Traditional open-air land for soil-based farming. Exposed to natural weather, sunlight, rainfall, and seasonal changes.",
    keyConsiderations:
      "Depends on climate zone and season. Requires irrigation system for dry periods. Pest and weed pressure is higher. Soil quality testing recommended before planting. Crop selection limited by frost dates and growing season length.",
    idealHydroSystems:
      "Drip irrigation can supplement outdoor soil. Kratky (passive hydro) possible outdoors. NFT/DWC not suitable — algae growth from sunlight, temperature fluctuations.",
    commonSetupCosts:
      "Land preparation: $50-500. Irrigation: $100-1000. Soil amendments: $30-200/season. Fencing: $200-2000.",
    icon: "sun",
    color: "amber",
  },
  {
    id: "2ee1f89f-2a73-47e6-92c7-fd04fc85e07b",
    name: "greenhouse",
    displayName: "Greenhouse / Polytunnel",
    description:
      "A covered structure with transparent walls/roof that allows natural sunlight while protecting plants from weather extremes.",
    keyConsiderations:
      "Natural light supplemented optionally with grow lights. Temperature can be moderated with vents, fans, or heaters. Extends growing season by 2-4 months. Higher humidity than outdoors — watch for fungal diseases.",
    idealHydroSystems:
      "NFT, DWC, Dutch Bucket system, Drip. Excellent for hydroponics because you get free sunlight + protection from rain and pests.",
    commonSetupCosts:
      "Structure: $500-5000 (polytunnel) to $5000-50000 (glass greenhouse). Benches/racks: $100-1000. Ventilation: $100-500. Shade cloth: $50-200.",
    icon: "building-warehouse",
    color: "emerald",
  },
  {
    id: "2943581d-2a84-4c8a-a87f-e2a8bf6b0246",
    name: "mixed",
    displayName: "Mixed (Indoor + Outdoor)",
    description:
      "A farm with both indoor controlled spaces AND outdoor growing areas. Common for diversified farms — leafy greens indoors year-round, seasonal fruiting crops outdoors.",
    keyConsiderations:
      "Manage two different environments simultaneously. Indoor for high-value, fast-turnover crops. Outdoor for larger, seasonal crops. Different pest management strategies needed for each zone.",
    idealHydroSystems:
      "All systems apply — NFT/DWC indoor for leafy greens, drip irrigation outdoor for fruiting crops, simple soil beds outside.",
    commonSetupCosts:
      "Combined costs of indoor + outdoor. Budget for both infrastructure types. Minimum viable: $2000-5000 for a small mixed setup.",
    icon: "arrows-exchange",
    color: "violet",
  },
  {
    id: "d2092d99-42bc-462d-99ed-be886d8db229",
    name: "indoor",
    displayName: "Indoor / Warehouse",
    description:
      "A fully enclosed, climate-controlled indoor space such as a warehouse, basement, or spare room. No natural light — relies entirely on artificial lighting.",
    keyConsiderations:
      "Requires full spectrum grow lights (LED panels or HPS lamps). HVAC system for temperature and humidity control. Higher electricity costs. Walls and floors should be water-resistant.",
    idealHydroSystems:
      "NFT, DWC, Aeroponics, Ebb & Flow, Drip System. All hydro systems work indoors since environment is fully controlled.",
    commonSetupCosts:
      "LED lights: $200-1000 per rack. HVAC: $300-2000. Shelving/racks: $100-500. Electrical setup: $200-1000.",
    icon: "building",
    color: "sky",
  },
];

const farms = [
  {
    id: "f1a2b3c4-d5e6-7890-abcd-ef1234567890",
    name: "Sunrise Valley Farm",
    location: "Napa Valley, CA",
    farmType: "outdoor",
    totalArea: 25000,
    areaUnit: "sq_ft",
    notes: "Main outdoor production farm with drip irrigation throughout.",
    isActive: true,
    createdAt: "2025-01-15T08:00:00Z",
    fieldCount: 4,
  },
  {
    id: "a2b3c4d5-e6f7-8901-bcde-f12345678901",
    name: "Green Haven Hydro",
    location: "Portland, OR",
    farmType: "greenhouse",
    totalArea: 5000,
    areaUnit: "sq_ft",
    notes: "Three polytunnels running NFT systems for leafy greens.",
    isActive: true,
    createdAt: "2025-02-20T10:30:00Z",
    fieldCount: 3,
  },
  {
    id: "b3c4d5e6-f7a8-9012-cdef-123456789012",
    name: "Urban Roots Indoor",
    location: "Brooklyn, NY",
    farmType: "indoor",
    totalArea: 3000,
    areaUnit: "sq_ft",
    notes:
      "Warehouse vertical farm with LED lighting. Specializes in microgreens and herbs.",
    isActive: true,
    createdAt: "2025-03-10T14:00:00Z",
    fieldCount: 2,
  },
  {
    id: "c4d5e6f7-a8b9-0123-defa-234567890123",
    name: "Riverside Mixed Farm",
    location: "Austin, TX",
    farmType: "mixed",
    totalArea: 15000,
    areaUnit: "sq_ft",
    notes: "Indoor hydro for lettuce + outdoor beds for tomatoes and peppers.",
    isActive: true,
    createdAt: "2025-01-28T09:15:00Z",
    fieldCount: 5,
  },
  {
    id: "d5e6f7a8-b9c0-1234-efab-345678901234",
    name: "High Desert Greens",
    location: "Santa Fe, NM",
    farmType: "greenhouse",
    totalArea: 8000,
    areaUnit: "sq_ft",
    notes:
      "Geodesic dome greenhouse. DWC systems for year-round lettuce production.",
    isActive: true,
    createdAt: "2025-04-05T11:00:00Z",
    fieldCount: 2,
  },
];

const soilTypes = [
  {
    id: "st-0001-0000-0000-000000000001",
    name: "sandy_loam",
    displayName: "Sandy Loam",
    description:
      "A balanced mix of sand, silt, and clay with a high sand content. Warms quickly in spring and drains freely — a forgiving, easy-to-work soil loved by root crops.",
    waterRetention: "medium",
    drainage: "good",
    phRange: "6.0–7.0",
    nutrientRetention: "medium",
    bestFor:
      "Root vegetables (carrots, potatoes, onions), tomatoes, peppers, and cucumbers. Great for early spring planting because it warms up fast.",
    challenges:
      "Dries out quickly in summer, so needs more frequent irrigation. Nutrients leach faster — feed little and often rather than in big doses.",
    amendmentsNeeded:
      "Add compost or aged manure each season to boost organic matter. Mulch to hold moisture. Use slow-release fertilizers to counter leaching.",
    color: "wheat",
  },
  {
    id: "st-0002-0000-0000-000000000002",
    name: "clay",
    displayName: "Clay",
    description:
      "Heavy, fine-textured soil made of tiny packed particles. Rich in nutrients and holds water well, but dense and slow to drain or warm up.",
    waterRetention: "high",
    drainage: "poor",
    phRange: "6.5–8.0",
    nutrientRetention: "high",
    bestFor:
      "Brassicas (cabbage, broccoli), beans, shallow-rooted leafy greens, and perennials that like firm anchoring.",
    challenges:
      "Compacts easily, waterlogs after rain, and bakes hard when dry. Slow to warm in spring, delaying planting. Hard to dig when wet.",
    amendmentsNeeded:
      "Add generous compost, grit, or coarse sand to open structure. Raised beds help. Avoid walking on it when wet to prevent compaction.",
    color: "clay",
  },
  {
    id: "st-0003-0000-0000-000000000003",
    name: "silt",
    displayName: "Silt",
    description:
      "Smooth, fine-grained soil that sits between sand and clay. Soft and fertile, retains moisture well, and is easy to cultivate when managed.",
    waterRetention: "high",
    drainage: "moderate",
    phRange: "6.0–7.0",
    nutrientRetention: "high",
    bestFor:
      "Moisture-loving crops like lettuce, spinach, herbs, and most vegetables. Good for shrubs and trees.",
    challenges:
      "Prone to compaction and surface crusting. Can become waterlogged and erode easily on slopes if left bare.",
    amendmentsNeeded:
      "Mix in organic matter to improve structure and prevent compaction. Mulch to protect the surface and reduce crusting.",
    color: "sky",
  },
  {
    id: "st-0004-0000-0000-000000000004",
    name: "loam",
    displayName: "Loam",
    description:
      "The ideal garden soil — an even blend of sand, silt, and clay. Drains well, holds moisture and nutrients, and is easy to work.",
    waterRetention: "medium",
    drainage: "good",
    phRange: "6.0–7.0",
    nutrientRetention: "high",
    bestFor:
      "Almost everything — the most versatile soil. Vegetables, fruits, herbs, and flowers all thrive in loam.",
    challenges:
      "Few. Maintain it with regular organic matter; otherwise it can degrade toward sand or clay over time.",
    amendmentsNeeded:
      "Top up with compost annually to keep it rich and well-structured. Light mulching to protect microbial life.",
    color: "leaf",
  },
  {
    id: "st-0005-0000-0000-000000000005",
    name: "chalky",
    displayName: "Chalky / Calcareous",
    description:
      "Alkaline, stony soil over chalk or limestone. Drains fast and is often shallow, which limits deep-rooted crops.",
    waterRetention: "low",
    drainage: "excellent",
    phRange: "7.1–8.5",
    nutrientRetention: "low",
    bestFor:
      "Alkaline-tolerant crops: spinach, cabbage, beets, and many herbs (lavender, thyme). Avoid acid-lovers like blueberries.",
    challenges:
      "High pH locks up iron and manganese, causing yellowing (chlorosis). Dries fast and is low in organic matter.",
    amendmentsNeeded:
      "Add compost to improve fertility and moisture. Use acidifying fertilizers or grow in raised beds with imported soil for sensitive crops.",
    color: "sky",
  },
  {
    id: "st-0006-0000-0000-000000000006",
    name: "peaty",
    displayName: "Peaty",
    description:
      "Dark, organic-rich soil formed in waterlogged bogs. Holds huge amounts of water and is naturally acidic and fertile.",
    waterRetention: "high",
    drainage: "poor",
    phRange: "4.0–5.5",
    nutrientRetention: "high",
    bestFor:
      "Acid-loving plants: blueberries, cranberries, rhododendrons, azaleas, and some brassicas if pH is raised.",
    challenges:
      "Very acidic, can be waterlogged, and may lack key minerals. Can shrink and blow away if drained and dried out.",
    amendmentsNeeded:
      "Lime to raise pH for most crops. Improve drainage with raised beds. Balance nutrients as peat can tie up nitrogen.",
    color: "clay",
  },
];

const fields = [
  {
    id: "fd01-0001-0000-0000-000000000001",
    farmId: "f1a2b3c4-d5e6-7890-abcd-ef1234567890",
    name: "West Tomato Patch",
    area: 5000,
    soilType: "Sandy Loam",
    soilTypeId: "st-0001-0000-0000-000000000001",
    isActive: true,
    cropName: "Beefsteak Tomatoes",
    status: "growing",
  },
  {
    id: "fd01-0001-0000-0000-000000000002",
    farmId: "f1a2b3c4-d5e6-7890-abcd-ef1234567890",
    name: "East Pepper Field",
    area: 6000,
    soilType: "Clay Loam",
    soilTypeId: "st-0002-0000-0000-000000000002",
    isActive: true,
    cropName: "Bell Peppers",
    status: "flowering",
  },
  {
    id: "fd01-0001-0000-0000-000000000003",
    farmId: "f1a2b3c4-d5e6-7890-abcd-ef1234567890",
    name: "North Herb Garden",
    area: 2000,
    soilType: "Silty Loam",
    soilTypeId: "st-0003-0000-0000-000000000003",
    isActive: true,
    cropName: "Basil & Cilantro",
    status: "harvested",
  },
  {
    id: "fd01-0001-0000-0000-000000000004",
    farmId: "f1a2b3c4-d5e6-7890-abcd-ef1234567890",
    name: "South Squash Bed",
    area: 4000,
    soilType: "Loam",
    soilTypeId: "st-0004-0000-0000-000000000004",
    isActive: false,
    cropName: null,
    status: null,
  },
  {
    id: "fd02-0002-0000-0000-000000000005",
    farmId: "a2b3c4d5-e6f7-8901-bcde-f12345678901",
    name: "NFT Rack Alpha",
    area: 800,
    soilType: null,
    soilTypeId: null,
    isActive: true,
    cropName: "Butterhead Lettuce",
    status: "growing",
  },
  {
    id: "fd02-0002-0000-0000-000000000006",
    farmId: "a2b3c4d5-e6f7-8901-bcde-f12345678901",
    name: "NFT Rack Beta",
    area: 800,
    soilType: null,
    soilTypeId: null,
    isActive: true,
    cropName: "Romaine Lettuce",
    status: "seeding",
  },
  {
    id: "fd02-0002-0000-0000-000000000007",
    farmId: "a2b3c4d5-e6f7-8901-bcde-f12345678901",
    name: "DWC Tank 1",
    area: 500,
    soilType: null,
    soilTypeId: null,
    isActive: true,
    cropName: "Kale Mix",
    status: "growing",
  },
  {
    id: "fd03-0003-0000-0000-000000000008",
    farmId: "b3c4d5e6-f7a8-9012-cdef-123456789012",
    name: "Microgreen Station A",
    area: 200,
    soilType: null,
    soilTypeId: null,
    isActive: true,
    cropName: "Sunflower Microgreens",
    status: "growing",
  },
  {
    id: "fd03-0003-0000-0000-000000000009",
    farmId: "b3c4d5e6-f7a8-9012-cdef-123456789012",
    name: "Herb Wall",
    area: 300,
    soilType: null,
    soilTypeId: null,
    isActive: true,
    cropName: "Sweet Basil",
    status: "flowering",
  },
  {
    id: "fd04-0004-0000-0000-000000000010",
    farmId: "c4d5e6f7-a8b9-0123-defa-234567890123",
    name: "Outdoor Cucumber Trellis",
    area: 3000,
    soilType: "Sandy Loam",
    soilTypeId: "st-0001-0000-0000-000000000001",
    isActive: true,
    cropName: "English Cucumbers",
    status: "harvested",
  },
];

const stats = {
  totalFarms: 5,
  activeFarms: 5,
  totalFields: 10,
  activeFields: 9,
  totalArea: 56000,
  cropsInProgress: 8,
  harvestedThisMonth: 3,
  averagePh: 6.2,
  averageEc: 1.8,
};

const recentActivity = [
  {
    id: "act-001",
    type: "harvest",
    message: "Harvested 45kg of Butterhead Lettuce",
    farm: "Green Haven Hydro",
    time: "2 hours ago",
  },
  {
    id: "act-002",
    type: "plant",
    message: "Seeded new batch in NFT Rack Beta",
    farm: "Green Haven Hydro",
    time: "5 hours ago",
  },
  {
    id: "act-003",
    type: "ph",
    message: "pH adjusted to 6.0 in DWC Tank 1",
    farm: "Green Haven Hydro",
    time: "8 hours ago",
  },
  {
    id: "act-004",
    type: "status",
    message: "Bell Peppers entered flowering stage",
    farm: "Sunrise Valley Farm",
    time: "1 day ago",
  },
  {
    id: "act-005",
    type: "harvest",
    message: "Harvested 120kg of English Cucumbers",
    farm: "Riverside Mixed Farm",
    time: "2 days ago",
  },
];

const systemTypes = [
  {
    id: "sys-nft-0001",
    name: "nft",
    displayName: "NFT (Nutrient Film Technique)",
    description:
      "A shallow stream of nutrient-rich water flows continuously through sloped channels. Plant roots dangle through holes and absorb nutrients from a thin film (1-2mm deep), while the upper roots breathe air.",
    howItWorks:
      "A submersible pump pushes nutrient solution to the high end of sloped channels (1-2% grade). Solution flows as a thin film across the channel floor and drains back to the reservoir. Roots grow into a mat, soaking in the film while breathing from the air gap above.",
    waterFlowType: "continuous",
    pumpRequired: true,
    airPumpRequired: false,
    growingMediumNeeded: "minimal",
    failureRisk: "high",
    failureWindowHours: "2-4 hours",
    idealCrops:
      "Leafy greens: lettuce, spinach, kale, Swiss chard, arugula. Herbs: basil, cilantro, mint. Best for small root systems and short cycles.",
    unsuitableCrops:
      "Large fruiting plants: tomatoes, peppers, cucumbers (roots clog channels). Root vegetables. Long-season crops with dense root mass.",
    maintenanceLevel: "medium",
    setupComplexity: "intermediate",
    costLevel: "medium",
    plantsPerSqMeter: "20-30",
    typicalReservoirSize: "50-200L per rack",
    color: "sky",
  },
  {
    id: "sys-dwc-0002",
    displayName: "DWC (Deep Water Culture)",
    name: "dwc",
    description:
      "Plants float on styrofoam rafts over a deep tank of nutrient solution. Roots hang fully submerged in oxygenated water. Air stones bubble oxygen 24/7 — the critical component.",
    howItWorks:
      "A deep reservoir (8-12+ inches) holds nutrient solution. Plants sit in net pots in a floating raft. An air pump forces air through air stones at the bottom, creating fine bubbles that oxygenate the water. Water is static except for bubble movement.",
    waterFlowType: "static",
    pumpRequired: false,
    airPumpRequired: true,
    growingMediumNeeded: "minimal",
    failureRisk: "high",
    failureWindowHours: "4-12 hours",
    idealCrops:
      "Leafy greens: lettuce (ideal for DWC), kale, chard. Herbs: basil, mint, watercress. Bok choy. Fast single-harvest crops.",
    unsuitableCrops:
      "Root vegetables: carrots, radishes, beets (submerged roots rot). Long-season fruiting. Multiple-harvest crops that disturb the raft.",
    maintenanceLevel: "low",
    setupComplexity: "beginner",
    costLevel: "low",
    plantsPerSqMeter: "15-25",
    typicalReservoirSize: "50-500L per tank",
    color: "sky",
  },
  {
    id: "sys-ebb-0003",
    name: "ebb_flow",
    displayName: "Ebb & Flow (Flood & Drain)",
    description:
      "A tray filled with growing medium is periodically flooded with nutrient solution on a timer, then drains back. Roots get nutrients during flood cycles and air during drain cycles.",
    howItWorks:
      "A timer-controlled pump floods the grow tray (typically 15 min). After the pump stops, solution drains back (45-60 min). The medium retains moisture between floods. The cycle repeats 4-8 times per day depending on crop and temperature.",
    waterFlowType: "timed",
    pumpRequired: true,
    airPumpRequired: false,
    growingMediumNeeded: "required",
    failureRisk: "medium",
    failureWindowHours: "12-24 hours",
    idealCrops:
      "Fruiting crops: tomatoes, peppers, cucumbers, eggplants, strawberries. Larger plants needing root support. Flowers. Seed starting (entire trays).",
    unsuitableCrops:
      "Microgreens (washed around during floods). Very small seeds (displaced). Root vegetables (medium gets in the way).",
    maintenanceLevel: "medium",
    setupComplexity: "intermediate",
    costLevel: "medium",
    plantsPerSqMeter: "4-10",
    typicalReservoirSize: "50-200L",
    color: "leaf",
  },
  {
    id: "sys-aero-0004",
    name: "aeroponics",
    displayName: "Aeroponics (High-Pressure Mist)",
    description:
      "Roots hang suspended in darkness inside a sealed chamber. Nutrient solution is atomized into a fine mist (50-80 microns) and sprayed onto roots at programmed intervals. Maximum oxygen exposure.",
    howItWorks:
      "A high-pressure pump (80-100 PSI) forces solution through fine mist nozzles inside a dark root chamber. Roots hang freely, receiving bursts of mist (3-5 seconds every 3-5 minutes). Excess drains back to the reservoir. Timers and solenoids control cycles precisely.",
    waterFlowType: "mist",
    pumpRequired: true,
    airPumpRequired: false,
    growingMediumNeeded: "none",
    failureRisk: "very_high",
    failureWindowHours: "30-60 minutes",
    idealCrops:
      "Leafy greens, herbs, strawberries, microgreens. High-value crops where growth speed matters. Cloning / propagation (rooting cuttings).",
    unsuitableCrops:
      "Large fruiting plants: tomatoes, squash (too heavy, no support). Root vegetables (pointless — roots are in air). Crops needing support structures.",
    maintenanceLevel: "high",
    setupComplexity: "advanced",
    costLevel: "high",
    plantsPerSqMeter: "15-25",
    typicalReservoirSize: "20-100L",
    color: "violet",
  },
  {
    id: "sys-drip-0005",
    name: "drip",
    displayName: "Drip System",
    description:
      "Nutrient solution is delivered to the base of each plant through small tubes and drip emitters. Can be recirculating or run-to-waste. The most common commercial hydroponic method.",
    howItWorks:
      "A pump sends solution through mainline tubing to individual drip emitters at each plant. Emitters release solution at a controlled rate (1-4 L/hr). A timer controls the drip schedule (3-6 times/day for 10-30 min). The medium retains moisture between drips.",
    waterFlowType: "timed",
    pumpRequired: true,
    airPumpRequired: false,
    growingMediumNeeded: "required",
    failureRisk: "medium",
    failureWindowHours: "12-24 hours",
    idealCrops:
      "Fruiting crops: tomatoes, peppers, cucumbers, eggplants, melons, strawberries. Large plants needing individual feeding. Any crop benefiting from targeted root-zone feeding.",
    unsuitableCrops:
      "Microgreens (overkill, too much infrastructure). Very small herbs (dense planting works better in NFT). Crops where you want minimum infrastructure.",
    maintenanceLevel: "medium",
    setupComplexity: "intermediate",
    costLevel: "medium",
    plantsPerSqMeter: "3-6",
    typicalReservoirSize: "50-500L",
    color: "leaf",
  },
  {
    id: "sys-kratky-0006",
    name: "kratky",
    displayName: "Kratky Method (Passive)",
    description:
      "The simplest hydroponic system. No pumps, no electricity, no moving parts. Plants sit in net pots above a static reservoir. As the plant drinks, the water level drops, exposing more roots to air. Set it and forget it.",
    howItWorks:
      "A container holds nutrient solution. The plant sits in a net pot suspended above the solution, with only the bottom 1/3 of roots submerged. As the plant consumes water over weeks, the level drops, creating an increasing air gap. Roots in the air gap breathe; roots still in water absorb nutrients.",
    waterFlowType: "static",
    pumpRequired: false,
    airPumpRequired: false,
    growingMediumNeeded: "required",
    failureRisk: "low",
    failureWindowHours: "24+ hours",
    idealCrops:
      "Leafy greens: lettuce (classic Kratky crop), spinach, kale. Herbs: basil, mint, cilantro. Fast-growing single-harvest crops. Educational setups.",
    unsuitableCrops:
      "Long-season fruiting: tomatoes, peppers (solution depletes before harvest). Multiple-harvest crops (refilling disturbs the air gap). Large plants. Hot climates (stagnant water heats up).",
    maintenanceLevel: "low",
    setupComplexity: "beginner",
    costLevel: "low",
    plantsPerSqMeter: "4-8",
    typicalReservoirSize: "5-20L per container",
    color: "wheat",
  },
];

const cropCategories = [
  {
    id: "crop-leafy-0001",
    name: "leafy_green",
    displayName: "Leafy Greens",
    description:
      "Fast-growing plants harvested for their edible leaves. Short crop cycles (30-60 days). Thrive in cooler temperatures. The backbone of hydroponic production — highest yield per square meter.",
    typicalPhMin: 5.5,
    typicalPhMax: 6.0,
    typicalEcMin: 0.8,
    typicalEcMax: 1.2,
    typicalPpmMin: 400,
    typicalPpmMax: 600,
    growthDurationDays: 45,
    temperatureRangeC: "15-24",
    lightHoursPerDay: 14,
    lightRequirement: "medium",
    harvestMethod:
      "Cut-and-come-again for loose leaf. Whole head harvest for head lettuce. Multiple harvests possible from the same plant.",
    bestSystems: "NFT, DWC, Kratky, Aeroponics",
    exampleCrops:
      "Bibb lettuce, Romaine, Butterhead, Spinach, Kale, Swiss chard, Arugula, Mizuna, Bok choy, Tatsoi",
    color: "leaf",
  },
  {
    id: "crop-herb-0002",
    name: "herb",
    displayName: "Herbs",
    description:
      "Aromatic plants grown for culinary, medicinal, or tea use. High-value per gram. Most herbs are perennials — multiple harvests from one planting over months.",
    typicalPhMin: 5.8,
    typicalPhMax: 6.4,
    typicalEcMin: 1.0,
    typicalEcMax: 1.8,
    typicalPpmMin: 500,
    typicalPpmMax: 900,
    growthDurationDays: 40,
    temperatureRangeC: "18-26",
    lightHoursPerDay: 14,
    lightRequirement: "medium-high",
    harvestMethod:
      "Selective pruning (pinch tops to encourage bushiness). Harvest outer leaves first. Never remove more than 1/3 of the plant at once.",
    bestSystems: "NFT, DWC, Drip, Aeroponics",
    exampleCrops:
      "Genovese basil, Thai basil, Cilantro, Dill, Mint, Parsley, Oregano, Thyme, Sage, Chives, Rosemary",
    color: "leaf",
  },
  {
    id: "crop-fruiting-0003",
    name: "fruiting",
    displayName: "Fruiting Crops",
    description:
      "Plants that produce edible fruits after flowering. Longest growing cycle (60-120+ days). Higher nutrient demands than leafy crops. Need support structures for vines and heavy fruit.",
    typicalPhMin: 5.8,
    typicalPhMax: 6.5,
    typicalEcMin: 1.8,
    typicalEcMax: 3.0,
    typicalPpmMin: 900,
    typicalPpmMax: 1500,
    growthDurationDays: 75,
    temperatureRangeC: "18-30",
    lightHoursPerDay: 16,
    lightRequirement: "high",
    harvestMethod:
      "Selective picking at peak ripeness. Continuous harvest over weeks/months. Color and firmness indicate readiness.",
    bestSystems: "Drip, Ebb & Flow, Dutch Bucket",
    exampleCrops:
      "Cherry tomatoes, Beefsteak tomatoes, Bell peppers, Hot peppers, Cucumbers, Eggplants, Strawberries, Melons, Zucchini",
    color: "clay",
  },
  {
    id: "crop-micro-0004",
    name: "microgreen",
    displayName: "Microgreens",
    description:
      "Edible seedlings harvested at the cotyledon or first true leaf stage, typically 7-21 days. Extremely nutrient-dense — up to 40x more nutrients than mature plants. Highest revenue per square foot.",
    typicalPhMin: 5.5,
    typicalPhMax: 6.5,
    typicalEcMin: 0.4,
    typicalEcMax: 0.8,
    typicalPpmMin: 200,
    typicalPpmMax: 400,
    growthDurationDays: 12,
    temperatureRangeC: "18-24",
    lightHoursPerDay: 12,
    lightRequirement: "low-medium",
    harvestMethod:
      "Single harvest: cut the entire tray at the stem base 1-2cm above medium. Sell as live trays or cut product. Perishable — use within 5-7 days refrigerated.",
    bestSystems: "NFT, Ebb & Flow (shallow trays)",
    exampleCrops:
      "Broccoli microgreens, Radish micros, Sunflower shoots, Pea shoots, Wheatgrass, Arugula micros, Amaranth, Beet micros, Kohlrabi micros, Cress",
    color: "leaf",
  },
  {
    id: "crop-root-0005",
    name: "root",
    displayName: "Root Vegetables",
    description:
      "Plants grown for their edible underground parts — roots, tubers, bulbs. Challenging in hydroponics because the edible part needs space to expand. Most successful in deep medium-based systems.",
    typicalPhMin: 6.0,
    typicalPhMax: 6.5,
    typicalEcMin: 1.2,
    typicalEcMax: 1.8,
    typicalPpmMin: 600,
    typicalPpmMax: 900,
    growthDurationDays: 60,
    temperatureRangeC: "15-25",
    lightHoursPerDay: 12,
    lightRequirement: "medium",
    harvestMethod:
      "Single harvest: pull the entire plant when the root reaches desired size. Check by gently uncovering the top of the root. Harvest window is narrow — roots become woody if left too long.",
    bestSystems:
      "DWC (deep media), Drip (coco coir/sand), Ebb & Flow (deep beds)",
    exampleCrops:
      "Radishes, Carrots (short varieties), Beets, Turnips, Potatoes (deep media), Onions (green), Garlic (green)",
    color: "wheat",
  },
  {
    id: "crop-flower-0006",
    name: "flower",
    displayName: "Edible Flowers & Ornamentals",
    description:
      "Plants grown for their flowers — either edible (culinary garnish) or ornamental (cut flowers). Niche high-value market. Specific light cycles trigger flowering in many species.",
    typicalPhMin: 5.5,
    typicalPhMax: 6.2,
    typicalEcMin: 1.0,
    typicalEcMax: 1.6,
    typicalPpmMin: 500,
    typicalPpmMax: 800,
    growthDurationDays: 55,
    temperatureRangeC: "18-28",
    lightHoursPerDay: 14,
    lightRequirement: "medium-high",
    harvestMethod:
      "Cut flowers at a specific bloom stage (varies by species). Morning harvest for longest vase life. Immediately place in water. Some flowers are single harvest, others rebloom.",
    bestSystems: "Drip, Ebb & Flow, NFT (small varieties)",
    exampleCrops:
      "Marigolds, Nasturtiums, Pansies, Violas, Calendula, Lavender, Chamomile, Borage, Sunflowers (dwarf)",
    color: "violet",
  },
  {
    id: "crop-grain-0007",
    name: "grain",
    displayName: "Grains & Fodder",
    description:
      "Cereal crops grown for grain production or as animal fodder. In hydroponics, primarily grown as sprouted fodder (6-10 days) for livestock feed. Full grain production is possible but requires large scale.",
    typicalPhMin: 6.0,
    typicalPhMax: 6.5,
    typicalEcMin: 0.6,
    typicalEcMax: 1.0,
    typicalPpmMin: 300,
    typicalPpmMax: 500,
    growthDurationDays: 10,
    temperatureRangeC: "18-24",
    lightHoursPerDay: 12,
    lightRequirement: "low",
    harvestMethod:
      "Fodder: harvest the entire mat at day 7-10 when grass is 15-20cm tall. Feed the entire mat (roots + greens) to animals. Grain: harvest when seed heads are dry and brown.",
    bestSystems: "Ebb & Flow (fodder trays), NFT (fodder channels)",
    exampleCrops:
      "Barley (fodder), Wheat (fodder & grain), Oats (fodder), Rye, Corn (sprouts), Sorghum",
    color: "wheat",
  },
];

export {
  farmTypes,
  farms,
  fields,
  soilTypes,
  systemTypes,
  cropCategories,
  stats,
  recentActivity,
};
