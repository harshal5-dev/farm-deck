import { Reveal } from "@/components/effects";
import ResourceExplorer from "@/components/layout/ResourceExplorer";
import QueryState from "@/components/feedback/query-state";
import { Empty } from "@/components/ui/empty";
import { IconArrowLeft, IconShovel, IconStack3 } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useGetSoilTypesQuery } from "../api/soilTypeApi";
import { soilTypeMeta } from "../constants";
import SoilTypeCard from "../components/SoilTypeCard";
import SoilTypeCardSkeleton from "../components/SoilTypeCardSkeleton";

const soilIcons = {
  loamy: "🌿",
  sandy: "🏜️",
  sandy_loam: "🌾",
  clay: "🟤",
  clay_loam: "🟫",
  silt: "💧",
  chalky: "⚪",
  peaty: "🌑",
};

const SoilType = () => {
  const soilResponse = useGetSoilTypesQuery();
  const { data = {} } = soilResponse;
  const { soilTypes = [], total = 0 } = data;

  const renderListItem = ({ item, active, onSelect }) => {
    const meta = soilTypeMeta[item.name] || soilTypeMeta.loamy;
    return (
      <button
        key={item.id}
        onClick={() => onSelect(item.id)}
        className={cn(
          "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150",
          active
            ? "bg-leaf/10 ring-1 ring-inset ring-leaf/20"
            : "hover:bg-muted/50"
        )}
      >
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg text-base",
            meta.bg
          )}
        >
          {soilIcons[item.name] || "🌱"}
        </span>
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-sm font-semibold",
              active ? "text-foreground" : "text-foreground/80"
            )}
          >
            {item.displayName}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            pH {item.phRange} · {item.drainage} drainage
          </p>
        </div>
        {active && (
          <span className="size-2 shrink-0 rounded-full bg-leaf" />
        )}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <Reveal duration={450}>
        <div>
          <Link
            to="/app/fields"
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <IconArrowLeft className="size-4" strokeWidth={1.75} />
            Back to Fields
          </Link>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-wheat/20 text-wheat ring-1 ring-wheat/20 ring-inset">
                <IconShovel className="size-6" strokeWidth={1.7} />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold tracking-tight">
                  Soil Types
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Browse all soils on the left — click any to see its full
                  profile. No scrolling required.
                </p>
              </div>
            </div>
            <span className="hidden shrink-0 rounded-full border border-border/50 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground sm:inline-flex">
              {total} types
            </span>
          </div>
        </div>
      </Reveal>

      <QueryState
        query={soilResponse}
        data={soilTypes}
        entity="soil types"
        loading={
          <ResourceExplorer
            items={[]}
            isLoading
            skeletonCount={6}
            renderListItem={renderListItem}
            renderDetail={() => null}
            ListSkeleton={() => (
              <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                <div className="size-9 animate-pulse rounded-lg bg-muted" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                </div>
              </div>
            )}
            DetailSkeleton={() => <SoilTypeCardSkeleton />}
          />
        }
        empty={
          <Empty className="py-20">
            <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <IconStack3 className="size-6" strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium">No soil types found</p>
            <p className="text-xs text-muted-foreground">
              Soil types will appear here once they&apos;re added.
            </p>
          </Empty>
        }
      >
        <ResourceExplorer
          items={soilTypes}
          isLoading={false}
          skeletonCount={6}
          renderListItem={renderListItem}
          renderDetail={(item) => <SoilTypeCard type={item} />}
          ListSkeleton={() => null}
          DetailSkeleton={() => <SoilTypeCardSkeleton />}
          emptyState="No soil types found."
        />
      </QueryState>
    </div>
  );
};

export default SoilType;
