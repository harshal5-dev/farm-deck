import { cn } from "@/lib/utils";

/**
 * ZoneTypeArt — decorative SVG scenes, one per zone type, drawn in the
 * same language as FarmTypeArt/SoilTypeArt (farm palette CSS vars,
 * flat shapes at varying opacity, xMidYMid slice) so zone cards sit
 * naturally next to farm cards.
 *
 * `variant`: "soil" | "hydro" | "aquaponic" | "mushroom"
 */

/** A sprout — stem with two leaves — anchored at the stem base (x, y). */
const sprout = (x, y, s = 1, key) => (
  <g key={key} transform={`translate(${x},${y}) scale(${s})`}>
    <line
      x1="0"
      y1="0"
      x2="0"
      y2="-12"
      stroke="var(--leaf)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M0,-8 C-6,-10 -9,-14 -9,-18 C-3,-18 0,-14 0,-8"
      fill="var(--leaf)"
      opacity="0.85"
    />
    <path
      d="M0,-8 C6,-10 9,-14 9,-18 C3,-18 0,-14 0,-8"
      fill="var(--leaf)"
      opacity="0.85"
    />
  </g>
);

/** A water band with a gentle wave along its top edge. */
const wave = (y, amp, fill, opacity, key) => (
  <path
    key={key}
    d={`M0,${y} C30,${y - amp} 60,${y + amp} 90,${y} C120,${y - amp} 150,${y + amp} 180,${y} C205,${y - amp / 2} 225,${y + amp / 2} 240,${y} L240,120 L0,120 Z`}
    fill={fill}
    opacity={opacity}
  />
);

/** A fish silhouette facing left, anchored at its centre. */
const fish = (x, y, s = 1, key) => (
  <g key={key} transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx="0" cy="0" rx="15" ry="7.5" fill="var(--sky-warm)" opacity="0.75" />
    <path d="M13,0 L25,-7 L25,7 Z" fill="var(--sky-warm)" opacity="0.55" />
    <circle cx="-8" cy="-1.5" r="1.6" fill="var(--soil)" opacity="0.8" />
  </g>
);

/** One mushroom anchored at the stem base. */
const mushroom = (x, y, s, capVar, key) => (
  <g key={key} transform={`translate(${x},${y}) scale(${s})`}>
    {/* stem */}
    <rect
      x="-4"
      y="-18"
      width="8"
      height="18"
      rx="3.5"
      fill="var(--wheat)"
      opacity="0.55"
    />
    {/* cap dome */}
    <path
      d="M-17,-15 C-17,-32 17,-32 17,-15 C10,-12 -10,-12 -17,-15 Z"
      fill={`var(${capVar})`}
      opacity="0.8"
    />
    {/* cap spots */}
    <circle cx="-7" cy="-22" r="2" fill="var(--card)" opacity="0.7" />
    <circle cx="4" cy="-25" r="1.6" fill="var(--card)" opacity="0.7" />
    <circle cx="9" cy="-19" r="1.3" fill="var(--card)" opacity="0.7" />
  </g>
);

const art = {
  /* ------------------------------------------------------------------ */
  /*  Soil plot — sun over furrowed ground with a row of sprouts        */
  /* ------------------------------------------------------------------ */
  soil: (
    <>
      {/* sun + rays */}
      <circle cx="202" cy="32" r="13" fill="var(--wheat)" opacity="0.75" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <line
            key={i}
            x1={202 + Math.cos(a) * 18}
            y1={32 + Math.sin(a) * 18}
            x2={202 + Math.cos(a) * 26}
            y2={32 + Math.sin(a) * 26}
            stroke="var(--wheat)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.55"
          />
        );
      })}
      {/* sprout row on the surface */}
      {[24, 56, 88, 120, 152, 184, 216].map((x, i) =>
        sprout(x, 72, i % 2 ? 1.15 : 0.85, `s-${x}`)
      )}
      {/* tilled bed with furrows */}
      <path
        d="M0,74 C60,68 120,74 180,70 C205,68 225,72 240,70 L240,120 L0,120 Z"
        fill="var(--clay)"
        opacity="0.35"
      />
      {[18, 50, 82, 114, 146, 178, 210].map((x) => (
        <path
          key={`f-${x}`}
          d={`M${x},80 Q${x + 9},85 ${x},91`}
          stroke="var(--clay-deep)"
          strokeWidth="1.8"
          fill="none"
          opacity="0.35"
          strokeLinecap="round"
        />
      ))}
      {/* deeper soil layer */}
      <path
        d="M0,96 C70,92 150,98 240,94 L240,120 L0,120 Z"
        fill="var(--soil)"
        opacity="0.35"
      />
    </>
  ),

  /* ------------------------------------------------------------------ */
  /*  Hydro — NFT channel with net pots above a bubbling reservoir      */
  /* ------------------------------------------------------------------ */
  hydro: (
    <>
      {/* nutrient droplet */}
      <path
        d="M22,16 C27,23 30,27 30,31 A8,8 0 1 1 14,31 C14,27 17,23 22,16"
        fill="var(--lagoon)"
        opacity="0.5"
      />
      {/* plants in net pots along the channel */}
      {[40, 72, 104, 136, 168, 200].map((x, i) =>
        sprout(x, 58, i % 2 ? 0.95 : 0.75, `p-${x}`)
      )}
      {/* net pots */}
      {[40, 72, 104, 136, 168, 200].map((x) => (
        <circle
          key={`np-${x}`}
          cx={x}
          cy="60"
          r="5"
          fill="var(--card)"
          stroke="var(--lagoon-deep)"
          strokeWidth="1.6"
          opacity="0.7"
        />
      ))}
      {/* NFT channel */}
      <rect
        x="26"
        y="62"
        width="192"
        height="12"
        rx="6"
        fill="var(--lagoon)"
        opacity="0.25"
        stroke="var(--lagoon-deep)"
        strokeWidth="1.6"
        strokeOpacity="0.55"
      />
      {/* flowing film inside the channel */}
      <line
        x1="34"
        y1="68"
        x2="210"
        y2="68"
        stroke="var(--lagoon)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* rising bubbles */}
      <g fill="var(--lagoon)" opacity="0.45">
        <circle cx="52" cy="88" r="3" />
        <circle cx="60" cy="80" r="2" />
        <circle cx="128" cy="90" r="2.5" />
        <circle cx="136" cy="82" r="1.8" />
        <circle cx="196" cy="86" r="2.6" />
      </g>
      {/* reservoir water */}
      {wave(90, 3, "var(--lagoon)", 0.32, "w1")}
      {wave(101, 2.5, "var(--lagoon-deep)", 0.28, "w2")}
      {wave(111, 2, "var(--lagoon-deep)", 0.22, "w3")}
    </>
  ),

  /* ------------------------------------------------------------------ */
  /*  Aquaponic — grow bed above, fish tank below, recirculating loop   */
  /* ------------------------------------------------------------------ */
  aquaponic: (
    <>
      {/* plants in the grow bed */}
      {[50, 78, 106, 134, 162, 190].map((x, i) =>
        sprout(x, 30, i % 2 ? 0.95 : 0.75, `a-${x}`)
      )}
      {/* grow bed */}
      <rect
        x="38"
        y="32"
        width="164"
        height="16"
        rx="7"
        fill="var(--sage)"
        opacity="0.3"
        stroke="var(--sage-deep)"
        strokeWidth="1.6"
        strokeOpacity="0.5"
      />
      {/* media dots inside the bed */}
      <g fill="var(--sage-deep)" opacity="0.35">
        {[52, 72, 92, 112, 132, 152, 172, 190].map((x) => (
          <circle key={`m-${x}`} cx={x} cy={44 - (x % 3) * 2} r="1.6" />
        ))}
      </g>
      {/* recirculating loop — down one side, up the other */}
      <g
        stroke="var(--lagoon-deep)"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M30,48 C18,60 18,72 30,82" />
        <path d="M26,74 L30,82 L38,78" />
        <path d="M210,48 C222,60 222,72 210,82" />
        <path d="M214,74 L210,82 L202,78" />
      </g>
      {/* rising bubbles */}
      <g fill="var(--lagoon)" opacity="0.45">
        <circle cx="70" cy="94" r="2.4" />
        <circle cx="78" cy="88" r="1.8" />
        <circle cx="158" cy="92" r="2.6" />
        <circle cx="166" cy="85" r="1.8" />
      </g>
      {/* fish tank water */}
      {wave(88, 3, "var(--lagoon)", 0.32, "aw1")}
      {wave(102, 2.5, "var(--lagoon-deep)", 0.26, "aw2")}
      {/* the fish */}
      {fish(96, 100, 1)}
      {fish(164, 106, 0.7)}
    </>
  ),

  /* ------------------------------------------------------------------ */
  /*  Mushroom — dark room, moon glow, mushrooms on the floor           */
  /* ------------------------------------------------------------------ */
  mushroom: (
    <>
      {/* dim room wash */}
      <rect x="0" y="0" width="240" height="120" fill="var(--soil)" opacity="0.14" />
      {/* moon glow */}
      <circle cx="198" cy="30" r="16" fill="var(--wheat)" opacity="0.2" />
      <circle cx="198" cy="30" r="9" fill="var(--wheat)" opacity="0.55" />
      {/* floating spores */}
      <g fill="var(--wheat)" opacity="0.4">
        <circle cx="40" cy="26" r="1.8" />
        <circle cx="72" cy="40" r="1.4" />
        <circle cx="120" cy="22" r="1.6" />
        <circle cx="150" cy="44" r="1.3" />
        <circle cx="60" cy="58" r="1.2" />
        <circle cx="168" cy="60" r="1.5" />
      </g>
      {/* mushrooms — a little family, caps in clay & wheat */}
      {mushroom(70, 100, 1.25, "--clay", "m1")}
      {mushroom(108, 100, 0.85, "--wheat", "m2")}
      {mushroom(140, 100, 1.05, "--clay-deep", "m3")}
      {mushroom(172, 100, 0.7, "--wheat", "m4")}
      {/* floor bed */}
      <path
        d="M0,98 C60,94 150,100 240,96 L240,120 L0,120 Z"
        fill="var(--soil)"
        opacity="0.4"
      />
    </>
  ),
};

const ZoneTypeArt = ({ variant, className }) => (
  <svg
    viewBox="0 0 240 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("size-full", className)}
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    {art[variant] || art.soil}
  </svg>
);

export default ZoneTypeArt;
