import { cn } from "@/lib/utils"

/**
 * CropCategoryArt — decorative SVG motif per crop category, used as the header
 * banner of each crop-category card. Uses earthy CSS color vars.
 *
 * `variant`: "leafy_green" | "herb" | "fruiting" | "microgreen" | "root" | "flower" | "grain"
 */
export default function CropCategoryArt({ variant, className }) {
  const art = {
    leafy_green: (
      <>
        {/* leafy heads row */}
        {[40, 90, 140, 190].map((x, i) => (
          <g key={i} transform={`translate(${x}, ${60 + (i % 2) * 6})`}>
            <ellipse cx="0" cy="6" rx="10" ry="7" fill="var(--leaf)" opacity="0.4" />
            <path d="M0,-2 C-8,-2 -10,4 -8,8 C-4,6 0,4 0,4 C0,4 4,6 8,8 C10,4 8,-2 0,-2 Z" fill="var(--leaf)" opacity="0.7" />
            <path d="M0,8 L0,16" stroke="var(--leaf)" strokeWidth="1.5" opacity="0.5" />
          </g>
        ))}
        {/* soil strip */}
        <rect x="0" y="95" width="240" height="20" fill="var(--soil)" opacity="0.2" />
      </>
    ),
    herb: (
      <>
        {/* bushy herb plants */}
        {[50, 110, 170, 210].map((x, i) => (
          <g key={i} transform={`translate(${x}, 70)`}>
            {[0, 45, 90, 135, 180, 225].map((a, j) => (
              <ellipse
                key={j}
                cx={Math.cos((a * Math.PI) / 180) * 6}
                cy={Math.sin((a * Math.PI) / 180) * 6 - 8}
                rx="3"
                ry="6"
                fill="var(--leaf)"
                opacity={0.4 + (j % 2) * 0.3}
                transform={`rotate(${a}, ${Math.cos((a * Math.PI) / 180) * 6}, ${Math.sin((a * Math.PI) / 180) * 6 - 8})`}
              />
            ))}
            <path d="M0,2 L0,18" stroke="var(--leaf)" strokeWidth="1.5" opacity="0.5" />
          </g>
        ))}
        <rect x="0" y="95" width="240" height="20" fill="var(--soil)" opacity="0.2" />
      </>
    ),
    fruiting: (
      <>
        {/* vine + fruits */}
        <path d="M30,50 Q120,40 210,55" stroke="var(--leaf)" strokeWidth="2.5" fill="none" opacity="0.6" />
        {/* leaves */}
        {[60, 110, 160, 200].map((x, i) => (
          <ellipse key={i} cx={x} cy={45 + (i % 2) * 4} rx="8" ry="4" fill="var(--leaf)" opacity="0.5" transform={`rotate(${i % 2 ? 20 : -20}, ${x}, ${45 + (i % 2) * 4})`} />
        ))}
        {/* fruits (clay/red) */}
        {[[70, 58], [120, 52], [170, 56]].map(([cx, cy], i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r="6" fill="var(--clay)" opacity="0.7" />
            <circle cx={cx} cy={cy} r="6" fill="none" stroke="var(--clay-deep)" strokeWidth="0.8" opacity="0.4" />
          </g>
        ))}
        <rect x="0" y="95" width="240" height="20" fill="var(--soil)" opacity="0.2" />
      </>
    ),
    microgreen: (
      <>
        {/* dense microgreen tray */}
        <rect x="20" y="70" width="200" height="30" rx="3" fill="var(--soil)" opacity="0.3" />
        {/* tiny sprouts */}
        {Array.from({ length: 26 }).map((_, i) => {
          const x = 28 + (i % 13) * 15
          const y = 78 + Math.floor(i / 13) * 12
          return (
            <g key={i}>
              <path d={`M${x},${y + 8} L${x},${y}`} stroke="var(--leaf)" strokeWidth="1" opacity="0.6" />
              <ellipse cx={x - 2} cy={y} rx="2" ry="3" fill="var(--leaf)" opacity="0.7" />
              <ellipse cx={x + 2} cy={y} rx="2" ry="3" fill="var(--leaf)" opacity="0.7" />
            </g>
          )
        })}
      </>
    ),
    root: (
      <>
        {/* plant tops */}
        {[60, 120, 180].map((x, i) => (
          <g key={i}>
            <ellipse cx={x} cy={48} rx="8" ry="4" fill="var(--leaf)" opacity="0.6" />
            {/* bulb/root below */}
            <ellipse cx={x} cy={80} rx="7" ry="10" fill="var(--wheat)" opacity="0.6" />
            <ellipse cx={x} cy={80} rx="7" ry="10" fill="none" stroke="var(--soil)" strokeWidth="1" opacity="0.3" />
            {/* root tail */}
            <path d={`M${x},88 Q${x - 2},98 ${x},104`} stroke="var(--soil)" strokeWidth="1.2" fill="none" opacity="0.4" />
          </g>
        ))}
        {/* soil band */}
        <rect x="0" y="60" width="240" height="50" fill="var(--soil)" opacity="0.2" />
        <path d="M0,60 L240,60" stroke="var(--soil)" strokeWidth="1.5" opacity="0.3" />
      </>
    ),
    flower: (
      <>
        {/* flowers */}
        {[50, 100, 150, 195].map((x, i) => (
          <g key={i} transform={`translate(${x}, 60)`}>
            {/* petals */}
            {[0, 72, 144, 216, 288].map((a, j) => (
              <ellipse
                key={j}
                cx="0"
                cy="-7"
                rx="3.5"
                ry="6"
                fill="var(--clay)"
                opacity="0.5"
                transform={`rotate(${a})`}
              />
            ))}
            {/* center */}
            <circle cx="0" cy="0" r="3" fill="var(--wheat)" opacity="0.9" />
            {/* stem */}
            <path d="M0,4 L0,30" stroke="var(--leaf)" strokeWidth="1.5" opacity="0.5" />
          </g>
        ))}
        <rect x="0" y="95" width="240" height="20" fill="var(--soil)" opacity="0.2" />
      </>
    ),
    grain: (
      <>
        {/* grain stalks */}
        {[40, 80, 120, 160, 200].map((x, i) => (
          <g key={i} transform={`translate(${x}, 95)`}>
            <path d="M0,0 Q-1,-30 0,-50" stroke="var(--wheat)" strokeWidth="1.5" fill="none" opacity="0.6" />
            {/* grain head */}
            {[-4, -2, 0, 2, 4].map((dx, j) => (
              <ellipse key={j} cx={dx} cy={-45 - j * 3} rx="1.5" ry="3" fill="var(--wheat)" opacity={0.7 - j * 0.08} transform={`rotate(${-20 + j * 10}, ${dx}, ${-45 - j * 3})`} />
            ))}
          </g>
        ))}
        <rect x="0" y="95" width="240" height="20" fill="var(--soil)" opacity="0.2" />
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
      {art[variant] || art.leafy_green}
    </svg>
  )
}
