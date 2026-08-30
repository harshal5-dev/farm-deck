import { createApi } from "@reduxjs/toolkit/query/react";
import * as dailyLogDb from "./mock/dailyLogDb";

/**
 * Daily-log API — currently MOCK-BACKED.
 *
 * Mirrors the backend routes for the `daily_logs` table:
 *
 *   GET    /cycles/:cycleId/logs/   → list { data: { logs } }
 *   GET    /cycles/:cycleId/logs/:id
 *   POST   /cycles/:cycleId/logs/   → create
 *   PUT    /cycles/:cycleId/logs/:id
 *   DELETE /cycles/:cycleId/logs/:id
 *
 * Validation in the mock enforces the schema's CHECK constraints
 * (pH range, humidity/soil-moisture ≤ 100, ppm ≥ 0, water_level
 * enum) and the unique (cycle_id, log_date) constraint — every
 * error is thrown as `{ status, data: { error: { message } } }` so
 * the toast handler in pages reads it the same way the rest of the
 * app does.
 */

export const dailyLogApi = createApi({
  reducerPath: "dailyLogApi",
  baseQuery: () => ({ data: null }),
  tagTypes: ["DailyLog"],
  endpoints: (builder) => ({
    listLogs: builder.query({
      queryFn: async (arg) => {
        try {
          return { data: await dailyLogDb.listLogs(arg ?? {}) };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (result) =>
        result?.logs
          ? [
              ...result.logs.map((l) => ({ type: "DailyLog", id: l.id })),
              { type: "DailyLog", id: "LIST" },
            ]
          : [{ type: "DailyLog", id: "LIST" }],
    }),
    getLog: builder.query({
      queryFn: async (id) => {
        try {
          return { data: await dailyLogDb.getLog(id) };
        } catch (error) {
          return { error };
        }
      },
      providesTags: (_r, _e, id) => [{ type: "DailyLog", id }],
    }),
    createLog: builder.mutation({
      queryFn: async (log) => {
        try {
          return { data: await dailyLogDb.createLog(log) };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: [{ type: "DailyLog", id: "LIST" }],
    }),
    updateLog: builder.mutation({
      queryFn: async (patch) => {
        try {
          return { data: await dailyLogDb.updateLog(patch) };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (r, e, arg) => [
        { type: "DailyLog", id: "LIST" },
        { type: "DailyLog", id: arg.id },
      ],
    }),
    deleteLog: builder.mutation({
      queryFn: async (id) => {
        try {
          return { data: await dailyLogDb.deleteLog(id) };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: (r, e, id) => [
        { type: "DailyLog", id: "LIST" },
        { type: "DailyLog", id },
      ],
    }),
  }),
});

export const {
  useListLogsQuery,
  useGetLogQuery,
  useCreateLogMutation,
  useUpdateLogMutation,
  useDeleteLogMutation,
} = dailyLogApi;