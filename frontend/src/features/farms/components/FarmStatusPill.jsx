import { cn } from "@/lib/utils";
import { getFarmStatus } from "@/constants/farms";

const FarmStatusPill = ({ active }) => {
  const s = getFarmStatus(active ? "active" : "inactive");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase backdrop-blur-sm",
        s.chip
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          active ? "relative flex bg-emerald-500" : s.dot
        )}
      >
        {active && (
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
        )}
      </span>
      {s.label}
    </span>
  );
};

export default FarmStatusPill;
