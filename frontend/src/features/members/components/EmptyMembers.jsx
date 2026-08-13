import { IconUsers, IconUserPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

/** Shown when no members match the current filters. */
export function EmptyMembers({ onAdd }) {
  return (
    <div className="glass-card texture-paper highlight-edge relative overflow-hidden rounded-3xl py-16 text-center">
      <div className="pointer-events-none absolute -top-10 left-1/2 size-48 -translate-x-1/2 rounded-full bg-leaf/10 blur-3xl" />
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-leaf/30 to-sky-warm/30 opacity-60 blur-lg" />
          <div className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-leaf to-sage-deep text-white shadow-md ring-1 ring-white/10">
            <IconUsers className="size-8" strokeWidth={1.5} />
          </div>
        </div>
        <div className="space-y-1.5">
          <h3 className="font-heading text-lg font-semibold tracking-tight">
            No members match your filters
          </h3>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            Try adjusting your search or add someone new to the team.
          </p>
        </div>
        <Button onClick={onAdd} className="mt-2 gap-2">
          <IconUserPlus className="size-4" strokeWidth={1.85} />
          Add a member
        </Button>
      </div>
    </div>
  );
}
