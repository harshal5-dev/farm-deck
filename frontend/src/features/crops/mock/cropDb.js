import { getZoneRow, farmRows } from "@/features/fields/mock/zoneDb";

/**
 * Mock crop database — two tables that mirror the backend schema:
 *
 *   • `crops`    — catalog of crop varieties (target pH / EC / PPM /
 *                  light / days-to-harvest). Reusable lookup rows
 *                  referenced from cycles via FK.
 *   • `cycles`   — ONE planting cycle: a crop growing in a zone on a
 *                  farm, from plan to close. Carries status,
 *                  growth_stage, plant count, dates and notes.
 *
 * Lifecycle is on cycles, not on the zone — terminal rows are kept
 * as history. Editing a cycle keeps its own zone even if the zone
 * was since deactivated; new cycles require an ACTIVE, non-maintenance
 * zone.
 *
 * Errors are thrown as `{ status, data: { error: { message } } }` to
 * match the API envelope the app's toasts already read from.
 */

const uuid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `c-${Math.random().toString(36).slice(2, 11)}`;

const daysAgo = (n) => new Date(Date.now() - n * 86_400_000).toISOString();
const daysAhead = (n) => new Date(Date.now() + n * 86_400_000).toISOString();
const hoursAgo = (n) => new Date(Date.now() - n * 3_600_000).toISOString();

const apiError = (status, message) => ({
  status,
  data: { error: { message } },
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const latency = () => sleep(220 + Math.random() * 380);
const nowIso = () => new Date().toISOString();

const farmNameOf = (farmId) =>
  farmRows.find((f) => f.id === farmId)?.name ?? null;

/* ------------------------------------------------------------------ */
/*  Crop catalog (rows for the `crops` table)                         */
/* ------------------------------------------------------------------ */

let cropRows = [
  {
    id: "crop-tomato-beefsteak",
    name: "Beefsteak Tomato",
    category: "fruiting",
    targetPhMin: 6.0,
    targetPhMax: 6.8,
    targetEcMin: 2.0,
    targetEcMax: 3.5,
    targetPpmMin: 1400,
    targetPpmMax: 2400,
    daysToHarvest: 80,
    lightHoursPerDay: 14,
    notes:
      "Heavy feeder — keep EC at the higher end once the first trusses set.",
    isActive: true,
    createdAt: daysAgo(420),
    updatedAt: daysAgo(60),
  },
  {
    id: "crop-tomato-cherry",
    name: "Cherry Tomato",
    category: "fruiting",
    targetPhMin: 5.8,
    targetPhMax: 6.5,
    targetEcMin: 2.2,
    targetEcMax: 3.8,
    targetPpmMin: 1500,
    targetPpmMax: 2500,
    daysToHarvest: 65,
    lightHoursPerDay: 14,
    notes: "Indeterminate — keep lowering and de-leafing each Friday.",
    isActive: true,
    createdAt: daysAgo(400),
    updatedAt: daysAgo(40),
  },
  {
    id: "crop-bell-pepper",
    name: "Bell Pepper",
    category: "fruiting",
    targetPhMin: 6.0,
    targetPhMax: 6.8,
    targetEcMin: 2.5,
    targetEcMax: 3.5,
    targetPpmMin: 1700,
    targetPpmMax: 2400,
    daysToHarvest: 75,
    lightHoursPerDay: 14,
    notes: "Coloured block peppers on the high-wire — long season crop.",
    isActive: true,
    createdAt: daysAgo(380),
    updatedAt: daysAgo(80),
  },
  {
    id: "crop-lettuce-butterhead",
    name: "Butterhead Lettuce",
    category: "leafy_green",
    targetPhMin: 5.8,
    targetPhMax: 6.4,
    targetEcMin: 0.8,
    targetEcMax: 1.2,
    targetPpmMin: 560,
    targetPpmMax: 840,
    daysToHarvest: 35,
    lightHoursPerDay: 14,
    notes: "Hydro raft classic — harvest at full head, before bolting.",
    isActive: true,
    createdAt: daysAgo(360),
    updatedAt: daysAgo(30),
  },
  {
    id: "crop-lettuce-mizuna",
    name: "Mizuna",
    category: "leafy_green",
    targetPhMin: 6.0,
    targetPhMax: 7.0,
    targetEcMin: 1.0,
    targetEcMax: 1.4,
    targetPpmMin: 700,
    targetPpmMax: 980,
    daysToHarvest: 30,
    lightHoursPerDay: 12,
    notes: "Asian green — cut-and-come-again; multiple harvests per tray.",
    isActive: true,
    createdAt: daysAgo(330),
    updatedAt: daysAgo(15),
  },
  {
    id: "crop-basil-genovese",
    name: "Genovese Basil",
    category: "herb",
    targetPhMin: 5.8,
    targetPhMax: 6.5,
    targetEcMin: 1.0,
    targetEcMax: 1.6,
    targetPpmMin: 700,
    targetPpmMax: 1120,
    daysToHarvest: 55,
    lightHoursPerDay: 14,
    notes: "Pinch above the second node to keep the bush tight.",
    isActive: true,
    createdAt: daysAgo(300),
    updatedAt: daysAgo(20),
  },
  {
    id: "crop-microgreen-mix",
    name: "Microgreen Salad Mix",
    category: "microgreen",
    targetPhMin: 5.8,
    targetPhMax: 6.2,
    targetEcMin: 0.4,
    targetEcMax: 0.8,
    targetPpmMin: 280,
    targetPpmMax: 560,
    daysToHarvest: 10,
    lightHoursPerDay: 14,
    notes: "Dense seeding on 10×20 trays; cut at cotyledon.",
    isActive: true,
    createdAt: daysAgo(240),
    updatedAt: daysAgo(7),
  },
  {
    id: "crop-microgreen-pea-shoots",
    name: "Pea Shoots",
    category: "microgreen",
    targetPhMin: 6.0,
    targetPhMax: 6.8,
    targetEcMin: 0.6,
    targetEcMax: 1.0,
    targetPpmMin: 420,
    targetPpmMax: 700,
    daysToHarvest: 12,
    lightHoursPerDay: 12,
    notes: "Pre-soak seeds 12h for an even germ.",
    isActive: true,
    createdAt: daysAgo(220),
    updatedAt: daysAgo(11),
  },
  {
    id: "crop-carrot-nantes",
    name: "Nantes Carrot",
    category: "root",
    targetPhMin: 6.0,
    targetPhMax: 6.8,
    targetEcMin: 1.0,
    targetEcMax: 1.6,
    targetPpmMin: 700,
    targetPpmMax: 1120,
    daysToHarvest: 70,
    lightHoursPerDay: 12,
    notes: "Loose soil, steady water — sweet harvest when soil is cool.",
    isActive: true,
    createdAt: daysAgo(190),
    updatedAt: daysAgo(8),
  },
  {
    id: "crop-mushroom-oyster",
    name: "Oyster Mushroom",
    category: "other",
    targetPhMin: null,
    targetPhMax: null,
    targetEcMin: null,
    targetEcMax: null,
    targetPpmMin: null,
    targetPpmMax: null,
    daysToHarvest: 35,
    lightHoursPerDay: 0,
    notes:
      "Humidity 85-95%, CO₂ <800 ppm during pinning. Darkness — light is irrelevant.",
    isActive: true,
    createdAt: daysAgo(150),
    updatedAt: daysAgo(25),
  },
];

/** Synchronous catalog lookup — exported for cross-feature consumers
 *  (e.g. daily-logs decorate their rows with the crop). */
export const findCrop = (id) => cropRows.find((c) => c.id === id);

/* ------------------------------------------------------------------ */
/*  Cycles (rows for the `cycles` table)                              */
/* ------------------------------------------------------------------ */

let cycleRows = [
  {
    id: "cyc-beefsteak",
    farmId: "farm-skagit",
    zoneId: "zone-beefsteak-1",
    cropId: "crop-tomato-beefsteak",
    name: "Spring beefsteak run",
    status: "growing",
    growthStage: "vegetative",
    plantCount: 220,
    dateSeeded: daysAgo(45),
    expectedHarvest: daysAhead(40),
    actualHarvestDate: null,
    notes: "Lowered the first trusses; de-leafing every Friday.",
    createdAt: daysAgo(50),
    updatedAt: hoursAgo(6),
  },
  {
    id: "cyc-bell-pepper",
    farmId: "farm-skagit",
    zoneId: "zone-cucumber-east",
    cropId: "crop-bell-pepper",
    name: "Block peppers east",
    status: "flowering",
    growthStage: "flowering",
    plantCount: 120,
    dateSeeded: daysAgo(62),
    expectedHarvest: daysAhead(28),
    actualHarvestDate: null,
    notes: "First flowers opened — bumble hives placed Tuesday.",
    createdAt: daysAgo(66),
    updatedAt: daysAgo(1),
  },
  {
    id: "cyc-butterhead",
    farmId: "farm-snake",
    zoneId: "zone-tilapia-raceways",
    cropId: "crop-lettuce-butterhead",
    name: "Butterhead raft rotation",
    status: "planned",
    growthStage: "seedling",
    plantCount: 480,
    dateSeeded: null,
    expectedHarvest: daysAhead(35),
    actualHarvestDate: null,
    notes: "Follows the mizuna once the biofilter settles.",
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
  {
    id: "cyc-mizuna",
    farmId: "farm-snake",
    zoneId: "zone-tilapia-raceways",
    cropId: "crop-lettuce-mizuna",
    name: "Mizuna baby-leaf run",
    status: "seeding",
    growthStage: "seedling",
    plantCount: 240,
    dateSeeded: daysAgo(12),
    expectedHarvest: daysAhead(18),
    actualHarvestDate: null,
    notes: "Germinated in 36h — strong run.",
    createdAt: daysAgo(15),
    updatedAt: daysAgo(12),
  },
  {
    id: "cyc-basil",
    farmId: "farm-skagit",
    zoneId: "zone-cucumber-east",
    cropId: "crop-basil-genovese",
    name: "Genovese succession",
    status: "planned",
    growthStage: "seedling",
    plantCount: 96,
    dateSeeded: null,
    expectedHarvest: daysAhead(55),
    actualHarvestDate: null,
    notes: "Succession crop after the block peppers clear.",
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: "cyc-microgreens",
    farmId: "farm-skagit",
    zoneId: "zone-mushroom-1",
    cropId: "crop-microgreen-mix",
    name: "Microgreen restaurant mix",
    status: "harvested",
    growthStage: "harvest",
    plantCount: 48,
    dateSeeded: daysAgo(11),
    expectedHarvest: daysAgo(1),
    actualHarvestDate: daysAgo(1),
    notes: "Cut at cotyledon — 48 trays delivered to the Saturday restaurant run.",
    createdAt: daysAgo(13),
    updatedAt: daysAgo(1),
  },
  {
    id: "cyc-pea-shoots",
    farmId: "farm-skagit",
    zoneId: "zone-mushroom-1",
    cropId: "crop-microgreen-pea-shoots",
    name: "Pea shoots — late trays",
    status: "growing",
    growthStage: "vegetative",
    plantCount: 30,
    dateSeeded: daysAgo(5),
    expectedHarvest: daysAhead(7),
    actualHarvestDate: null,
    notes: "Strong tendrils — second cut looking good.",
    createdAt: daysAgo(7),
    updatedAt: daysAgo(1),
  },
  {
    id: "cyc-carrots",
    farmId: "farm-yakima",
    zoneId: "zone-gala-b",
    cropId: "crop-carrot-nantes",
    name: "Alley-crop Nantes",
    status: "planned",
    growthStage: "seedling",
    plantCount: 6,
    dateSeeded: null,
    expectedHarvest: daysAhead(70),
    actualHarvestDate: null,
    notes: "Alley crop between the Gala rows.",
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
  },
  {
    id: "cyc-oyster",
    farmId: "farm-skagit",
    zoneId: "zone-mushroom-1",
    cropId: "crop-mushroom-oyster",
    name: "Oyster pin run",
    status: "failed",
    growthStage: "harvest",
    plantCount: 40,
    dateSeeded: daysAgo(208),
    expectedHarvest: daysAgo(190),
    actualHarvestDate: null,
    notes: "Pins aborted in the week-2 heat wave — room retired after.",
    createdAt: daysAgo(210),
    updatedAt: daysAgo(195),
  },
];

/* ------------------------------------------------------------------ */
/*  Decorators + sync helpers exposed for cross-feature consumers     */
/* ------------------------------------------------------------------ */

/** Synchronous cycle lookup — used by other features (e.g. daily
 *  logs) that need to read a cycle's joined zone + catalog row
 *  without going through the API. */
export function findCycle(id) {
  return cycleRows.find((c) => c.id === id) ?? null;
}

/** Join the live zone + crop-catalog row so the list renders in one read. */
const decorateCycle = (cycle) => {
  const zone = getZoneRow(cycle.zoneId);
  const crop = findCrop(cycle.cropId);
  return {
    ...cycle,
    crop,
    cropName: crop?.name ?? "Unknown crop",
    cropCategory: crop?.category ?? null,
    zoneName: zone?.name ?? "Unknown field",
    zoneStatus: zone?.zoneStatus ?? null,
    farmId: zone?.farmId ?? null,
    farmName: farmNameOf(zone?.farmId),
  };
};

/* ------------------------------------------------------------------ */
/*  Catalog operations (`crops` table)                                */
/* ------------------------------------------------------------------ */

/** Range validator — {min, max} where at least one may be null. */
const isValidRange = (min, max) =>
  min == null || max == null || Number(min) <= Number(max);

/** Number or null — used for nullable target columns. */
const asNumberOrNull = (v) => {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

const trimOrNull = (v) => {
  const s = v == null ? null : String(v).trim();
  return s ? s : null;
};

const validateCropPayload = (input) => {
  const phMin = asNumberOrNull(input.targetPhMin);
  const phMax = asNumberOrNull(input.targetPhMax);
  const ecMin = asNumberOrNull(input.targetEcMin);
  const ecMax = asNumberOrNull(input.targetEcMax);
  const ppmMin = asNumberOrNull(input.targetPpmMin);
  const ppmMax = asNumberOrNull(input.targetPpmMax);
  const dth = asNumberOrNull(input.daysToHarvest);
  const light = asNumberOrNull(input.lightHoursPerDay);

  if (input.targetPhMin != null && (phMin < 0 || phMin > 14)) {
    throw apiError(400, "pH min must be between 0 and 14.");
  }
  if (input.targetPhMax != null && (phMax < 0 || phMax > 14)) {
    throw apiError(400, "pH max must be between 0 and 14.");
  }
  if (!isValidRange(phMin, phMax)) {
    throw apiError(400, "pH min must be ≤ pH max.");
  }
  if (!isValidRange(ecMin, ecMax)) {
    throw apiError(400, "EC min must be ≤ EC max.");
  }
  if (!isValidRange(ppmMin, ppmMax)) {
    throw apiError(400, "PPM min must be ≤ PPM max.");
  }
  if (dth != null && dth <= 0) {
    throw apiError(400, "Days to harvest must be greater than 0.");
  }
  if (light != null && (light < 0 || light > 24)) {
    throw apiError(400, "Light hours per day must be between 0 and 24.");
  }
};

const toStoredCrop = (input) => ({
  name: trimOrNull(input.name),
  category: input.category || "other",
  targetPhMin: asNumberOrNull(input.targetPhMin),
  targetPhMax: asNumberOrNull(input.targetPhMax),
  targetEcMin: asNumberOrNull(input.targetEcMin),
  targetEcMax: asNumberOrNull(input.targetEcMax),
  targetPpmMin: asNumberOrNull(input.targetPpmMin),
  targetPpmMax: asNumberOrNull(input.targetPpmMax),
  daysToHarvest: asNumberOrNull(input.daysToHarvest),
  lightHoursPerDay: asNumberOrNull(input.lightHoursPerDay),
  notes: trimOrNull(input.notes),
});

export async function listCrops() {
  await latency();
  return { crops: [...cropRows] };
}

export async function createCrop(input) {
  await latency();
  const stored = toStoredCrop(input);
  if (!stored.name || stored.name.length < 2) {
    throw apiError(400, "Crop name must be at least 2 characters.");
  }
  if (
    cropRows.some(
      (c) =>
        c.isActive &&
        c.name.toLowerCase() === stored.name.toLowerCase(),
    )
  ) {
    throw apiError(
      409,
      `A crop named "${stored.name}" already exists in the catalog.`,
    );
  }
  validateCropPayload(input);

  const crop = {
    id: uuid(),
    ...stored,
    isActive: true,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  cropRows = [crop, ...cropRows];
  return crop;
}

export async function updateCrop({ id, ...patch }) {
  await latency();
  const index = cropRows.findIndex((c) => c.id === id);
  if (index === -1) throw apiError(404, "That crop no longer exists.");

  const stored = toStoredCrop(patch);
  if (!stored.name || stored.name.length < 2) {
    throw apiError(400, "Crop name must be at least 2 characters.");
  }
  if (
    cropRows.some(
      (c) =>
        c.id !== id &&
        c.isActive &&
        c.name.toLowerCase() === stored.name.toLowerCase(),
    )
  ) {
    throw apiError(
      409,
      `A crop named "${stored.name}" already exists in the catalog.`,
    );
  }
  validateCropPayload(patch);

  cropRows[index] = {
    ...cropRows[index],
    ...stored,
    updatedAt: nowIso(),
  };
  return cropRows[index];
}

export async function inactivateCrop(id) {
  await latency();
  const index = cropRows.findIndex((c) => c.id === id);
  if (index === -1) throw apiError(404, "That crop no longer exists.");
  // Don't allow inactivating a crop that's still being grown.
  const activeRefs = cycleRows.filter(
    (c) =>
      c.cropId === id &&
      !["completed", "failed", "cancelled"].includes(c.status),
  );
  if (activeRefs.length > 0) {
    throw apiError(
      400,
      `Close ${activeRefs.length} active cycle${activeRefs.length === 1 ? "" : "s"} first — this crop is still in production.`,
    );
  }
  cropRows[index] = {
    ...cropRows[index],
    isActive: false,
    updatedAt: nowIso(),
  };
  return cropRows[index];
}

export async function activateCrop(id) {
  await latency();
  const index = cropRows.findIndex((c) => c.id === id);
  if (index === -1) throw apiError(404, "That crop no longer exists.");
  cropRows[index] = {
    ...cropRows[index],
    isActive: true,
    updatedAt: nowIso(),
  };
  return cropRows[index];
}

/* ------------------------------------------------------------------ */
/*  Cycle operations (`cycles` table)                                 */
/* ------------------------------------------------------------------ */

const VALID_CYCLE_STATUSES = [
  "planned",
  "seeding",
  "growing",
  "flowering",
  "harvested",
  "completed",
  "cancelled",
  "failed",
];
const VALID_GROWTH_STAGES = [
  "seedling",
  "vegetative",
  "flowering",
  "fruiting",
  "harvest",
];

const toStoredCycle = (input) => {
  const status = VALID_CYCLE_STATUSES.includes(input.status)
    ? input.status
    : "planned";
  const growthStage = VALID_GROWTH_STAGES.includes(input.growthStage)
    ? input.growthStage
    : "seedling";
  return {
    name: trimOrNull(input.name),
    farmId: input.farmId || null,
    zoneId: input.zoneId || null,
    cropId: input.cropId || null,
    status,
    growthStage,
    plantCount:
      input.plantCount === "" ||
      input.plantCount == null ||
      Number.isNaN(Number(input.plantCount))
        ? null
        : Number(input.plantCount),
    dateSeeded: input.dateSeeded || null,
    expectedHarvest: input.expectedHarvest || null,
    actualHarvestDate: input.actualHarvestDate || null,
    notes: trimOrNull(input.notes),
  };
};

const validateCyclePayload = (stored) => {
  if (!stored.zoneId) throw apiError(400, "Pick the field this cycle grows in.");
  if (!stored.cropId) throw apiError(400, "Pick a crop from the catalog.");
  if (!stored.name || stored.name.length < 2) {
    throw apiError(400, "Give this cycle a name.");
  }
  if (stored.plantCount != null && stored.plantCount <= 0) {
    throw apiError(400, "Plant count must be greater than 0.");
  }
  if (
    stored.dateSeeded &&
    stored.expectedHarvest &&
    new Date(stored.dateSeeded) > new Date(stored.expectedHarvest)
  ) {
    throw apiError(
      400,
      "Expected harvest must be on or after the seed date.",
    );
  }
  if (
    stored.actualHarvestDate &&
    stored.dateSeeded &&
    new Date(stored.actualHarvestDate) < new Date(stored.dateSeeded)
  ) {
    throw apiError(
      400,
      "Actual harvest date cannot be before the seed date.",
    );
  }
};

export async function listCycles() {
  await latency();
  return { cycles: cycleRows.map(decorateCycle) };
}

export async function createCycle(input) {
  await latency();
  const stored = toStoredCycle(input);
  validateCyclePayload(stored);

  const zone = getZoneRow(stored.zoneId);
  if (!zone) throw apiError(404, "That field no longer exists.");
  if (!zone.isActive) {
    throw apiError(400, "That field is deactivated — pick an active field.");
  }
  if (zone.zoneStatus === "maintenance") {
    throw apiError(
      400,
      `${zone.name} is under maintenance — fix it before sowing into it.`,
    );
  }

  const crop = findCrop(stored.cropId);
  if (!crop) throw apiError(404, "That crop is no longer in the catalog.");
  if (!crop.isActive) {
    throw apiError(400, "That crop is deactivated — pick an active crop.");
  }

  // Stamp zone's farm on the cycle (DB FK keeps them in lockstep).
  stored.farmId = zone.farmId;

  const cycle = {
    id: uuid(),
    ...stored,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  cycleRows = [cycle, ...cycleRows];
  return decorateCycle(cycle);
}

export async function updateCycle({ id, ...patch }) {
  await latency();
  const index = cycleRows.findIndex((c) => c.id === id);
  if (index === -1) throw apiError(404, "That cycle no longer exists.");

  const previous = cycleRows[index];
  const stored = toStoredCycle(patch);
  validateCyclePayload(stored);

  // Moving to a NEW field re-runs the sowing rules; staying on the
  // current field is always allowed so history stays editable even
  // if the field was since deactivated or broke.
  if (stored.zoneId !== previous.zoneId) {
    const zone = getZoneRow(stored.zoneId);
    if (!zone) throw apiError(404, "That field no longer exists.");
    if (!zone.isActive) {
      throw apiError(400, "That field is deactivated — pick an active field.");
    }
    if (zone.zoneStatus === "maintenance") {
      throw apiError(
        400,
        `${zone.name} is under maintenance — fix it before sowing into it.`,
      );
    }
    stored.farmId = zone.farmId;
  } else {
    stored.farmId = previous.farmId;
  }

  const crop = findCrop(stored.cropId);
  if (!crop) throw apiError(404, "That crop is no longer in the catalog.");

  cycleRows[index] = {
    ...previous,
    ...stored,
    updatedAt: nowIso(),
  };
  return decorateCycle(cycleRows[index]);
}

/** One-step happy-path advance ("Mark flowering", "Close cycle"…). */
export async function advanceCycleStatus(id) {
  await latency();
  const index = cycleRows.findIndex((c) => c.id === id);
  if (index === -1) throw apiError(404, "That cycle no longer exists.");

  const steps = {
    planned: "seeding",
    seeding: "growing",
    growing: "flowering",
    flowering: "harvested",
    harvested: "completed",
  };
  const next = steps[cycleRows[index].status];
  if (!next) {
    throw apiError(400, "This cycle is already closed.");
  }

  // Stamp the relevant date when crossing a milestone; also advance
  // the growth stage to keep the two columns roughly in sync.
  const stageFor = {
    seeding: "seedling",
    growing: "vegetative",
    flowering: "flowering",
    harvested: "harvest",
    completed: "harvest",
  };
  const updates = { status: next, updatedAt: nowIso() };
  if (stageFor[next]) updates.growthStage = stageFor[next];
  if (next === "seeding" && !cycleRows[index].dateSeeded) {
    updates.dateSeeded = nowIso();
  }
  if (next === "harvested" && !cycleRows[index].actualHarvestDate) {
    updates.actualHarvestDate = nowIso();
  }

  cycleRows[index] = { ...cycleRows[index], ...updates };
  return decorateCycle(cycleRows[index]);
}

/**
 * Convenience helper for the catalog — synchronous, used by the
 * cycle form so it can show a chip with target conditions without a
 * round-trip through the API.
 */
export function getCatalogCrop(id) {
  return findCrop(id) ?? null;
}