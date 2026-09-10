/**
 * Field formatting helpers. The generic date/page helpers are shared
 * with the farms feature; everything here is zone-specific.
 */
export {
  formatDate,
  formatRelative,
  buildPageList,
} from "@/features/farms/lib/format";

/** "18 ac" / "4,200 m²" — zone area, reusing the farm area formatter. */
export { formatArea } from "@/features/farms/lib/format";

/** "3d" / "2h" / "45d" — compact age of a timestamp (for "since" hints). */
export function formatAge(iso) {
  if (!iso) return null;
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 45) return `${days}d`;
  const months = Math.floor(days / 30);
  return `${months}mo`;
}

/** "5,400 L" — reservoir volume, thousands-separated. */
export function formatLiters(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value)))
    return null;
  return `${new Intl.NumberFormat("en-US").format(Number(value))} L`;
}

/** Title-case a snake_case lookup token ("sandy_loam" → "Sandy loam"). */
export function humanizeToken(token) {
  if (!token) return "";
  return String(token)
    .split(/[_\s]+/)
    .map((word, i) =>
      i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
    )
    .join(" ");
}
