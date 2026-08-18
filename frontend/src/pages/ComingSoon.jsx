import { Link } from "react-router-dom"
import { IconArrowLeft, IconBell } from "@tabler/icons-react"
import { cn } from "@/lib/utils"


const ComingSoon = ({
  title,
  description,
  icon: Icon,
  accent = "text-leaf",
  accentBg = "bg-leaf/15",
}) => {
  return (
    <div className="space-y-6">
      <Link
        to="/app"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <IconArrowLeft className="size-4" strokeWidth={1.75} />
        Back to Dashboard
      </Link>

      <div className="glass-card texture-paper highlight-edge relative flex flex-col items-center overflow-hidden rounded-3xl px-6 py-16 text-center">
        {/* Soft backdrop glow */}
        <div
          className={cn(
            "pointer-events-none absolute -top-16 size-64 rounded-full opacity-30 blur-3xl",
            accentBg
          )}
        />

        <div className="relative">
          {/* Big icon in a gradient ring */}
          <div className="relative mx-auto flex size-20 items-center justify-center">
            <div
              className={cn(
                "absolute inset-0 rounded-2xl opacity-20 blur-xl",
                accentBg
              )}
            />
            <div
              className={cn(
                "relative flex size-20 items-center justify-center rounded-2xl ring-1 ring-inset ring-border/40",
                accentBg
              )}
            >
              <Icon className={cn("size-10", accent)} strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="mt-6 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-leaf/30 bg-leaf/10 px-4 py-2 text-sm font-medium text-leaf">
            <IconBell className="size-4" strokeWidth={1.85} />
            Coming soon — we're growing this feature
          </div>

          <p className="mt-4 text-xs text-muted-foreground/70">
            🌱 Part of Farmdeck v1.0
          </p>
        </div>
      </div>
    </div>
  )
};

export default ComingSoon;
