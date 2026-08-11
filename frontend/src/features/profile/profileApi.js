import { baseQuery } from "@/lib/api";
import { createApi } from "@reduxjs/toolkit/query/react";


export const ProfileApi = createApi({
  reducerPath: "profileApi",
  baseQuery,
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({ url: "/users/me" }),
      transformResponse: (response) => response?.data,
      providesTags: ["Profile"],
    }),

  }),
});

export const { useGetProfileQuery, useLazyGetProfileQuery } = ProfileApi;
