import { useId } from "react";
import { cn } from "@/lib/utils";

export const Mark = ({ className }) => {
  const uid = useId().replace(/[:#]/g, "");
  const bodyId = `fd-leaf-body-${uid}`;
  const shineId = `fd-leaf-shine-${uid}`;
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className || "size-full"}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={bodyId}
          x1="24"
          y1="4"
          x2="24"
          y2="46"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#66BB6A" />
          <stop offset="45%" stopColor="#43A047" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
        <linearGradient
          id={shineId}
          x1="24"
          y1="4"
          x2="24"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Leaf body */}
      <path
        d="M24 4 C 17 6, 7 16, 6 27 C 5 41, 15 46, 24 46 C 33 46, 43 41, 42 27 C 41 16, 31 6, 24 4 Z"
        fill={`url(#${bodyId})`}
      />

      {/* Sun rising behind the horizon — slow breathing */}
      <g
        style={{ transformOrigin: "32px 20px", transformBox: "fill-box" }}
        className="animate-sun-pulse"
      >
        <circle cx="32" cy="20" r="4.5" fill="#FFD56B" opacity="0.95" />
        <circle cx="32" cy="20" r="7" fill="#FFD56B" opacity="0.3" />
      </g>

      {/* Horizon line */}
      <path
        d="M0 32 C 10 30, 20 30, 24 32 C 28 34, 38 34, 48 32 L 48 48 L 0 48 Z"
        fill="#1F5C3A"
        opacity="0.4"
      />

      {/* Sprout climbing toward the sun — gentle sway */}
      <g
        style={{ transformOrigin: "24px 32px", transformBox: "fill-box" }}
        className="animate-sprout-sway"
      >
        <path
          d="M24 32 L 24 18"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.95"
        />
        <circle cx="24" cy="17" r="1.6" fill="#FFFFFF" />
      </g>

      {/* Vein down the middle */}
      <line
        x1="24"
        y1="8"
        x2="24"
        y2="42"
        stroke="#FFFFFF"
        strokeWidth="0.6"
        opacity="0.22"
      />

      {/* Top highlight */}
      <path
        d="M24 4 C 17 6, 7 16, 6 27 L 7 25 C 11 14, 17 7, 24 5 C 31 7, 37 14, 41 25 L 42 27 C 41 16, 31 6, 24 4 Z"
        fill={`url(#${shineId})`}
      />

      {/* Outline — thicker so the silhouette pops on light backgrounds */}
      <path
        d="M24 4 C 17 6, 7 16, 6 27 C 5 41, 15 46, 24 46 C 33 46, 43 41, 42 27 C 41 16, 31 6, 24 4 Z"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="0.9"
        opacity="0.55"
      />
    </svg>
  );
};

const Logo = ({
  variant = "full",
  className,
  withSubtitle = false,
  animate = false,
}) => {
  if (variant === "mark") {
    return (
      <div className={cn("size-9", animate && "animate-logo-pop", className)}>
        <Mark />
      </div>
    );
  }

  const MarkBadge = (
    <div
      className={cn(
        "relative shrink-0",
        animate && "animate-logo-pop transition-transform duration-300",
        className
      )}
    >
      <div className="size-10">
        <Mark />
      </div>
    </div>
  );

  if (variant === "badge") {
    return MarkBadge;
  }

  if (variant === "stacked") {
    return (
      <div
        className={cn(
          "group/logo flex flex-col items-center gap-2 leading-none",
          className
        )}
      >
        <div
          className={cn(
            "relative shrink-0",
            animate && "animate-logo-pop transition-transform duration-300"
          )}
        >
          <div className="size-14">
            <Mark />
          </div>
        </div>
        <h1 className="font-heading text-lg font-bold tracking-tight">
          <span className="text-foreground">Farm</span>
          <span className="bg-linear-to-br from-leaf via-sage to-sage-deep bg-clip-text text-transparent">
            deck
          </span>
        </h1>
        {withSubtitle && (
          <div className="mt-1 flex items-center gap-1.5">
            <span className="h-px w-4 bg-linear-to-r from-leaf/60 to-transparent" />
            <span className="text-[9px] font-semibold tracking-[0.18em] text-muted-foreground/70 uppercase">
              Cultivate · Track · Grow
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("group/logo flex items-center gap-3", className)}>
      {MarkBadge}
      <div className="flex flex-col leading-none">
        <h1 className="font-heading text-[17px] font-bold tracking-tight">
          <span className="text-foreground">Farm</span>
          <span className="bg-linear-to-br from-leaf via-sage to-sage-deep bg-clip-text text-transparent">
            deck
          </span>
        </h1>
        {withSubtitle && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="h-px w-4 bg-linear-to-r from-leaf/60 to-transparent" />
            <span className="text-[9px] font-semibold tracking-[0.18em] text-muted-foreground/70 uppercase">
              Cultivate · Track · Grow
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Logo;
