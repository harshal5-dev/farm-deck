import { Reveal } from "@/components/effects";
import { cn } from "@/lib/utils";


const accentMap = {
  leaf: {
    chip: "bg-leaf/15 text-leaf ring-leaf/20",
    glow: "bg-leaf/10",
  },
  sky: {
    chip: "bg-sky-warm/15 text-sky-warm ring-sky-warm/20",
    glow: "bg-sky-warm/10",
  },
  wheat: {
    chip: "bg-wheat/20 text-wheat ring-wheat/30",
    glow: "bg-wheat/10",
  },
  clay: {
    chip: "bg-clay/15 text-clay-deep ring-clay/20 dark:text-clay",
    glow: "bg-clay/10",
  },
};

const ComingSoonCard = ({ item, delay }) => {
  const meta = accentMap[item.accent];
  const Icon = item.icon;

  return (
    <Reveal delay={delay} duration={500}>
      <div className="glass-card texture-paper group relative h-full overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-leaf/10">
        {/* hover glow */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -top-12 -right-8 size-32 rounded-full opacity-60 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-90",
            meta.glow
          )}
        />

        <div className="relative flex h-full flex-col">
          <div className="flex items-start justify-between gap-3">
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
                meta.chip
              )}
            >
              <Icon className="size-6" strokeWidth={1.7} />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/50 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              <span className="size-1.5 rounded-full bg-wheat" />
              Coming soon
            </span>
          </div>

          <h3 className="mt-5 font-heading text-lg font-bold tracking-tight">
            {item.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {item.desc}
          </p>
        </div>
      </div>
    </Reveal>
  );
};

export default ComingSoonCard;
