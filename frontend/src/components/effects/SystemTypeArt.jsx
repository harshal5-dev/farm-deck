import { cn } from "@/lib/utils"

/**
 * SystemTypeArt — decorative SVG motif per hydroponic system type, used as the
 * header banner of each system-type card. Uses earthy CSS color vars.
 *
 * `variant`: "nft" | "dwc" | "ebb_flow" | "aeroponics" | "drip" | "kratky"
 */
export default function SystemTypeArt({ variant, className }) {
  const art = {
    nft: (
      <>
        {/* sloped channel with flowing film */}
        <path d="M0,70 L240,55" stroke="var(--sky-warm)" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
        <path d="M0,78 L240,63" stroke="var(--sky-warm)" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        {/* plants on top */}
        {[
          [40, 70], [90, 67], [140, 64], [190, 61],
        ].map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y - 8} r="5" fill="var(--leaf)" opacity="0.7" />
            <circle cx={x - 3} cy={y - 12} r="3.5" fill="var(--leaf)" opacity="0.5" />
            <circle cx={x + 3} cy={y - 12} r="3.5" fill="var(--leaf)" opacity="0.5" />
          </g>
        ))}
        {/* reservoir */}
        <rect x="0" y="88" width="240" height="24" rx="4" fill="var(--sky-warm)" opacity="0.15" />
      </>
    ),
    dwc: (
      <>
        {/* raft on tank */}
        <rect x="20" y="50" width="200" height="60" rx="6" fill="var(--sky-warm)" opacity="0.2" />
        {/* raft (styrofoam) */}
        <rect x="16" y="48" width="208" height="8" rx="3" fill="var(--wheat)" opacity="0.6" />
        {/* bubbles */}
        {[[60, 95], [110, 92], [160, 96], [200, 90]].map(([cx, cy], i) => (
          <g key={i} opacity="0.5">
            <circle cx={cx} cy={cy} r="2.5" fill="var(--sky-warm)" />
            <circle cx={cx + 4} cy={cy - 10} r="1.8" fill="var(--sky-warm)" />
            <circle cx={cx - 2} cy={cy - 20} r="1.4" fill="var(--sky-warm)" />
          </g>
        ))}
        {/* plants */}
        {[60, 110, 160, 200].map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={40} r="6" fill="var(--leaf)" opacity="0.7" />
            <circle cx={x - 4} cy={34} r="4" fill="var(--leaf)" opacity="0.5" />
            <circle cx={x + 4} cy={34} r="4" fill="var(--leaf)" opacity="0.5" />
          </g>
        ))}
      </>
    ),
    ebb_flow: (
      <>
        {/* tray with flood/drain */}
        <rect x="20" y="55" width="200" height="40" rx="6" fill="var(--soil)" opacity="0.25" />
        {/* water line */}
        <rect x="24" y="68" width="192" height="24" rx="3" fill="var(--sky-warm)" opacity="0.4" />
        {/* wave */}
        <path d="M24,68 Q60,64 100,68 T180,68 T216,68" stroke="var(--sky-warm)" strokeWidth="1.5" fill="none" opacity="0.7" />
        {/* plants */}
        {[60, 110, 160, 200].map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={45} r="5" fill="var(--leaf)" opacity="0.7" />
            <circle cx={x - 3} cy={40} r="3.5" fill="var(--leaf)" opacity="0.5" />
            <circle cx={x + 3} cy={40} r="3.5" fill="var(--leaf)" opacity="0.5" />
          </g>
        ))}
        {/* arrows up/down */}
        <g opacity="0.5" stroke="var(--sky-warm)" strokeWidth="1.5" fill="none">
          <path d="M30,100 L30,112 M27,109 L30,112 L33,109" />
        </g>
      </>
    ),
    aeroponics: (
      <>
        {/* dark chamber */}
        <rect x="20" y="55" width="200" height="45" rx="6" fill="var(--soil)" opacity="0.35" />
        {/* mist nozzles */}
        {[
          [60, 100], [110, 100], [160, 100], [200, 100],
        ].map(([cx, cy], i) => (
          <g key={i} opacity="0.6">
            <circle cx={cx} cy={cy - 8} r="3" fill="var(--sky-warm)" />
            <circle cx={cx - 3} cy={cy - 16} r="2" fill="var(--sky-warm)" />
            <circle cx={cx + 3} cy={cy - 16} r="2" fill="var(--sky-warm)" />
            <circle cx={cx} cy={cy - 24} r="1.5" fill="var(--sky-warm)" />
          </g>
        ))}
        {/* hanging roots */}
        {[60, 110, 160, 200].map((x, i) => (
          <path key={i} d={`M${x},58 Q${x - 3},75 ${x},90`} stroke="var(--clay)" strokeWidth="1.2" fill="none" opacity="0.5" />
        ))}
        {/* plants on top */}
        {[60, 110, 160, 200].map((x, i) => (
          <g key={`p-${i}`}>
            <circle cx={x} cy={48} r="5" fill="var(--leaf)" opacity="0.7" />
            <circle cx={x - 3} cy={43} r="3.5" fill="var(--leaf)" opacity="0.5" />
            <circle cx={x + 3} cy={43} r="3.5" fill="var(--leaf)" opacity="0.5" />
          </g>
        ))}
      </>
    ),
    drip: (
      <>
        {/* mainline tube */}
        <path d="M0,80 L240,80" stroke="var(--clay)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
        {/* drip emitters + drops */}
        {[60, 110, 160, 200].map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={80} r="2" fill="var(--sky-warm)" />
            <path d={`M${x},83 Q${x + 1},90 ${x},96`} stroke="var(--sky-warm)" strokeWidth="1.5" fill="none" opacity="0.7" />
            <circle cx={x} cy={98} r="1.5" fill="var(--sky-warm)" opacity="0.6" />
          </g>
        ))}
        {/* plants */}
        {[60, 110, 160, 200].map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={55} r="6" fill="var(--leaf)" opacity="0.7" />
            <circle cx={x - 4} cy={49} r="4" fill="var(--leaf)" opacity="0.5" />
            <circle cx={x + 4} cy={49} r="4" fill="var(--leaf)" opacity="0.5" />
          </g>
        ))}
        {/* medium pot */}
        {[60, 110, 160, 200].map((x, i) => (
          <path key={`pot-${i}`} d={`M${x - 8},70 L${x + 8},70 L${x + 6},80 L${x - 6},80 Z`} fill="var(--soil)" opacity="0.3" />
        ))}
      </>
    ),
    kratky: (
      <>
        {/* container */}
        <path d="M40,55 L200,55 L190,110 L50,110 Z" fill="var(--sky-warm)" opacity="0.15" />
        {/* water level (dropped) */}
        <path d="M48,80 L192,80 L188,108 L52,108 Z" fill="var(--sky-warm)" opacity="0.35" />
        {/* air gap label lines */}
        <path d="M48,62 L192,62" stroke="var(--sky-warm)" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
        <path d="M48,80 L192,80" stroke="var(--sky-warm)" strokeWidth="1" opacity="0.5" />
        {/* plant */}
        <g transform="translate(120,45)">
          <circle cx="0" cy="0" r="7" fill="var(--leaf)" opacity="0.7" />
          <circle cx="-5" cy="-6" r="5" fill="var(--leaf)" opacity="0.5" />
          <circle cx="5" cy="-6" r="5" fill="var(--leaf)" opacity="0.5" />
          {/* roots down */}
          <path d="M0,8 Q-3,25 0,50" stroke="var(--clay)" strokeWidth="1.2" fill="none" opacity="0.5" />
          <path d="M0,8 Q3,25 0,50" stroke="var(--clay)" strokeWidth="1.2" fill="none" opacity="0.4" />
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
      {art[variant] || art.nft}
    </svg>
  )
}
