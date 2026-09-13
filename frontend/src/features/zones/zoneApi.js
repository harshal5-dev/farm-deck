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

const ZONES_FETCH_PAGE_SIZE = 100; // must stay <= the backend's pageSize cap
const ZONES_MAX_PAGES = 10; // safety ceiling: 1000 zones client-side

export const zoneApi = createApi({
  reducerPath: "zoneApi",
  baseQuery,
  tagTypes: ["Zone", "FarmPicker"],
  endpoints: (builder) => ({
    listZones: builder.query({
      // Fetch pages until the server-reported total is covered, then hand
      // back the same envelope the page has always consumed.
      queryFn: async (_arg, api) => {
        const zones = [];
        let last = null;
        for (let page = 1; page <= ZONES_MAX_PAGES; page += 1) {
          const res = await baseQuery(
            { url: "/zones", params: { page, pageSize: ZONES_FETCH_PAGE_SIZE } },
            api,
            {}
          );
          if (res.error) return { error: res.error };
          last = res.data?.data ?? {};
          zones.push(...(last.zones ?? []));
          if (zones.length >= (last.total ?? 0)) break;
        }
        return {
          data: {
            zones,
            active: last?.active ?? 0,
            inactive: last?.inactive ?? 0,
            total: last?.total ?? zones.length,
          },
        };
      },
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

    /* --- lookups (backend: GET /lookups/*) --------------------------- */

    listZoneTypes: builder.query({
      query: () => ({ url: "/lookups/zone-types", method: "GET" }),
      transformResponse: transformResult,
    }),

    listSoilTypes: builder.query({
      query: () => ({ url: "/lookups/soil-types", method: "GET" }),
      transformResponse: transformResult,
    }),

    listHydroSystemTypes: builder.query({
      query: () => ({ url: "/lookups/hydro-system-types", method: "GET" }),
      transformResponse: transformResult,
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
  useCreateZoneMutation,
  useUpdateZoneMutation,
  useInactivateZoneMutation,
  useActivateZoneMutation,
  useListZoneTypesQuery,
  useListSoilTypesQuery,
  useListHydroSystemTypesQuery,
  useListFarmsForPickerQuery,
} = zoneApi;
