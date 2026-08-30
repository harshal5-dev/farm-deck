import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { IconArrowLeft, IconCirclePlus, IconBook } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/effects";
import { usePermissions } from "@/features/auth/usePermissions";
import CropCatalogForm from "../components/crop-catalog-form/CropCatalogForm";
import { useCreateCropMutation } from "../cropApi";

const AddCrop = () => {
  const navigate = useNavigate();
  const { canManageCrops } = usePermissions();
  const [createCrop, { isLoading }] = useCreateCropMutation();

  if (!canManageCrops) return <Navigate to="/app/crops?tab=catalog" replace />;

  const handleSubmit = async (values) => {
    try {
      const created = await createCrop(values).unwrap();
      toast.success("Crop added", {
        description: `${created.name} is now in the catalog.`,
      });
      navigate("/app/crops?tab=catalog", { replace: true });
    } catch (err) {
      toast.error("Could not add crop", {
        description: err?.data?.error?.message || "Please try again.",
      });
    }
  };

  const handleCancel = () => navigate("/app/crops?tab=catalog");

  return (
    <div className="flex flex-col lg:h-full lg:min-h-0">
      <Reveal duration={350}>
        <Link
          to="/app/crops?tab=catalog"
          className="group mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <IconArrowLeft
            className="size-3.5 transition-transform group-hover:-translate-x-0.5"
            strokeWidth={1.85}
          />
          Back to Catalog
        </Link>
      </Reveal>

      <Reveal delay={60} duration={450}>
        <div className="glass-card texture-paper highlight-edge relative mb-4 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-linear-to-br from-leaf/12 via-wheat/6 to-lagoon/12" />
          <div className="absolute -top-16 -right-12 size-48 rounded-full bg-leaf/25 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-wheat/20 blur-3xl" />
          <div className="pattern-contour absolute inset-0 opacity-40 mix-blend-soft-light" />

          <div className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-linear-to-br from-leaf/30 to-wheat/30 opacity-60 blur-md" />
                <div className="relative flex size-10 items-center justify-center rounded-2xl bg-linear-to-br from-leaf to-wheat-deep text-white shadow-md ring-1 ring-white/10">
                  <IconCirclePlus className="size-5" strokeWidth={1.85} />
                </div>
              </div>
              <div className="min-w-0">
                <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full border border-leaf/30 bg-leaf/12 px-2 py-0.5 text-[9px] font-semibold tracking-wider text-leaf uppercase backdrop-blur-sm">
                    <IconBook className="size-2.5" strokeWidth={2.2} />
                    Catalog
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground/70">
                    New crop
                  </span>
                </div>
                <h1 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
                  Add a crop
                </h1>
                <p className="text-[11px] text-muted-foreground sm:text-xs">
                  Set the variety's target pH, EC, PPM, light and days to
                  harvest — cycles then reference it from the picker.
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

      <Reveal delay={140} duration={500}>
        <div className="glass-card texture-paper highlight-edge flex flex-col rounded-2xl p-4 sm:p-5 lg:min-h-0 lg:flex-1 lg:overflow-hidden">
          <CropCatalogForm
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

export default AddCrop;