/**
 * Daily-log formatters — relative-date phrasing and metric summary
 * helpers used by the card / list / hero chips.
 */
import { METRIC_META } from "../constants";

const DAY_MS = 86_400_000;

/** "today" / "yesterday" / "in 3 days" / "5 days ago" */
export function relativeLogDay(iso) {
  if (!iso) return "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${iso}T00:00:00`);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / DAY_MS);
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  if (diff === -1) return "yesterday";
  if (diff > 0) return `in ${diff} days`;
  return `${-diff} days ago`;
}

/** Format a single metric value to its canonical display shape. */
export function formatMetric(key, value) {
  if (value === null || value === undefined || value === "") return null;
  const meta = METRIC_META[key];
  if (!meta) return String(value);
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  const decimals = meta.decimals;
  const out = decimals === 0 ? String(Math.round(n)) : n.toFixed(decimals);
  return meta.unit ? `${out} ${meta.unit}` : out;
}

/** Which metric keys are tied to each log_type (universal keys
 *  belong to both). The form renders the right list per cycle. */
export const METRICS_BY_TYPE = {
  hydro: ["ph", "ec", "ppm", "waterTempC", "waterLevelStatus", "nutrientsAdded"],
  soil: ["ph", "ec", "soilMoisture", "airTempC", "humidityPercent", "rainfallMm", "nutrientsAdded"],
};

/** True when the metric falls inside the catalog crop's target range.
 *  Used by the card / list to highlight readings that drift. */
export function isMetricInRange(key, value, crop) {
  if (value == null) return null;
  if (!crop) return null;
  const map = {
    ph: [crop.targetPhMin, crop.targetPhMax],
    ec: [crop.targetEcMin, crop.targetEcMax],
    ppm: [crop.targetPpmMin, crop.targetPpmMax],
  };
  const [min, max] = map[key];
  if (min == null && max == null) return null;
  const n = Number(value);
  if (Number.isNaN(n)) return null;
  if (min != null && n < min) return false;
  if (max != null && n > max) return false;
  return true;
}