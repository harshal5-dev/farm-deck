import { FARM_AVATARS, getAvatar } from "@/components/avatars/avatars-data";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { IconCamera, IconCheck, IconChevronDown } from "@tabler/icons-react";


function AvatarPopover({ value, onChange }) {
  const currentLabel = getAvatar(value).label;
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label="Choose a profile avatar"
            className="group inline-flex items-center gap-1.5 rounded-xl border border-border/40 bg-card/40 px-3 py-2 text-sm font-medium transition-all hover:border-leaf/50 hover:bg-card/70 hover:shadow-sm"
          />
        }
      >
        <IconCamera
          className="size-3.5 text-muted-foreground"
          strokeWidth={1.75}
        />
        <span className="truncate">{currentLabel}</span>
        <IconChevronDown
          className="size-3.5 text-muted-foreground transition-transform group-data-popup-open:rotate-180"
          strokeWidth={1.75}
        />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
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
                onClick={() => onChange(a.id)}
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

export default AvatarPopover;
