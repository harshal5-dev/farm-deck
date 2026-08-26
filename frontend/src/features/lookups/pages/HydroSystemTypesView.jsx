import { getHydroSystemType } from "@/features/fields/constants";
import { useListHydroSystemTypesQuery } from "../lookupsApi";
import HydroSystemCard from "../components/hydro-system/HydroSystemCard";
import HydroSystemTypesViewSkeleton from "../components/hydro-system/HydroSystemTypesViewSkeleton";

const HydroSystemTypesView = () => {
  const { data: hydroSystemTypes = [], isLoading, isError, refetch } =
    useListHydroSystemTypesQuery();

  if (isLoading) {
    return <HydroSystemTypesViewSkeleton count={6} />;
  }

  if (isError) {
    return (
      <div className="glass-card texture-paper flex flex-col items-center gap-2 rounded-2xl border border-dashed border-destructive/30 p-8 text-center">
        <p className="font-heading text-base font-semibold tracking-tight">
          Couldn't load hydroponic system types
        </p>
        <p className="max-w-md text-xs text-muted-foreground">
          The lookup service didn't respond.
        </p>
        <button
          type="button"
          onClick={refetch}
          className="mt-1 inline-flex h-8 items-center rounded-xl bg-foreground px-3 text-xs font-semibold text-background shadow-sm hover:brightness-105"
        >
          Try again
        </button>
      </div>
    );
  }

  if (hydroSystemTypes.length === 0) {
    return (
      <div className="glass-card texture-paper flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border/60 p-8 text-center">
        <p className="font-heading text-base font-semibold tracking-tight">
          No hydroponic system types yet
        </p>
        <p className="max-w-md text-xs text-muted-foreground">
          The lookup service returned an empty list. Seed the{" "}
          <span className="font-mono">hydro_system_types</span> table to see
          entries here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-2">
      {hydroSystemTypes.map((h, i) => {
        const meta = getHydroSystemType(h.name);
        return (
          <HydroSystemCard
            key={h.id}
            hydroSystemType={h}
            meta={meta}
            index={i}
          />
        );
      })}
    </div>
  );
};

export default HydroSystemTypesView;
