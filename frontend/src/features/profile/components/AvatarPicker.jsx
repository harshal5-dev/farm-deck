import { useState } from "react";
import { FARM_AVATARS, getAvatar } from "@/components/avatars/avatars-data";
import { Avatar } from "@/components/avatars/avatars";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getRole } from "@/constants/roles";
import {
  IconCamera,
  IconCheck,
  IconChevronDown,
} from "@tabler/icons-react";

const AvatarPicker = ({ value, onChange, disabled, role, compact = false }) => {
  const r = getRole(role || "viewer");
  const currentLabel = getAvatar(value).label;
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            disabled={disabled}
            aria-label={`Change avatar, currently ${currentLabel}`}
            className={cn(
              "group relative shrink-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60",
              compact
                ? "rounded-full hover:scale-105 active:scale-95 disabled:hover:scale-100"
                : "inline-flex flex-col items-center gap-2 rounded-xl px-1 py-1 hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100"
            )}
          />
        }
      >
        <span className="relative">
          {/* Role-tinted glow on hover */}
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute -inset-1 rounded-full opacity-60 blur-md transition-opacity duration-300 group-hover:opacity-80",
              r.bg
            )}
          />
          {/* Avatar with role-gradient ring */}
          <span
            className={cn(
              "relative block overflow-hidden rounded-full bg-linear-to-br p-0.5 shadow-md ring-2 ring-card",
              r.gradient
            )}
          >
            <Avatar
              id={value}
              className={compact ? "size-12" : "size-16"}
            />
          </span>

          <span
            className={cn(
              "absolute right-0 bottom-0 flex items-center justify-center rounded-full bg-card shadow ring-2 ring-card transition-transform duration-200 group-hover:scale-110",
              compact ? "size-5" : "size-6"
            )}
          >
            <IconCamera
              className={cn(
                "text-muted-foreground",
                compact ? "size-2.5" : "size-3"
              )}
              strokeWidth={1.85}
            />
          </span>
        </span>

        {!compact && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase group-hover:text-foreground">
            <span className="truncate">{currentLabel}</span>
            <IconChevronDown
              className="size-3 transition-transform duration-200 group-data-popup-open:rotate-180"
              strokeWidth={1.75}
            />
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent
        align={compact ? "start" : "start"}
        sideOffset={compact ? 6 : 8}
        className="w-[min(28rem,calc(100vw-2rem))] p-4"
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
            Pick a profile avatar
          </p>
          <Badge variant="amber" className="gap-1">
            {FARM_AVATARS.length} styles
          </Badge>
        </div>
        <div className="grid max-h-72 grid-cols-6 gap-2 overflow-y-auto pr-1 sm:gap-2.5">
          {FARM_AVATARS.map((a) => {
            const isSelected = a.id === value;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => {
                  onChange(a.id);
                  setOpen(false);
                }}
                title={a.label}
                aria-label={`Select ${a.label} avatar`}
                aria-pressed={isSelected}
                className={cn(
                  "group/cell relative aspect-square overflow-hidden rounded-xl border-2 transition-all",
                  isSelected
                    ? "scale-[1.04] border-leaf shadow-md ring-2 shadow-leaf/25 ring-leaf/30"
                    : "border-border/40 hover:scale-[1.03] hover:border-leaf/50 hover:shadow-sm hover:shadow-leaf/10"
                )}
              >
                <a.Component />
                {isSelected && (
                  <div className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-leaf text-white shadow ring-1 ring-background">
                    <IconCheck className="size-2.5" strokeWidth={3} />
                  </div>
                )}
                <div
                  className={cn(
                    "absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-0.5 py-0.5 text-center transition-opacity",
                    isSelected
                      ? "opacity-100"
                      : "opacity-0 group-hover/cell:opacity-100"
                  )}
                >
                  <p className="truncate text-[8px] font-semibold tracking-wide text-white uppercase">
                    {a.label}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Your choice saves when you click{" "}
          <span className="font-medium text-foreground">Save changes</span>{" "}
          below.
        </p>
      </PopoverContent>
    </Popover>
  );
}

export default AvatarPicker;
