import { IconBasket, IconCirclePlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

const EmptyHarvests = ({ onAdd, canAdd = true, filtered = false }) => (
  <div className="glass-card texture-paper highlight-edge relative w-full max-w-xl overflow-hidden rounded-3xl py-10 text-center">
    <div className="pointer-events-none absolute -top-10 left-1/2 size-48 -translate-x-1/2 rounded-full bg-wheat/10 blur-3xl" />
    <div className="relative flex flex-col items-center gap-4">
      <div className="relative">
        <div className="absolute -inset-1 rounded-2xl bg-linear-to-br from-leaf/30 to-wheat/30 opacity-60 blur-lg" />
        <div className="relative flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-leaf to-wheat-deep text-white shadow-md ring-1 ring-white/10">
          <IconBasket className="size-8" strokeWidth={1.5} />
        </div>
      </div>
      <div className="space-y-1.5">
        <h3 className="font-heading text-lg font-semibold tracking-tight">
          {filtered ? "No harvests match your filters" : "No harvests logged yet"}
        </h3>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          {filtered
            ? "Try a different search or grade filter — or clear them to see every harvest."
            : canAdd
              ? "Log what came off each cycle — yield, grade and price — to see revenue stack up per crop."
              : "Once a harvest is logged, yields and revenue will appear here."}
        </p>
      </div>
      {canAdd && !filtered && onAdd && (
        <Button onClick={onAdd} className="mt-2 gap-2">
          <IconCirclePlus className="size-4" strokeWidth={1.85} />
          Log harvest
        </Button>
      )}
    </div>
  </div>
);

export default EmptyHarvests;
