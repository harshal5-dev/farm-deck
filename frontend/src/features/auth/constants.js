export const AUTH_STORAGE_KEY = "farmdeck_auth"
export const AUTH_USER_STORAGE_KEY = "farmdeck_user"

/**
 * Default demo user for mock login (any email/password succeeds).
 * Shape mirrors the backend `UserProfileResponse`
 * (GET /api/v1/auth/profile) so UI code can treat both identically.
 *
 * @typedef {Object} AuthUser
 * @property {string} id        - user uuid
 * @property {string} fullName
 * @property {string} emailId
 * @property {string} role      - e.g. "owner"
 * @property {string} tenantId  - owning tenant/company uuid
 * @property {string} createdAt - ISO timestamp
 * @property {string} tenantName- tenant display name (for the Company page)
 */
export const DEMO_USER = {
  id: "ad10c1d3-bb68-4d00-b43b-f477ce2bd919",
  fullName: "Harshal Ganbote",
  emailId: "harshalganbote55@gmail.com",
  role: "owner",
  tenantId: "a2e727e2-69d8-47a2-8073-a23d99bc651c",
  tenantName: "Ganbote Farms",
  createdAt: "2026-08-01T10:01:08.707834+05:30",
}
