/**
 * MOCK auth-flow helpers — simulate the forgot-password / verify-otp /
 * reset-password round-trip so the UI is fully testable before the backend
 * endpoints exist. Each helper resolves after a short delay.
 *
 * To go live later:
 *   1. Add `forgotPassword`, `verifyOtp`, and `resetPassword` mutations to
 *      `authApi.js` (same shape as the existing `login` mutation).
 *   2. Add `/auth/forgot-password`, `/auth/verify-otp`, and
 *      `/auth/reset-password` to `NO_REFRESH_PATHS` in `lib/api.js` (they are
 *      unauthenticated, so the 401-refresh interceptor must skip them).
 *   3. Swap these helpers for the generated hooks
 *      (useForgotPasswordMutation, etc.) inside the pages.
 */

const wait = (ms, value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const DEMO_OTP_CODE = "123456";

export function requestPasswordReset(email) {
  return wait(900, { email, delivered: true });
}

export function verifyOtp(email, code) {
  // Demo mode: any complete 6-digit code verifies.
  const ok = /^\d{6}$/.test(code);
  return wait(900, { email, verified: ok });
}

export function resetPassword(email, password) {
  return wait(900, { email, password, reset: true });
}
