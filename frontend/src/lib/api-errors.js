/**
 * Error helpers for normalizing RTK Query / fetch errors into friendly messages.
 *
 * RTK Query errors come in a few shapes:
 *  - { status: 'FETCH_ERROR', error: '...' }      // network / CORS / server down
 *  - { status: 404 | 401 | 500, data: {...} }     // HTTP error with a body
 *  - { status: 'PARSING_ERROR', ... }              // bad JSON
 *  - { status: 'CUSTOM_ERROR', error: '...' }      // thrown in queryFn
 *  - Error instance
 */

/** Map common HTTP statuses to human-friendly text. */
const HTTP_MESSAGES = {
  400: "The request was invalid. Please check your input and try again.",
  401: "Your session has expired. Please sign in again.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you were looking for.",
  408: "The request timed out. Please try again.",
  409: "That resource already exists.",
  422: "Some of the submitted data was invalid.",
  429: "Too many requests. Please slow down and try again shortly.",
  500: "Something went wrong on our servers. We're on it.",
  502: "The server is temporarily unavailable. Please try again.",
  503: "The service is temporarily down for maintenance.",
  504: "The server took too long to respond. Please try again.",
};

/** Extract a backend message string from a response body if present. */
function extractBackendMessage(data) {
  if (!data) return null;
  if (typeof data === "string") return data;
  // Common envelope shapes: { message }, { error }, { error: { message } }, { errors: [...] }
  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;
  if (data.error && typeof data.error.message === "string") return data.error.message;
  if (Array.isArray(data.errors) && data.errors.length) {
    const first = data.errors[0];
    if (typeof first === "string") return first;
    if (first && typeof first.message === "string") return first.message;
  }
  if (Array.isArray(data.detail) && data.detail.length) return String(data.detail[0]);
  if (typeof data.detail === "string") return data.detail;
  return null;
}

/**
 * Normalize any error value into { title, message, status, isAuthError }.
 * @param {*} error - the `error` field from an RTK Query result, or any thrown value.
 * @param {{ entity?: string, action?: string }} opts - context for fallback copy.
 */
export function normalizeError(
  error,
  { entity = "data", action = "load" } = {}
) {
  // No error
  if (!error) return null;

  // Already a JS Error
  if (error instanceof Error) {
    return {
      title: "Something went wrong",
      message: error.message || `Failed to ${action} ${entity}.`,
      status: null,
      isAuthError: false,
    };
  }

  // RTK Query / fetch shape
  if (typeof error === "object") {
    const { status } = error;

    // Network / connection failure
    if (status === "FETCH_ERROR") {
      return {
        title: "Connection failed",
        message:
          extractBackendMessage(error) ||
          `We couldn't reach the server. Check your internet connection and try again.`,
        status: "FETCH_ERROR",
        isAuthError: false,
      };
    }

    // Bad JSON
    if (status === "PARSING_ERROR") {
      return {
        title: "Bad response",
        message:
          extractBackendMessage(error.originalError) ||
          `The server returned an unexpected response. Please try again.`,
        status: "PARSING_ERROR",
        isAuthError: false,
      };
    }

    // Custom error thrown in a queryFn
    if (status === "CUSTOM_ERROR") {
      return {
        title: "Something went wrong",
        message: extractBackendMessage(error) || error.message || `Failed to ${action} ${entity}.`,
        status: "CUSTOM_ERROR",
        isAuthError: false,
      };
    }

    // Numeric HTTP status
    if (typeof status === "number") {
      const backend = extractBackendMessage(error.data);
      return {
        title: httpTitle(status),
        message: backend || HTTP_MESSAGES[status] || `Request failed with status ${status}.`,
        status,
        isAuthError: status === 401 || status === 403,
      };
    }

    // Unknown object shape — try a message field, else generic
    return {
      title: "Something went wrong",
      message: extractBackendMessage(error) || `Failed to ${action} ${entity}.`,
      status: status ?? null,
      isAuthError: false,
    };
  }

  // String
  return {
    title: "Something went wrong",
    message: String(error) || `Failed to ${action} ${entity}.`,
    status: null,
    isAuthError: false,
  };
}

function httpTitle(status) {
  if (status === 401) return "Session expired";
  if (status === 403) return "Access denied";
  if (status === 404) return "Not found";
  if (status === 429) return "Slow down";
  if (status >= 500) return "Server error";
  if (status >= 400) return "Request failed";
  return "Error";
}
