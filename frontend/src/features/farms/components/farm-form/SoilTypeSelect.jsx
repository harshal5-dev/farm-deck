import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SoilTypeArt } from "@/components/effects";
import { SOIL_TYPE_ORDER, getSoilType } from "@/constants/farms";
import { cn } from "@/lib/utils";

/**
 * SoilTypeSelect — themed select with a tiny SoilTypeArt preview per
 * option. The trigger renders the selected soil as a compact pill;
 * the dropdown rows show the art + label + description.
 */
const SoilTypeSelect = ({ value, onChange, disabled }) => {
  const selected = getSoilType(value);
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange?.(v)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Pick a soil type">
          <span className="flex items-center gap-2 truncate">
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-md bg-muted ring-1 ring-border/40"
              )}
            >
              <SoilTypeArt
                variant={selected.art}
                className="size-7 overflow-hidden rounded-md"
              />
            </span>
            <span className="truncate font-semibold tracking-tight">
              {selected.label}
            </span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="min-w-56">
        {SOIL_TYPE_ORDER.map((id) => {
          const s = getSoilType(id);
          return (
            <SelectItem key={id} value={id} className="py-2">
              <span className="flex items-center gap-2.5">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted ring-1 ring-border/40">
                  <SoilTypeArt
                    variant={s.art}
                    className="size-7 overflow-hidden rounded-md"
                  />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="font-semibold tracking-tight">
                    {s.label}
                  </span>
                  <span className="truncate text-[10px] text-muted-foreground">
                    {s.description}
                  </span>
                </span>
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default SoilTypeSelect;
