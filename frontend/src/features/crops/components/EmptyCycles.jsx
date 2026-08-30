import { IconPlant2, IconCirclePlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

const EmptyCycles = ({ onAdd, canAdd = true }) => {
  return (
    <div className="glass-card texture-paper highlight-edge relative w-full max-w-xl overflow-hidden rounded-3xl py-16 text-center">
      <div className="pointer-events-none absolute -top-10 left-1/2 size-48 -translate-x-1/2 rounded-full bg-leaf/10 blur-3xl" />
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute -inset-1 rounded-2xl bg-linear-to-br from-leaf/30 to-wheat/30 opacity-60 blur-lg" />
          <div className="relative flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-leaf to-wheat-deep text-white shadow-md ring-1 ring-white/10">
            <IconPlant2 className="size-8" strokeWidth={1.5} />
          </div>
        </div>
        <div className="space-y-1.5">
          <h3 className="font-heading text-lg font-semibold tracking-tight">
            No cycles match your filters
          </h3>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            {canAdd
              ? "Try adjusting your search or plan a new planting on one of your fields."
              : "Try adjusting your filters — only managers and growers can add cycles."}
          </p>
        </div>
        {canAdd && onAdd && (
          <Button onClick={onAdd} className="mt-2 gap-2">
            <IconCirclePlus className="size-4" strokeWidth={1.85} />
            Plan a cycle
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyCycles;