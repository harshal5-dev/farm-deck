import { cn } from "@/lib/utils";

/**
 * Logo — HydroZen's unique mark: a water droplet cradling a leaf/sprout.
 * Fuses "Hydro" (droplet) with growth (leaf) in one symbol.
 *
 * Variants:
 *  - `mark`   : the symbol only (for favicon, avatars, collapsed sidebar)
 *  - `full`   : symbol + wordmark "HydroZen"
 *  - `badge`  : symbol inside a rounded gradient tile
 *
 * Sizes via className (width/height). Pass `className="size-9"` etc.
 */
export default function Logo({
  variant = "full",
  className,
  withSubtitle = true,
}) {
  const Mark = (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="size-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="hz-drop"
          x1="12"
          y1="6"
          x2="34"
          y2="42"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7FD66E" />
          <stop offset="55%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#2E7D52" />
        </linearGradient>
        <linearGradient
          id="hz-leaf"
          x1="18"
          y1="14"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#E8F8D8" />
          <stop offset="100%" stopColor="#BCE89A" />
        </linearGradient>
        <radialGradient id="hz-shine" cx="35%" cy="30%" r="55%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Droplet body */}
      <path
        d="M24 4 C 16 14, 11 21, 11 29 a 13 13 0 0 0 26 0 C 37 21, 32 14, 24 4 Z"
        fill="url(#hz-drop)"
      />
      {/* Droplet shine */}
      <path
        d="M24 4 C 16 14, 11 21, 11 29 a 13 13 0 0 0 26 0 C 37 21, 32 14, 24 4 Z"
        fill="url(#hz-shine)"
      />

      {/* Leaf inside the droplet */}
      <path
        d="M24 33 C 18 31, 16 25, 18 19 C 24 20, 30 24, 30 30 C 30 32, 28 33, 24 33 Z"
        fill="url(#hz-leaf)"
        opacity="0.95"
      />
      {/* Leaf mid-vein */}
      <path
        d="M19 30 C 22 27, 25 24, 29 22"
        stroke="#2E7D52"
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      {/* Sprout stem rising */}
      <path
        d="M24 33 L 24 26"
        stroke="#E8F8D8"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  );

  if (variant === "mark") {
    return <div className={cn("size-9", className)}>{Mark}</div>;
  }

  if (variant === "badge") {
    return (
      <div
        className={cn(
          "relative flex size-9 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-leaf to-sage-deep shadow-lg shadow-leaf/40",
          className
        )}
      >
        {/* soft inner glow + top highlight */}
        <div className="absolute inset-0 rounded-2xl bg-linear-to-b from-white/25 to-transparent" />
        <div className="size-full p-1.5">{Mark}</div>
      </div>
    );
  }

  // full
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="size-9 shrink-0 drop-shadow-sm">{Mark}</div>
      <div className="leading-tight">
        <span className="block text-base font-bold tracking-tight">
          Hydro<span className="text-leaf">Zen</span>
        </span>
        {withSubtitle && (
          <span className="mt-0.5 inline-flex items-center gap-1.5 rounded-full border border-leaf/20 bg-leaf/10 px-2 py-0.5 text-[9px] font-semibold tracking-wider text-leaf uppercase">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-leaf opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-leaf" />
            </span>
            Farm OS
          </span>
        )}
      </div>
    </div>
  );
}
