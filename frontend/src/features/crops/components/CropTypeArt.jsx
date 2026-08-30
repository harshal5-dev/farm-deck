import { cn } from "@/lib/utils";

/**
 * CropTypeArt — decorative SVG scenes, one per crop CATEGORY (plant
 * family), drawn in the same language as FarmTypeArt/ZoneTypeArt.
 * Six scenes cover the whole crop catalog:
 *
 *   `variant`: "leafy_green" | "fruiting" | "herb" | "root" | "microgreen" | "other"
 *
 * Mirrors the `crops.category` CHECK constraint from the DB schema.
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
  /*  Leafy green — lettuce rosettes in a row under a soft sun          */
  /* ------------------------------------------------------------------ */
  leafy_green: (
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
  /*  Microgreen — dense, low trays with tiny cotyledon leaves          */
  /* ------------------------------------------------------------------ */
  microgreen: (
    <>
      <circle cx="200" cy="28" r="11" fill="var(--wheat)" opacity="0.55" />
      {/* trays */}
      {[20, 100, 180].map((x, i) => (
        <g key={`tr-${x}`}>
          <rect
            x={x}
            y="78"
            width="55"
            height="14"
            rx="2.5"
            fill="var(--soil)"
            opacity={0.28 - i * 0.04}
          />
          {/* dense sprout tufts — 4 small leaves per tray */}
          {[6, 18, 30, 42].map((dx, k) => (
            <g key={`s-${x}-${k}`}>
              <line
                x1={x + dx}
                y1="78"
                x2={x + dx}
                y2="62"
                stroke="var(--leaf)"
                strokeWidth="1.4"
                opacity="0.75"
                strokeLinecap="round"
              />
              <ellipse
                cx={x + dx - 2.2}
                cy="60"
                rx="4"
                ry="2"
                fill="var(--leaf)"
                opacity="0.7"
                transform={`rotate(-22 ${x + dx - 2.2} 60)`}
              />
              <ellipse
                cx={x + dx + 2.2}
                cy="60"
                rx="4"
                ry="2"
                fill="var(--leaf)"
                opacity="0.7"
                transform={`rotate(22 ${x + dx + 2.2} 60)`}
              />
            </g>
          ))}
        </g>
      ))}
      {/* table edge */}
      <path
        d="M0,94 C70,90 160,98 240,94 L240,120 L0,120 Z"
        fill="var(--sage)"
        opacity="0.3"
      />
    </>
  ),

  /* ------------------------------------------------------------------ */
  /*  Other / specialty — a tall orchard tree (covers orchards + fungi) */
  /* ------------------------------------------------------------------ */
  other: (
    <>
      <circle cx="200" cy="30" r="13" fill="var(--wheat)" opacity="0.65" />
      {/* trunk */}
      <rect
        x="116"
        y="60"
        width="8"
        height="34"
        rx="3"
        fill="var(--soil)"
        opacity="0.5"
      />
      {/* canopy — layered circles for an orchard tree */}
      <circle cx="120" cy="50" r="30" fill="var(--leaf)" opacity="0.45" />
      <circle cx="100" cy="58" r="20" fill="var(--leaf)" opacity="0.4" />
      <circle cx="142" cy="56" r="20" fill="var(--leaf)" opacity="0.4" />
      <circle cx="120" cy="36" r="18" fill="var(--leaf)" opacity="0.35" />
      {/* fruit hints */}
      <g fill="var(--clay)" opacity="0.7">
        <circle cx="106" cy="48" r="3" />
        <circle cx="128" cy="40" r="3" />
        <circle cx="138" cy="60" r="3" />
        <circle cx="114" cy="64" r="3" />
      </g>
      <path
        d="M0,94 C70,90 160,98 240,94 L240,120 L0,120 Z"
        fill="var(--sage)"
        opacity="0.3"
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
    {art[variant] || art.other}
  </svg>
);

export default CropTypeArt;