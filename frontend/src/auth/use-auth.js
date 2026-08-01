import { useContext } from "react"
import { AuthProviderContext } from "./context"

export function useAuth() {
  const ctx = useContext(AuthProviderContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}
