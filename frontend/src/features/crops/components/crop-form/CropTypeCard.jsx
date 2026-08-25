import { IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { getCropType } from "../../constants";
import CropTypeArt from "../CropTypeArt";

/**
 * Selectable card for one crop type from the lookups
 * (`{ id, name, displayName, description }`). The selected value is
 * the row's UUID (a future crops.crop_type_id FK); visual meta is
 * derived from the type's `name` via CROP_TYPES.
 */
const CropTypeCard = ({ cropType, selected, onSelect, disabled }) => {
  const t = getCropType(cropType?.name);
  const Icon = t.icon;

  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect(cropType.id)}
      disabled={disabled}
      className={cn(
        "group/type relative flex flex-col items-stretch overflow-hidden rounded-2xl border p-0 text-left transition-all duration-200",
        selected
          ? cn("border-transparent shadow-md ring-2", t.ring)
          : "border-border/50 bg-card/40 hover:border-border hover:bg-card/70"
      )}
    >
      {/* Top art band — illustrated per plant family */}
      <div className="relative h-16 w-full overflow-hidden">
        <CropTypeArt variant={t.category} className="size-full" />
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-br transition-opacity duration-200",
            selected ? "opacity-50" : "opacity-25",
            t.gradient
          )}
        />
        <div className="absolute inset-0 bg-linear-to-t from-card via-card/30 to-transparent" />
        {/* Top-left type icon badge */}
        <div className="absolute top-2 left-2">
          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-full bg-linear-to-br text-white shadow-md ring-2 ring-card",
              t.gradient
            )}
          >
            <Icon className="size-3.5" strokeWidth={2.1} />
          </span>
        </div>
        {/* Selected check */}
        {selected && (
          <span
            className={cn(
              "absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-linear-to-br text-white shadow-sm ring-2 ring-card",
              t.gradient
            )}
          >
            <IconCheck className="size-3" strokeWidth={3} />
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex items-center gap-2 p-2.5">
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-xs font-bold tracking-tight",
              selected ? t.text : "text-foreground"
            )}
          >
            {cropType?.displayName || t.label}
          </p>
          <p className="line-clamp-2 text-[10px] leading-snug text-muted-foreground">
            {cropType?.description || t.tagline}
          </p>
        </div>
      </div>
    </button>
  );
};

export default CropTypeCard;
