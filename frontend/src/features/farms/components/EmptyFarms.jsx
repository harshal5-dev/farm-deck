import { IconTractor, IconCirclePlus, IconRoute2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const EmptyFarms = ({ onAdd, canAdd = true }) => {
  const navigate = useNavigate();
  return (
    <div className="glass-card texture-paper highlight-edge relative w-full max-w-xl overflow-hidden rounded-3xl py-16 text-center">
      <div className="pointer-events-none absolute -top-10 left-1/2 size-48 -translate-x-1/2 rounded-full bg-leaf/10 blur-3xl" />
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute -inset-1 rounded-2xl bg-linear-to-br from-leaf/30 to-sky-warm/30 opacity-60 blur-lg" />
          <div className="relative flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-leaf to-sage-deep text-white shadow-md ring-1 ring-white/10">
            <IconTractor className="size-8" strokeWidth={1.5} />
          </div>
        </div>
        <div className="space-y-1.5">
          <h3 className="font-heading text-lg font-semibold tracking-tight">
            No farms match your filters
          </h3>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            {canAdd
              ? "Try adjusting your search or add a new farm to the workspace."
              : "Try adjusting your filters — only managers and growers can add farms."}
          </p>
        </div>
        {canAdd && onAdd && (
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <Button onClick={onAdd} className="gap-2">
              <IconCirclePlus className="size-4" strokeWidth={1.85} />
              Add a farm
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/app/setup")}
              className="gap-2"
            >
              <IconRoute2 className="size-4" strokeWidth={1.85} />
              or use the guided setup
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyFarms;
