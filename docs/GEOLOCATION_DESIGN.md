# FarmDeck — Farm Location Capture Design

> **Repo:** `farm-deck` (this repository)
> **Version:** v1.1 · **Date:** Aug 2026 · **Status:** Decided — Phase 1 shipped, map picker ready to implement
> **Companions:** `backend/db/migrations/000001_init_schema.up.sql` (§ `farms` table) · `frontend/src/features/farms/lib/geolocation.js` (Phase-1 GPS helper)
> **Purpose of this document:** a **self-contained** record of how the app captures a farm's
> geographic location — the decision, the UX, the exact code, and the traps. Written so a
> fresh session (or future-you) can implement it with no other context.

---

## 0. TL;DR — the decision

**Farmers never type coordinates.** Location is captured through an **interactive map picker**
in the farm-create/edit form, backed by three free, keyless services:

| Concern | Choice |
|---|---|
| Map engine | **Leaflet** (BSD, free) via **react-leaflet v5** (MIT — the React 19 wrapper; this project is on React 19) |
| Street tiles | **OpenStreetMap** raster tiles (free, attribution required) |
| Satellite tiles | **Esri World Imagery** (free w/ attribution) — default view; farmers recognize their own land |
| Place-name search | **Open-Meteo Geocoding API** (free, keyless, CORS-enabled, same provider as our weather) |
| GPS capture | Browser **Geolocation API** — **✅ shipped** as the "Use my location" button on the map |
| Manual lat/lng entry | **✅ shipped** — collapsed "enter coordinates manually" advanced fallback in `LocationSection` |
| API changes needed | **None.** `POST /farms` / `PATCH /farms/{id}` already accept optional `latitude`/`longitude` (see §7 for the current mock phase) |
| Schema changes needed | **One CHECK** — lat/lng must be both-set or both-NULL (§2) |

No API keys, no billing accounts, no vendor lock.

### Phase status in this repo

| Phase | Scope | Status |
|---|---|---|
| **1 — GPS + manual entry** | GPS button, paired lat/lng inputs, both-or-neither validation (`lib/geolocation.js`) | ✅ Shipped |
| **2 — Map picker** | Leaflet `LocationPicker` — satellite/street tiles, tap-to-place, draggable pin, GPS, clear (`components/farm-form/LocationPicker.jsx`) | ✅ Shipped |
| **3 — Place search** | Open-Meteo geocoding search box overlaid on the map (`lib/geocode.js`) | ✅ Shipped |
| **4 — Backend farms module** | Real `POST/PATCH /farms` (camelCase JSON) replacing the redux/localStorage mock | ☐ Backend work |

> Manual coordinate entry now lives in `LocationSection`'s collapsed
> "advanced" fallback, as this doc always intended.

> **Current data layer:** farms still live in the frontend mock
> (`frontend/src/features/farms/farmApi.js` — RTK Query over localStorage). The mock
> already stores the final payload shape in camelCase — `farmTypeId`, `name`, `location`,
> `latitude`, `longitude`, `totalArea`, `areaUnit`, `notes` — and enforces the same
> validation rules described here, so swapping in the real API later is a baseQuery change,
> not a form rewrite.

---

## 1. The problem

The `farms` table stores `latitude`/`longitude` (in `000001_init_schema.up.sql`) for one
downstream purpose: the planned `GET /farms/{id}/weather` endpoint will round them to
3 decimals (~111 m) and key an Open-Meteo forecast cache. Without coordinates the weather
card silently degrades to `{ weather: null }`.

The catch: **no farmer knows their land as decimal numbers.** They know an address, a
village name, or "2 km past the temple". The schema already reflects this split:

- `location VARCHAR(255)` — the *human* description (free text: "Warehouse near the highway")
- `latitude`/`longitude NUMERIC(9,6)` — the *machine* coordinates (never the primary input)

So the entire problem is UX: get accurate coordinates into the DB **without the farmer ever
seeing a number**. Location stays **optional** (missing location = no weather card, nothing
else breaks) but the form actively nudges for it.

---

## 2. Schema refinement (apply with the backend farms module)

Current CHECKs validate each coordinate's range independently (`farms_lat_chk`,
`farms_lng_chk`); nothing prevents a half-coordinate (latitude set, longitude NULL), which
is meaningless and silently breaks weather lookups. Add to `farms`:

```sql
CONSTRAINT farms_latlng_pair_chk
    CHECK ((latitude IS NULL AND longitude IS NULL)
        OR (latitude IS NOT NULL AND longitude IS NOT NULL))
```

Both-or-neither. Ship it as migration `000004_farms_latlng_pair.up.sql` (000001–000003
already exist). No other schema change is required.

The frontend already mirrors this rule in two places: `FarmForm`'s submit guard and the
mock API's 400 response (`"Latitude and longitude must be set together"`).

---

## 3. Mental model — how web maps work (why the pieces are what they are)

A web map is **not one big image**. It's a grid of small square images (**tiles**, typically
256×256 px) fetched over HTTPS and stitched by JavaScript:

```
┌──────┬──────┬──────┐
│ tile │ tile │ tile │   each square = one request like
├──────┼──────┼──────┤   https://tile.openstreetmap.org/12/2043/1344.png
│ tile │ tile │ tile │                      zoom / x  / y
├──────┼──────┼──────┤
│ tile │ tile │ tile │
└──────┴──────┴──────┘
```

- **Pan** → fetch tiles for newly visible squares. **Zoom** → a different tile set per level.
- A **tile server** serves the images; a **map library** does the math (which tiles, where,
  and converting a click into lat/lng).

That's the whole model. Leaflet = the library. OSM/Esri = the tile servers.

---

## 4. The pieces — licenses and costs

| Piece | Role | License / cost | Key? | Fine print |
|---|---|---|---|---|
| **Leaflet 1.9.x** | JS map engine (pan/zoom/clicks→lat-lng) | BSD — free forever, commercial OK | No | ~40 KB |
| **react-leaflet v5** | Official React wrapper (JSX components) | MIT — free | No | **v5 = React 19 (this project); v4 is the React 18 line** |
| **OpenStreetMap tiles** | street-map imagery | Free, fair use | No | Must display "© OpenStreetMap contributors"; light/moderate use — fine for a map that appears only on the farm form |
| **Esri World Imagery** | global satellite imagery | Free with attribution | No | Credit "Esri, Maxar, Earthstar Geographics"; light use |
| **Open-Meteo Geocoding** | village-name → coordinates search | Free (non-commercial) | No | Same project as our weather; commercial-at-volume needs their cheap paid tier |
| Browser Geolocation API | GPS fix | Free | No | Requires user permission + HTTPS (localhost counts as secure) |

**Rejected alternatives** (and why):

| Alternative | Why rejected |
|---|---|
| Google Maps / Mapbox | API key + billing card required even for the "free" tier — violates the no-keys/no-accounts constraint |
| Manual lat/lng entry as the only input | Farmers don't know coordinates; guarantees bad or missing data (acceptable only as the Phase-1 stopgap, which is why Phase 2 exists) |
| Nominatim (OSM) for search | Free & keyless but 1 req/s policy + User-Agent rules make browser-direct calls awkward; viable later **proxied through the Go API** if we want reverse geocoding (pin → place-name label) |
| No location at all | Loses the weather feature entirely — the dashboard's most visible integration |

---

## 5. The UX flow (what the farmer experiences)

In the **add-farm** (and edit-farm) form, after the name/type fields:

1. **`location` text field** — free text, human description. Optional.
2. **Location card** with an embedded map (satellite view by default):
   - **Search box**: type "Talegaon" → dropdown of matches (Open-Meteo geocoding) → picking one centers the map and drops the pin.
   - **Tap the map**: pin drops where tapped.
   - **Drag the pin**: fine-tune onto the exact plot.
   - **"Use my current location"** button *(already shipped)*: browser GPS fills the pin (best on a phone, standing in the field; accuracy typically 5–20 m).
   - **Street ⇄ Satellite toggle** (two TileLayers, one renders).
   - **Collapsed "enter coordinates manually"** — advanced fallback only once the map exists (today it is the visible pair of inputs).
3. On save: `POST /farms` with `latitude`/`longitude` from the pin (silently) + the `location` text. The farmer never sees or types a number.
4. **Display rule**: never render coordinates back to the farmer. The form's identity preview shows only a **Pinned / No pin** state; the future farm page shows the pin on a mini-map + their own `location` text (reverse-geocoded place label is a Phase-3+ nicety via server-proxied Nominatim).

**Degradation philosophy**: geocoder unreachable → search box shows "search unavailable —
drop a pin instead"; tiles slow → map still renders, tiles stream in; everything fails →
manual entry still works. **Location capture never blocks farm creation.** (Phase 1 already
follows this: GPS errors render as an amber hint while the form stays submittable.)

---

## 6. Implementation (Phase 2–3)

### 6.1 Install

```bash
npm add leaflet react-leaflet        # react-leaflet v5 for React 19
npm add -D @types/leaflet            # JSDoc/IDE hints — project is JS, types are dev-only
```

### 6.2 The global Leaflet fix (do once, app bootstrap)

Vite's bundling breaks Leaflet's default marker-icon image paths — the red pin 404s.
Fix once in `main.jsx` (or a `leaflet-setup.js` imported there):

```js
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});
```

### 6.3 Geocode client (SPA-direct; Open-Meteo is CORS-enabled)

```js
// frontend/src/features/farms/lib/geocode.js
export async function searchPlaces(q) {
  if (q.trim().length < 3) return [];
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`
  );
  if (!res.ok) return []; // degrade: caller shows "search unavailable"
  const data = await res.json();
  return data.results ?? []; // [{ name, latitude, longitude, country, admin1 }]
}
```

### 6.4 `LocationPicker` component (complete)

Drops into the farm form where `CoordinatesField`'s manual inputs sit today — same
contract (`{ latitude, longitude }` both-or-neither, `onChange`), so `FarmForm` barely
changes. GPS logic is reused verbatim from `lib/geolocation.js` (`locateMe()`).

```jsx
// frontend/src/features/farms/components/farm-form/LocationPicker.jsx
import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // REQUIRED — else tiles render scrambled
import { locateMe } from "../../lib/geolocation";

function ClickCapture({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ latitude: e.latlng.lat, longitude: e.latlng.lng });
    },
  });
  return null;
}

export default function LocationPicker({ value, onChange, disabled = false }) {
  const [satellite, setSatellite] = useState(true);
  const center = value
    ? [value.latitude, value.longitude]
    : [19.07, 72.87]; // default viewport; refine after search

  const handleLocate = async () => {
    try {
      const pos = await locateMe();
      onChange({ latitude: pos.latitude, longitude: pos.longitude });
    } catch {
      /* friendly hint already handled like CoordinatesField does */
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button type="button" onClick={() => setSatellite((s) => !s)}>
          {satellite ? "Street view" : "Satellite view"}
        </button>
        <button type="button" onClick={handleLocate} disabled={disabled}>
          Use my current location
        </button>
        {value && (
          <button type="button" onClick={() => onChange(null)}>
            Clear
          </button>
        )}
      </div>

      <MapContainer center={center} zoom={15} style={{ height: 320 /* REQUIRED — else 0px */ }}>
        {satellite ? (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Esri, Maxar, Earthstar Geographics"
          />
        ) : (
          <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
        )}
        <ClickCapture onPick={onChange} />
        {value && (
          <Marker
            position={[value.latitude, value.longitude]}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const ll = e.target.getLatLng();
                onChange({ latitude: ll.lat, longitude: ll.lng });
              },
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
```

> ⚠️ Esri's URL is `{z}/{y}/{x}` (y before x); OSM's is `{z}/{x}/{y}`. Swapping them
> fails silently with misplaced tiles.

### 6.5 Search box wiring (inside the farm form)

```jsx
// sketch — combobox backed by searchPlaces()
const [query, setQuery] = useState("");
const [results, setResults] = useState([]);

// on input (debounced ~300ms):
searchPlaces(query).then(setResults).catch(() => setResults([]));

// on selecting a result:
onChange({ latitude: p.latitude, longitude: p.longitude }); // → LocationPicker value
```

If Open-Meteo returns `[]` or throws, show "search unavailable — drop a pin on the map
instead". A plain shadcn-style `Select`/popover list fits the project's UI kit.

### 6.6 On submit

```js
// form payload — camelCase JSON, matching the backend's DTO convention
// (see lookup_dtos.go: json:"displayName") — coordinates ride along silently
await createFarm({
  farmTypeId, // UUID from /lookups/farm-types
  name,
  location: locationText || null, // human description, optional
  latitude: coords?.latitude ?? null, // both-or-neither (§2 CHECK)
  longitude: coords?.longitude ?? null,
  totalArea: totalAreaValue ?? null,
  areaUnit, // 'sq_m' | 'hectare' | 'acre' | …
  notes: notesText || null,
});
```

Edit flow is identical via `PATCH /farms/{id}` — "create now, add the pin later" already
works. This is exactly what `FarmForm.submit()` builds today.

---

## 7. API & data flow impact

**No new endpoints.** The end-to-end flow once the backend farms module lands:

```
farmer taps/drags pin (Leaflet) → SPA form state { latitude, longitude }
  → POST/PATCH /farms (optional fields; both-or-neither CHECK)
  → GET /farms/{id}/weather (planned)
      → farm lat/lng rounded to 3dp (~111 m) → weather cache key
      → miss → Open-Meteo forecast → cache 30 min
      → cache/payload never shown as coordinates in UI
```

Missing location → weather endpoint returns `{ weather: null }` → dashboard hides the card.
Nothing else reads these columns today.

> **Mock phase note:** until the Go farms module exists, `farmApi.js` intercepts these
> calls with the localStorage shim and applies the same rules (required name/farmTypeId,
> both-or-neither coordinates, `totalArea > 0`). The `farms` table DDL it mirrors lives in
> `backend/db/migrations/000001_init_schema.up.sql`.

---

## 8. First-time gotchas (checklist before review)

- [ ] `import "leaflet/dist/leaflet.css"` present — else tiles render scrambled (the #1 bug).
- [ ] Map container has an explicit `height` — else the div collapses to 0px, blank box.
- [ ] Marker-icon fix (§6.2) applied at bootstrap — else the pin 404s under Vite.
- [ ] If the map ever sits inside a shadcn `<Dialog>`: z-index conflict — add
      `.leaflet-pane { z-index: 400 !important; }`-style CSS, or keep the picker on the
      page (simpler — the form is a full page, not a dialog, so this doesn't apply today).
- [ ] Esri `{z}/{y}/{x}` vs OSM `{z}/{x}/{y}` ordering.
- [ ] Attribution lines visible for whichever tile layer is active (Leaflet's attribution
      control handles rendering — just pass the strings).
- [ ] Tiles are lazy: zero network requests until the map mounts; other pages pay nothing.
- [ ] Geolocation needs a secure context — `localhost` counts, plain-HTTP LAN IPs don't
      (the Phase-1 button already disables itself with a tooltip when unavailable).

---

## 9. Definition of Done

- [ ] `000004_farms_latlng_pair` migration added; up/down clean.
- [ ] `LocationPicker` renders satellite-by-default with street toggle, tap-to-place, draggable pin, GPS button, clear button.
- [ ] Geocode search (debounced) with results dropdown; selecting a result centers map + drops pin.
- [ ] Geocoder failure degrades to "drop a pin" — never blocks form submission.
- [ ] Farm create + edit flows save both-or-neither coordinates; API rejects half-coordinate with 400/422 (map the CHECK violation).
- [ ] No raw coordinates rendered anywhere in normal UX (advanced entry is collapsed).
- [ ] Weather card appears once coordinates are set; hidden when not (when weather ships).
- [ ] `npm run build` and `npm run lint` clean in `frontend/`.

---

## 10. Scale path (when "free" would stop being free)

Only at real volume, and all fixes are URL swaps, not redesigns:

- **Tiles**: if OSM/Esri fair use is ever a concern, switch to a commercial provider
  (MapTiler / Stadia — free tiers, key required) or self-host (Protomaps). One line per `TileLayer`.
- **Geocoding**: Open-Meteo needs a cheap paid key for commercial-at-volume; or proxy
  Nominatim through the Go API (also unlocks reverse geocoding for place labels), shaped
  exactly like the existing lookup module.
- **Later niceties** (deferred): reverse-geocoded place label under the pin; polygon
  boundary drawing per zone (Leaflet.draw / turf) feeding a future `boundary_geojson`
  column.
