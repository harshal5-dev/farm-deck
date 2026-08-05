import { IconSun, IconMoon } from "@tabler/icons-react"
import { useTheme } from "@/theme"
import { cn } from "@/lib/utils"

/**
 * ThemeToggle — a self-contained light/dark switch that morphs its icon.
 * `variant="ghost"` matches the floating landing/login style (pill on glass);
 * `variant="solid"` matches the dashboard header's bordered chip style.
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
        "group relative flex size-9 items-center justify-center overflow-hidden rounded-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0",
        variant === "solid"
          ? "border border-border/50 bg-card/50 text-muted-foreground hover:border-leaf/40 hover:text-leaf hover:shadow-md hover:shadow-leaf/10"
          : "border border-border/40 bg-card/40 text-muted-foreground hover:border-leaf/40 hover:text-leaf hover:shadow-md hover:shadow-leaf/10",
        className
      )}
    >
      <IconSun
        className={cn(
          "absolute size-4 transition-all duration-300",
          isDark
            ? "scale-100 rotate-0 opacity-100"
            : "scale-0 -rotate-90 opacity-0"
        )}
        strokeWidth={1.85}
      />
      <IconMoon
        className={cn(
          "absolute size-4 transition-all duration-300",
          isDark
            ? "scale-0 rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100"
        )}
        strokeWidth={1.85}
      />
    </button>
  )
}
