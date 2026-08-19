import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/lib/api";

export const memberApi = createApi({
  reducerPath: "memberApi",
  baseQuery,
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    createMember: builder.mutation({
      query: (profile) => ({
        url: "/users/members",
        method: "POST",
        body: profile,
      }),
      invalidatesTags: ["Profile"],
    }),

    listMembers: builder.query({
      query: () => ({
        url: "/users/members",
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
      providesTags: ["Profile"],
    }),

    updateMember: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/users/members/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["Profile"],
    }),

    deleteMember: builder.mutation({
      query: (id) => ({
        url: `/users/members/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useCreateMemberMutation,
  useListMembersQuery,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
} = memberApi;
