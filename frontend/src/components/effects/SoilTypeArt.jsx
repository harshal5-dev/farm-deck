import { cn } from "@/lib/utils"

/**
 * SoilTypeArt — small decorative SVG motifs, one per soil type, used as the
 * header banner of each soil-type card. Each draws a distinctive cross-section
 * / texture. Uses the earthy CSS color vars so it adapts to light/dark.
 *
 * `variant`: "sandy" | "sandy_loam" | "clay" | "clay_loam" | "silt" | "loam" | "chalky" | "peaty"
 */
export default function SoilTypeArt({ variant, className }) {
  const art = {
    sandy_loam: (
      <>
        {/* sun */}
        <circle cx="200" cy="42" r="14" fill="var(--wheat)" opacity="0.7" />
        {/* dotted sandy grains */}
        <g fill="var(--wheat)" opacity="0.7">
          {grains(30, 240, 120, 46, 6)}
        </g>
        {/* surface line */}
        <path
          d="M0,96 C60,90 120,94 180,88 C210,85 230,90 240,88 L240,120 L0,120 Z"
          fill="var(--wheat)"
          opacity="0.3"
        />
        {/* darker grains below */}
        <g fill="var(--clay)" opacity="0.45">
          {grains(20, 240, 120, 26, 5)}
        </g>
      </>
    ),
    sandy: (
      <>
        {/* warm sun */}
        <circle cx="200" cy="38" r="18" fill="var(--wheat)" opacity="0.85" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          const x1 = 200 + Math.cos(a) * 24;
          const y1 = 38 + Math.sin(a) * 24;
          const x2 = 200 + Math.cos(a) * 32;
          const y2 = 38 + Math.sin(a) * 32;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="var(--wheat)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          );
        })}
        {/* loose, gritty surface */}
        <path d="M0,90 C50,84 100,88 160,82 C200,78 220,84 240,80 L240,120 L0,120 Z"
          fill="var(--wheat)" opacity="0.35" />
        {/* deep scattered coarse grains */}
        <g fill="var(--wheat)" opacity="0.55">
          {grains(15, 240, 120, 40, 7)}
        </g>
        <g fill="var(--clay)" opacity="0.35">
          {grains(10, 240, 120, 20, 4)}
        </g>
      </>
    ),
    clay: (
      <>
        {/* sun */}
        <circle cx="200" cy="42" r="12" fill="var(--wheat)" opacity="0.6" />
        {/* solid clay mass */}
        <path
          d="M0,70 C80,62 160,72 240,66 L240,120 L0,120 Z"
          fill="var(--clay)"
          opacity="0.45"
        />
        {/* crack lines */}
        <g stroke="var(--clay-deep)" strokeWidth="2" strokeLinecap="round" opacity="0.55" fill="none">
          <path d="M40,80 L70,110" />
          <path d="M70,80 L40,110" />
          <path d="M120,78 L150,112" />
          <path d="M150,78 L118,112" />
          <path d="M195,76 L222,110" />
          <path d="M222,76 L193,110" />
        </g>
      </>
    ),
    clay_loam: (
      <>
        <circle cx="200" cy="42" r="13" fill="var(--wheat)" opacity="0.65" />
        {/* balanced clay-loam body */}
        <path d="M0,72 C70,64 150,74 240,68 L240,120 L0,120 Z"
          fill="var(--clay)" opacity="0.35" />
        <path d="M0,90 C70,86 150,92 240,88 L240,120 L0,120 Z"
          fill="var(--clay-deep)" opacity="0.2" />
        {/* mixed crumb structure */}
        <g opacity="0.8">
          {grains(15, 240, 120, 28, 4.5, "var(--clay)")}
          {grains(10, 240, 120, 22, 3, "var(--sage)")}
          {grains(8, 240, 120, 18, 2.5, "var(--wheat)")}
        </g>
        {/* sunburst motif for heavy-feeder energy */}
        <g transform="translate(60,82)" stroke="var(--clay)" strokeWidth="1.5" opacity="0.4" fill="none">
          <circle cx="0" cy="0" r="8" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
            <line key={deg} x1="0" y1="0" x2={8 * Math.cos(deg * Math.PI / 180)} y2={8 * Math.sin(deg * Math.PI / 180)}
              strokeWidth="2" strokeLinecap="round" />
          ))}
        </g>
      </>
    ),
    silt: (
      <>
        <circle cx="200" cy="42" r="12" fill="var(--sky-warm)" opacity="0.6" />
        {/* smooth layered silt bands */}
        <path d="M0,72 C70,66 150,74 240,68 L240,120 L0,120 Z" fill="var(--sky-warm)" opacity="0.3" />
        <path d="M0,86 C70,82 150,88 240,84 L240,120 L0,120 Z" fill="var(--sky-warm)" opacity="0.22" />
        <path d="M0,100 C70,98 150,102 240,99 L240,120 L0,120 Z" fill="var(--sky-warm)" opacity="0.16" />
        {/* fine specks */}
        <g fill="var(--sky-warm)" opacity="0.5">
          {grains(10, 240, 120, 60, 2.5)}
        </g>
      </>
    ),
    loam: (
      <>
        <circle cx="200" cy="42" r="12" fill="var(--leaf)" opacity="0.6" />
        {/* rich crumbly loam */}
        <path
          d="M0,74 C70,66 150,76 240,70 L240,120 L0,120 Z"
          fill="var(--leaf)"
          opacity="0.4"
        />
        {/* varied crumbs (mix of sizes/colors) */}
        <g opacity="0.8">
          {grains(20, 240, 120, 30, 5, "var(--leaf)")}
          {grains(10, 240, 120, 24, 3.5, "var(--sage)")}
          {grains(10, 240, 120, 18, 3, "var(--wheat)")}
        </g>
        {/* sprout */}
        <g transform="translate(60,76)">
          <path d="M0,18 L0,4" stroke="var(--leaf)" strokeWidth="2" strokeLinecap="round" />
          <path d="M0,8 C-6,6 -8,2 -8,-2 C-2,-2 0,2 0,8" fill="var(--leaf)" opacity="0.8" />
          <path d="M0,8 C6,6 8,2 8,-2 C2,-2 0,2 0,8" fill="var(--leaf)" opacity="0.8" />
        </g>
      </>
    ),
    chalky: (
      <>
        <circle cx="200" cy="42" r="12" fill="var(--sky-warm)" opacity="0.6" />
        {/* pale chalk stones */}
        <path d="M0,80 C70,74 150,82 240,76 L240,120 L0,120 Z" fill="var(--sky-warm)" opacity="0.2" />
        <g fill="var(--sky-warm)" opacity="0.55" stroke="var(--sky-warm)" strokeWidth="1">
          {[[40, 96, 12], [90, 104, 9], [140, 92, 14], [190, 102, 10], [70, 112, 8], [165, 112, 9]].map(
            ([cx, cy, r], i) => (
              <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.7} />
            )
          )}
        </g>
      </>
    ),
    peaty: (
      <>
        <circle cx="200" cy="42" r="11" fill="var(--clay)" opacity="0.5" />
        {/* dark peat bands */}
        <path d="M0,72 C70,66 150,74 240,68 L240,120 L0,120 Z" fill="var(--soil)" opacity="0.55" />
        <path d="M0,88 C70,84 150,90 240,86 L240,120 L0,120 Z" fill="var(--soil)" opacity="0.4" />
        <path d="M0,102 C70,100 150,104 240,101 L240,120 L0,120 Z" fill="var(--soil)" opacity="0.3" />
        {/* organic flecks */}
        <g fill="var(--leaf)" opacity="0.4">
          {grains(12, 240, 120, 40, 2.5)}
        </g>
      </>
    ),
  }

  return (
    <svg
      viewBox="0 0 240 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-full", className)}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {art[variant] || art.loam}
    </svg>
  )
}

/** Deterministic scatter of small circles for a textured "grain" look. */
function grains(x0, x1, yMax, count, r, color) {
  const pts = []
  let seed = 7
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280
    return seed / 233280
  }
  for (let i = 0; i < count; i++) {
    const cx = x0 + rand() * (x1 - x0)
    const cy = 78 + rand() * (yMax - 78)
    pts.push(
      <circle key={`${i}-${cx.toFixed(0)}`} cx={cx} cy={cy} r={r} fill={color || "currentColor"} />
    )
  }
  return pts
}
