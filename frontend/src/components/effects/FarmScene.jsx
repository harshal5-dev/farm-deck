import { cn } from "@/lib/utils"

/**
 * FarmScene — a hand-built illustrated landscape used as the Dashboard hero
 * backdrop. Drawn entirely in SVG so it scales crisply and respects the current
 * theme via CSS variables (sage/clay/wheat/sky/soil/leaf).
 *
 * Layers (back → front): sky wash · sun + glow · distant hills · mid hills ·
 * field rows · greenhouse · water pool · crop dots · foreground hill.
 */
export default function FarmScene({ className }) {
  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
      viewBox="0 0 1200 400"
      preserveAspectRatio="xMidYMax slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hz-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--sky-warm)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--sky-warm)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="hz-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--wheat)" stopOpacity="0.9" />
          <stop offset="60%" stopColor="var(--clay)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--clay)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hz-hill-far" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--sage)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--sage-deep)" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="hz-hill-mid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--leaf)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--sage-deep)" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="hz-soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--soil)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--soil)" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="hz-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--sky-warm)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--sky-warm)" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* Sky wash */}
      <rect x="0" y="0" width="1200" height="400" fill="url(#hz-sky)" />

      {/* Sun + soft glow */}
      <circle cx="930" cy="110" r="180" fill="url(#hz-sun)" />
      <circle cx="930" cy="110" r="46" fill="var(--wheat)" opacity="0.95" />
      <circle cx="930" cy="110" r="60" fill="none" stroke="var(--wheat)" strokeWidth="2" strokeOpacity="0.3" />

      {/* Distant rolling hills */}
      <path
        d="M0,210 C160,160 320,200 480,175 C640,150 800,195 960,170 C1080,152 1200,185 1200,185 L1200,400 L0,400 Z"
        fill="url(#hz-hill-far)"
        opacity="0.85"
      />
      {/* Mid hills */}
      <path
        d="M0,255 C200,215 360,250 560,225 C760,200 920,245 1200,220 L1200,400 L0,400 Z"
        fill="url(#hz-hill-mid)"
        opacity="0.9"
      />

      {/* Cultivated field with furrow rows */}
      <g>
        <path
          d="M0,300 C260,275 460,300 720,285 C960,272 1100,298 1200,290 L1200,400 L0,400 Z"
          fill="url(#hz-soil)"
          opacity="0.75"
        />
        {/* perspective crop rows */}
        {Array.from({ length: 9 }).map((_, i) => {
          const y = 300 + i * 12
          const inset = i * 26
          return (
            <path
              key={i}
              d={`M${inset},${y} C300,${y - 4} 900,${y + 4} ${1200 - inset},${y}`}
              stroke="var(--leaf)"
              strokeWidth="1.6"
              strokeOpacity={0.45 + i * 0.05}
              strokeLinecap="round"
            />
          )
        })}
      </g>

      {/* Water reservoir / pond */}
      <ellipse cx="220" cy="345" rx="135" ry="24" fill="url(#hz-water)" opacity="0.9" />
      <ellipse
        cx="220"
        cy="342"
        rx="135"
        ry="24"
        fill="none"
        stroke="var(--sky-warm)"
        strokeWidth="2"
        strokeOpacity="0.6"
      />

      {/* Greenhouse / polytunnel */}
      <g transform="translate(540,250)">
        <path
          d="M0,60 C0,18 40,0 80,0 C120,0 160,18 160,60 Z"
          fill="var(--sage)"
          opacity="0.5"
        />
        <path
          d="M0,60 C0,18 40,0 80,0 C120,0 160,18 160,60 Z"
          fill="none"
          stroke="var(--sage-deep)"
          strokeWidth="2"
          strokeOpacity="0.7"
        />
        {/* hoop ribs */}
        {[20, 50, 80, 110, 140].map((x) => (
          <line
            key={x}
            x1={x}
            y1="60"
            x2={x}
            y2={60 - Math.sin((x / 160) * Math.PI) * 56}
            stroke="var(--sage-deep)"
            strokeWidth="1.2"
            strokeOpacity="0.5"
          />
        ))}
      </g>

      {/* Crop dot clusters (leafy greens) */}
      <g fill="var(--leaf)" opacity="0.7">
        {[
          [360, 320],
          [385, 326],
          [345, 328],
          [410, 322],
          [680, 330],
          [705, 334],
          [860, 326],
          [890, 330],
          [1010, 324],
          [1035, 330],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3.5" />
        ))}
      </g>

      {/* Foreground hill for depth */}
      <path
        d="M0,360 C300,335 700,365 1200,345 L1200,400 L0,400 Z"
        fill="var(--sage-deep)"
        opacity="0.5"
      />
    </svg>
  )
}
