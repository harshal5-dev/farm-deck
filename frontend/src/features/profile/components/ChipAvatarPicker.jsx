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
import {
  IconCheck,
  IconChevronDown,
} from "@tabler/icons-react";

const ChipAvatarPicker = ({ value, onChange, disabled }) => {
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
              "group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/40 bg-card/60 py-0.5 pl-1 pr-1.5 text-xs font-medium transition-all hover:border-leaf/50 hover:bg-card/80 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60 mt-[.2rem]"
            )}
          />
        }
      >
        <Avatar id={value} className="size-6" />
        <span className="hidden max-w-24 truncate font-semibold tracking-tight sm:inline-block">
          {currentLabel}
        </span>
        <IconChevronDown
          className={cn(
            "size-3 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180"
          )}
          strokeWidth={1.85}
        />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={6}
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

export default ChipAvatarPicker;
