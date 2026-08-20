import { cn } from "@/lib/utils";
import { FarmTypeArt } from "@/components/effects";
import { getFarmType } from "@/constants/farms";

const SIZES = {
  sm: "size-8",
  md: "size-10",
  lg: "size-14",
  xl: "size-16",
  "2xl": "size-20",
};

/**
 * FarmIconArt — circular icon for a farm, showing the per-type FarmTypeArt
 * cropped to a circle, framed with a gradient ring in the farm-type
 * accent color. Used in dialogs, list rows, and form previews.
 */
const FarmIconArt = ({ farm, size = "lg" }) => {
  const t = getFarmType(farm?.farmType);
  const px = SIZES[size] || SIZES.lg;
  return (
    <div className={cn("relative shrink-0", px)}>
      <div
        className={cn(
          "absolute -inset-0.5 rounded-full opacity-70 blur-md",
          t.bg
        )}
      />
      <div
        className={cn(
          "relative overflow-hidden rounded-full bg-background p-0.5 shadow-sm ring-2 ring-background",
          t.ring
        )}
      >
        <div className="relative size-full overflow-hidden rounded-full">
          <FarmTypeArt variant={t.art} className="size-full" />
        </div>
      </div>
    </div>
  );
};

export default FarmIconArt;
