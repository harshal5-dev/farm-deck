import { baseQuery } from "@/lib/api";
import { createApi } from "@reduxjs/toolkit/query/react";
import { transformGetSoilTypesResponse } from "../soil-type-utils";

export const soilTypeApi = createApi({
  reducerPath: "soilTypeApi",
  baseQuery: baseQuery,
  tagTypes: ["SoilType"],
  endpoints: (builder) => ({
    getSoilTypes: builder.query({
      query: () => "/soil-types",
      providesTags: ["SoilType"],
      transformResponse: transformGetSoilTypesResponse,
    }),
  }),
});

export const { useGetSoilTypesQuery } = soilTypeApi;
