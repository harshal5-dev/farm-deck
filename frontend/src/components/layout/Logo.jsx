import { cn } from "@/lib/utils";
/**
 * Logo — FarmDeck's unique mark: a stylized barn/silo roof resting on
 * rolling field rows. Fuses the "deck" (layered rows) with growth (the
 * rising sun + sprout) in one symbol.
 *
 * Variants:
 *  - `mark`   : the symbol only (for favicon, avatars, collapsed sidebar)
 *  - `full`   : symbol + wordmark "Farmdeck"
 *  - `badge`  : symbol inside a rounded gradient tile
 *
 * Sizes via className (width/height). Pass `className="size-9"` etc.
 */
export default function Logo({
  variant = "full",
  className,
  withSubtitle = true,
  animate = false,
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
          id="fd-field"
          x1="6"
          y1="30"
          x2="42"
          y2="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7FD66E" />
          <stop offset="55%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#2E7D52" />
        </linearGradient>
        <linearGradient
          id="fd-barn"
          x1="14"
          y1="8"
          x2="34"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#E0825C" />
          <stop offset="100%" stopColor="#C25A36" />
        </linearGradient>
        <radialGradient id="fd-sun" cx="35%" cy="30%" r="55%">
          <stop offset="0%" stopColor="#FFD56B" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFD56B" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Rising sun glow behind the barn — slow breathing */}
      <circle
        cx="24"
        cy="20"
        r="13"
        fill="url(#fd-sun)"
        style={{
          transformOrigin: "24px 20px",
          transformBox: "fill-box",
        }}
        className="animate-sun-pulse"
      />

      {/* Barn roof — a peaked silhouette */}
      <path
        d="M24 6 L36 17 L33 17 L33 28 L15 28 L15 17 L12 17 Z"
        fill="url(#fd-barn)"
      />
      {/* Barn door */}
      <path d="M21 21 H27 V28 H21 Z" fill="#7A2E16" opacity="0.75" />

      {/* Layered field rows — the "deck" */}
      <path
        d="M4 38 C 12 34, 20 34, 24 38 C 28 42, 36 42, 44 38 L44 44 L4 44 Z"
        fill="url(#fd-field)"
      />
      <path
        d="M4 34 C 12 30, 20 30, 24 34 C 28 38, 36 38, 44 34"
        stroke="#2E7D52"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      {/* Sprout rising from the field — gentle sway */}
      <path
        d="M24 30 L 24 24"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.95"
        style={{
          transformOrigin: "24px 30px",
          transformBox: "fill-box",
        }}
        className="animate-sprout-sway"
      />
    </svg>
  );

  if (variant === "mark") {
    return (
      <div className={cn("size-9", animate && "animate-logo-pop", className)}>
        {Mark}
      </div>
    );
  }

  if (variant === "badge") {
    return (
      <div
        className={cn(
          "relative flex size-9 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-leaf to-sage-deep shadow-lg shadow-leaf/40",
          animate && "animate-logo-pop",
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
      <div
        className={cn(
          "size-9 shrink-0 drop-shadow-sm",
          animate && "animate-logo-pop"
        )}
      >
        {Mark}
      </div>
      <div className="leading-tight">
        <span className="block text-base font-bold tracking-tight">
          Farm<span className="text-leaf">deck</span>
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
