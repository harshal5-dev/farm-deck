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

/**
 * Compact area formatter — 25000 → "25.0k", 800 → "800". Keeps stat tiles
 * narrow regardless of how large a farm's total area grows.
 */
export function formatArea(area) {
  if (area == null) return "—";
  if (area >= 1000) return `${(area / 1000).toFixed(1)}k`;
  return String(area);
}
