import { IconSun, IconMoon } from "@tabler/icons-react"
import { useTheme } from "@/theme"
import { cn } from "@/lib/utils"

/**
 * ThemeToggle — a self-contained light/dark switch that morphs its icon.
 * Borderless icon button — relies on the hover background + icon colour
 * change for affordance so the header reads as one clean band instead of
 * a row of bordered chips.
 */
export default function ThemeToggle({ variant = "ghost", className }) {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={cn(
        "group relative flex size-10 items-center justify-center overflow-hidden rounded-xl text-muted-foreground transition-all duration-300 hover:bg-leaf/10 hover:text-leaf active:scale-95",
        className
      )}
    >
      <IconSun
        className={cn(
          "absolute size-5 transition-all duration-300",
          isDark
            ? "scale-100 rotate-0 opacity-100"
            : "scale-0 -rotate-90 opacity-0"
        )}
        strokeWidth={1.85}
      />
      <IconMoon
        className={cn(
          "absolute size-5 transition-all duration-300",
          isDark
            ? "scale-0 rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100"
        )}
        strokeWidth={1.85}
      />
    </button>
  )
}
