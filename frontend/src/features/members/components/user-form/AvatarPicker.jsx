import { Avatar } from "@/components/avatars/avatars";
import { DEFAULT_AVATAR_ID, FARM_AVATARS, getAvatar } from "@/components/avatars/avatars-data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";

const AvatarPicker = ({ value, onChange, disabled }) => {
  const current = value || DEFAULT_AVATAR_ID;
  const currentLabel = getAvatar(current).label;
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            disabled={disabled}
            aria-label={`Change avatar, currently ${currentLabel}`}
            title={currentLabel}
            className="group relative size-12 rounded-full bg-muted shadow-sm ring-2 ring-border transition-all hover:scale-[1.04] hover:ring-leaf/50 disabled:opacity-60"
          />
        }
      >
        <span className="absolute inset-0 overflow-hidden rounded-full">
          <Avatar id={current} className="size-full" />
        </span>
        <span className="absolute -right-0.5 -bottom-0.5 flex size-5 items-center justify-center rounded-full bg-background text-muted-foreground shadow ring-1 ring-border transition-colors group-hover:bg-leaf group-hover:text-white">
          <IconChevronDown className="size-3" strokeWidth={2.5} />
        </span>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-[min(20rem,calc(100vw-2rem))] p-3"
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
            Pick an avatar
          </span>
          <span className="inline-flex items-center gap-1 truncate text-[11px] font-medium text-foreground">
            <IconCheck className="size-3 text-leaf" strokeWidth={2.5} />
            {currentLabel}
          </span>
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {FARM_AVATARS.map((a) => {
            const isSelected = a.id === current;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => onChange(a.id)}
                title={a.label}
                aria-label={`Select ${a.label} avatar`}
                aria-pressed={isSelected}
                className={cn(
                  "group/cell relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                  isSelected
                    ? "border-leaf shadow-sm ring-2 ring-leaf/30"
                    : "border-transparent hover:scale-105 hover:ring-2 hover:ring-leaf/20"
                )}
              >
                <a.Component />
                {isSelected && (
                  <span className="absolute right-0.5 bottom-0.5 flex size-3.5 items-center justify-center rounded-full bg-leaf text-white shadow ring-1 ring-background">
                    <IconCheck className="size-2" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default AvatarPicker;
