import { cn } from "@/lib/utils";

/**
 * FarmTypeArt — small decorative SVG motifs, one per farm type, used as the
 * header banner of each farm-type card. Each draws a distinctive scene.
 *
 * `variant`: "outdoor" | "greenhouse" | "mixed" | "indoor"
 */
const FarmTypeArt = ({ variant, className }) => {
  const art = {
    outdoor: (
      <>
        {/* sun + rays */}
        <circle cx="150" cy="70" r="26" fill="var(--wheat)" opacity="0.9" />
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const x1 = 150 + Math.cos(a) * 34;
          const y1 = 70 + Math.sin(a) * 34;
          const x2 = 150 + Math.cos(a) * 46;
          const y2 = 70 + Math.sin(a) * 46;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--wheat)"
              strokeWidth="3"
              strokeLinecap="round"
              opacity="0.7"
            />
          );
        })}
        {/* rolling field */}
        <path
          d="M0,110 C40,95 70,100 100,92 C140,82 180,96 240,88 L240,120 L0,120 Z"
          fill="var(--clay)"
          opacity="0.5"
        />
        <path
          d="M0,120 C50,108 90,112 140,104 C190,96 220,108 240,104 L240,130 L0,130 Z"
          fill="var(--leaf)"
          opacity="0.55"
        />
      </>
    ),
    greenhouse: (
      <>
        {/* sun */}
        <circle cx="200" cy="48" r="16" fill="var(--wheat)" opacity="0.7" />
        {/* greenhouse structure */}
        <g transform="translate(40,40)">
          <path
            d="M0,80 C0,28 30,8 80,8 C130,8 160,28 160,80 Z"
            fill="var(--leaf)"
            opacity="0.4"
          />
          <path
            d="M0,80 C0,28 30,8 80,8 C130,8 160,28 160,80 Z"
            fill="none"
            stroke="var(--sage-deep)"
            strokeWidth="2.5"
            opacity="0.6"
          />
          {/* hoop ribs */}
          {[20, 50, 80, 110, 140].map((x) => (
            <line
              key={x}
              x1={x}
              y1="80"
              x2={x}
              y2={80 - Math.sin((x / 160) * Math.PI) * 72}
              stroke="var(--sage-deep)"
              strokeWidth="1.5"
              opacity="0.45"
            />
          ))}
          {/* plants inside */}
          <g fill="var(--leaf)" opacity="0.7">
            {[30, 60, 90, 120].map((x, i) => (
              <circle key={x} cx={x} cy={70} r={4 + (i % 2)} />
            ))}
          </g>
        </g>
      </>
    ),
    mixed: (
      <>
        {/* left: indoor box */}
        <g transform="translate(20,45)">
          <rect
            x="0"
            y="20"
            width="70"
            height="55"
            rx="6"
            fill="var(--lagoon)"
            opacity="0.35"
          />
          <rect
            x="0"
            y="20"
            width="70"
            height="55"
            rx="6"
            fill="none"
            stroke="var(--lagoon-deep)"
            strokeWidth="2"
            opacity="0.5"
          />
          {/* grow shelves */}
          {[32, 48, 64].map((y) => (
            <line
              key={y}
              x1="8"
              y1={y}
              x2="62"
              y2={y}
              stroke="var(--lagoon-deep)"
              strokeWidth="2"
              opacity="0.6"
            />
          ))}
        </g>
        {/* divider arrows */}
        <g transform="translate(108,68)" opacity="0.6">
          <path
            d="M0,0 L14,0 M10,-4 L14,0 L10,4"
            stroke="var(--lagoon)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M24,0 L10,0 M14,-4 L10,0 L14,4"
            stroke="var(--lagoon)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
        {/* right: outdoor sun + field */}
        <circle cx="180" cy="50" r="16" fill="var(--wheat)" opacity="0.8" />
        <path
          d="M150,100 C170,92 190,96 240,90 L240,120 L150,120 Z"
          fill="var(--leaf)"
          opacity="0.5"
        />
      </>
    ),
    indoor: (
      <>
        {/* walls */}
        <rect
          x="20"
          y="20"
          width="200"
          height="100"
          rx="8"
          fill="var(--soil)"
          opacity="0.18"
        />
        {/* ceiling grow lights */}
        <g>
          {[60, 110, 160].map((x) => (
            <g key={x}>
              <rect
                x={x - 12}
                y="26"
                width="24"
                height="5"
                rx="2.5"
                fill="var(--wheat)"
                opacity="0.9"
              />
              {/* light glow */}
              <path
                d={`M${x - 12},31 L${x + 12},31 L${x + 20},52 L${x - 20},52 Z`}
                fill="var(--wheat)"
                opacity="0.18"
              />
            </g>
          ))}
        </g>
        {/* vertical grow racks */}
        <g transform="translate(0,55)">
          {[40, 100, 160].map((x) => (
            <g key={x}>
              <rect
                x={x}
                y="0"
                width="34"
                height="55"
                rx="3"
                fill="var(--leaf)"
                opacity="0.3"
              />
              {[12, 30].map((y) => (
                <line
                  key={y}
                  x1={x}
                  y1={y}
                  x2={x + 34}
                  y2={y}
                  stroke="var(--leaf)"
                  strokeWidth="2.5"
                  opacity="0.55"
                />
              ))}
            </g>
          ))}
        </g>
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 240 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-full", className)}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {art[variant] || art.outdoor}
    </svg>
  );
};

export default FarmTypeArt;
