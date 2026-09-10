import { cn } from "@/lib/utils";

/**
 * HydroSystemArt — small decorative SVG schematics, one per hydroponic
 * system type, drawn in the same cross-section language as SoilTypeArt /
 * ZoneTypeArt (farm-palette CSS vars, flat shapes at varying opacity,
 * xMidYMid slice) so hydro cards sit naturally next to the other lookup
 * cards. Each variant is a recognisable schematic of the system:
 *
 *   nft        — sloped channel with a thin nutrient film + roots
 *   dwc        — raft floating on a deep aerated reservoir
 *   ebb_flow   — tray mid-flood with a return pipe
 *   aeroponics — chamber with suspended roots + mist droplets
 *   drip       — substrate fed by a top emitter drip
 *   kratky     — passive reservoir with an air gap above the solution
 *
 * `variant`: "nft" | "dwc" | "ebb_flow" | "aeroponics" | "drip" | "kratky"
 */

/** A small plant — stem with two leaves — anchored at (x, baseY). */
const plant = (x, baseY, s = 1, key) => (
  <g key={key} transform={`translate(${x},${baseY}) scale(${s})`}>
    <line x1="0" y1="0" x2="0" y2="-14" stroke="var(--leaf)" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M0,-8 C-6,-9 -8,-13 -8,-17 C-2,-17 0,-13 0,-8" fill="var(--leaf)" opacity="0.9" />
    <path d="M0,-8 C6,-9 8,-13 8,-17 C2,-17 0,-13 0,-8" fill="var(--leaf)" opacity="0.7" />
  </g>
);

/** Hanging roots — a few wavy lines from (x, y) downward, length ~len. */
const roots = (x, y, len, key, strands = 3) => (
  <g key={key} stroke="var(--lagoon-deep)" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.55">
    {Array.from({ length: strands }).map((_, i) => {
      const dx = (i - (strands - 1) / 2) * 4;
      return (
        <path key={i} d={`M${x + dx},${y} q2,${len / 3} 0,${len * 2 / 3} q-2,${len / 3} 0,${len / 3}`} />
      );
    })}
  </g>
);

const HydroSystemArt = ({ variant, className }) => {
  const art = {
    // NFT — sloped channel, thin film of solution, roots dipping in.
    nft: (
      <>
        <rect x="0" y="0" width="240" height="120" fill="var(--lagoon)" opacity="0.06" />
        {/* sloped channel */}
        <path d="M16,86 L224,54 L224,96 L16,128 Z" fill="var(--lagoon-deep)" opacity="0.18" />
        <path d="M16,86 L224,54" stroke="var(--lagoon)" strokeWidth="2.4" strokeLinecap="round" opacity="0.8" />
        {/* nutrient film */}
        <path d="M20,88 L220,56 L220,62 L20,94 Z" fill="var(--lagoon)" opacity="0.45" />
        {/* flow arrow */}
        <path d="M196,60 l8,3 -3,-6" stroke="var(--lagoon-deep)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        {/* plants on the channel, roots into the film */}
        {plant(60, 84, 1.1, "p1")}
        {roots(60, 84, 8, "r1")}
        {plant(120, 78, 1.1, "p2")}
        {roots(120, 78, 9, "r2")}
        {plant(182, 72, 1.1, "p3")}
        {roots(182, 72, 10, "r3")}
      </>
    ),

    // DWC — raft floating on a deep aerated reservoir.
    dwc: (
      <>
        <rect x="0" y="0" width="240" height="120" fill="var(--lagoon)" opacity="0.06" />
        {/* reservoir */}
        <rect x="20" y="56" width="200" height="64" rx="6" fill="var(--lagoon-deep)" opacity="0.16" />
        {/* water body */}
        <rect x="20" y="68" width="200" height="52" rx="6" fill="var(--lagoon)" opacity="0.4" />
        <path d="M20,68 q50,-6 100,0 t100,0" stroke="var(--lagoon-deep)" strokeWidth="1.4" fill="none" opacity="0.5" />
        {/* raft */}
        <rect x="28" y="62" width="184" height="8" rx="3" fill="var(--clay)" opacity="0.7" />
        {/* plants on raft, long roots into water */}
        {plant(70, 62, 1.15, "p1")}
        {roots(70, 62, 18, "r1", 4)}
        {plant(120, 62, 1.15, "p2")}
        {roots(120, 62, 18, "r2", 4)}
        {plant(170, 62, 1.15, "p3")}
        {roots(170, 62, 18, "r3", 4)}
        {/* air bubbles */}
        <g fill="var(--sky-warm)" opacity="0.6">
          <circle cx="48" cy="104" r="2.5" />
          <circle cx="92" cy="112" r="1.8" />
          <circle cx="148" cy="106" r="2.2" />
          <circle cx="196" cy="110" r="1.6" />
        </g>
      </>
    ),

    // Ebb & Flow — tray mid-flood with a return pipe.
    ebb_flow: (
      <>
        <rect x="0" y="0" width="240" height="120" fill="var(--lagoon)" opacity="0.06" />
        {/* tray */}
        <rect x="20" y="60" width="200" height="48" rx="5" fill="var(--clay)" opacity="0.22" />
        {/* flooding solution */}
        <rect x="20" y="78" width="200" height="30" rx="5" fill="var(--lagoon)" opacity="0.4" />
        <path d="M20,78 q50,-5 100,0 t100,0" stroke="var(--lagoon-deep)" strokeWidth="1.3" fill="none" opacity="0.5" />
        {/* media bed pebbles */}
        <g fill="var(--clay)" opacity="0.4">
          {Array.from({ length: 14 }).map((_, i) => (
            <circle key={i} cx={28 + i * 14} cy={74} r={2.4 + (i % 3)} />
          ))}
        </g>
        {/* plants */}
        {plant(60, 74, 1.1, "p1")}
        {roots(60, 74, 4, "r1")}
        {plant(120, 74, 1.1, "p2")}
        {roots(120, 74, 4, "r2")}
        {plant(182, 74, 1.1, "p3")}
        {roots(182, 74, 4, "r3")}
        {/* return pipe + arrows */}
        <rect x="208" y="60" width="8" height="48" rx="2" fill="var(--lagoon-deep)" opacity="0.35" />
        <path d="M212,96 l-4,-4 8,0 z" fill="var(--lagoon-deep)" opacity="0.8" />
      </>
    ),

    // Aeroponics — suspended roots in a chamber with mist droplets.
    aeroponics: (
      <>
        <rect x="0" y="0" width="240" height="120" fill="var(--sky-warm)" opacity="0.06" />
        {/* chamber */}
        <rect x="24" y="58" width="192" height="56" rx="6" fill="var(--lagoon-deep)" opacity="0.14" />
        {/* lid / support slab */}
        <rect x="24" y="56" width="192" height="6" rx="3" fill="var(--clay)" opacity="0.55" />
        {/* plants on the lid */}
        {plant(64, 56, 1.15, "p1")}
        {plant(120, 56, 1.2, "p2")}
        {plant(176, 56, 1.15, "p3")}
        {/* long suspended roots in air */}
        {roots(64, 56, 44, "r1", 3)}
        {roots(120, 56, 50, "r2", 4)}
        {roots(176, 56, 44, "r3", 3)}
        {/* mist droplets scattered through the chamber */}
        <g fill="var(--sky-warm)" opacity="0.7">
          {Array.from({ length: 18 }).map((_, i) => {
            const x = 32 + (i * 11) % 176;
            const y = 74 + ((i * 7) % 34);
            return <circle key={i} cx={x} cy={y} r={1.4 + (i % 3) * 0.5} />;
          })}
        </g>
        {/* high-pressure nozzles */}
        <g fill="var(--lagoon-deep)" opacity="0.6">
          <rect x="48" y="104" width="6" height="8" rx="1" />
          <rect x="116" y="104" width="6" height="8" rx="1" />
          <rect x="184" y="104" width="6" height="8" rx="1" />
        </g>
      </>
    ),

    // Drip — substrate fed by a top emitter.
    drip: (
      <>
        <rect x="0" y="0" width="240" height="120" fill="var(--lagoon)" opacity="0.06" />
        {/* substrate block */}
        <rect x="64" y="64" width="112" height="44" rx="6" fill="var(--clay)" opacity="0.28" />
        <rect x="64" y="64" width="112" height="10" rx="4" fill="var(--clay)" opacity="0.4" />
        {/* wet patch under the emitter */}
        <ellipse cx="120" cy="74" rx="40" ry="6" fill="var(--lagoon)" opacity="0.4" />
        {/* plant on top */}
        {plant(120, 64, 1.3, "p1")}
        {/* emitter line + emitter */}
        <path d="M120,16 L120,40" stroke="var(--lagoon-deep)" strokeWidth="1.6" fill="none" opacity="0.7" />
        <rect x="114" y="40" width="12" height="10" rx="2" fill="var(--lagoon-deep)" opacity="0.6" />
        {/* the drip drop */}
        <path d="M120,54 q3,4 0,8 q-3,-4 0,-8" fill="var(--lagoon)" opacity="0.9" />
        {/* substrate grain texture */}
        <g fill="var(--clay-deep)" opacity="0.35">
          {Array.from({ length: 10 }).map((_, i) => (
            <circle key={i} cx={74 + i * 10} cy={92 + (i % 2) * 6} r={1.6} />
          ))}
        </g>
      </>
    ),

    // Kratky — passive reservoir with an air gap above the solution.
    kratky: (
      <>
        <rect x="0" y="0" width="240" height="120" fill="var(--lagoon)" opacity="0.06" />
        {/* reservoir */}
        <rect x="24" y="52" width="192" height="64" rx="6" fill="var(--lagoon-deep)" opacity="0.16" />
        {/* solution (lower portion only — air gap on top) */}
        <rect x="24" y="86" width="192" height="30" rx="6" fill="var(--lagoon)" opacity="0.4" />
        <path d="M24,86 q50,-4 96,0 t96,0" stroke="var(--lagoon-deep)" strokeWidth="1.3" fill="none" opacity="0.5" />
        {/* lid / net-pot support */}
        <rect x="24" y="50" width="192" height="6" rx="3" fill="var(--clay)" opacity="0.55" />
        {/* net pots */}
        <g fill="var(--clay)" opacity="0.45">
          <rect x="58" y="44" width="20" height="12" rx="3" />
          <rect x="110" y="44" width="20" height="12" rx="3" />
          <rect x="162" y="44" width="20" height="12" rx="3" />
        </g>
        {/* plants */}
        {plant(68, 50, 1.15, "p1")}
        {plant(120, 50, 1.25, "p2")}
        {plant(172, 50, 1.15, "p3")}
        {/* roots: upper roots in the humid air gap, lower roots reach the solution */}
        {roots(68, 50, 30, "r1", 3)}
        {roots(120, 50, 36, "r2", 4)}
        {roots(172, 50, 30, "r3", 3)}
        {/* air-gap mist hint */}
        <g fill="var(--sky-warm)" opacity="0.4">
          <circle cx="40" cy="74" r="1.3" />
          <circle cx="96" cy="80" r="1.1" />
          <circle cx="150" cy="74" r="1.3" />
          <circle cx="204" cy="78" r="1.1" />
        </g>
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 240 120"
      preserveAspectRatio="xMidYMid slice"
      className={cn("size-full", className)}
      aria-hidden="true"
    >
      {art[variant] || art.dwc}
    </svg>
  );
};

export default HydroSystemArt;
