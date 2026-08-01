import { useEffect, useState } from "react"

/**
 * useMockLoading — simulates an async data fetch by returning `loading=true`
 * for `delay` ms (default 900ms), then `false`. Used to show skeletons while
 * "fetching" mock data.
 *
 * @param {number} delay ms to stay in loading state
 * @param {any[]} deps  when any dep changes, loading resets to true again
 */
export function useMockLoading(delay = 900, deps = []) {
  const [loading, setLoading] = useState(true)

  // Re-run the fake fetch whenever the dep signature changes.
  const depSignature = JSON.stringify(deps)
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), delay)
    return () => clearTimeout(t)
  }, [delay, depSignature])

  return loading
}
