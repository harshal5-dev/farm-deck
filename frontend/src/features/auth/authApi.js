import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/lib/api";

/**
 * authApi — RTK Query API for authentication.
 *
 * Endpoints:
 *  - login        POST /auth/login    { emailId, password } -> { accessToken }
 *  - logout       POST /auth/logout                         -> { message }
 *  - refresh      POST /auth/refresh                        -> { accessToken }  (internal; called by baseQuery on 401)
 *  - getProfile   GET  /auth/profile                        -> UserProfileResponse
 *
 * The backend wraps every success response in a { success, data, timestamp }
 * envelope; transformResponse unwraps `.data` so consumers get the inner
 * payload directly. Error envelopes are passed through unchanged — the existing
 * `normalizeError` helper in `lib/api-errors.js` already extracts the message
 * from `{ error: { code, message, details } }`.
 */
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: {
          emailId: credentials.emailId,
          password: credentials.password,
        },
      }),
      transformResponse: (response) => response?.data,
    }),

    logout: builder.mutation({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      transformResponse: (response) => response?.data,
    }),

    refresh: builder.mutation({
      query: () => ({ url: "/auth/refresh", method: "POST" }),
      transformResponse: (response) => response?.data,
    }),

    updateProfile: builder.mutation({
      query: (patch) => ({
        url: "/auth/profile",
        method: "PATCH",
        body: patch,
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ["Profile"],
    }),

    updateTenant: builder.mutation({
      query: (patch) => ({
        url: "/auth/tenant",
        method: "PATCH",
        body: patch,
      }),
      transformResponse: (response) => response?.data,
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
  useUpdateProfileMutation,
  useUpdateTenantMutation,
} = authApi;
