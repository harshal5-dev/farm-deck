import { FARM_TYPES } from "@/constants/farms";
import { useListFarmTypesQuery } from "../lookupsApi";
import FarmTypeCard from "../components/farm-type/FarmTypeCard";
import FarmTypesViewSkeleton from "../components/farm-type/FarmTypesViewSkeleton";

const FarmTypesView = () => {
  const { data: farmTypes = [], isLoading, isError, refetch } =
    useListFarmTypesQuery();

  if (isLoading) {
    return <FarmTypesViewSkeleton count={4} />;
  }

  if (isError) {
    return (
      <div className="glass-card texture-paper flex flex-col items-center gap-2 rounded-2xl border border-dashed border-destructive/30 p-8 text-center">
        <p className="font-heading text-base font-semibold tracking-tight">
          Couldn't load farm types
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

  if (farmTypes.length === 0) {
    return (
      <div className="glass-card texture-paper flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border/60 p-8 text-center">
        <p className="font-heading text-base font-semibold tracking-tight">
          No farm types yet
        </p>
        <p className="max-w-md text-xs text-muted-foreground">
          The lookup service returned an empty list. Seed the{" "}
          <span className="font-mono">farm_types</span> table to see entries
          here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-2">
      {farmTypes.map((ft, i) => {
        const meta = FARM_TYPES[ft.name];
        if (!meta) return null;
        return (
          <FarmTypeCard
            key={ft.id}
            farmType={ft}
            meta={meta}
            index={i}
          />
        );
      })}
    </div>
  );
};

export default FarmTypesView;
