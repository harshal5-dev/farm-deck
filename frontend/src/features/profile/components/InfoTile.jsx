
import { cn } from "@/lib/utils";

const InfoTile = ({ icon: Icon, label, value, accent = "leaf", mono = false }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/40 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-border/70 hover:bg-card/60 hover:shadow-md hover:shadow-foreground/5">
      <div
        className={cn(
          "pointer-events-none absolute -top-8 -right-8 size-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60",
          accent === "leaf" && "bg-leaf/25",
          accent === "sky" && "bg-sky-warm/25",
          accent === "clay" && "bg-clay/20",
          accent === "wheat" && "bg-wheat/30"
        )}
      />
      <div className="relative flex items-center gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-white/10 transition-transform duration-300 ring-inset group-hover:scale-105 dark:ring-white/5",
            accent === "leaf" &&
              "bg-linear-to-br from-leaf/20 to-leaf/5 text-leaf",
            accent === "sky" &&
              "bg-linear-to-br from-sky-warm/25 to-sky-warm/5 text-sky-warm",
            accent === "clay" &&
              "bg-linear-to-br from-clay/25 to-clay/5 text-clay-deep dark:text-clay",
            accent === "wheat" &&
              "bg-linear-to-br from-wheat/30 to-wheat/5 text-wheat"
          )}
        >
          <Icon className="size-4.5" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
            {label}
          </p>
          <p
            className={cn(
              "truncate text-sm font-semibold text-foreground",
              mono && "font-mono"
            )}
          >
            {value || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default InfoTile;
