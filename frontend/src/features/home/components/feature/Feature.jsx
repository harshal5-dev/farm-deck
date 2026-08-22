import { Reveal, FarmTypeArt, SoilTypeArt } from "@/components/effects";
import {
  IconBuildingWarehouse,
  IconChartDots,
  IconUsers,
  IconLeaf,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: IconBuildingWarehouse,
    title: "Multi-workspace by design",
    desc: "Every farm, field, and crop is scoped to a workspace. Complete data isolation, row-level security, and a single Postgres backend serving many workspaces.",
    accent: "leaf",
    art: <FarmTypeArt variant="greenhouse" className="size-full" />,
    span: "lg:col-span-2",
  },
  {
    icon: IconChartDots,
    title: "Field & crop tracking",
    desc: "Growth stages, pH, EC, soil types, and yields — indoor, outdoor, and greenhouse.",
    accent: "sky",
    art: <SoilTypeArt variant="loam" className="size-full" />,
    span: "lg:col-span-1",
  },
  {
    icon: IconUsers,
    title: "Role-based access",
    desc: "JWT + RBAC: owners, workers, and viewers get exactly the access they need.",
    accent: "clay",
    art: <SoilTypeArt variant="clay" className="size-full" />,
    span: "lg:col-span-1",
  },
  {
    icon: IconLeaf,
    title: "Soil intelligence",
    desc: "Drainage, nutrients, pH ranges, and amendments — built into the lookup library.",
    accent: "wheat",
    art: <SoilTypeArt variant="sandy_loam" className="size-full" />,
    span: "lg:col-span-2",
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
        <span className="inline-flex items-center gap-1.5 rounded-full border border-leaf/30 bg-leaf/10 px-3 py-1 text-xs font-semibold text-leaf">
          What's inside
        </span>
        <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Everything your farm needs.
        </h2>
        <p className="mt-3 text-base text-muted-foreground sm:text-[17px]">
          A complete backend and frontend built to demonstrate real-world,
          production-style architecture.
        </p>
      </Reveal>

      <div className="mt-14 grid auto-rows-min gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <Reveal
            key={f.title}
            trigger="scroll"
            delay={i * 80}
            duration={500}
            className={cn("h-full", f.span)}
          >
            <FeatureCard feature={f} featured={i === 0} />
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default Feature;
