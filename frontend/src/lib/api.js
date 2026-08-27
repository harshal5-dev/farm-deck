import { env } from "@/config/env";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";

/**
 * baseQuery — shared RTK Query base with a 401 → refresh → retry interceptor.
 *
 * Flow:
 *   1. Run the request via raw fetchBaseQuery (cookies included).
 *   2. If the response is 401 AND the request wasn't to /auth/refresh itself:
 *        a. Acquire a serialized lock (promise-chain mutex, see below) so that
 *           a burst of 401s results in at-most-one refresh attempt at a time.
 *        b. Call POST /auth/refresh via a SEPARATE fetchBaseQuery instance.
 *           Using a separate instance avoids importing the authApi (which would
 *           create a circular dependency), and also keeps the refresh request
 *           outside this baseQuery's own 401-handling.
 *        c. If the refresh succeeded, retry the ORIGINAL request exactly once
 *           (it will now use the freshly-issued access_token cookie).
 *        d. If the refresh failed, propagate the original 401 so callers (e.g.
 *           QueryState) can clear local auth state and redirect to /login.
 *
 * The lock is a chain of promises: every 401 handler appends a new pending
 * promise to `mutex` and awaits the previous one. Because the append happens
 * synchronously (before any await) inside the handler, concurrent 401s are
 * serialized in arrival order and refresh storms collapse to a single refresh.
 */
const baseURL = env.apiBaseUrl;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  credentials: "include",
});

const refreshBaseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  credentials: "include",
});

let mutex = Promise.resolve();

/**
 * Endpoints that should NOT trigger the 401 → refresh interceptor. Refreshing
 * on these is either pointless (a failed login: bad creds, no session to
 * refresh) or dangerous (a recursive refresh loop).
 */
const NO_REFRESH_PATHS = ["/auth/refresh", "/auth/login", "/auth/logout"];

const isNoRefreshPath = (args) => {
  const url = typeof args === "string" ? args : args?.url ?? "";
  return NO_REFRESH_PATHS.some((p) => url.includes(p));
};

export const baseQuery = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && !isNoRefreshPath(args)) {
    // Acquire the mutex synchronously: build a new pending lock, chain it on,
    // then await the previous lock. This serializes all concurrent 401s.
    let release;
    const myLock = new Promise((resolve) => {
      release = resolve;
    });
    const previous = mutex;
    mutex = myLock;
    await previous;

    try {
      const refreshResult = await refreshBaseQuery(
        { url: "/auth/refresh", method: "POST" },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        // Refresh succeeded — retry the original request with the new cookie.
        result = await rawBaseQuery(args, api, extraOptions);
      }
      // If refresh failed, fall through and return the original 401 to the caller.
    } finally {
      release();
    }
  }

  return result;
};

export const transformResult = (result = { data: {} }) => {
  return result.data;
};
