import { useCallback, useEffect, useMemo, useState } from "react"

import {
  AUTH_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
  DEMO_USER,
} from "./constants"
import { AuthProviderContext } from "./context"

/**
 * Normalize a stored/raw user object into the canonical backend shape
 * ({ id, fullName, emailId, role, tenantId, tenantName, createdAt }).
 *
 * Older demo sessions persisted a different shape ({ name, email, role });
 * this maps those legacy fields onto the new ones and fills any gaps from
 * DEMO_USER so every consumer can trust the fields exist.
 */
function normalizeUser(raw) {
  if (!raw || typeof raw !== "object") return null
  return {
    ...DEMO_USER,
    // Legacy compatibility: name → fullName, email → emailId
    fullName: raw.fullName || raw.name || DEMO_USER.fullName,
    emailId: raw.emailId || raw.email || DEMO_USER.emailId,
    role: raw.role || DEMO_USER.role,
    id: raw.id || DEMO_USER.id,
    tenantId: raw.tenantId || DEMO_USER.tenantId,
    tenantName: raw.tenantName || DEMO_USER.tenantName,
    createdAt: raw.createdAt || DEMO_USER.createdAt,
  }
}

/**
 * AuthProvider — MOCK authentication for the portfolio demo. Persists a flag +
 * user object in localStorage so the session survives refreshes. Login succeeds
 * with a demo user after a short fake delay.
 *
 * The user object mirrors the backend `UserProfileResponse`
 * (GET /api/v1/auth/profile): { id, fullName, emailId, role, tenantId, createdAt }.
 */
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_STORAGE_KEY) === "true"
  })
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_STORAGE_KEY)
      return normalizeUser(stored ? JSON.parse(stored) : null)
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(false)

  const persist = useCallback((authed, nextUser) => {
    setIsAuthenticated(authed)
    setUser(nextUser)
    if (authed) {
      localStorage.setItem(AUTH_STORAGE_KEY, "true")
      localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(nextUser))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      localStorage.removeItem(AUTH_USER_STORAGE_KEY)
    }
  }, [])

  // Simulated async login. Any credentials succeed; the demo user is returned
  // but the email reflects whatever was typed.
  const login = useCallback(
    async (credentials) => {
      setLoading(true)
      await new Promise((r) => setTimeout(r, 800))
      const nextUser = {
        ...DEMO_USER,
        emailId: credentials?.email || DEMO_USER.emailId,
      }
      persist(true, nextUser)
      setLoading(false)
      return nextUser
    },
    [persist]
  )

  // Update the in-memory + persisted user (used by the Profile / Tenant pages
  // to reflect edits immediately in the demo).
  const updateUser = useCallback(
    (patch) => {
      setUser((prev) => {
        const next = { ...prev, ...patch }
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(next))
        return next
      })
    },
    []
  )

  const logout = useCallback(() => {
    persist(false, null)
  }, [persist])

  // Keep multiple tabs in sync.
  useEffect(() => {
    const handler = (e) => {
      if (e.key === AUTH_STORAGE_KEY) {
        setIsAuthenticated(e.newValue === "true")
      }
    }
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [])

  const value = useMemo(
    () => ({ isAuthenticated, user, loading, login, logout, updateUser }),
    [isAuthenticated, user, loading, login, logout, updateUser]
  )

  return (
    <AuthProviderContext.Provider value={value}>
      {children}
    </AuthProviderContext.Provider>
  )
}
