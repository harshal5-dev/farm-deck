import { createApi } from "@reduxjs/toolkit/query/react";
import * as harvestDb from "./mock/harvestDb";

/**
 * Harvest API — currently MOCK-BACKED.
 *
 * Mirrors the backend routes for the `harvests` table:
 *
 *   GET    /harvests/?cycleId=…  → list { data: { harvests } }
 *   GET    /harvests/:id
 *   POST   /harvests/            → create (total_revenue computed here)
 *   PUT    /harvests/:id         → update (revenue recomputed)
 *   DELETE /harvests/:id
 *
 * The mock enforces the schema's CHECK constraints (yield > 0,
 * grade ∈ {A,B,C}, price ≥ 0) and computes `total_revenue`
 * service-side — exactly like the real backend. Errors are thrown as
 * `{ status, data: { error: { message } } }` so the toasts in the
 * pages read them the same way the rest of the app does.
 */

export const harvestApi = createApi({
  reducerPath: "harvestApi",
  baseQuery: () => ({ data: null }),
  tagTypes: ["Harvest"],
  endpoints: (builder) => ({
    listHarvests: builder.query({
      queryFn: async (arg) => {
        try {
          return { data: await harvestDb.listHarvests(arg ?? {}) };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (result) =>
        result?.harvests
          ? [
              ...result.harvests.map((h) => ({ type: "Harvest", id: h.id })),
              { type: "Harvest", id: "LIST" },
            ]
          : [{ type: "Harvest", id: "LIST" }],
    }),
    getHarvest: builder.query({
      queryFn: async (id) => {
        try {
          return { data: await harvestDb.getHarvest(id) };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (_r, _e, id) => [{ type: "Harvest", id }],
    }),
    createHarvest: builder.mutation({
      queryFn: async (harvest) => {
        try {
          return { data: await harvestDb.createHarvest(harvest) };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: [{ type: "Harvest", id: "LIST" }],
    }),
    updateHarvest: builder.mutation({
      queryFn: async (patch) => {
        try {
          return { data: await harvestDb.updateHarvest(patch) };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (r, e, arg) => [
        { type: "Harvest", id: "LIST" },
        { type: "Harvest", id: arg.id },
      ],
    }),
    deleteHarvest: builder.mutation({
      queryFn: async (id) => {
        try {
          return { data: await harvestDb.deleteHarvest(id) };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (r, e, id) => [
        { type: "Harvest", id: "LIST" },
        { type: "Harvest", id },
      ],
    }),
  }),
});

export const {
  useListHarvestsQuery,
  useGetHarvestQuery,
  useCreateHarvestMutation,
  useUpdateHarvestMutation,
  useDeleteHarvestMutation,
} = harvestApi;
