import { getZoneRow, farmRows } from "@/features/fields/mock/zoneDb";

/**
 * Mock crop database — in-memory stand-in for the crops module (crop
 * cycles / plantings). Each row is ONE cycle: a crop growing in a
 * zone, from plan to harvest.
 *
 * Rules mirrored from the domain design:
 *   - The lifecycle lives here (planned → sown → growing → ready →
 *     harvested, plus failed/cancelled) — NOT on the zone.
 *   - Terminal rows are kept as history; advancing to "harvested"
 *     stamps harvestDateActual automatically.
 *   - A new crop needs an ACTIVE, non-maintenance zone (you don't sow
 *     into a broken pump); editing keeps its own zone even if the zone
 *     was since deactivated — history stays editable.
 *   - Zone joins resolve live from the zone mock, so deactivating a
 *     zone keeps its crop history readable.
 *
 * Errors are thrown as `{ status, data: { error: { message } } }` to
 * match the API envelope the app's toasts read from.
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

/* ------------------------------------------------------------------ */
/*  Crop-type lookup rows                                              */
/* ------------------------------------------------------------------ */

export const cropTypeRows = [
  { id: "ct-tomato", name: "tomato", displayName: "Tomato", description: "Staked or trellised fruiting crop — high-value greenhouse staple." },
  { id: "ct-lettuce", name: "lettuce", displayName: "Lettuce", description: "Fast leafy greens — heads or cuts, ideal for hydro rafts." },
  { id: "ct-basil", name: "basil", displayName: "Basil", description: "Aromatic herbs — pinch harvests, restaurant-ready premiums." },
  { id: "ct-pepper", name: "bell_pepper", displayName: "Bell pepper", description: "Coloured block peppers on the high-wire — long season crop." },
  { id: "ct-carrot", name: "carrot", displayName: "Carrot", description: "Direct-sown roots — loose soil, steady water, sweet harvest." },
  { id: "ct-apple", name: "apple", displayName: "Apple", description: "Permanent orchard blocks — blossoms, thinning, then bins." },
  { id: "ct-berries", name: "berries", displayName: "Berries", description: "Trailing canes on trellises — u-pick and fresh market." },
  { id: "ct-mushroom", name: "mushroom", displayName: "Mushroom", description: "Oyster, lion's mane, shiitake — humidity and CO₂ managed." },
  { id: "ct-micro", name: "microgreens", displayName: "Microgreens", description: "Tray-grown shoots — the fastest cash crop in the book." },
];

const findCropType = (id) => cropTypeRows.find((t) => t.id === id);
const farmNameOf = (farmId) =>
  farmRows.find((f) => f.id === farmId)?.name ?? null;

/* ------------------------------------------------------------------ */
/*  Crop cycles                                                        */
/* ------------------------------------------------------------------ */

let cropRows = [
  {
    id: "crop-beefsteak",
    zoneId: "zone-beefsteak-1",
    cropTypeId: "ct-tomato",
    variety: "Trust",
    status: "growing",
    sowDatePlanned: daysAgo(46),
    sowDateActual: daysAgo(45),
    harvestDateExpected: daysAhead(40),
    harvestDateActual: null,
    quantity: 220,
    quantityUnit: "plants",
    notes: "Lowered the first trusses; de-leafing every Friday.",
    createdAt: daysAgo(50),
    updatedAt: hoursAgo(6),
  },
  {
    id: "crop-cucumber",
    zoneId: "zone-cucumber-east",
    cropTypeId: "ct-pepper",
    variety: "Corinto",
    status: "harvest_ready",
    sowDatePlanned: daysAgo(64),
    sowDateActual: daysAgo(62),
    harvestDateExpected: daysAhead(3),
    harvestDateActual: null,
    quantity: 120,
    quantityUnit: "plants",
    notes: "First pick scheduled with the restaurant orders.",
    createdAt: daysAgo(66),
    updatedAt: daysAgo(1),
  },
  {
    id: "crop-butterhead",
    zoneId: "zone-tilapia-raceways",
    cropTypeId: "ct-lettuce",
    variety: "Rex",
    status: "planned",
    sowDatePlanned: daysAhead(7),
    sowDateActual: null,
    harvestDateExpected: daysAhead(42),
    harvestDateActual: null,
    quantity: 480,
    quantityUnit: "plants",
    notes: "Follows the mizuna once the biofilter settles.",
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
  {
    id: "crop-mizuna",
    zoneId: "zone-tilapia-raceways",
    cropTypeId: "ct-lettuce",
    variety: "Mizuna",
    status: "sown",
    sowDatePlanned: daysAgo(13),
    sowDateActual: daysAgo(12),
    harvestDateExpected: daysAhead(18),
    harvestDateActual: null,
    quantity: 240,
    quantityUnit: "plants",
    notes: "Germinated in 36h — strong run.",
    createdAt: daysAgo(15),
    updatedAt: daysAgo(12),
  },
  {
    id: "crop-honeycrisp",
    zoneId: "zone-honeycrisp-a",
    cropTypeId: "ct-apple",
    variety: "Honeycrisp",
    status: "growing",
    sowDatePlanned: daysAgo(4000),
    sowDateActual: daysAgo(4000),
    harvestDateExpected: daysAhead(32),
    harvestDateActual: null,
    quantity: 18,
    quantityUnit: "acres",
    notes: "Nets on before the July heat; bins ordered.",
    createdAt: daysAgo(4000),
    updatedAt: daysAgo(6),
  },
  {
    id: "crop-gala",
    zoneId: "zone-gala-b",
    cropTypeId: "ct-apple",
    variety: "Gala",
    status: "growing",
    sowDatePlanned: daysAgo(4000),
    sowDateActual: daysAgo(4000),
    harvestDateExpected: daysAhead(47),
    harvestDateActual: null,
    quantity: 14,
    quantityUnit: "acres",
    notes: "Leaf-tissue sample due with the July flush.",
    createdAt: daysAgo(4000),
    updatedAt: daysAgo(10),
  },
  {
    id: "crop-marion",
    zoneId: "zone-marion-west",
    cropTypeId: "ct-berries",
    variety: "Marion",
    status: "harvest_ready",
    sowDatePlanned: daysAgo(120),
    sowDateActual: daysAgo(118),
    harvestDateExpected: daysAhead(5),
    harvestDateActual: null,
    quantity: 7,
    quantityUnit: "acres",
    notes: "Brix at 14 — u-pick opens Saturday.",
    createdAt: daysAgo(120),
    updatedAt: hoursAgo(30),
  },
  {
    id: "crop-blueberry",
    zoneId: "zone-blueberry-east",
    cropTypeId: "ct-berries",
    variety: "Duke",
    status: "harvested",
    sowDatePlanned: daysAgo(130),
    sowDateActual: daysAgo(128),
    harvestDateExpected: daysAgo(22),
    harvestDateActual: daysAgo(20),
    quantity: 3.5,
    quantityUnit: "acres",
    notes: "2,840 lb off the Duke block — best year yet.",
    createdAt: daysAgo(130),
    updatedAt: daysAgo(20),
  },
  {
    id: "crop-basil",
    zoneId: "zone-cucumber-east",
    cropTypeId: "ct-basil",
    variety: "Genovese",
    status: "planned",
    sowDatePlanned: daysAhead(12),
    sowDateActual: null,
    harvestDateExpected: daysAhead(55),
    harvestDateActual: null,
    quantity: 96,
    quantityUnit: "plants",
    notes: "Succession crop after the Corinto peppers clear.",
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    id: "crop-oyster",
    zoneId: "zone-mushroom-1",
    cropTypeId: "ct-mushroom",
    variety: "Oyster",
    status: "failed",
    sowDatePlanned: daysAgo(210),
    sowDateActual: daysAgo(208),
    harvestDateExpected: daysAgo(190),
    harvestDateActual: null,
    quantity: 40,
    quantityUnit: "trays",
    notes: "Pins aborted in the week-2 heat wave — room retired after.",
    createdAt: daysAgo(210),
    updatedAt: daysAgo(195),
  },
  {
    id: "crop-carrots",
    zoneId: "zone-gala-b",
    cropTypeId: "ct-carrot",
    variety: "Nantes",
    status: "planned",
    sowDatePlanned: daysAhead(5),
    sowDateActual: null,
    harvestDateExpected: daysAhead(80),
    harvestDateActual: null,
    quantity: 6,
    quantityUnit: "rows",
    notes: "Alley crop between the Gala rows.",
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Join the live zone row so deactivated zones still resolve for history. */
const withFarmName = (crop) => {
  const zone = getZoneRow(crop.zoneId);
  return {
    ...crop,
    zoneName: zone?.name ?? "Unknown field",
    zoneStatus: zone?.zoneStatus ?? null,
    farmId: zone?.farmId ?? null,
    farmName: farmNameOf(zone?.farmId),
  };
};

/** Form payload → storable crop shape. */
const toStoredCrop = (input) => ({
  zoneId: input.zoneId,
  cropTypeId: input.cropTypeId,
  variety: input.variety?.trim() || null,
  status: input.status || "planned",
  sowDatePlanned: input.sowDate || null,
  harvestDateExpected: input.harvestDateExpected || null,
  quantity:
    input.quantity === null || input.quantity === undefined ||
    input.quantity === ""
      ? null
      : Number(input.quantity),
  quantityUnit: input.quantityUnit || "plants",
  notes: input.notes?.trim() || null,
});

/** Display name — "Trust Tomatoes", "Mizuna Lettuce", or just "Mushroom". */
export function cropDisplayName(crop, type) {
  const typeName = type?.displayName ?? "";
  if (crop.variety) {
    return `${crop.variety} ${typeName.toLowerCase()}`;
  }
  return typeName || "Crop";
}

const decorateCrop = (crop) => {
  const type = findCropType(crop.cropTypeId);
  return { ...withFarmName(crop), name: cropDisplayName(crop, type) };
};

/* ------------------------------------------------------------------ */
/*  Public operations                                                  */
/* ------------------------------------------------------------------ */

export async function listCrops() {
  await latency();
  return { crops: cropRows.map(decorateCrop) };
}

export async function createCrop(input) {
  await latency();
  const stored = toStoredCrop(input);

  if (!stored.zoneId) throw apiError(400, "Pick the field this crop grows in.");
  if (!stored.cropTypeId) throw apiError(400, "Pick a crop type.");

  const zone = getZoneRow(stored.zoneId);
  if (!zone) throw apiError(404, "That field no longer exists.");
  if (!zone.isActive) {
    throw apiError(400, "That field is deactivated — pick an active field.");
  }
  if (zone.zoneStatus === "maintenance") {
    throw apiError(
      400,
      `${zone.name} is under maintenance — fix it before sowing into it.`
    );
  }

  const crop = {
    id: uuid(),
    ...stored,
    sowDateActual:
      stored.status !== "planned" ? stored.sowDatePlanned : null,
    harvestDateActual:
      stored.status === "harvested" ? nowIso() : null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  cropRows = [crop, ...cropRows];
  return decorateCrop(crop);
}

export async function updateCrop({ id, ...patch }) {
  await latency();
  const index = cropRows.findIndex((c) => c.id === id);
  if (index === -1) throw apiError(404, "That crop no longer exists.");

  const previous = cropRows[index];
  const stored = toStoredCrop(patch);
  if (!stored.zoneId) throw apiError(400, "Pick the field this crop grows in.");

  // Moving to a NEW field re-runs the sowing rules; staying on your own
  // field is always allowed (history stays editable even if the field
  // was since deactivated or broke).
  if (stored.zoneId !== previous.zoneId) {
    const zone = getZoneRow(stored.zoneId);
    if (!zone) throw apiError(404, "That field no longer exists.");
    if (!zone.isActive) {
      throw apiError(400, "That field is deactivated — pick an active field.");
    }
    if (zone.zoneStatus === "maintenance") {
      throw apiError(
        400,
        `${zone.name} is under maintenance — fix it before sowing into it.`
      );
    }
  }

  // Keep the actual dates honest with the lifecycle: passing a
  // milestone stamps its date once, moving back clears it.
  const crop = {
    ...previous,
    ...stored,
    sowDateActual:
      stored.status !== "planned"
        ? previous.sowDateActual ?? stored.sowDatePlanned
        : null,
    harvestDateActual:
      stored.status === "harvested"
        ? previous.harvestDateActual ?? nowIso()
        : null,
    updatedAt: nowIso(),
  };
  cropRows[index] = crop;
  return decorateCrop(crop);
}

/** One-step happy-path advance ("Mark sown", "Complete harvest"…). */
export async function advanceCropStatus(id) {
  await latency();
  const crop = cropRows.find((c) => c.id === id);
  if (!crop) throw apiError(404, "That crop no longer exists.");

  const steps = {
    planned: "sown",
    sown: "growing",
    growing: "harvest_ready",
    harvest_ready: "harvested",
  };
  const next = steps[crop.status];
  if (!next) {
    throw apiError(400, "This crop cycle is already finished.");
  }

  crop.status = next;
  if (next === "sown") crop.sowDateActual = crop.sowDateActual ?? nowIso();
  if (next === "harvested") crop.harvestDateActual = nowIso();
  crop.updatedAt = nowIso();
  return decorateCrop(crop);
}

export async function listCropTypes() {
  await latency();
  return cropTypeRows;
}
