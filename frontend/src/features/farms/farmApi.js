import { createApi } from "@reduxjs/toolkit/query/react";
import { SEED_FARMS } from "./lib/seed";

const STORAGE_KEY = "farmdeck.farms.v1";
const LATENCY_MS = 220;

const delay = (ms = LATENCY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const isBrowser = typeof window !== "undefined";

const readStore = () => {
  if (!isBrowser) return [...SEED_FARMS];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_FARMS));
      return [...SEED_FARMS];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...SEED_FARMS];
    return parsed;
  } catch {
    return [...SEED_FARMS];
  }
};

const writeStore = (farms) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(farms));
  } catch {
    // localStorage may be unavailable (private mode, quota) — silently
    // drop the write. The in-memory snapshot still reflects the change
    // for the rest of this session.
  }
};

const newId = () =>
  `farm-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const nowIso = () => new Date().toISOString();

/**
 * localStorageBaseQuery — a tiny RTK Query baseQuery for the farms
 * feature. The backend doesn't expose a farms module yet, so this
 * shim persists farms in localStorage and pretends to be a REST API.
 * Records follow the `farms` table schema in camelCase — farmTypeId,
 * name, location, latitude, longitude, totalArea, areaUnit, notes.
 * farmTypeId is a real lookup row id from /lookups/farm-types; legacy
 * demo records from earlier seeds may still carry extra display fields.
 *
 * Supported routes:
 *   GET    /farms           → list (returns { data: { farms, counts } })
 *   GET    /farms/:id       → single farm
 *   POST   /farms           → create
 *   PATCH  /farms/:id       → update
 *   DELETE /farms/:id       → remove
 *
 * All handlers simulate a small network delay so the loading skeletons
 * show naturally. Errors are shaped the same way the backend returns
 * them (`err.data.error.message`) so consumers like the toast handler
 * in pages don't need to special-case the mock.
 */
const localStorageBaseQuery = async (args) => {
  await delay();
  const farms = readStore();

  const method = (args?.method || "GET").toUpperCase();
  const rawUrl = args?.url || "";
  const url = rawUrl.replace(/^\/+/, "");
  const segments = url.split("/").filter(Boolean);

  if (method === "GET" && segments.length === 1 && segments[0] === "farms") {
    const counts = farms.reduce(
      (acc, f) => {
        acc.total += 1;
        acc[f.status] = (acc[f.status] || 0) + 1;
        return acc;
      },
      { total: 0 }
    );
    return { data: { farms, counts } };
  }

  if (
    method === "GET" &&
    segments.length === 2 &&
    segments[0] === "farms"
  ) {
    const id = segments[1];
    const farm = farms.find((f) => f.id === id);
    if (!farm) {
      return {
        error: {
          status: 404,
          data: { error: { code: "not_found", message: "Farm not found" } },
        },
      };
    }
    return { data: farm };
  }

  if (method === "POST" && segments.length === 1 && segments[0] === "farms") {
    const body = args?.body || {};
    if (!body.name || !String(body.name).trim()) {
      return {
        error: {
          status: 400,
          data: {
            error: { code: "invalid", message: "Farm name is required" },
          },
        },
      };
    }
    if (!body.farmTypeId) {
      return {
        error: {
          status: 400,
          data: {
            error: { code: "invalid", message: "Farm type is required" },
          },
        },
      };
    }
    const hasLat = body.latitude !== null && body.latitude !== undefined && body.latitude !== "";
    const hasLng = body.longitude !== null && body.longitude !== undefined && body.longitude !== "";
    if (hasLat !== hasLng) {
      return {
        error: {
          status: 400,
          data: {
            error: {
              code: "invalid",
              message: "Latitude and longitude must be set together",
            },
          },
        },
      };
    }
    const totalArea =
      body.totalArea === null || body.totalArea === undefined || body.totalArea === ""
        ? null
        : Number(body.totalArea);
    if (totalArea !== null && (Number.isNaN(totalArea) || totalArea <= 0)) {
      return {
        error: {
          status: 400,
          data: {
            error: { code: "invalid", message: "Total area must be greater than 0" },
          },
        },
      };
    }
    // Mirrors the `farms` table columns (camelCase JSON): farm_type_id,
    // name, location, latitude, longitude, total_area, area_unit, notes
    // + id / is_active / timestamps added by the "server".
    const farm = {
      id: newId(),
      farmTypeId: body.farmTypeId,
      name: String(body.name).trim(),
      location: body.location ? String(body.location).trim() : null,
      latitude: hasLat ? Number(body.latitude) : null,
      longitude: hasLng ? Number(body.longitude) : null,
      totalArea,
      areaUnit: body.areaUnit || "sq_m",
      notes: body.notes ? String(body.notes).trim() : null,
      isActive: true,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    const next = [farm, ...farms];
    writeStore(next);
    return { data: farm };
  }

  if (
    method === "PATCH" &&
    segments.length === 2 &&
    segments[0] === "farms"
  ) {
    const id = segments[1];
    const idx = farms.findIndex((f) => f.id === id);
    if (idx === -1) {
      return {
        error: {
          status: 404,
          data: { error: { code: "not_found", message: "Farm not found" } },
        },
      };
    }
    const patch = args?.body || {};
    // The form always submits the full camelCase payload, so a plain
    // merge keeps any legacy fields on older mock records intact while
    // numeric/optional fields are normalised to the new schema.
    const numberOrNull = (value, fallback) => {
      if (value === undefined) return fallback;
      if (value === null || value === "") return null;
      const n = Number(value);
      return Number.isNaN(n) ? fallback : n;
    };
    const updated = {
      ...farms[idx],
      ...patch,
      name:
        patch.name !== undefined ? String(patch.name).trim() : farms[idx].name,
      location:
        patch.location !== undefined
          ? patch.location
            ? String(patch.location).trim()
            : null
          : farms[idx].location,
      notes:
        patch.notes !== undefined
          ? patch.notes
            ? String(patch.notes).trim()
            : null
          : farms[idx].notes,
      latitude: numberOrNull(patch.latitude, farms[idx].latitude),
      longitude: numberOrNull(patch.longitude, farms[idx].longitude),
      totalArea: numberOrNull(patch.totalArea, farms[idx].totalArea),
      areaUnit: patch.areaUnit || farms[idx].areaUnit || "sq_m",
      updatedAt: nowIso(),
    };
    const next = [...farms];
    next[idx] = updated;
    writeStore(next);
    return { data: updated };
  }

  if (
    method === "DELETE" &&
    segments.length === 2 &&
    segments[0] === "farms"
  ) {
    const id = segments[1];
    const next = farms.filter((f) => f.id !== id);
    if (next.length === farms.length) {
      return {
        error: {
          status: 404,
          data: { error: { code: "not_found", message: "Farm not found" } },
        },
      };
    }
    writeStore(next);
    return { data: { id } };
  }

  return {
    error: {
      status: 404,
      data: {
        error: { code: "not_found", message: "Unknown farm route" },
      },
    },
  };
};

/**
 * Reset the mock store back to the seed data — handy for development and
 * debugging. Not exported via the API surface; tests / devtools only.
 */
export const __resetFarmStore = () => {
  if (!isBrowser) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    writeStore([...SEED_FARMS]);
  } catch {
    /* noop */
  }
};

export const farmApi = createApi({
  reducerPath: "farmApi",
  baseQuery: localStorageBaseQuery,
  tagTypes: ["Farm"],
  endpoints: (builder) => ({
    listFarms: builder.query({
      query: () => ({ url: "/farms", method: "GET" }),
      transformResponse: (response) => response,
      providesTags: ["Farm"],
    }),

    getFarm: builder.query({
      query: (id) => ({ url: `/farms/${id}`, method: "GET" }),
      providesTags: (_result, _err, id) => [{ type: "Farm", id }],
    }),

    createFarm: builder.mutation({
      query: (farm) => ({
        url: "/farms",
        method: "POST",
        body: farm,
      }),
      invalidatesTags: ["Farm"],
    }),

    updateFarm: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/farms/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        "Farm",
        { type: "Farm", id },
      ],
    }),

    deleteFarm: builder.mutation({
      query: (id) => ({ url: `/farms/${id}`, method: "DELETE" }),
      invalidatesTags: ["Farm"],
    }),
  }),
});

export const {
  useListFarmsQuery,
  useGetFarmQuery,
  useCreateFarmMutation,
  useUpdateFarmMutation,
  useDeleteFarmMutation,
} = farmApi;
