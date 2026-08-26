/**
 * Mock zone database — an in-memory stand-in for the zones module
 * until the backend endpoints land. Seeded with realistic rows that
 * reference the farms from the seed migrations.
 *
 * The operations deliberately mirror the real schema's rules so the
 * UI exercises the same paths the API will:
 *
 *   - `uq_zones_farm_name_live`   → an ACTIVE name is unique per farm;
 *                                   deactivation frees the name, and
 *                                   reactivation can conflict (409).
 *   - `assert_zone_cultivation_mode` → soil details only on soil
 *                                   zones, hydro details only on hydro.
 *   - `is_active` soft delete     → rows are never removed, archived
 *                                   zones keep their history.
 *
 * Errors are thrown as `{ status, data: { error: { message } } }` to
 * match the API envelope the app's toasts already read from.
 */

const uuid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `z-${Math.random().toString(36).slice(2, 11)}`;

const daysAgo = (n) => new Date(Date.now() - n * 86_400_000).toISOString();
const hoursAgo = (n) => new Date(Date.now() - n * 3_600_000).toISOString();

/* ------------------------------------------------------------------ */
/*  Lookups (mock /lookups/* rows)                                     */
/* ------------------------------------------------------------------ */

export const zoneTypeRows = [
  {
    id: "zt-soil",
    name: "soil",
    displayName: "Soil plot",
    cultivationMode: "soil",
    description: "Beds, plots and containers grown in soil.",
  },
  {
    id: "zt-hydro",
    name: "hydro",
    displayName: "Hydroponic system",
    cultivationMode: "hydro",
    description: "Soil-less growing fed by a nutrient solution.",
  },
  {
    id: "zt-aquaponic",
    name: "aquaponic",
    displayName: "Aquaponic",
    cultivationMode: "other",
    description: "Fish and plants sharing one water loop.",
  },
  {
    id: "zt-mushroom",
    name: "mushroom",
    displayName: "Mushroom room",
    cultivationMode: "other",
    description: "Climate-controlled growing space for fungi.",
  },
];

export const soilTypeRows = [
  { id: "st-loam", name: "loamy", displayName: "Loam", waterRetention: "high", drainage: "good" },
  { id: "st-sandy", name: "sandy", displayName: "Sandy", waterRetention: "low", drainage: "excellent" },
  { id: "st-clay", name: "clay", displayName: "Clay", waterRetention: "high", drainage: "poor" },
  { id: "st-silt", name: "silt", displayName: "Silt", waterRetention: "medium", drainage: "medium" },
  { id: "st-sandy-loam", name: "sandy_loam", displayName: "Sandy loam", waterRetention: "medium", drainage: "good" },
  { id: "st-clay-loam", name: "clay_loam", displayName: "Clay loam", waterRetention: "high", drainage: "medium" },
];

export const hydroSystemTypeRows = [
  { id: "hs-nft", name: "nft", displayName: "NFT", description: "A thin film of nutrient water flows constantly over the roots." },
  { id: "hs-dwc", name: "dwc", displayName: "DWC", description: "Roots hang in oxygenated nutrient water (deep water culture)." },
  { id: "hs-ebb-flow", name: "ebb_flow", displayName: "Ebb & Flow", description: "Trays flooded on a timer, then drained so roots breathe." },
  { id: "hs-aeroponics", name: "aeroponics", displayName: "Aeroponics", description: "Roots misted in air — fastest growth, most sensitive." },
  { id: "hs-drip", name: "drip", displayName: "Drip", description: "A slow nutrient drip to each plant's base." },
  { id: "hs-kratky", name: "kratky", displayName: "Kratky", description: "Passive — no pump; the level falls as the plant drinks." },
];

/* ------------------------------------------------------------------ */
/*  Farms (picker-shaped slices of the seeded farms)                   */
/* ------------------------------------------------------------------ */

export const farmRows = [
  { id: "farm-skagit", name: "Skagit Valley Greenhouse", farmTypeName: "greenhouse", isActive: true },
  { id: "farm-snake", name: "Snake River Greenhouse", farmTypeName: "greenhouse", isActive: true },
  { id: "farm-yakima", name: "Yakima Apple Orchard", farmTypeName: "outdoor", isActive: true },
  { id: "farm-willamette", name: "Willamette Berry Farm", farmTypeName: "outdoor", isActive: true },
];

/** Mock farm-type lookup rows — mirror the backend's seeded farm_types. */
export const farmTypeRows = [
  { id: "ft-indoor", name: "indoor", displayName: "Indoor", description: "Fully enclosed grow rooms with LED lighting and tight environmental control." },
  { id: "ft-outdoor", name: "outdoor", displayName: "Outdoor", description: "Traditional fields under the open sky — sun-grown row crops, orchards, and pasture." },
  { id: "ft-greenhouse", name: "greenhouse", displayName: "Greenhouse", description: "Covered structures that extend the season and protect crops from weather extremes." },
  { id: "ft-mixed", name: "mixed", displayName: "Mixed", description: "A blend of indoor propagation and outdoor finishing — best of both environments." },
];

/**
 * Mock farm creation for the setup wizard — registers the new farm in
 * the same in-memory world the field/crop pickers read from, so the
 * wizard works end-to-end without the backend.
 */
export async function createFarmRow(input) {
  await latency();
  const name = String(input?.name || "").trim();
  if (!name || name.length < 2) {
    throw apiError(400, "Farm name must be at least 2 characters.");
  }
  if (farmRows.some((f) => f.name.toLowerCase() === name.toLowerCase())) {
    throw apiError(409, `A farm named “${name}” already exists.`);
  }
  const type = farmTypeRows.find((t) => t.id === input.farmTypeId);
  const farm = {
    id: uuid(),
    name,
    farmTypeName: type?.name ?? null,
    farmTypeId: input.farmTypeId,
    isActive: true,
  };
  farmRows.push(farm);
  return { ...farm, farmTypeDisplayName: type?.displayName ?? null };
}

export async function listFarmTypesMock() {
  await latency();
  return farmTypeRows;
}

/* ------------------------------------------------------------------ */
/*  Zones                                                              */
/* ------------------------------------------------------------------ */

let zoneRows = [
  {
    id: "zone-beefsteak-1",
    farmID: "farm-skagit",
    zoneTypeID: "zt-soil",
    zoneTypeName: "soil",
    name: "Beefsteak High-Wire Bay 1",
    area: 4200,
    areaUnit: "sq_m",
    notes: "Sept–June beefsteak rotation on the high-wire. Compost amended each August.",
    isActive: true,
    zoneStatus: "preparing",
    statusChangedAt: daysAgo(2),
    createdAt: daysAgo(410),
    updatedAt: hoursAgo(20),
    soilTypeDetails: { soilTypeID: "st-clay-loam" },
    hydroSystemTypeDetails: null,
  },
  {
    id: "zone-cucumber-east",
    farmID: "farm-skagit",
    zoneTypeID: "zt-hydro",
    zoneTypeName: "hydro",
    name: "Cucumber Troughs East",
    area: 980,
    areaUnit: "sq_m",
    notes: "Long-English cucumbers on raised troughs through the summer gap.",
    isActive: true,
    zoneStatus: "idle",
    statusChangedAt: daysAgo(12),
    createdAt: daysAgo(380),
    updatedAt: daysAgo(5),
    soilTypeDetails: null,
    hydroSystemTypeDetails: {
      hydroSystemTypeID: "hs-drip",
      growMedium: "rockwool",
      reservoirVolumeLiters: 5400,
      numberOfSlots: 120,
    },
  },
  {
    id: "zone-tilapia-raceways",
    farmID: "farm-snake",
    zoneTypeID: "zt-aquaponic",
    zoneTypeName: "aquaponic",
    name: "Tilapia Raceway Bank",
    area: 650,
    areaUnit: "sq_m",
    notes: "18,000 L tilapia raceways feeding the DWC rafts through the moving-bed biofilter.",
    isActive: true,
    zoneStatus: "idle",
    statusChangedAt: daysAgo(30),
    createdAt: daysAgo(600),
    updatedAt: daysAgo(9),
    soilTypeDetails: null,
    hydroSystemTypeDetails: null,
  },
  {
    id: "zone-butterhead-raft-3",
    farmID: "farm-snake",
    zoneTypeID: "zt-hydro",
    zoneTypeName: "hydro",
    name: "Butterhead Raft 3",
    area: 220,
    areaUnit: "sq_m",
    notes: "Pump #2 seized — awaiting the replacement impeller before the next sow.",
    isActive: true,
    zoneStatus: "maintenance",
    statusChangedAt: daysAgo(1),
    createdAt: daysAgo(220),
    updatedAt: hoursAgo(3),
    soilTypeDetails: null,
    hydroSystemTypeDetails: {
      hydroSystemTypeID: "hs-dwc",
      growMedium: null,
      reservoirVolumeLiters: 18000,
      numberOfSlots: 480,
    },
  },
  {
    id: "zone-honeycrisp-a",
    farmID: "farm-yakima",
    zoneTypeID: "zt-soil",
    zoneTypeName: "soil",
    name: "Honeycrisp Block A",
    area: 18,
    areaUnit: "acre",
    notes: "M9-337 dwarf rootstock, V-trellis. Nets going up before the July heat.",
    isActive: true,
    zoneStatus: "idle",
    statusChangedAt: daysAgo(45),
    createdAt: daysAgo(1200),
    updatedAt: daysAgo(14),
    soilTypeDetails: { soilTypeID: "st-sandy-loam" },
    hydroSystemTypeDetails: null,
  },
  {
    id: "zone-gala-b",
    farmID: "farm-yakima",
    zoneTypeID: "zt-soil",
    zoneTypeName: "soil",
    name: "Gala Block B",
    area: 14,
    areaUnit: "acre",
    notes: "Leaf-tissue sampling each July; drip moisture sensors at 30/60 cm.",
    isActive: true,
    zoneStatus: "preparing",
    statusChangedAt: daysAgo(4),
    createdAt: daysAgo(1200),
    updatedAt: daysAgo(4),
    soilTypeDetails: { soilTypeID: "st-sandy-loam" },
    hydroSystemTypeDetails: null,
  },
  {
    id: "zone-marion-west",
    farmID: "farm-willamette",
    zoneTypeID: "zt-soil",
    zoneTypeName: "soil",
    name: "Marion Trellis West",
    area: 7,
    areaUnit: "acre",
    notes: "Certified organic trailing blackberries; phacelia & clover spring cover crop.",
    isActive: true,
    zoneStatus: "idle",
    statusChangedAt: daysAgo(60),
    createdAt: daysAgo(900),
    updatedAt: daysAgo(21),
    soilTypeDetails: { soilTypeID: "st-silt" },
    hydroSystemTypeDetails: null,
  },
  {
    id: "zone-blueberry-east",
    farmID: "farm-willamette",
    zoneTypeID: "zt-soil",
    zoneTypeName: "soil",
    name: "Blueberry East",
    area: 3.5,
    areaUnit: "acre",
    notes: "Duke & Liberty highbush — drip-irrigated from the on-site reservoir.",
    isActive: true,
    zoneStatus: "idle",
    statusChangedAt: daysAgo(60),
    createdAt: daysAgo(700),
    updatedAt: daysAgo(11),
    soilTypeDetails: { soilTypeID: "st-loam" },
    hydroSystemTypeDetails: null,
  },
  {
    id: "zone-mushroom-1",
    farmID: "farm-skagit",
    zoneTypeID: "zt-mushroom",
    zoneTypeName: "mushroom",
    name: "Mushroom Room 1",
    area: 45,
    areaUnit: "sq_m",
    notes: "Retired the oyster racks after the 2025 season — kept for history.",
    isActive: false,
    zoneStatus: "idle",
    statusChangedAt: daysAgo(200),
    createdAt: daysAgo(500),
    updatedAt: daysAgo(200),
    soilTypeDetails: null,
    hydroSystemTypeDetails: null,
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const apiError = (status, message) => ({
  status,
  data: { error: { message } },
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Simulated network latency, jittered so loading states feel real. */
const latency = () => sleep(220 + Math.random() * 380);

const nowIso = () => new Date().toISOString();

const findZoneType = (id) => zoneTypeRows.find((t) => t.id === id);

/**
 * Enforce `uq_zones_farm_name_live` — an active zone name must be
 * unique within its farm. Returns an error object when taken.
 */
const checkNameConflict = (farmID, name, { exceptId = null } = {}) => {
  const clash = zoneRows.find(
    (z) =>
      z.id !== exceptId &&
      z.farmID === farmID &&
      z.isActive &&
      z.name.toLowerCase() === name.toLowerCase()
  );
  if (!clash) return null;
  return apiError(
    409,
    `An active field named “${name}” already exists on this farm. Rename one of them first.`
  );
};

/**
 * Enforce the `assert_zone_cultivation_mode` trigger — detail rows
 * must match the zone type's cultivation mode.
 */
const checkModeMatch = (zoneTypeID, soilTypeDetails, hydroSystemTypeDetails) => {
  const mode = findZoneType(zoneTypeID)?.cultivationMode;
  if (mode === "soil" && hydroSystemTypeDetails) {
    return apiError(400, "A soil zone cannot carry hydroponic details.");
  }
  if (mode === "hydro" && soilTypeDetails) {
    return apiError(400, "A hydroponic zone cannot carry soil details.");
  }
  if (mode === "other" && (soilTypeDetails || hydroSystemTypeDetails)) {
    return apiError(400, "This zone type does not take soil or hydro details yet.");
  }
  return null;
};

/** Compose the stored row shape (adds farmName for display). */
const withFarmName = (zone) => ({
  ...zone,
  farmName: farmRows.find((f) => f.id === zone.farmID)?.name ?? null,
});

/** Parse the form payload into a storable zone shape. */
const toStoredZone = (input) => {
  const zoneType = findZoneType(input.zoneTypeID);
  const mode = zoneType?.cultivationMode ?? "other";
  return {
    farmID: input.farmID,
    zoneTypeID: input.zoneTypeID,
    zoneTypeName: input.zoneTypeName ?? zoneType?.name ?? null,
    name: String(input.name || "").trim(),
    area:
      input.area === null || input.area === undefined || input.area === ""
        ? null
        : Number(input.area),
    areaUnit: input.areaUnit || "sq_m",
    notes: input.notes?.trim() ? input.notes.trim() : null,
    zoneStatus: input.zoneStatus || "idle",
    soilTypeDetails:
      mode === "soil" && input.soilTypeDetails
        ? { ...input.soilTypeDetails }
        : null,
    hydroSystemTypeDetails:
      mode === "hydro" && input.hydroSystemTypeDetails
        ? { ...input.hydroSystemTypeDetails }
        : null,
  };
};

/* ------------------------------------------------------------------ */
/*  Public operations (what zoneApi calls)                             */
/* ------------------------------------------------------------------ */

/** Synchronous zone lookup — used by the crops mock to join zones. */
export function getZoneRow(id) {
  return zoneRows.find((z) => z.id === id) ?? null;
}

export async function listZones() {
  await latency();
  const zones = zoneRows.map(withFarmName);
  const active = zones.filter((z) => z.isActive).length;
  return {
    zones,
    active,
    inactive: zones.length - active,
    total: zones.length,
  };
}

export async function createZone(input) {
  await latency();
  const stored = toStoredZone(input);

  if (!stored.name || stored.name.length < 2) {
    throw apiError(400, "Field name must be at least 2 characters.");
  }
  if (!stored.farmID) throw apiError(400, "Pick the farm this field belongs to.");
  if (!stored.zoneTypeID) throw apiError(400, "Pick a zone type.");

  const conflict = checkNameConflict(stored.farmID, stored.name);
  if (conflict) throw conflict;

  const modeError = checkModeMatch(
    stored.zoneTypeID,
    stored.soilTypeDetails,
    stored.hydroSystemTypeDetails
  );
  if (modeError) throw modeError;

  const zone = {
    id: uuid(),
    ...stored,
    isActive: true,
    statusChangedAt: nowIso(),
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  zoneRows = [zone, ...zoneRows];
  return withFarmName(zone);
}

export async function updateZone({ id, ...patch }) {
  await latency();
  const index = zoneRows.findIndex((z) => z.id === id);
  if (index === -1) throw apiError(404, "That field no longer exists.");

  const stored = toStoredZone(patch);
  if (!stored.name || stored.name.length < 2) {
    throw apiError(400, "Field name must be at least 2 characters.");
  }

  const conflict = checkNameConflict(stored.farmID, stored.name, { exceptId: id });
  if (conflict) throw conflict;

  const modeError = checkModeMatch(
    stored.zoneTypeID,
    stored.soilTypeDetails,
    stored.hydroSystemTypeDetails
  );
  if (modeError) throw modeError;

  const previous = zoneRows[index];
  const zone = {
    ...previous,
    ...stored,
    statusChangedAt:
      stored.zoneStatus !== previous.zoneStatus ? nowIso() : previous.statusChangedAt,
    updatedAt: nowIso(),
  };
  zoneRows[index] = zone;
  return withFarmName(zone);
}

/** PATCH /zones/:id — soft delete (is_active = false). */
export async function inactivateZone(id) {
  await latency();
  const zone = zoneRows.find((z) => z.id === id);
  if (!zone) throw apiError(404, "That field no longer exists.");
  zone.isActive = false;
  zone.updatedAt = nowIso();
  return withFarmName(zone);
}

/** PATCH /zones/:id/activate — reactivate; can hit the name unique index. */
export async function activateZone(id) {
  await latency();
  const zone = zoneRows.find((z) => z.id === id);
  if (!zone) throw apiError(404, "That field no longer exists.");

  const conflict = checkNameConflict(zone.farmID, zone.name, { exceptId: id });
  if (conflict) {
    // Mirrors the reactivation edge case: a new zone took the name
    // while this one was archived (uq_zones_farm_name_live).
    throw apiError(
      409,
      `Another active field is already named “${zone.name}” on this farm. Rename one of them first.`
    );
  }

  zone.isActive = true;
  zone.updatedAt = nowIso();
  return withFarmName(zone);
}

export async function listZoneTypes() {
  await latency();
  return zoneTypeRows;
}

export async function listSoilTypes() {
  await latency();
  return soilTypeRows;
}

export async function listHydroSystemTypes() {
  await latency();
  return hydroSystemTypeRows;
}

export async function listFarmsForPicker() {
  await latency();
  return farmRows.filter((f) => f.isActive);
}
