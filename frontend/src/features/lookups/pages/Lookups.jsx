import {
  IconBook2,
  IconCategory,
  IconDroplets,
  IconGrain,
  IconLayoutGrid,
  IconRefresh,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/effects";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  useListFarmTypesQuery,
  useListZoneTypesQuery,
  useListSoilTypesQuery,
  useListHydroSystemTypesQuery,
} from "../lookupsApi";
import FarmTypesView from "./FarmTypesView";
import ZoneTypesView from "./ZoneTypesView";
import SoilTypesView from "./SoilTypesView";
import HydroSystemTypesView from "./HydroSystemTypesView";

const LOOKUP_TABS = [
  {
    value: "farm-types",
    label: "Farm type",
    icon: IconCategory,
    content: FarmTypesView,
  },
  {
    value: "zone-types",
    label: "Zone type",
    icon: IconLayoutGrid,
    content: ZoneTypesView,
  },
  {
    value: "soil-types",
    label: "Soil type",
    icon: IconGrain,
    content: SoilTypesView,
  },
  {
    value: "hydro-system-types",
    label: "Hydro system",
    icon: IconDroplets,
    content: HydroSystemTypesView,
  },
];

const Lookups = () => {
  const {
    data: farmTypes = [],
    refetch: refetchFarmTypes,
    isFetching: isFetchingFarmTypes,
  } = useListFarmTypesQuery();
  const {
    data: zoneTypes = [],
    refetch: refetchZoneTypes,
    isFetching: isFetchingZoneTypes,
  } = useListZoneTypesQuery();
  const {
    data: soilTypes = [],
    refetch: refetchSoilTypes,
    isFetching: isFetchingSoilTypes,
  } = useListSoilTypesQuery();
  const {
    data: hydroSystemTypes = [],
    refetch: refetchHydroSystemTypes,
    isFetching: isFetchingHydroSystemTypes,
  } = useListHydroSystemTypesQuery();

  const totalEntries =
    farmTypes.length +
    zoneTypes.length +
    soilTypes.length +
    hydroSystemTypes.length;
  const categoryCount = LOOKUP_TABS.length;
  const isFetching =
    isFetchingFarmTypes ||
    isFetchingZoneTypes ||
    isFetchingSoilTypes ||
    isFetchingHydroSystemTypes;

  const refetch = () => {
    refetchFarmTypes();
    refetchZoneTypes();
    refetchSoilTypes();
    refetchHydroSystemTypes();
  };

  return (
    <div className="flex flex-col gap-4 lg:h-[calc(100svh-6.5rem)] lg:overflow-hidden">
      {/* ============ Compact header ===================================== */}
      <Reveal duration={400}>
        <div className="glass-card texture-paper highlight-edge relative shrink-0 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-linear-to-br from-leaf/10 via-sage-deep/5 to-sky-warm/10" />
          <div className="absolute -top-16 -right-10 size-48 rounded-full bg-wheat/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-48 rounded-full bg-clay/10 blur-3xl" />
          <div className="pattern-contour absolute inset-0 opacity-40 mix-blend-soft-light" />

          <div className="relative flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative shrink-0">
                <div className="absolute -inset-1 rounded-2xl bg-linear-to-br from-leaf/30 to-sky-warm/30 opacity-60 blur-md" />
                <div className="relative flex size-10 items-center justify-center rounded-2xl bg-linear-to-br from-leaf to-sage-deep text-white shadow-md ring-1 ring-white/10">
                  <IconBook2 className="size-5" strokeWidth={1.75} />
                </div>
              </div>
              <div className="min-w-0">
                <h1 className="font-heading text-lg font-bold tracking-tight sm:text-xl">
                  Lookups
                </h1>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-leaf" />
                    <span className="font-semibold text-foreground tabular-nums">
                      {totalEntries}
                    </span>{" "}
                    {totalEntries === 1 ? "entry" : "entries"}
                  </span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="inline-flex items-center gap-1">
                    <span className="font-semibold text-foreground tabular-nums">
                      {categoryCount}
                    </span>{" "}
                    {categoryCount === 1 ? "category" : "categories"}
                  </span>
                  <span className="text-muted-foreground/40">·</span>
                  <span>Workspace reference data</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={refetch}
                size="sm"
                variant="outline"
                className="gap-1.5"
                disabled={isFetching}
              >
                <IconRefresh
                  className={`size-4 ${isFetching ? "animate-spin" : ""}`}
                  strokeWidth={1.85}
                />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ============ Tabs + grid (single Tabs root so they sync) ========= */}
      <Tabs
        defaultValue={LOOKUP_TABS[0].value}
        className="flex flex-col gap-4 lg:min-h-0 lg:flex-1"
      >
        <Reveal delay={80} duration={500}>
          <TabsList>
            {LOOKUP_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.value} value={tab.value} icon={Icon}>
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Reveal>

        <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
          {LOOKUP_TABS.map((tab) => {
            const Content = tab.content;
            return (
              <TabsContent key={tab.value} value={tab.value} className="mt-0">
                <Content />
              </TabsContent>
            );
          })}
        </div>
      </Tabs>
    </div>
  );
};

export default Lookups;
