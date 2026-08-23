import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import {
  IconCurrentLocation,
  IconLoader2,
  IconMapPinOff,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  isGeolocationAvailable,
  locateMe,
  toCoordinate,
} from "../../lib/geolocation";
import { formatPlace, searchPlaces } from "../../lib/geocode";
import "../../lib/leaflet-setup";
import "leaflet/dist/leaflet.css";

/** Default viewport per the design doc — refined as soon as a pin/search lands. */
const DEFAULT_CENTER = [19.07, 72.87];

/**
 * Custom pin marker — an inline-SVG divIcon in the app's leaf palette.
 * Deliberately not an image asset: the default Leaflet marker PNGs 404
 * under bundlers (see §6.2), and an SVG can't. Rendered crisp at any
 * zoom/DPR in both light and dark themes.
 */
const pinIcon = L.divIcon({
  className: "farm-pin-icon",
  html: `
    <div style="filter:drop-shadow(0 4px 6px rgba(0,0,0,.45));line-height:0;">
      <svg width="36" height="46" viewBox="0 0 34 46" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="farmPinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#5ebf89"/>
            <stop offset="100%" stop-color="#1e7a48"/>
          </linearGradient>
        </defs>
        <path d="M17 2 C10 2 4.5 7.5 4.5 14.4 C4.5 23 15 40.5 17 43.2 C19 40.5 29.5 23 29.5 14.4 C29.5 7.5 24 2 17 2 Z"
              fill="url(#farmPinGrad)" stroke="rgba(255,255,255,0.95)" stroke-width="2"/>
        <circle cx="17" cy="14.2" r="5" fill="#fff"/>
      </svg>
    </div>`,
  iconSize: [36, 46],
  iconAnchor: [18, 44],
});

/** Captures map clicks/taps and reports them as picked coordinates. */
function ClickCapture({ onPick }) {
  useMapEvents({
    click: (e) => onPick(e.latlng),
  });
  return null;
}

/**
 * Flies the map to a pin set from OUTSIDE the map (search result, GPS).
 * Clicks and marker drags don't pass through here — the view is already
 * there, so flying would fight the user.
 */
function MapFlyer({ target }) {
  const map = useMap();
  useEffect(() => {
    if (!target) return undefined;
    map.flyTo([target.latitude, target.longitude], Math.max(map.getZoom(), 16), {
      duration: 0.8,
    });
    return undefined;
  }, [target, map]);
  return null;
}

/**
 * Re-measures the map shortly after mount. Required when the map is
 * rendered inside an animating dialog — the container is sized while
 * the open transition is still running, leaving the map blank until it
 * recomputes (docs/GEOLOCATION_DESIGN.md §8).
 */
function InvalidateSize() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 60);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

const overlayButton =
  "inline-flex h-7 items-center gap-1.5 rounded-xl border border-border/50 bg-background/90 px-2.5 text-[11px] font-semibold text-foreground shadow-lg backdrop-blur transition-colors hover:bg-background disabled:pointer-events-none disabled:opacity-50";

/**
 * LocationPicker — interactive map for the farm form
 * (docs/GEOLOCATION_DESIGN.md §5–§6).
 *
 * Satellite imagery by default (farmers recognise their own land), street
 * toggle via OSM, tap-to-place, draggable pin, GPS capture, place search
 * via Open-Meteo geocoding. Coordinates are never rendered as numbers —
 * the value is { latitude, longitude } | null and always moves as a pair.
 * Every failure degrades to "drop a pin" and never blocks the form.
 */
const LocationPicker = ({ value, onChange, onPlaceSelected, disabled = false }) => {
  const [satellite, setSatellite] = useState(true);
  const [flyTarget, setFlyTarget] = useState(null);

  // --- Place search state (debounced geocoding) ----------------------
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  const searchIdRef = useRef(0);

  // --- GPS state ------------------------------------------------------
  const gpsSupported = isGeolocationAvailable();
  const [locating, setLocating] = useState(false);
  const [gpsError, setGpsError] = useState(null);

  useEffect(() => {
    const q = query.trim();
    const timer = setTimeout(async () => {
      if (q.length < 3) {
        setResults([]);
        setSearching(false);
        setOpen(false);
        return;
      }
      const id = ++searchIdRef.current;
      setSearching(true);
      const found = await searchPlaces(q);
      if (id !== searchIdRef.current) return; // stale response — drop it
      setResults(found);
      setSearching(false);
      setOpen(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // --- Value plumbing --------------------------------------------------
  const setPin = (lat, lng, { fly = false } = {}) => {
    const next = { latitude: toCoordinate(lat), longitude: toCoordinate(lng) };
    onChange(next);
    setGpsError(null);
    if (fly) setFlyTarget(next);
  };

  const handleMapClick = (latlng) => setPin(latlng.lat, latlng.lng);

  const handleMarkerDrag = (e) => {
    const ll = e.target.getLatLng();
    setPin(ll.lat, ll.lng);
  };

  const handleSelectPlace = (place) => {
    setQuery(place?.name || "");
    setOpen(false);
    setPin(place.latitude, place.longitude, { fly: true });
    onPlaceSelected?.(place);
  };

  const handleLocate = () => {
    setGpsError(null);
    setLocating(true);
    locateMe()
      .then((pos) => setPin(pos.latitude, pos.longitude, { fly: true }))
      .catch(
        (error) =>
          setGpsError(error?.message || "Could not get your location."),
      )
      .finally(() => setLocating(false));
  };

  const handleClear = () => {
    onChange(null);
    setGpsError(null);
  };

  const center = value ? [value.latitude, value.longitude] : DEFAULT_CENTER;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 shadow-sm">
      {/* ===== The map ===== */}
      <MapContainer
        center={center}
        zoom={value ? 16 : 11}
        zoomControl={false}
        scrollWheelZoom={false}
        className="z-0 h-80 w-full"
      >
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
        <ZoomControl position="bottomleft" />
        <ClickCapture onPick={handleMapClick} />
        <MapFlyer target={flyTarget} />
        <InvalidateSize />
        {value && (
          <Marker
            position={[value.latitude, value.longitude]}
            icon={pinIcon}
            draggable
            eventHandlers={{ dragend: handleMarkerDrag }}
          />
        )}
      </MapContainer>

      {/* ===== Place search (overlaid top-left) ===== */}
      <div className="pointer-events-none absolute top-3 left-3 z-[500] w-72 max-w-[calc(100%-1.5rem)]">
        <div className="pointer-events-auto relative">
          <IconSearch
            className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.85}
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder="Search a village or town…"
            disabled={disabled}
            className="h-9 border-border/50 bg-background/90 pl-9 pr-8 text-xs shadow-lg backdrop-blur"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                setOpen(false);
              }}
              className="absolute top-1/2 right-2 inline-flex size-5 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <IconX className="size-3" strokeWidth={2} />
            </button>
          )}

          {open && (
            <div className="absolute inset-x-0 top-11 overflow-hidden rounded-xl border border-border/50 bg-background/95 shadow-xl backdrop-blur">
              {searching ? (
                <p className="flex items-center gap-2 px-3 py-2.5 text-xs text-muted-foreground">
                  <IconLoader2
                    className="size-3.5 animate-spin"
                    strokeWidth={2}
                  />
                  Searching places…
                </p>
              ) : results === null ? (
                <p className="px-3 py-2.5 text-xs text-muted-foreground">
                  Search unavailable — drop a pin on the map instead.
                </p>
              ) : results.length === 0 ? (
                <p className="px-3 py-2.5 text-xs text-muted-foreground">
                  No matches — drop a pin on the map instead.
                </p>
              ) : (
                <ul className="max-h-52 overflow-y-auto py-1">
                  {results.map((place) => (
                    <li key={`${place.id}-${place.latitude}-${place.longitude}`}>
                      <button
                        type="button"
                        // mousedown fires before the input's blur closes the list
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelectPlace(place)}
                        className="flex w-full flex-col items-start px-3 py-1.5 text-left transition-colors hover:bg-muted/70"
                      >
                        <span className="text-xs font-semibold">
                          {place.name}
                        </span>
                        <span className="truncate text-[10px] text-muted-foreground">
                          {formatPlace(place)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== Map controls (overlaid top-right) ===== */}
      <div className="absolute top-3 right-3 z-[500] flex flex-col items-end gap-1.5">
        <div className="flex overflow-hidden rounded-xl border border-border/50 bg-background/90 p-0.5 shadow-lg backdrop-blur">
          {[
            { id: true, label: "Satellite" },
            { id: false, label: "Street" },
          ].map((opt) => (
            <button
              key={String(opt.id)}
              type="button"
              disabled={disabled}
              onClick={() => setSatellite(opt.id)}
              className={cn(
                "inline-flex h-6 items-center rounded-[0.6rem] px-2 text-[10px] font-semibold transition-all",
                satellite === opt.id
                  ? "bg-foreground/90 text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleLocate}
          disabled={disabled || locating || !gpsSupported}
          title={
            gpsSupported
              ? "Drop the pin at this device's GPS position"
              : "Geolocation is not available in this browser"
          }
          className={overlayButton}
        >
          {locating ? (
            <IconLoader2 className="size-3.5 animate-spin" strokeWidth={2} />
          ) : (
            <IconCurrentLocation className="size-3.5" strokeWidth={1.85} />
          )}
          {locating ? "Locating…" : "Use my location"}
        </button>

        {value && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className={cn(overlayButton, "text-muted-foreground")}
          >
            <IconMapPinOff className="size-3.5" strokeWidth={1.85} />
            Clear pin
          </button>
        )}
      </div>

      {/* ===== GPS failure hint ===== */}
      {gpsError && (
        <p className="absolute bottom-3 left-1/2 z-[500] w-max max-w-[calc(100%-1.5rem)] -translate-x-1/2 rounded-xl border border-amber-500/30 bg-background/95 px-3 py-1.5 text-[11px] font-medium text-amber-700 shadow-lg backdrop-blur dark:text-amber-400">
          {gpsError}
        </p>
      )}
    </div>
  );
};

export default LocationPicker;
