import { Link } from "react-router-dom";
import {
  IconMapPin,
  IconArrowsMoveVertical,
  IconChartDots,
  IconActivity,
  IconChevronRight,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Reveal, FieldPlot, FarmTypeArt } from "@/components/effects";
import { Badge } from "@/components/ui/badge";
import { getFarmTypeMeta } from "../lib/farm-meta";
import { formatArea } from "../lib/format";
import { FarmActionMenu } from "./FarmActionMenu";

/**
 * FarmCard — the redesigned, bolder farm tile.
 *
 * Layout, top → bottom:
 *  • a taller illustrated banner with the farm-type art, a type badge, a live
 *    status dot, and the overflow action menu
 *  • an overlapping type icon chip that bridges banner ↔ body
 *  • name + location, then three condensed stat tiles (area, fields, active)
 *  • optional notes, a mini field plot, and a footer with the created date
 *
 * Hover lifts the card and blooms a soft glow in the farm type's own colour.
 */
export function FarmCard({
  farm,
  farmFields = [],
  index = 0,
  onDuplicate,
  onToggleActive,
  onDelete,
}) {
  const meta = getFarmTypeMeta(farm.farmType);
  const Icon = meta.icon;
  const fieldStatuses = farmFields.map((f) => f.status).filter(Boolean);
  const activeFields = farmFields.filter((f) => f.isActive).length;
  const isActive = farm.isActive !== false;

  return (
    <Reveal delay={Math.min(index * 60, 420)} duration={500} changeKey={farm.id}>
      <Link
        to={`/app/farms/${farm.id}`}
        className="group/farm glass-card texture-paper highlight-edge relative block overflow-hidden rounded-2xl py-0 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
      >
        {/* Bloom the farm type's colour behind the card on hover */}
        <div
          className={cn(
            "pointer-events-none absolute -inset-px -z-10 rounded-2xl opacity-0 blur-2xl transition-opacity duration-500 group-hover/farm:opacity-100",
            meta.bg
          )}
        />

        {/* ── Art banner ─────────────────────────────────────────────── */}
        <div className="relative h-24 overflow-hidden">
          <div className={cn("absolute inset-0 bg-gradient-to-br", meta.gradient)} />
          <FarmTypeArt variant={farm.farmType} className="relative size-full" />

          {/* top row: type badge + status + menu */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-2.5">
            <Badge
              variant={meta.color}
              className="px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase shadow-sm backdrop-blur-sm"
            >
              {meta.label}
            </Badge>

            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase shadow-sm backdrop-blur-sm",
                  isActive
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                    : "bg-muted/70 text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    isActive ? "bg-emerald-500" : "bg-muted-foreground/60"
                  )}
                />
                {isActive ? "Active" : "Archived"}
              </span>
              <div onClick={(e) => e.preventDefault()}>
                <FarmActionMenu
                  farm={farm}
                  onDuplicate={onDuplicate}
                  onToggleActive={onToggleActive}
                  onDelete={onDelete}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ──────────────────────────────────────────────────── */}
        <div className="relative px-5 pb-5">
          {/* Overlapping type icon chip */}
          <div
            className={cn(
              "absolute -top-7 left-5 flex size-14 items-center justify-center rounded-2xl shadow-lg ring-4 ring-card transition-transform duration-300 group-hover/farm:scale-105",
              meta.bg
            )}
          >
            <Icon className={cn("size-7", meta.text)} strokeWidth={1.7} />
          </div>

          {/* Title */}
          <div className="mt-8 pl-[4.5rem]">
            <h3 className="truncate font-heading text-base font-bold tracking-tight">
              {farm.name}
            </h3>
            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <IconMapPin className="size-3 shrink-0" strokeWidth={1.75} />
              <span className="truncate">{farm.location}</span>
            </div>
          </div>

          {/* Stat tiles */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <StatTile
              icon={IconArrowsMoveVertical}
              label="Area"
              value={formatArea(farm.totalArea)}
              unit="sq ft"
            />
            <StatTile
              icon={IconChartDots}
              label="Fields"
              value={String(farm.fieldCount ?? farmFields.length)}
            />
            <StatTile
              icon={IconActivity}
              label="Active"
              value={String(activeFields)}
              accent="leaf"
            />
          </div>

          {farm.notes && (
            <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {farm.notes}
            </p>
          )}

          {/* Mini field plot */}
          <div className="mt-4">
            <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium tracking-wider text-muted-foreground/70 uppercase">
              <span className="size-1.5 rounded-full bg-leaf/70" />
              Field plot · {farmFields.length} zones
            </div>
            <FieldPlot statuses={fieldStatuses} cols={6} />
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
            <span className="text-xs text-muted-foreground">
              Created{" "}
              {new Date(farm.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span
              className={cn(
                "flex items-center gap-1 text-xs font-semibold transition-all group-hover/farm:gap-1.5",
                meta.text
              )}
            >
              View
              <IconChevronRight className="size-4" strokeWidth={2} />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

/** A compact icon-led stat tile used in the card body. */
function StatTile({ icon: Icon, label, value, unit, accent }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-2 py-1.5">
      <Icon
        className={cn(
          "size-4 shrink-0",
          accent === "leaf" ? "text-leaf" : "text-muted-foreground"
        )}
        strokeWidth={1.7}
      />
      <div className="min-w-0">
        <p className="text-[9px] tracking-wider text-muted-foreground/70 uppercase">
          {label}
        </p>
        <p className="text-sm font-bold leading-tight tabular-nums">
          {value}
          {unit && (
            <span className="ml-0.5 text-[9px] font-medium text-muted-foreground">
              {unit}
            </span>
          )}
        </p>
      </div>
    </div>
  );
}
