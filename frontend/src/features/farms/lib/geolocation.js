/**
 * Thin promise wrapper around the browser Geolocation API for the farm
 * form's "use my current location" action.
 *
 * Follows docs/GEOLOCATION_DESIGN.md: location capture must never block
 * farm creation — every failure resolves to a friendly message the form
 * can show while the farmer keeps typing or enters a manual pin.
 */

const ERR_PERMISSION_DENIED = 1;
const ERR_POSITION_UNAVAILABLE = 2;
const ERR_TIMEOUT = 3;

const HIGH_ACCURACY_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
};

export const isGeolocationAvailable = () =>
  typeof navigator !== "undefined" && "geolocation" in navigator;

/**
 * Round to the 6 decimal places `farms.latitude/longitude NUMERIC(9,6)`
 * can store — GPS gives more precision than the column keeps.
 */
export const toCoordinate = (value) => Number(Number(value).toFixed(6));

const describeError = (code) => {
  switch (code) {
    case ERR_PERMISSION_DENIED:
      return "Location permission was denied — enter coordinates manually instead.";
    case ERR_POSITION_UNAVAILABLE:
      return "Your location could not be determined right now — try again or enter coordinates manually.";
    case ERR_TIMEOUT:
      return "Getting your location took too long — try again or enter coordinates manually.";
    default:
      return "Location is not available in this browser — enter coordinates manually.";
  }
};

/**
 * locateMe() — resolves with `{ latitude, longitude, accuracy }` (already
 * rounded to 6 dp) or rejects with an Error carrying a farmer-friendly
 * message. Options default to a fresh high-accuracy fix, which is what a
 * phone in the field gives in ~5–20 m (see the design doc).
 */
export function locateMe(options = HIGH_ACCURACY_OPTIONS) {
  return new Promise((resolve, reject) => {
    if (!isGeolocationAvailable()) {
      reject(new Error(describeError()));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: toCoordinate(position.coords.latitude),
          longitude: toCoordinate(position.coords.longitude),
          accuracy: position.coords.accuracy,
        }),
      (error) => reject(new Error(describeError(error?.code))),
      options,
    );
  });
}

/**
 * Validate one coordinate input (form value is a string; empty = unset).
 * `limit` is 90 for latitude, 180 for longitude. Mirrors the DB CHECKs
 * `farms_lat_chk` / `farms_lng_chk` plus the NUMERIC(9,6) precision.
 */
export function validateCoordinate(value, limit) {
  if (value === "" || value == null) return true;
  const n = Number(value);
  if (Number.isNaN(n)) return "Enter a number";
  const s = String(value).trim();
  if (s.includes(".") && s.split(".")[1].length > 6) {
    return "Max 6 decimal places";
  }
  if (Math.abs(n) > limit) {
    return `Must be between -${limit} and ${limit}`;
  }
  return true;
}
