import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  IconArrowLeft,
  IconCirclePlus,
  IconLayoutGrid,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/effects";
import { usePermissions } from "@/features/auth/usePermissions";
import ZoneForm from "../components/zone-form/ZoneForm";
import { useCreateZoneMutation } from "../zoneApi";

const AddField = () => {
  const navigate = useNavigate();
  const { canManageFields } = usePermissions();
  const [createZone, { isLoading }] = useCreateZoneMutation();

  // Only roles that can manage fields should reach this form. Bounce
  // anyone else back to the list so a typed URL never exposes the form.
  if (!canManageFields) return <Navigate to="/app/fields" replace />;

  const handleSubmit = async (values) => {
    try {
      const created = await createZone(values).unwrap();
      toast.success("Field added", {
        description: `${created.name} is now part of ${created.farmName}.`,
      });
      navigate("/app/fields", { replace: true });
    } catch (err) {
      toast.error("Could not add field", {
        description: err?.data?.error?.message || "Please try again.",
      });
    }
  };

  const handleCancel = () => navigate("/app/fields");

  return (
    <div className="flex flex-col lg:h-full lg:min-h-0">
      {/* ===== Compact back link ===== */}
      <Reveal duration={350}>
        <Link
          to="/app/fields"
          className="group mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <IconArrowLeft
            className="size-3.5 transition-transform group-hover:-translate-x-0.5"
            strokeWidth={1.85}
          />
          Back to Fields
        </Link>
      </Reveal>

      {/* ===== Hero — compact, no scroll ===== */}
      <Reveal delay={60} duration={450}>
        <div className="glass-card texture-paper highlight-edge relative mb-4 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-linear-to-br from-lagoon/12 via-leaf/6 to-sky-warm/12" />
          <div className="absolute -top-16 -right-12 size-48 rounded-full bg-lagoon/25 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-leaf/20 blur-3xl" />
          <div className="pattern-contour absolute inset-0 opacity-40 mix-blend-soft-light" />

          <div className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-linear-to-br from-lagoon/30 to-leaf/30 opacity-60 blur-md" />
                <div className="relative flex size-10 items-center justify-center rounded-2xl bg-linear-to-br from-lagoon to-lagoon-deep text-white shadow-md ring-1 ring-white/10">
                  <IconCirclePlus className="size-5" strokeWidth={1.85} />
                </div>
              </div>
              <div className="min-w-0">
                <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full border border-lagoon/30 bg-lagoon/12 px-2 py-0.5 text-[9px] font-semibold tracking-wider text-lagoon-deep uppercase backdrop-blur-sm dark:text-lagoon">
                    <IconLayoutGrid className="size-2.5" strokeWidth={2.2} />
                    New
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground/70">
                    Step 1 of 1
                  </span>
                </div>
                <h1 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
                  Add a new field
                </h1>
                <p className="text-[11px] text-muted-foreground sm:text-xs">
                  Pick a farm, name it, choose how it grows. You can edit
                  anything later.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={isLoading}
                className="gap-1.5"
              >
                <IconArrowLeft className="size-3.5" strokeWidth={1.85} />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ===== Form body ===== */}
      <Reveal delay={140} duration={500}>
        <div className="glass-card texture-paper highlight-edge flex flex-col rounded-2xl p-4 sm:p-5 lg:min-h-0 lg:flex-1 lg:overflow-hidden">
          <ZoneForm
            mode="create"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitting={isLoading}
          />
        </div>
      </Reveal>
    </div>
  );
};

export default AddField;
