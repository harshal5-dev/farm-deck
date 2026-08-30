/**
 * Crop-cycle helpers — timeline math for the card's progress strip
 * and small render helpers for catalog target ranges.
 */

const DAY_MS = 86_400_000;

/**
 * Progress through one cycle, 0–1. Anchored on the seed date,
 * measured against the expected harvest date. Terminal cycles pin
 * to 1 (completed/harvested) or null (no bar for failed/cancelled
 * unless dates exist).
 */
export function cycleProgress(cycle) {
  if (!cycle) return null;
  if (cycle.status === "completed" || cycle.status === "harvested") return 1;

  const start = cycle.dateSeeded;
  const end = cycle.actualHarvestDate || cycle.expectedHarvest;
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
export function cycleDayLabel(cycle) {
  const start = cycle?.dateSeeded;
  const end = cycle?.actualHarvestDate || cycle?.expectedHarvest;
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

/**
 * Format a target range (e.g. pH 6.0–6.8, EC 1.0–1.4 mS/cm). When
 * either bound is null, the surviving side is shown alone with a
 * "≥" or "≤" hint. Returns null if neither bound is set.
 */
export function formatTargetRange(min, max, { unit = "", precision = 1 } = {}) {
  if (min == null && max == null) return null;
  const fmt = (n) => {
    if (n == null) return null;
    const isInt = Number.isInteger(Number(n));
    return isInt
      ? String(Number(n))
      : Number(n).toFixed(precision).replace(/\.?0+$/, "");
  };
  const a = fmt(min);
  const b = fmt(max);
  if (a != null && b != null) return `${a}–${b}${unit ? ` ${unit}` : ""}`;
  if (a != null) return `≥ ${a}${unit ? ` ${unit}` : ""}`;
  return `≤ ${b}${unit ? ` ${unit}` : ""}`;
}

/** Pretty pH / EC / PPM / light / days renderers — thin wrappers so
 *  card + form + identity preview use one source of truth. */
export function formatPhRange(min, max) {
  return formatTargetRange(min, max);
}
export function formatEcRange(min, max) {
  return formatTargetRange(min, max, { unit: "mS/cm", precision: 2 });
}
export function formatPpmRange(min, max) {
  return formatTargetRange(min, max, { precision: 0 });
}
export function formatLightRange(min, max) {
  return formatTargetRange(min, max, { unit: "h/day", precision: 1 });
}