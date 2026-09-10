import { createApi } from "@reduxjs/toolkit/query/react";
import * as zoneDb from "./mock/zoneDb";

/**
 * Zone API — currently MOCK-BACKED.
 *
 * Every endpoint is served by the in-memory database in `./mock/zoneDb`
 * through `queryFn`, so the full CRUD flow (list, create, update,
 * deactivate, reactivate — including the name-conflict errors the real
 * unique indexes will raise) works with zero backend.
 *
 * Swapping to the real module later is mechanical: replace each
 * `queryFn` with `query: () => ({ url, method, body })` against the
 * shared `baseQuery` from `@/lib/api` (see features/farms/farmApi.js)
 * and delete the mock import. Response shapes are already identical.
 *
 * Planned routes (mirroring the farms module):
 *   GET    /zones/               → list  { data: { zones, active, inactive, total } }
 *   POST   /zones/               → create
 *   PUT    /zones/:id            → update (full replace)
 *   PATCH  /zones/:id            → inactivate (soft delete)
 *   PATCH  /zones/:id/activate   → reactivate
 *   GET    /lookups/zone-types | soil-types | hydro-system-types
 */

export const zoneApi = createApi({
  reducerPath: "zoneApi",
  baseQuery: () => ({ data: null }),
  tagTypes: ["Zone", "FarmPicker"],
  endpoints: (builder) => ({
    listZones: builder.query({
      queryFn: async () => {
        try {
          return { data: await zoneDb.listZones() };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["Zone"],
    }),

    createZone: builder.mutation({
      queryFn: async (zone) => {
        try {
          return { data: await zoneDb.createZone(zone) };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Zone"],
    }),

    updateZone: builder.mutation({
      queryFn: async (patch) => {
        try {
          return { data: await zoneDb.updateZone(patch) };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Zone"],
    }),

    inactivateZone: builder.mutation({
      queryFn: async (id) => {
        try {
          return { data: await zoneDb.inactivateZone(id) };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Zone"],
    }),

    activateZone: builder.mutation({
      queryFn: async (id) => {
        try {
          return { data: await zoneDb.activateZone(id) };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Zone"],
    }),

    /* --- lookups (move to lookupsApi when the backend lands) -------- */

    listZoneTypes: builder.query({
      queryFn: async () => {
        try {
          return { data: await zoneDb.listZoneTypes() };
        } catch (error) {
          return { error };
        }
      },
    }),

    listSoilTypes: builder.query({
      queryFn: async () => {
        try {
          return { data: await zoneDb.listSoilTypes() };
        } catch (error) {
          return { error };
        }
      },
    }),

    listHydroSystemTypes: builder.query({
      queryFn: async () => {
        try {
          return { data: await zoneDb.listHydroSystemTypes() };
        } catch (error) {
          return { error };
        }
      },
    }),

    listFarmsForPicker: builder.query({
      queryFn: async () => {
        try {
          return { data: await zoneDb.listFarmsForPicker() };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["FarmPicker"],
    }),
  }),
});

export const {
  useListZonesQuery,
  useCreateZoneMutation,
  useUpdateZoneMutation,
  useInactivateZoneMutation,
  useActivateZoneMutation,
  useListZoneTypesQuery,
  useListSoilTypesQuery,
  useListHydroSystemTypesQuery,
  useListFarmsForPickerQuery,
} = zoneApi;
