import { getZoneType } from "@/features/fields/constants";
import { useListZoneTypesQuery } from "../lookupsApi";
import ZoneTypeCard from "../components/zone-type/ZoneTypeCard";
import ZoneTypesViewSkeleton from "../components/zone-type/ZoneTypesViewSkeleton";

const ZoneTypesView = () => {
  const { data: zoneTypes = [], isLoading, isError, refetch } =
    useListZoneTypesQuery();

  if (isLoading) {
    return <ZoneTypesViewSkeleton count={4} />;
  }

  if (isError) {
    return (
      <div className="glass-card texture-paper flex flex-col items-center gap-2 rounded-2xl border border-dashed border-destructive/30 p-8 text-center">
        <p className="font-heading text-base font-semibold tracking-tight">
          Couldn't load zone types
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

  if (zoneTypes.length === 0) {
    return (
      <div className="glass-card texture-paper flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border/60 p-8 text-center">
        <p className="font-heading text-base font-semibold tracking-tight">
          No zone types yet
        </p>
        <p className="max-w-md text-xs text-muted-foreground">
          The lookup service returned an empty list. Seed the{" "}
          <span className="font-mono">zone_types</span> table to see entries
          here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-2">
      {zoneTypes.map((zt, i) => {
        const meta = getZoneType(zt.name);
        return (
          <ZoneTypeCard
            key={zt.id}
            zoneType={zt}
            meta={meta}
            index={i}
          />
        );
      })}
    </div>
  );
};

export default ZoneTypesView;
