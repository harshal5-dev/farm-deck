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
    if (!body.farmType) {
      return {
        error: {
          status: 400,
          data: {
            error: { code: "invalid", message: "Farm type is required" },
          },
        },
      };
    }
    const farm = {
      id: newId(),
      name: String(body.name).trim(),
      farmType: body.farmType,
      location: (body.location || "").trim(),
      sizeAcres: Number(body.sizeAcres) || 0,
      soilType: body.soilType || "loam",
      description: (body.description || "").trim(),
      establishedAt: body.establishedAt || null,
      status: body.status || "active",
      managerName: (body.managerName || "").trim(),
      fieldsCount: Number(body.fieldsCount) || 0,
      cropsCount: Number(body.cropsCount) || 0,
      yieldKg: Number(body.yieldKg) || 0,
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
    const updated = {
      ...farms[idx],
      ...patch,
      sizeAcres:
        patch.sizeAcres !== undefined
          ? Number(patch.sizeAcres) || 0
          : farms[idx].sizeAcres,
      fieldsCount:
        patch.fieldsCount !== undefined
          ? Number(patch.fieldsCount) || 0
          : farms[idx].fieldsCount,
      cropsCount:
        patch.cropsCount !== undefined
          ? Number(patch.cropsCount) || 0
          : farms[idx].cropsCount,
      yieldKg:
        patch.yieldKg !== undefined
          ? Number(patch.yieldKg) || 0
          : farms[idx].yieldKg,
      name:
        patch.name !== undefined ? String(patch.name).trim() : farms[idx].name,
      location:
        patch.location !== undefined
          ? String(patch.location).trim()
          : farms[idx].location,
      managerName:
        patch.managerName !== undefined
          ? String(patch.managerName).trim()
          : farms[idx].managerName,
      description:
        patch.description !== undefined
          ? String(patch.description).trim()
          : farms[idx].description,
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
