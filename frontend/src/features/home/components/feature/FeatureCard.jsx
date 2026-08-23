import { cn } from "@/lib/utils";
import { accentMap } from "../../constants";
import { IconArrowUpRight } from "@tabler/icons-react";
import TenantList from "./TenantList";
import SoilReadout from "./SoilReadout";



const FeatureCard = ({ feature, featured }) => {
  const meta = accentMap[feature.accent];
  const Icon = feature.icon;
  const showArt = !!feature.art;
  const artSize = featured ? "h-44 w-44" : "h-28 w-28";

  return (
    <div
      className={cn(
        "glass-card texture-paper group relative h-full overflow-hidden rounded-2xl p-6 transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl hover:shadow-foreground/5",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100",
        "before:bg-linear-to-br before:via-transparent before:to-transparent",
        meta.glow,
        "before:to-transparent"
      )}
    >
      {/* Decorative art bleed (top-right) */}
      {showArt && (
        <div
          className={cn(
            "pointer-events-none absolute -top-3 -right-4 transition-opacity duration-500 group-hover:opacity-90",
            artSize,
            featured ? "opacity-60" : "opacity-40"
          )}
        >
          <div className="absolute inset-0 bg-linear-to-br to-transparent blur-2xl" />
          <div className="relative h-full w-full">{feature.art}</div>
        </div>
      )}

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-white/10 ring-inset dark:ring-white/5",
              meta.icon
            )}
          >
            <Icon className="size-6" strokeWidth={1.7} />
          </div>
          <IconArrowUpRight
            className="size-5 text-muted-foreground/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground/60"
            strokeWidth={1.75}
          />
        </div>

        <h3
          className={cn(
            "mt-5 font-heading font-bold tracking-tight",
            featured ? "text-2xl" : "text-lg"
          )}
        >
          {feature.title}
        </h3>
        <p
          className={cn(
            "mt-2 leading-relaxed text-muted-foreground",
            featured ? "text-[15px] sm:max-w-md" : "text-sm"
          )}
        >
          {feature.desc}
        </p>

        {/* Featured: 2-col layout with workspace list mock on the right */}
        {featured && (
          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.2fr] lg:items-end">
            <div className="flex flex-wrap gap-2">
              {[
                "Workspace-scoped",
                "Row-level security",
                "Audit log",
                "Workspace switcher",
              ].map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase",
                    meta.chip
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
            <TenantList />
          </div>
        )}

        {/* Soil intelligence — compact stat strip */}
        {feature.title === "Soil intelligence" && <SoilReadout />}
      </div>
    </div>
  );
}

export default FeatureCard;
