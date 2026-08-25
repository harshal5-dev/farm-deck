import { cn } from "@/lib/utils";

/**
 * CropTypeArt — decorative SVG scenes, one per crop CATEGORY (plant
 * family), drawn in the same language as FarmTypeArt/ZoneTypeArt.
 * Six scenes cover the whole crop catalog.
 *
 * `variant`: "leafy" | "fruiting" | "herb" | "root" | "vine" | "fungi"
 */

/** A lettuce-style rosette: layered leaf circles around a heart. */
const rosette = (x, y, s, key) => (
  <g key={key} transform={`translate(${x},${y}) scale(${s})`}>
    <circle r="13" fill="var(--leaf)" opacity="0.35" />
    <circle r="9" fill="var(--leaf)" opacity="0.45" />
    <circle r="5" fill="var(--sage)" opacity="0.7" />
  </g>
);

/** A slim herb leaf hanging off a stem at an angle. */
const herbLeaf = (x, y, a, len, key) => (
  <ellipse
    key={key}
    cx={x + Math.cos((a * Math.PI) / 180) * (len / 2)}
    cy={y + Math.sin((a * Math.PI) / 180) * (len / 2)}
    rx={len / 2}
    ry="1.8"
    transform={`rotate(${a} ${x + Math.cos((a * Math.PI) / 180) * (len / 2)} ${
      y + Math.sin((a * Math.PI) / 180) * (len / 2)
    })`}
    fill="var(--lagoon)"
    opacity="0.6"
  />
);

const art = {
  /* ------------------------------------------------------------------ */
  /*  Leafy — lettuce rosettes in a row under a soft sun                */
  /* ------------------------------------------------------------------ */
  leafy: (
    <>
      <circle cx="200" cy="32" r="14" fill="var(--wheat)" opacity="0.65" />
      {rosette(40, 74, 1)}
      {rosette(88, 78, 1.25)}
      {rosette(140, 73, 0.9)}
      {rosette(190, 78, 1.15)}
      <path
        d="M0,86 C60,82 150,88 240,84 L240,120 L0,120 Z"
        fill="var(--sage)"
        opacity="0.3"
      />
    </>
  ),

  /* ------------------------------------------------------------------ */
  /*  Fruiting — a staked bush with round ripening fruit                */
  /* ------------------------------------------------------------------ */
  fruiting: (
    <>
      <circle cx="200" cy="30" r="13" fill="var(--wheat)" opacity="0.65" />
      {/* stake */}
      <line
        x1="120"
        y1="92"
        x2="120"
        y2="26"
        stroke="var(--soil)"
        strokeWidth="2.5"
        opacity="0.35"
        strokeLinecap="round"
      />
      {/* bush canopy */}
      <circle cx="120" cy="52" r="26" fill="var(--leaf)" opacity="0.4" />
      <circle cx="98" cy="62" r="16" fill="var(--leaf)" opacity="0.35" />
      <circle cx="143" cy="62" r="16" fill="var(--leaf)" opacity="0.35" />
      {/* fruits in two ripeness stages */}
      <g fill="var(--clay)" opacity="0.8">
        <circle cx="112" cy="48" r="6" />
        <circle cx="132" cy="58" r="5" />
      </g>
      <g fill="var(--wheat)" opacity="0.8">
        <circle cx="100" cy="60" r="5" />
        <circle cx="126" cy="40" r="4" />
      </g>
      {/* ground */}
      <path
        d="M0,94 C70,90 160,96 240,92 L240,120 L0,120 Z"
        fill="var(--sage)"
        opacity="0.3"
      />
    </>
  ),

  /* ------------------------------------------------------------------ */
  /*  Herb — fragrant sprigs with slim leaves                            */
  /* ------------------------------------------------------------------ */
  herb: (
    <>
      <circle cx="198" cy="30" r="12" fill="var(--wheat)" opacity="0.6" />
      {[36, 76, 116, 156, 196].map((x, i) => (
        <g key={`h-${x}`}>
          <line
            x1={x}
            y1="92"
            x2={x}
            y2={44 - (i % 2) * 8}
            stroke="var(--lagoon-deep)"
            strokeWidth="2"
            opacity="0.5"
            strokeLinecap="round"
          />
          {[0, 1, 2].map((t) => {
            const y = 84 - t * 16;
            return (
              <g key={`hl-${x}-${t}`}>
                {herbLeaf(x, y, -38, 14 - t * 2, `l-${x}-${t}`)}
                {herbLeaf(x, y - 4, 218, 14 - t * 2, `r-${x}-${t}`)}
              </g>
            );
          })}
        </g>
      ))}
      <path
        d="M0,94 C70,90 160,96 240,92 L240,120 L0,120 Z"
        fill="var(--sage)"
        opacity="0.3"
      />
    </>
  ),

  /* ------------------------------------------------------------------ */
  /*  Root — leafy tops above, tapering roots below the soil line       */
  /* ------------------------------------------------------------------ */
  root: (
    <>
      <circle cx="200" cy="26" r="12" fill="var(--wheat)" opacity="0.65" />
      {/* tops */}
      {[42, 84, 126, 168].map((x, i) => (
        <g key={`t-${x}`} stroke="var(--leaf)" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7">
          <path d={`M${x},62 L${x - 9},${44 - i * 2}`} />
          <path d={`M${x},62 L${x},${40 - (i % 2) * 4}`} />
          <path d={`M${x},62 L${x + 9},${44 - i * 2}`} />
        </g>
      ))}
      {/* soil line */}
      <path
        d="M0,64 C60,60 160,66 240,62 L240,120 L0,120 Z"
        fill="var(--soil)"
        opacity="0.3"
      />
      {/* roots below */}
      {[42, 84, 126, 168].map((x, i) => (
        <path
          key={`r-${x}`}
          d={`M${x - 5},66 L${x},100 L${x + 5},66 Z`}
          fill="var(--wheat)"
          opacity={0.65 - i * 0.08}
        />
      ))}
    </>
  ),

  /* ------------------------------------------------------------------ */
  /*  Vine — a trellised cane with berry clusters                        */
  /* ------------------------------------------------------------------ */
  vine: (
    <>
      <circle cx="200" cy="28" r="13" fill="var(--wheat)" opacity="0.65" />
      {/* trellis wires */}
      <line x1="10" y1="42" x2="230" y2="42" stroke="var(--soil)" strokeWidth="1.8" opacity="0.3" />
      <line x1="10" y1="70" x2="230" y2="70" stroke="var(--soil)" strokeWidth="1.8" opacity="0.3" />
      {/* main cane */}
      <path
        d="M120,98 C112,80 130,66 118,50 C110,38 124,28 120,18"
        stroke="var(--lagoon-deep)"
        strokeWidth="2.5"
        fill="none"
        opacity="0.6"
        strokeLinecap="round"
      />
      {/* canes leaves */}
      <g fill="var(--leaf)" opacity="0.6">
        <ellipse cx="100" cy="60" rx="9" ry="5" transform="rotate(-24 100 60)" />
        <ellipse cx="140" cy="52" rx="9" ry="5" transform="rotate(24 140 52)" />
        <ellipse cx="104" cy="34" rx="8" ry="4.5" transform="rotate(-24 104 34)" />
        <ellipse cx="138" cy="28" rx="8" ry="4.5" transform="rotate(24 138 28)" />
      </g>
      {/* berry clusters */}
      <g fill="var(--lagoon-deep)" opacity="0.75">
        <circle cx="96" cy="70" r="3.4" />
        <circle cx="104" cy="74" r="3" />
        <circle cx="99" cy="78" r="2.6" />
        <circle cx="138" cy="70" r="3.4" />
        <circle cx="146" cy="74" r="3" />
        <circle cx="141" cy="78" r="2.6" />
      </g>
      <path
        d="M0,96 C70,92 160,98 240,94 L240,120 L0,120 Z"
        fill="var(--sage)"
        opacity="0.3"
      />
    </>
  ),

  /* ------------------------------------------------------------------ */
  /*  Fungi — a moonlit cluster on a dark bed                            */
  /* ------------------------------------------------------------------ */
  fungi: (
    <>
      <rect x="0" y="0" width="240" height="120" fill="var(--soil)" opacity="0.14" />
      <circle cx="198" cy="30" r="14" fill="var(--wheat)" opacity="0.2" />
      <circle cx="198" cy="30" r="8" fill="var(--wheat)" opacity="0.55" />
      {/* spores */}
      <g fill="var(--wheat)" opacity="0.4">
        <circle cx="42" cy="30" r="1.6" />
        <circle cx="80" cy="44" r="1.3" />
        <circle cx="120" cy="26" r="1.5" />
        <circle cx="56" cy="58" r="1.2" />
      </g>
      {/* cluster */}
      {[
        [86, 100, 1.2, "--clay"],
        [120, 100, 0.85, "--wheat"],
        [150, 100, 1.05, "--clay-deep"],
      ].map(([x, y, s, cap]) => (
        <g key={`m-${x}`} transform={`translate(${x},${y}) scale(${s})`}>
          <rect x="-4" y="-18" width="8" height="18" rx="3.5" fill="var(--wheat)" opacity="0.55" />
          <path
            d="M-17,-15 C-17,-32 17,-32 17,-15 C10,-12 -10,-12 -17,-15 Z"
            fill={`var(${cap})`}
            opacity="0.8"
          />
          <circle cx="-6" cy="-22" r="1.8" fill="var(--card)" opacity="0.7" />
          <circle cx="5" cy="-25" r="1.5" fill="var(--card)" opacity="0.7" />
        </g>
      ))}
      <path
        d="M0,98 C60,94 150,100 240,96 L240,120 L0,120 Z"
        fill="var(--soil)"
        opacity="0.4"
      />
    </>
  ),
};

const CropTypeArt = ({ variant, className }) => (
  <svg
    viewBox="0 0 240 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("size-full", className)}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    {art[variant] || art.leafy}
  </svg>
);

export default CropTypeArt;
