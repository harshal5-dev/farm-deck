import { Reveal } from "@/components/effects";
import {
  IconBuildingWarehouse,
  IconChartDots,
  IconLeaf,
  IconUsers,
} from "@tabler/icons-react";

const features = [
  {
    icon: IconBuildingWarehouse,
    title: "Multi-Tenant Architecture",
    desc: "Complete data isolation per tenant — every farm, field, and crop is scoped and secure.",
    accent: "text-leaf",
    bg: "bg-leaf/15",
  },
  {
    icon: IconChartDots,
    title: "Field & Crop Tracking",
    desc: "Monitor growth stages, pH, EC, soil types, and yields across indoor, outdoor & greenhouse farms.",
    accent: "text-sky-warm",
    bg: "bg-sky-warm/15",
  },
  {
    icon: IconUsers,
    title: "Role-Based Access",
    desc: "JWT auth with RBAC — farm owners, workers, and viewers each get the right access level.",
    accent: "text-clay",
    bg: "bg-clay/15",
  },
  {
    icon: IconLeaf,
    title: "Soil Intelligence",
    desc: "Built-in soil-type knowledge base — drainage, nutrients, pH ranges, and amendments per soil.",
    accent: "text-wheat",
    bg: "bg-wheat/20",
  },
];

const Feature = () => {
  return (
    <section
      id="features"
      className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
    >
      <Reveal
        trigger="scroll"
        duration={500}
        className="mx-auto max-w-2xl text-center"
      >
        <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Everything your farm needs
        </h2>
        <p className="mt-3 text-muted-foreground">
          A complete backend and frontend built to demonstrate real-world,
          production-style architecture.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <Reveal
              key={f.title}
              trigger="scroll"
              delay={i * 90}
              duration={500}
            >
              <div className="glass-card texture-paper group relative h-full overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-leaf/10">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${f.bg}`}
                  >
                    <Icon className={`size-6 ${f.accent}`} strokeWidth={1.7} />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold tracking-tight">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
};

export default Feature;
