import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, transformResult } from "@/lib/api";
import * as zoneDb from "./mock/zoneDb";

/**
 * Zone API — list, lookups and farm picker hit the real backend;
 * update / deactivate / reactivate are still mock-backed until the
 * backend ships those routes.
 *
 * listZones keeps the client-side filtering UX of the list page, so it
 * stitches every server page (pageSize 100, capped at MAX_PAGES) into
 * the single { zones, active, inactive, total } shape the page filters
 * locally. If zones-per-tenant ever outgrows that ceiling, move the
 * filters into the /zones query params — the endpoint already supports
 * page/pageSize/farmID/zoneTypeID/status/q/sort.
 */

export const zoneApi = createApi({
  reducerPath: "zoneApi",
  baseQuery,
  tagTypes: ["Zone", "FarmPicker"],
  endpoints: (builder) => ({
    listZones: builder.query({
      query: (params) => ({
        url: "/zones",
        params,
        method: "GET",
      }),
      transformResponse: transformResult,
      providesTags: ["Zone"],
    }),

    /* Real server-side-filtered list for one farm — powers the farm
       view page's fields grid (GET /zones?farmID=…). */
    listZonesByFarm: builder.query({
      query: (farmId) => ({
        url: "/zones",
        params: { farmID: farmId, pageSize: 100, sort: "name" },
      }),
      transformResponse: transformResult,
      providesTags: ["Zone"],
    }),

    createZone: builder.mutation({
      query: (zone) => ({
        url: "/zones",
        method: "POST",
        body: zone,
      }),
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

    /* Active farms for pickers — same backend list as the farms module,
       narrowed to what a picker needs. */
    listFarmsForPicker: builder.query({
      query: () => ({ url: "/farms", method: "GET" }),
      transformResponse: (result) =>
        transformResult(result).farms?.filter((f) => f.isActive) ?? [],
      providesTags: ["FarmPicker"],
    }),
  }),
});

export const {
  useListZonesQuery,
  useListZonesByFarmQuery,
  useCreateZoneMutation,
  useUpdateZoneMutation,
  useInactivateZoneMutation,
  useActivateZoneMutation,
  useListFarmsForPickerQuery,
} = zoneApi;
