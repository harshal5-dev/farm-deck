import { baseQuery } from "@/lib/api";
import { createApi } from "@reduxjs/toolkit/query/react";
import { setUser } from "../auth";


export const ProfileApi = createApi({
  reducerPath: "profileApi",
  baseQuery,
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({ url: "/users/me" }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error) {
          console.error(error);
        }
      },
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
