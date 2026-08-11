import { Reveal } from "@/components/effects";
import TechRow from "./TechRow";
import { groups } from "../../constants";
import { IconStack2 } from "@tabler/icons-react";


const TechStack = () => {
  return (
    <section
      id="stack"
      className="relative border-y border-border/40 bg-card/30 py-20 sm:py-24"
    >
      <div className="absolute inset-0 pattern-contour opacity-25" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal
          trigger="scroll"
          duration={500}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
            <IconStack2 className="size-3.5" strokeWidth={2} />
            Built with modern tools
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            The tech stack
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-[17px]">
            A pragmatic, type-safe full-stack architecture — built to learn and
            demonstrate real-world patterns.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {groups.map((group, gi) => (
            <Reveal
              key={group.label}
              trigger="scroll"
              delay={gi * 100}
              duration={500}
            >
              <div className="glass-card texture-paper relative h-full overflow-hidden rounded-2xl p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-[10px] font-bold tracking-[0.18em] text-muted-foreground uppercase">
                    {group.label}
                  </h3>
                  <span className="font-mono text-[10px] text-muted-foreground/60">
                    0{gi + 1}
                  </span>
                </div>
                <ul className="space-y-2">
                  {group.items.map((t, i) => (
                    <TechRow key={t.name} item={t} index={i} />
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
