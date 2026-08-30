/**
 * Harvest formatters — yield, money and grade-share helpers shared by
 * the list page stats, the card chips and the form's live preview.
 */

/** "4.8 kg" / "850 g" — grams flip to kg at 1 kg. */
export function formatYield(grams) {
  if (grams === null || grams === undefined || grams === "") return null;
  const n = Number(grams);
  if (Number.isNaN(n)) return String(grams);
  if (n < 1000) return `${formatNumber(n)} g`;
  return `${formatNumber(n / 1000)} kg`;
}

/** Compact yield for tight chips: "4.8kg" without a space. */
export function formatYieldCompact(grams) {
  const out = formatYield(grams);
  return out ? out.replace(" ", "") : null;
}

/** "$115.20" — whole dollars drop the cents. */
export function formatMoney(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(n);
}

/** "$24.00/kg" for the price chip. */
export function formatPricePerKg(value) {
  const out = formatMoney(value);
  return out ? `${out}/kg` : null;
}

/** Live in-input conversion: 4800 g → "≈ 4.80 kg". */
export function gramsToKgHint(grams) {
  if (grams === "" || grams == null) return null;
  const n = Number(grams);
  if (Number.isNaN(n) || n <= 0) return null;
  return `≈ ${formatNumber(n / 1000)} kg`;
}

function formatNumber(n) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(n);
}
