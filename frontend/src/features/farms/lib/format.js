import { getAreaUnitLabel } from "@/constants/farms";

/** Format an ISO date as e.g. "Mar 12, 2024". Returns "—" for empty/invalid input. */
export function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

/** Human "x ago" relative time, falling back to an absolute date. */
export function formatRelative(iso) {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = now - then;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

/** Format a number with thousands separators. */
export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US").format(value);
}

/** Format an acres value — one decimal place when needed, integer when whole. */
export function formatAcres(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  if (n === 0) return "0";
  return n % 1 === 0 ? `${n}` : n.toFixed(1);
}

/** "12.5 ac" / "2 ha" — value + normalised unit label, "—" when unset. */
export function formatArea(value, unit) {
  if (value === null || value === undefined || value === "") return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  return `${formatAcres(n)} ${getAreaUnitLabel(unit)}`.trim();
}

/** "18.52, 73.86" — null when the farm has no pin. `precision` in decimals. */
export function formatCoords(latitude, longitude, precision = 4) {
  const hasLat = latitude !== null && latitude !== undefined;
  const hasLng = longitude !== null && longitude !== undefined;
  if (!hasLat || !hasLng) return null;
  return `${Number(latitude).toFixed(precision)}, ${Number(longitude).toFixed(precision)}`;
}

/** Build the page-number list with ellipses, e.g. [1, "...", 4, 5, "...", 9]. */
export function buildPageList(current, totalPages) {
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = new Set([1, totalPages, current, current - 1, current + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);
  const result = [];
  sorted.forEach((p, i) => {
    result.push(p);
    const next = sorted[i + 1];
    if (next && next - p > 1) result.push("...");
  });
  return result;
}
