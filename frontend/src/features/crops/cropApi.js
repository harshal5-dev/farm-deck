import { createApi } from "@reduxjs/toolkit/query/react";
import * as cropDb from "./mock/cropDb";

/**
 * Crop API — currently MOCK-BACKED.
 *
 * Two surfaces that mirror the backend schema:
 *
 *   • Catalog (`/crops/`)     — CRUD on the `crops` table (varieties
 *                                with target pH / EC / PPM / light /
 *                                days-to-harvest).
 *   • Cycles  (`/cycles/`)    — CRUD on the `cycles` table (one
 *                                planting per row, with status and
 *                                growth_stage lifecycle).
 *
 * Planned routes:
 *   GET    /crops/                      → list  { data: { crops } }
 *   POST   /crops/                      → create
 *   PUT    /crops/:id                   → update
 *   PATCH  /crops/:id/inactivate   → soft delete
 *   PATCH  /crops/:id/activate     → reactivate
 *
 *   GET    /cycles/                     → list  { data: { cycles } }
 *   POST   /cycles/                     → create
 *   PUT    /cycles/:id                  → update
 *   PATCH  /cycles/:id/advance          → happy-path status advance
 */

export const cropApi = createApi({
  reducerPath: "cropApi",
  baseQuery: () => ({ data: null }),
  tagTypes: ["Crop", "Cycle"],
  endpoints: (builder) => ({
    /* ---------- Catalog (crops table) ----------------------------- */
    listCrops: builder.query({
      queryFn: async () => {
        try {
          return { data: await cropDb.listCrops() };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["Crop"],
    }),

    createCrop: builder.mutation({
      queryFn: async (crop) => {
        try {
          return { data: await cropDb.createCrop(crop) };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Crop"],
    }),

    updateCrop: builder.mutation({
      queryFn: async (patch) => {
        try {
          return { data: await cropDb.updateCrop(patch) };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Crop"],
    }),

    inactivateCrop: builder.mutation({
      queryFn: async (id) => {
        try {
          return { data: await cropDb.inactivateCrop(id) };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Crop"],
    }),

    activateCrop: builder.mutation({
      queryFn: async (id) => {
        try {
          return { data: await cropDb.activateCrop(id) };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Crop"],
    }),

    /* ---------- Cycles (cycles table) ----------------------------- */
    listCycles: builder.query({
      queryFn: async () => {
        try {
          return { data: await cropDb.listCycles() };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["Cycle"],
    }),

    createCycle: builder.mutation({
      queryFn: async (cycle) => {
        try {
          return { data: await cropDb.createCycle(cycle) };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Cycle"],
    }),

    updateCycle: builder.mutation({
      queryFn: async (patch) => {
        try {
          return { data: await cropDb.updateCycle(patch) };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Cycle"],
    }),

    advanceCycleStatus: builder.mutation({
      queryFn: async (id) => {
        try {
          return { data: await cropDb.advanceCycleStatus(id) };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Cycle"],
    }),
  }),
});

export const {
  /* Catalog */
  useListCropsQuery,
  useCreateCropMutation,
  useUpdateCropMutation,
  useInactivateCropMutation,
  useActivateCropMutation,
  /* Cycles */
  useListCyclesQuery,
  useCreateCycleMutation,
  useUpdateCycleMutation,
  useAdvanceCycleStatusMutation,
} = cropApi;