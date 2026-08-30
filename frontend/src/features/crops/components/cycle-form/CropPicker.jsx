import {
  IconBeach,
  IconCheck,
  IconClockHour4,
  IconDroplet,
  IconLeaf,
  IconSun,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { CROP_TYPE_ORDER, getCropType } from "../../constants";
import {
  formatEcRange,
  formatPhRange,
  formatPpmRange,
} from "../../lib/crop";

/**
 * Crop catalog picker — a compact, horizontal-row grid grouped by
 * category. Each row carries the variety's icon, name, tagline and
 * an inline metrics line (pH / EC / PPM / days / light), so the
 * whole picker fits in roughly half the vertical space of a tall
 * card-grid layout. The selected row recolors, gets a strong ring,
 * and shows a contrasting check badge that reads on both light and
 * dark themes.
 */
const CropPicker = ({ crops, value, onChange, disabled }) => {
  const grouped = CROP_TYPE_ORDER.map((cat) => ({
    category: cat,
    items: crops.filter((c) => c.category === cat),
  })).filter((g) => g.items.length > 0);

  if (crops.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/60 bg-muted/30 px-4 py-6 text-center text-xs text-muted-foreground">
        The crop catalog is empty — add a crop first to plan a cycle.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {grouped.map(({ category, items }) => {
        const t = getCropType(category);
        const Icon = t.icon;
        return (
          <div key={category}>
            {/* Category header — icon badge + label + count + thin divider */}
            <div className="mb-1.5 flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex size-5 items-center justify-center rounded-md text-white shadow-sm ring-1 ring-card bg-linear-to-br",
                  t.gradient
                )}
              >
                <Icon className="size-3" strokeWidth={2.2} />
              </span>
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                {t.label}
              </span>
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-muted/60 px-1.5 text-[10px] font-bold tabular-nums text-muted-foreground">
                {items.length}
              </span>
              <div
                className={cn(
                  "h-px flex-1 bg-linear-to-r to-transparent",
                  t.gradient
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((crop) => (
                <Row
                  key={crop.id}
                  crop={crop}
                  category={category}
                  selected={value === crop.id}
                  onSelect={onChange}
                  disabled={disabled}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const TONE = {
  lagoon: {
    text: "text-lagoon-deep dark:text-lagoon",
    bg: "bg-lagoon/12",
  },
  leaf: { text: "text-leaf", bg: "bg-leaf/12" },
  wheat: { text: "text-wheat-deep dark:text-wheat", bg: "bg-wheat/15" },
  clay: { text: "text-clay-deep dark:text-clay", bg: "bg-clay/15" },
};

/**
 * Horizontal compact card — single row with the icon badge on the
 * left, name + tagline + an inline metrics strip in the middle, and
 * the selected check badge on the right when chosen.
 */
const Row = ({ crop, category, selected, onSelect, disabled }) => {
  const t = getCropType(category);
  const Icon = t.icon;

  const ph = formatPhRange(crop.targetPhMin, crop.targetPhMax);
  const ec = formatEcRange(crop.targetEcMin, crop.targetEcMax);
  const ppm = formatPpmRange(crop.targetPpmMin, crop.targetPpmMax);

  // Inline metric chips — only render the ones we have data for.
  const chips = [];
  if (ph) chips.push({ icon: IconDroplet, label: "pH", value: ph, tone: "lagoon" });
  if (ec) chips.push({ icon: IconLeaf, label: "EC", value: ec, tone: "leaf" });
  if (ppm) chips.push({ icon: IconBeach, label: "PPM", value: ppm, tone: "wheat" });
  if (crop.daysToHarvest != null) {
    chips.push({
      icon: IconClockHour4,
      label: "days",
      value: `${crop.daysToHarvest}d`,
      tone: "clay",
    });
  }
  if (crop.lightHoursPerDay != null) {
    chips.push({
      icon: IconSun,
      label: "light",
      value: `${crop.lightHoursPerDay}h`,
      tone: "wheat",
    });
  }

  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect(crop.id)}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "group/row relative flex items-center gap-2.5 overflow-hidden rounded-xl border p-2 text-left transition-all duration-200",
        "hover:translate-x-0.5 hover:shadow-sm",
        selected
          ? cn(
              "border-transparent shadow-md ring-2",
              t.ring,
              t.bgSoft
            )
          : "border-border/50 bg-card/40 hover:border-border hover:bg-card/70"
      )}
    >
      {/* Left gradient strip — shows the category on idle rows */}
      <span
        className={cn(
          "absolute inset-y-1 left-0 w-0.5 rounded-full transition-opacity",
          selected ? "opacity-100" : "opacity-50 group-hover/row:opacity-80",
          "bg-linear-to-b",
          t.gradient
        )}
      />

      {/* Icon badge */}
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br text-white shadow-sm ring-1 ring-card",
          t.gradient
        )}
      >
        <Icon className="size-4" strokeWidth={2.1} />
      </span>

      {/* Middle — name + tagline + inline metric chips */}
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-[13px] font-bold tracking-tight",
            selected ? t.text : "text-foreground"
          )}
        >
          {crop.name}
        </p>
        {chips.length > 0 ? (
          <div className="mt-0.5 flex flex-wrap items-center gap-1">
            {chips.slice(0, 4).map((c, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-tight text-muted-foreground"
              >
                <c.icon
                  className={cn("size-2.5", TONE[c.tone].text)}
                  strokeWidth={2.4}
                />
                <span className="tabular-nums">{c.value}</span>
                {i < Math.min(chips.length, 4) - 1 && (
                  <span className="text-muted-foreground/30">·</span>
                )}
              </span>
            ))}
          </div>
        ) : (
          <p className="truncate text-[10px] text-muted-foreground/80">
            {t.tagline}
          </p>
        )}
      </div>

      {/* Selected check — solid white badge with category ring & tone.
          Reads on light + dark themes against any gradient. */}
      {selected ? (
        <span
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-full bg-white shadow-md ring-2",
            t.ring
          )}
        >
          <IconCheck className={cn("size-3.5", t.text)} strokeWidth={3} />
        </span>
      ) : (
        <span className="size-6 shrink-0" aria-hidden="true" />
      )}
    </button>
  );
};

export default CropPicker;