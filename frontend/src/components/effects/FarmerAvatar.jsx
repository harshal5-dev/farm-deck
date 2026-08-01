import { cn } from "@/lib/utils"

/**
 * FarmerAvatar — a hand-drawn cartoon farmer avatar (SVG), used in place of
 * initials for a friendly, on-brand farm feel. Drawn with flat shapes + soft
 * gradients so it scales crisply at any size.
 *
 * Use `className` to control size, e.g. className="size-9".
 */
export default function FarmerAvatar({ className }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-full", className)}
      aria-label="Farmer avatar"
      role="img"
    >
      <defs>
        <linearGradient id="fa-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5C9A0" />
          <stop offset="100%" stopColor="#E8B488" />
        </linearGradient>
        <linearGradient id="fa-hat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9BC56B" />
          <stop offset="100%" stopColor="#6FA044" />
        </linearGradient>
        <linearGradient id="fa-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#BFE0A0" />
          <stop offset="100%" stopColor="#8FC56A" />
        </linearGradient>
        <linearGradient id="fa-shirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7BA85C" />
          <stop offset="100%" stopColor="#5A8342" />
        </linearGradient>
        <clipPath id="fa-clip">
          <circle cx="32" cy="32" r="32" />
        </clipPath>
      </defs>

      <g clipPath="url(#fa-clip)">
        {/* Background */}
        <rect width="64" height="64" fill="url(#fa-bg)" />

        {/* Shoulders / shirt */}
        <path
          d="M10,64 C10,48 20,42 32,42 C44,42 54,48 54,64 Z"
          fill="url(#fa-shirt)"
        />
        {/* Collar */}
        <path
          d="M26,44 L32,50 L38,44 L38,48 C38,48 35,52 32,52 C29,52 26,48 26,48 Z"
          fill="#F5C9A0"
        />

        {/* Neck */}
        <rect x="27" y="38" width="10" height="8" rx="3" fill="url(#fa-skin)" />

        {/* Face */}
        <circle cx="32" cy="30" r="13" fill="url(#fa-skin)" />

        {/* Ears */}
        <circle cx="19" cy="30" r="3" fill="url(#fa-skin)" />
        <circle cx="45" cy="30" r="3" fill="url(#fa-skin)" />

        {/* Straw hat brim */}
        <ellipse cx="32" cy="20" rx="22" ry="5.5" fill="url(#fa-hat)" />
        {/* Hat crown */}
        <path
          d="M22,20 C22,11 26,9 32,9 C38,9 42,11 42,20 Z"
          fill="url(#fa-hat)"
        />
        {/* Hat band */}
        <path
          d="M22,18.5 C26,17 38,17 42,18.5 L42,20.5 C38,19 26,19 22,20.5 Z"
          fill="#4A6E2F"
        />
        {/* Hat highlight */}
        <path
          d="M26,13 C28,11 30,10 32,10"
          stroke="#C7E49A"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Cheeks */}
        <circle cx="25" cy="33" r="2.2" fill="#F09B8A" opacity="0.5" />
        <circle cx="39" cy="33" r="2.2" fill="#F09B8A" opacity="0.5" />

        {/* Eyes */}
        <circle cx="27" cy="29" r="1.7" fill="#3A2E22" />
        <circle cx="37" cy="29" r="1.7" fill="#3A2E22" />
        {/* Eye shine */}
        <circle cx="27.6" cy="28.4" r="0.6" fill="#fff" />
        <circle cx="37.6" cy="28.4" r="0.6" fill="#fff" />

        {/* Smile */}
        <path
          d="M28,35 Q32,38.5 36,35"
          stroke="#7A4A35"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Small sprout on hat for farm charm */}
        <g transform="translate(32,7)">
          <path
            d="M0,3 C0,0 -2,-1 -3,-0.5 M0,3 C0,0 2,-1 3,-0.5"
            stroke="#6FA044"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </g>

      {/* Ring */}
      <circle cx="32" cy="32" r="31" stroke="#fff" strokeOpacity="0.25" strokeWidth="1.5" />
    </svg>
  )
}
