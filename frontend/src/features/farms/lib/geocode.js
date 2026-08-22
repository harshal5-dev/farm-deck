/**
 * Open-Meteo geocoding client — free, keyless, CORS-enabled, so the SPA
 * calls it directly (docs/GEOLOCATION_DESIGN.md §6.3).
 *
 * Return contract:
 *   - query < 3 chars → []           (nothing searched yet)
 *   - service responded              → array of place results (may be [])
 *   - request failed / non-200       → null   (caller shows "search
 *                                          unavailable — drop a pin")
 * Location capture must never block farm creation.
 */
export async function searchPlaces(query, { count = 5 } = {}) {
  const q = String(query || "").trim();
  if (q.length < 3) return [];

  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        q
      )}&count=${count}&language=en&format=json`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data?.results) ? data.results : [];
  } catch {
    return null; // offline / aborted / CORS — degrade, never throw
  }
}

/** One-line label for a geocode result, e.g. "Talegaon, Maharashtra, India". */
export function formatPlace(place) {
  return [place?.name, place?.admin1, place?.country]
    .filter(Boolean)
    .join(", ");
}
