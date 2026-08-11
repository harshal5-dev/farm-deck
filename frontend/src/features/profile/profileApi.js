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

    updateProfile: builder.mutation({
      query: (patch) => ({
        url: "/users/me",
        method: "PATCH",
        body: patch,
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ["Profile"],
    }),

    updateTenant: builder.mutation({
      query: (patch) => ({
        url: "/tenants/me",
        method: "PATCH",
        body: patch,
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const { useGetProfileQuery, useLazyGetProfileQuery, useUpdateProfileMutation, useUpdateTenantMutation } = ProfileApi;
