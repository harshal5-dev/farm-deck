/**
 * Mock register API — a fully client-side simulation of a sign-up endpoint.
 *
 * Farmdeck's real backend is invite-only (there is no public /auth/register),
 * and this project is a portfolio piece: the register page should showcase the
 * flow without letting unknown visitors create real accounts. So the "API"
 * below fakes a network round-trip — latency and a success payload — with zero
 * network traffic and nothing persisted anywhere (display purposes only).
 */

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Feels like a real request: ~0.65–1.25s.
const randomLatency = () => 650 + Math.random() * 600;

const makeId = () =>
  typeof crypto?.randomUUID === "function"
    ? crypto.randomUUID()
    : `demo_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

/**
 * Simulated POST /auth/register.
 *
 * Resolves with the same envelope the real endpoints use ({ data: ... }) so
 * the page code paths mirror a real API. Nothing is stored — not the profile,
 * and never the password.
 *
 * @param {{ fullName: string, emailId: string, password: string }} payload
 * @returns {Promise<{ data: { user: object } }>}
 */
export async function mockRegister(payload) {
  await delay(randomLatency());

  const user = {
    id: makeId(),
    fullName: String(payload.fullName).trim(),
    emailId: String(payload.emailId).trim().toLowerCase(),
    role: "owner",
    demo: true,
    createdAt: new Date().toISOString(),
  };

  return { data: { user } };
}
