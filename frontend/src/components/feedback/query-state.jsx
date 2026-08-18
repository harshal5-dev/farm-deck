import { useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import ErrorState from "@/components/ui/error-state";
import { normalizeError } from "@/lib/api-errors";

/**
 * QueryState — handles the loading / error / empty / success lifecycle of an
 * RTK Query result so pages don't repeat the same boilerplate.
 *
 * Pass a query result object (what `useGetXQuery()` returns). It supports the
 * standard RTK Query fields: { isLoading, isError, error, refetch, data }.
 *
 * Props:
 *  - query:             the RTK Query result object
 *  - data:              the (already-shaped) data array/object to render with
 *  - isEmpty:           (optional) fn(data) => boolean; override empty check
 *  - empty:             node shown when there's no data
 *  - loading:           node shown while loading
 *  - entity:            noun for error copy (e.g. "soil types")
 *  - errorVariant:      force a variant ("error" | "auth" | "offline")
 *  - errorCompact:      render the error in compact mode (for tight panels)
 *  - children:          rendered on success with the data
 */
export default function QueryState({
  query,
  data,
  isEmpty,
  empty,
  loading,
  entity = "data",
  errorVariant,
  errorCompact = false,
  children,
}) {
  const { refetch } = query;
  const location = useLocation();
  const [retrying, setRetrying] = useState(false);

  const handleRetry = useCallback(async () => {
    setRetrying(true);
    try {
      await refetch();
    } finally {
      // give the UI a beat before flipping back
      setTimeout(() => setRetrying(false), 400);
    }
  }, [refetch]);

  // Loading
  if (query.isLoading) {
    return <>{loading ?? null}</>;
  }

  // Error
  if (query.isError) {
    const norm = normalizeError(query.error, { entity });
    const variant =
      errorVariant ||
      (norm?.isAuthError ? "auth" : norm?.status === "FETCH_ERROR" ? "offline" : "error");

    // Auto-redirect to login on auth errors.
    if (norm?.isAuthError) {
      // Defer to avoid setState-during-render warnings.
      setTimeout(() => {
        window.location.assign(`/login?from=${encodeURIComponent(location.pathname)}`);
      }, 0);
    }

    return (
      <ErrorState
        title={norm?.title}
        message={norm?.message}
        variant={variant}
        onRetry={handleRetry}
        retrying={retrying}
        compact={errorCompact}
      />
    );
  }

  // Empty
  const emptyNow = isEmpty ? isEmpty(data) : !data || (Array.isArray(data) && data.length === 0);
  if (emptyNow) {
    return <>{empty ?? null}</>;
  }

  // Success
  return <>{typeof children === "function" ? children(data) : children}</>;
}
