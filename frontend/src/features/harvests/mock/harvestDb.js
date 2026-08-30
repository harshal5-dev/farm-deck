import { getZoneRow, farmRows } from "@/features/fields/mock/zoneDb";
import { findCrop, findCycle } from "@/features/crops/mock/cropDb";

/**
 * Mock harvest database — rows for the `harvests` table. Each row is
 * one harvest off one cycle; `total_revenue` is service-computed
 * (yield_kg × sold_price_per_kg) exactly as the backend recomputes it
 * on create/edit, never accepted from the client.
 *
 * Schema-driven validations mirror the CHECK constraints:
 *   total_yield_grams  > 0
 *   quality_grade      ∈ {A, B, C} | null
 *   sold_price_per_kg  ≥ 0 | null
 *   total_revenue      ≥ 0 | null (computed, never trusted from input)
 *
 * Errors are thrown as `{ status, data: { error: { message } } }` to
 * match the API envelope the app's toasts already read from.
 */

const uuid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `hv-${Math.random().toString(36).slice(2, 11)}`;

const daysAgo = (n) =>
  new Date(Date.now() - n * 86_400_000).toISOString().slice(0, 10);

const apiError = (status, message) => ({
  status,
  data: { error: { message } },
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const latency = () => sleep(220 + Math.random() * 380);
const nowIso = () => new Date().toISOString();

const round2 = (n) => Math.round(n * 100) / 100;

/** Service-side revenue computation — mirrors the backend rule:
 *  revenue = (grams / 1000) × price, null when no price is set. */
export function computeRevenue(totalYieldGrams, soldPricePerKg) {
  if (soldPricePerKg == null || totalYieldGrams == null) return null;
  return round2((Number(totalYieldGrams) / 1000) * Number(soldPricePerKg));
}

/* ------------------------------------------------------------------ */
/*  Seed data                                                          */
/* ------------------------------------------------------------------ */

let harvestRows = [
  {
    id: "hv-microgreens-cut2",
    cycleId: "cyc-microgreens",
    harvestDate: daysAgo(1),
    totalYieldGrams: 4800,
    qualityGrade: "A",
    soldPricePerKg: 24,
    totalRevenue: 115.2,
    notes: "Cut at cotyledon — 48 trays delivered to the Saturday restaurant run.",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "hv-microgreens-cut1",
    cycleId: "cyc-microgreens",
    harvestDate: daysAgo(4),
    totalYieldGrams: 2650,
    qualityGrade: "B",
    soldPricePerKg: 22,
    totalRevenue: 58.3,
    notes: "First cut — slightly uneven germination on the east trays.",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "hv-beefsteak-pick1",
    cycleId: "cyc-beefsteak",
    harvestDate: daysAgo(2),
    totalYieldGrams: 12500,
    qualityGrade: "A",
    soldPricePerKg: 6.5,
    totalRevenue: 81.25,
    notes: "First truss pick — fruit firm, no splitting after the rain.",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: "hv-oyster-salvage",
    cycleId: "cyc-oyster",
    harvestDate: daysAgo(10),
    totalYieldGrams: 5400,
    qualityGrade: "C",
    soldPricePerKg: 14,
    totalRevenue: 75.6,
    notes: "Salvage cut before the green-mold contamination spread; sold to the processor.",
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

/* ------------------------------------------------------------------ */
/*  Decorators                                                         */
/* ------------------------------------------------------------------ */

const decorate = (harvest) => {
  const cycle = findCycle(harvest.cycleId);
  const zone = cycle ? getZoneRow(cycle.zoneId) : null;
  const crop = cycle ? findCrop(cycle.cropId) : null;
  return {
    ...harvest,
    cycle,
    zone,
    crop,
    cycleName: cycle?.name ?? "Unknown cycle",
    cropName: crop?.name ?? "Crop",
    cropCategory: crop?.category ?? null,
    zoneName: zone?.name ?? "Unknown field",
    farmName: zone
      ? farmRows.find((f) => f.id === zone.farmId)?.name ?? null
      : null,
  };
};

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

const VALID_GRADES = ["A", "B", "C"];
const NOTES_MAX = 1000;
const MAX_YIELD_GRAMS = 10_000_000; // NUMERIC(12,2) practical ceiling
const MAX_PRICE = 100_000;

const numOrNull = (v) => {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};
const trimOrNull = (v) => {
  const s = v == null ? null : String(v).trim();
  return s ? s : null;
};

function validatePayload(input) {
  if (!input.cycleId) {
    throw apiError(400, "Pick the cycle this harvest came off.");
  }
  const cycle = findCycle(input.cycleId);
  if (!cycle) {
    throw apiError(404, "That cycle no longer exists.");
  }
  // A planned cycle hasn't grown anything yet — nothing to harvest.
  if (cycle.status === "planned") {
    throw apiError(
      400,
      "This cycle is still planned — start seeding before logging a harvest."
    );
  }

  if (!input.harvestDate) {
    throw apiError(400, "Pick the harvest date.");
  }

  // Yield — NOT NULL and strictly positive per `total_yield_grams`.
  const yieldG = numOrNull(input.totalYieldGrams);
  if (yieldG == null) {
    throw apiError(400, "Enter the total yield for this harvest.");
  }
  if (yieldG <= 0) {
    throw apiError(400, "Total yield must be greater than 0.");
  }
  if (yieldG > MAX_YIELD_GRAMS) {
    throw apiError(400, "Total yield is unrealistically large.");
  }

  // Grade — nullable enum per `harvest_grade_chk`.
  const grade = trimOrNull(input.qualityGrade);
  if (grade != null && !VALID_GRADES.includes(grade)) {
    throw apiError(400, "Quality grade must be A, B, or C.");
  }

  // Price — nullable, ≥ 0 per `harvest_price_chk`.
  const price = numOrNull(input.soldPricePerKg);
  if (price != null && price < 0) {
    throw apiError(400, "Sold price per kg must be ≥ 0.");
  }
  if (price != null && price > MAX_PRICE) {
    throw apiError(400, "Sold price per kg is unrealistically large.");
  }

  const notes = trimOrNull(input.notes);
  if (notes && notes.length > NOTES_MAX) {
    throw apiError(400, "Notes are too long (max 1000 characters).");
  }

  return {
    cycleId: input.cycleId,
    harvestDate: input.harvestDate,
    totalYieldGrams: yieldG,
    qualityGrade: grade,
    soldPricePerKg: price,
    totalRevenue: computeRevenue(yieldG, price),
    notes,
  };
}

/* ------------------------------------------------------------------ */
/*  Public operations                                                  */
/* ------------------------------------------------------------------ */

export async function listHarvests({ cycleId } = {}) {
  await latency();
  const all = cycleId
    ? harvestRows.filter((h) => h.cycleId === cycleId)
    : harvestRows;
  // Newest first.
  const sorted = [...all].sort((a, b) =>
    a.harvestDate < b.harvestDate ? 1 : a.harvestDate > b.harvestDate ? -1 : 0
  );
  return { harvests: sorted.map(decorate) };
}

export async function getHarvest(id) {
  await latency();
  const harvest = harvestRows.find((h) => h.id === id);
  if (!harvest) throw apiError(404, "That harvest no longer exists.");
  return decorate(harvest);
}

export async function createHarvest(input) {
  await latency();
  const stored = validatePayload(input);
  const harvest = {
    id: uuid(),
    ...stored,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  harvestRows = [harvest, ...harvestRows];
  return decorate(harvest);
}

export async function updateHarvest({ id, ...patch }) {
  await latency();
  const index = harvestRows.findIndex((h) => h.id === id);
  if (index === -1) throw apiError(404, "That harvest no longer exists.");
  const previous = harvestRows[index];
  const stored = validatePayload({ ...previous, ...patch });
  harvestRows[index] = { ...previous, ...stored, updatedAt: nowIso() };
  return decorate(harvestRows[index]);
}

export async function deleteHarvest(id) {
  await latency();
  const index = harvestRows.findIndex((h) => h.id === id);
  if (index === -1) throw apiError(404, "That harvest no longer exists.");
  const [removed] = harvestRows.splice(index, 1);
  return decorate(removed);
}

/** Synchronous lookups for cross-feature consumers (cycle cards). */
export function getHarvestsForCycle(cycleId) {
  return harvestRows
    .filter((h) => h.cycleId === cycleId)
    .sort((a, b) => (a.harvestDate < b.harvestDate ? 1 : -1));
}
