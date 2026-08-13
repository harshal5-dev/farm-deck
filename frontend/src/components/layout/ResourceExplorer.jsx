import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * ResourceExplorer — a master-detail split layout for browsing reference data
 * (farm types, soil types, etc.) without endless scrolling.
 *
 * Props:
 *  - items:          the full list (already fetched)
 *  - isLoading:      show skeletons in the list
 *  - skeletons:      count of list-item skeletons
 *  - ListSkeleton:   component rendered per skeleton slot
 *  - DetailSkeleton: component rendered while detail loads
 *  - renderListItem: ({ item, active }) => compact selectable row
 *  - renderDetail:   (item) => full detail panel
 *  - emptyState:     node shown when there are no items
 *  - toolbar?:       optional node rendered above the list (e.g. search)
 *
 * On desktop: two-column split (list left, detail right). The list is compact
 * so all/most items are visible without much scrolling; the detail panel
 * scrolls independently. On mobile: list only; selecting an item swaps to the
 * detail view with a back button.
 */
export default function ResourceExplorer({
  items = [],
  isLoading = false,
  skeletonCount = 4,
  ListSkeleton,
  DetailSkeleton,
  renderListItem,
  renderDetail,
  emptyState,
  toolbar,
}) {
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? null);
  const [mobileView, setMobileView] = useState("list"); // "list" | "detail"

  const selected = items.find((i) => i.id === selectedId) ?? null;

  const handleSelect = (id) => {
    setSelectedId(id);
    setMobileView("detail");
  };

  const listColumn = (
    <div className="flex h-full flex-col gap-2">
      {toolbar}
      <div className="-mr-1 flex-1 space-y-1.5 overflow-y-auto pr-1">
        {isLoading
          ? Array.from({ length: skeletonCount }).map((_, i) =>
              ListSkeleton ? <ListSkeleton key={i} /> : null
            )
          : items.map((item) =>
              renderListItem({
                item,
                active: item.id === selectedId,
                onSelect: handleSelect,
              })
            )}
        {!isLoading && items.length === 0 && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            {emptyState || "No items found."}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
      {/* Left: list — hidden on mobile when viewing detail */}
      <div className={cn("h-[70vh] lg:h-[78vh]", mobileView === "detail" && "hidden lg:block")}>
        <div className="glass-card texture-paper h-full overflow-hidden rounded-2xl p-3">
          {listColumn}
        </div>
      </div>

      {/* Right: detail — on mobile, replaces the list */}
      <div className={cn("min-h-[60vh] lg:min-h-0", mobileView === "list" && "hidden lg:block")}>
        {selected ? (
          <div key={selected.id} className="animate-in fade-in slide-in-from-right-2 duration-300">
            {/* Mobile back-to-list */}
            <button
              onClick={() => setMobileView("list")}
              className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground lg:hidden"
            >
              ← All items
            </button>
            {renderDetail(selected)}
          </div>
        ) : isLoading && DetailSkeleton ? (
          <DetailSkeleton />
        ) : (
          <div className="glass-card flex h-full min-h-[40vh] items-center justify-center rounded-2xl text-center text-sm text-muted-foreground">
            {emptyState || "Select an item to view details."}
          </div>
        )}
      </div>
    </div>
  );
}
