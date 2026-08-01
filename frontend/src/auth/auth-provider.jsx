import { useCallback, useEffect, useMemo, useState } from "react"

import {
  AUTH_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
  DEMO_USER,
} from "./constants"
import { AuthProviderContext } from "./context"

/**
 * AuthProvider — MOCK authentication for the portfolio demo. Persists a flag +
 * user object in localStorage so the session survives refreshes. All
 * login/register calls succeed with a demo user after a short fake delay.
 */
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_STORAGE_KEY) === "true"
  })
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
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

  // Simulated async login. Any credentials succeed.
  const login = useCallback(
    async (credentials) => {
      setLoading(true)
      await new Promise((r) => setTimeout(r, 800))
      const nextUser = {
        name: credentials?.name || DEMO_USER.name,
        email: credentials?.email || DEMO_USER.email,
        role: DEMO_USER.role,
      }
      persist(true, nextUser)
      setLoading(false)
      return nextUser
    },
    [persist]
  )

  // Simulated async register. Creates a user from the form fields.
  const register = useCallback(
    async (details) => {
      setLoading(true)
      await new Promise((r) => setTimeout(r, 900))
      const nextUser = {
        name: details?.name || "New Farmer",
        email: details?.email || DEMO_USER.email,
        role: "Farm Owner",
      }
      persist(true, nextUser)
      setLoading(false)
      return nextUser
    },
    [persist]
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
    () => ({ isAuthenticated, user, loading, login, register, logout }),
    [isAuthenticated, user, loading, login, register, logout]
  )

  return (
    <AuthProviderContext.Provider value={value}>
      {children}
    </AuthProviderContext.Provider>
  )
}
