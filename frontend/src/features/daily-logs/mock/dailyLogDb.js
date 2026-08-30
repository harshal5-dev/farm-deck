import { getZoneRow, farmRows } from "@/features/fields/mock/zoneDb";
import { findCrop, findCycle } from "@/features/crops/mock/cropDb";

/**
 * Mock daily-log database — rows for the `daily_logs` table. Each
 * row is one day's reading on one cycle; the unique
 * `(cycle_id, log_date)` constraint is enforced at write time so
 * the API surface mirrors the DB's `dl_uq_cycle_day` index.
 *
 * Schema-driven validations mirror the CHECK constraints:
 *   log_type            ∈ {hydro, soil}     (denormalised from zone)
 *   ph                  0 ≤ ph ≤ 14
 *   humidity_percent    0 ≤ humidity ≤ 100
 *   soil_moisture       0 ≤ moisture ≤ 100
 *   rainfall_mm         rainfall ≥ 0
 *   water_level_status  ∈ {full, medium, low} | null
 *   ppm                 ≥ 0
 *
 * Errors are thrown as `{ status, data: { error: { message } } }` to
 * match the API envelope the app's toasts already read from.
 */

const uuid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `dl-${Math.random().toString(36).slice(2, 11)}`;

const daysAgo = (n) =>
  new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);

const apiError = (status, message) => ({
  status,
  data: { error: { message } },
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const latency = () => sleep(220 + Math.random() * 380);
const nowIso = () => new Date().toISOString();

/**
 * Map the cycle's zone cultivation mode → log_type. Mirrors the
 * rule that `daily_logs.log_type` is denormalised from `zone_types`
 * at write time.
 */
function logTypeForZone(zone) {
  if (!zone) return null;
  if (zone.zoneTypeName === "hydro" || zone.zoneTypeName === "aquaponic") {
    return "hydro";
  }
  if (zone.zoneTypeName === "soil") return "soil";
  // Mushroom / other — fall back to hydro so the form has a sane
  // type to render. Real backend would refuse the write here.
  return "hydro";
}

/* ------------------------------------------------------------------ */
/*  Seed data                                                          */
/* ------------------------------------------------------------------ */

let logRows = [
  // Beefsteak tomatoes — soil logs (zone-beefsteak-1 is a soil bay,
  // so log_type is 'soil' per the denormalisation rule)
  {
    id: "dl-beefsteak-d3",
    cycleId: "cyc-beefsteak",
    logDate: daysAgo(3),
    logType: "soil",
    ph: 6.1,
    ec: 2.6,
    ppm: 1800,
    waterTempC: null,
    airTempC: 24.5,
    humidityPercent: 68.0,
    waterLevelStatus: null,
    nutrientsAdded: true,
    soilMoisture: 44.0,
    rainfallMm: 0.0,
    observation: "Side-dressed with compost; moisture steady after drip run.",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "dl-beefsteak-d2",
    cycleId: "cyc-beefsteak",
    logDate: daysAgo(2),
    logType: "soil",
    ph: 6.4,
    ec: 2.8,
    ppm: 1900,
    waterTempC: null,
    airTempC: 25.1,
    humidityPercent: 70.0,
    waterLevelStatus: null,
    nutrientsAdded: false,
    soilMoisture: 41.5,
    rainfallMm: 0.0,
    observation: null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "dl-beefsteak-d1",
    cycleId: "cyc-beefsteak",
    logDate: daysAgo(1),
    logType: "soil",
    ph: 5.9,
    ec: 3.1,
    ppm: 2050,
    waterTempC: null,
    airTempC: 26.4,
    humidityPercent: 64.0,
    waterLevelStatus: null,
    nutrientsAdded: false,
    soilMoisture: 38.0,
    rainfallMm: 1.2,
    observation: "pH drifting down — amended with a touch of lime after reading.",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },

  // Butterhead lettuce — hydro logs
  {
    id: "dl-butterhead-d5",
    cycleId: "cyc-butterhead",
    logDate: daysAgo(5),
    logType: "hydro",
    ph: 5.9,
    ec: 0.9,
    ppm: 620,
    waterTempC: 19.5,
    airTempC: 22.0,
    humidityPercent: 72.0,
    waterLevelStatus: "full",
    nutrientsAdded: true,
    soilMoisture: null,
    rainfallMm: null,
    observation: null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "dl-butterhead-d2",
    cycleId: "cyc-butterhead",
    logDate: daysAgo(2),
    logType: "hydro",
    ph: 6.0,
    ec: 1.0,
    ppm: 680,
    waterTempC: 20.1,
    airTempC: 23.0,
    humidityPercent: 70.0,
    waterLevelStatus: "medium",
    nutrientsAdded: false,
    soilMoisture: null,
    rainfallMm: null,
    observation: null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },

  // Microgreens — hydro logs (recent harvest)
  {
    id: "dl-microgreens-d2",
    cycleId: "cyc-microgreens",
    logDate: daysAgo(2),
    logType: "hydro",
    ph: 6.0,
    ec: 0.6,
    ppm: 420,
    waterTempC: 21.0,
    airTempC: 22.5,
    humidityPercent: 75.0,
    waterLevelStatus: "full",
    nutrientsAdded: true,
    soilMoisture: null,
    rainfallMm: null,
    observation: "Final feed before the Saturday harvest.",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },

  // Carrots — soil logs
  {
    id: "dl-carrots-d4",
    cycleId: "cyc-carrots",
    logDate: daysAgo(4),
    logType: "soil",
    ph: 6.4,
    ec: 1.3,
    ppm: 880,
    waterTempC: null,
    airTempC: 18.2,
    humidityPercent: 64.0,
    waterLevelStatus: null,
    nutrientsAdded: true,
    soilMoisture: 42.0,
    rainfallMm: 2.4,
    observation: "Side-dressed with compost tea; soil moisture holding nicely.",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "dl-carrots-d1",
    cycleId: "cyc-carrots",
    logDate: daysAgo(1),
    logType: "soil",
    ph: 6.5,
    ec: 1.2,
    ppm: 850,
    waterTempC: null,
    airTempC: 16.0,
    humidityPercent: 70.0,
    waterLevelStatus: null,
    nutrientsAdded: false,
    soilMoisture: 38.5,
    rainfallMm: 6.1,
    observation: "Light shower overnight — no irrigation needed.",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

/* ------------------------------------------------------------------ */
/*  Decorators                                                         */
/* ------------------------------------------------------------------ */

const decorate = (log) => {
  const cycle = findCycle(log.cycleId);
  const zone = cycle ? getZoneRow(cycle.zoneId) : null;
  const crop = cycle ? findCrop(cycle.cropId) : null;
  return {
    ...log,
    cycle,
    zone,
    crop,
    zoneName: zone?.name ?? "Unknown field",
    cropName: crop?.name ?? "Crop",
    cropCategory: crop?.category ?? null,
    farmName: zone
      ? farmRows.find((f) => f.id === zone.farmId)?.name ?? null
      : null,
  };
};

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

const VALID_LOG_TYPES = ["hydro", "soil"];
const VALID_WATER_LEVELS = ["full", "medium", "low"];

const numOrNull = (v) => {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};
const intOrNull = (v) => {
  const n = numOrNull(v);
  return n == null ? null : Math.round(n);
};
const trimOrNull = (v) => {
  const s = v == null ? null : String(v).trim();
  return s ? s : null;
};
const boolOrFalse = (v) => v === true || v === "true" || v === 1;

function validatePayload(input, { isUpdate = false, previousLog = null } = {}) {
  if (!input.cycleId) {
    throw apiError(400, "Pick a cycle for this log.");
  }
  if (!input.logDate) {
    throw apiError(400, "Pick the date for this log.");
  }
  if (!VALID_LOG_TYPES.includes(input.logType)) {
    throw apiError(400, "Log type must be 'hydro' or 'soil'.");
  }

  // Resolve the cycle + its zone, then re-derive log_type from the
  // zone's cultivation mode — the form picks this up but the
  // server is the source of truth.
  const cycle = findCycle(input.cycleId);
  if (!cycle) {
    throw apiError(404, "That cycle no longer exists.");
  }
  const zone = getZoneRow(cycle.zoneId);
  if (!zone) {
    throw apiError(404, "That field no longer exists.");
  }
  const derivedLogType = logTypeForZone(zone);
  if (derivedLogType !== input.logType) {
    throw apiError(
      400,
      `This cycle's field is ${zone.zoneTypeName ?? "unsupported"} — log type must be "${derivedLogType}".`
    );
  }

  // Range checks — mirror the CHECK constraints.
  const ph = numOrNull(input.ph);
  if (ph != null && (ph < 0 || ph > 14)) {
    throw apiError(400, "pH must be between 0 and 14.");
  }
  const ec = numOrNull(input.ec);
  if (ec != null && ec < 0) {
    throw apiError(400, "EC must be ≥ 0.");
  }
  const ppm = intOrNull(input.ppm);
  if (ppm != null && ppm < 0) {
    throw apiError(400, "PPM must be ≥ 0.");
  }
  const humidity = numOrNull(input.humidityPercent);
  if (humidity != null && (humidity < 0 || humidity > 100)) {
    throw apiError(400, "Humidity must be between 0 and 100.");
  }
  const moisture = numOrNull(input.soilMoisture);
  if (moisture != null && (moisture < 0 || moisture > 100)) {
    throw apiError(400, "Soil moisture must be between 0 and 100.");
  }
  const rain = numOrNull(input.rainfallMm);
  if (rain != null && rain < 0) {
    throw apiError(400, "Rainfall must be ≥ 0.");
  }
  const waterTemp = numOrNull(input.waterTempC);
  if (waterTemp != null && (waterTemp < -10 || waterTemp > 60)) {
    throw apiError(400, "Water temperature must be between -10°C and 60°C.");
  }
  const airTemp = numOrNull(input.airTempC);
  if (airTemp != null && (airTemp < -40 || airTemp > 60)) {
    throw apiError(400, "Air temperature must be between -40°C and 60°C.");
  }
  const level = trimOrNull(input.waterLevelStatus);
  if (level != null && !VALID_WATER_LEVELS.includes(level)) {
    throw apiError(400, "Water level must be full, medium, or low.");
  }

  // Unique (cycle_id, log_date) — mirror `dl_uq_cycle_day`.
  const clash = logRows.find(
    (l) =>
      l.cycleId === input.cycleId &&
      l.logDate === input.logDate &&
      (isUpdate ? l.id !== previousLog?.id : true)
  );
  if (clash) {
    throw apiError(
      409,
      `A log already exists for ${input.logDate} on this cycle. Edit the existing entry instead.`
    );
  }

  // Don't allow logs on a closed cycle — terminal cycles shouldn't
  // grow new readings.
  const terminal = ["completed", "failed", "cancelled"].includes(
    cycle.status
  );
  if (terminal && !isUpdate) {
    throw apiError(
      400,
      `This cycle is ${cycle.status}; close it before adding new readings.`
    );
  }

  return {
    cycleId: input.cycleId,
    logDate: input.logDate,
    logType: derivedLogType,
    ph,
    ec,
    ppm,
    waterTempC: waterTemp,
    airTempC: airTemp,
    humidityPercent: humidity,
    waterLevelStatus: level,
    nutrientsAdded: boolOrFalse(input.nutrientsAdded),
    soilMoisture: moisture,
    rainfallMm: rain,
    observation: trimOrNull(input.observation),
  };
}

/* ------------------------------------------------------------------ */
/*  Public operations                                                  */
/* ------------------------------------------------------------------ */

export async function listLogs({ cycleId } = {}) {
  await latency();
  const all = cycleId
    ? logRows.filter((l) => l.cycleId === cycleId)
    : logRows;
  // Newest first so the list page mirrors what you wrote most
  // recently at the top.
  const sorted = [...all].sort((a, b) =>
    a.logDate < b.logDate ? 1 : a.logDate > b.logDate ? -1 : 0
  );
  return { logs: sorted.map(decorate) };
}

export async function getLog(id) {
  await latency();
  const log = logRows.find((l) => l.id === id);
  if (!log) throw apiError(404, "That log no longer exists.");
  return decorate(log);
}

export async function createLog(input) {
  await latency();
  const stored = validatePayload(input);
  const log = {
    id: uuid(),
    ...stored,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  logRows = [log, ...logRows];
  return decorate(log);
}

export async function updateLog({ id, ...patch }) {
  await latency();
  const index = logRows.findIndex((l) => l.id === id);
  if (index === -1) throw apiError(404, "That log no longer exists.");
  const previous = logRows[index];
  const stored = validatePayload(patch, { isUpdate: true, previousLog: previous });
  logRows[index] = { ...previous, ...stored, updatedAt: nowIso() };
  return decorate(logRows[index]);
}

export async function deleteLog(id) {
  await latency();
  const index = logRows.findIndex((l) => l.id === id);
  if (index === -1) throw apiError(404, "That log no longer exists.");
  const [removed] = logRows.splice(index, 1);
  return decorate(removed);
}

/** Synchronous lookup used by the cycle-card summary. */
export function getLatestLogForCycle(cycleId) {
  const filtered = logRows.filter((l) => l.cycleId === cycleId);
  if (filtered.length === 0) return null;
  return filtered.sort((a, b) => (a.logDate < b.logDate ? 1 : -1))[0];
}

/** How many logs a cycle has — used in the cycle card. */
export function getLogCountForCycle(cycleId) {
  return logRows.filter((l) => l.cycleId === cycleId).length;
}

/** Reset to seed — handy in dev to clear mutations. */
export function __resetForTesting() {
  // Re-seed by re-importing — but we can't easily re-run the module
  // code, so just leave a no-op here for now.
}

// Re-export internal helpers for cross-feature consumers.
export { logTypeForZone, decorate as decorateLog };