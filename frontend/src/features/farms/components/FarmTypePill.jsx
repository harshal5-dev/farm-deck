import { getFarmType } from "@/constants/farms";
import { cn } from "@/lib/utils";


const FarmTypePill = ({ farmType, size = "sm", displayName, withIcon = true }) => {
  const t = getFarmType(farmType);
  const Icon = t.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-linear-to-br font-semibold tracking-wide ring-1 ring-inset uppercase",
        t.chip,
        size === "xs" && "px-1.5 py-0.5 text-[9px]",
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "md" && "px-2.5 py-0.5 text-[11px]"
      )}
    >
      {withIcon && (
        <Icon
          className={cn(size === "xs" ? "size-2.5" : "size-3")}
          strokeWidth={2.2}
        />
      )}
      {displayName}
    </span>
  );
}

export default FarmTypePill;