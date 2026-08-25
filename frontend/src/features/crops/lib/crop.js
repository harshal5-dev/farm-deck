/**
 * Crop-cycle helpers — timeline math for the card's progress strip.
 */

const DAY_MS = 86_400_000;

/**
 * Progress through one cycle, 0–1. Anchored on the actual sow date
 * (falling back to the planned date), measured against the expected
 * harvest date. Terminal crops pin to 1 (harvested) or null (no bar
 * for failed/cancelled unless dates exist).
 */
export function cycleProgress(crop) {
  if (!crop) return null;
  if (crop.status === "harvested") return 1;

  const start = crop.sowDateActual || crop.sowDatePlanned;
  const end = crop.harvestDateActual || crop.harvestDateExpected;
  if (!start || !end) return null;

  const span = new Date(end) - new Date(start);
  if (span <= 0) return null;
  const done = Date.now() - new Date(start);
  return Math.min(1, Math.max(0, done / span));
}

/**
 * "Day 45 of 85" — where we are in the cycle. Null when the dates
 * aren't known.
 */
export function cycleDayLabel(crop) {
  const start = crop?.sowDateActual || crop?.sowDatePlanned;
  const end = crop?.harvestDateActual || crop?.harvestDateExpected;
  if (!start || !end) return null;
  const day = Math.floor((Date.now() - new Date(start)) / DAY_MS) + 1;
  const total = Math.max(1, Math.round((new Date(end) - new Date(start)) / DAY_MS));
  return `Day ${Math.max(0, day)} of ${total}`;
}

/** "in 5 days" / "3 days ago" — relative day phrasing for date chips. */
export function relativeDays(iso) {
  if (!iso) return null;
  const diff = Math.round(
    (new Date(iso).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) /
      DAY_MS
  );
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  if (diff === -1) return "yesterday";
  if (diff > 0) return `in ${diff} days`;
  return `${-diff} days ago`;
}
