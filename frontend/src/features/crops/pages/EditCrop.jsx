import { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { IconArrowLeft, IconPlant2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/effects";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/features/auth/usePermissions";
import { getCropType } from "../constants";
import CropForm from "../components/crop-form/CropForm";
import { useUpdateCropMutation } from "../cropApi";
import { clearSelectedCrop, selectSelectedCrop } from "../selectedCropSlice";

/**
 * Map a stored crop onto the form's field shape. Crop records arrive
 * decorated from the list (cropType lookup row included).
 */
const toFormDefaults = (crop) => ({
  zoneId: crop.zoneId || "",
  cropTypeId: crop.cropTypeId || "",
  variety: crop.variety || "",
  status: crop.status || "planned",
  sowDate: crop.sowDatePlanned || crop.sowDateActual || "",
  harvestDateExpected: crop.harvestDateExpected || "",
  quantity: crop.quantity != null ? String(crop.quantity) : "",
  quantityUnit: crop.quantityUnit || "plants",
  notes: crop.notes || "",
});

const EditCrop = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const crop = useSelector(selectSelectedCrop);
  const [updateCrop, { isLoading: submitting }] = useUpdateCropMutation();
  const { canManageCrops } = usePermissions();

  useEffect(() => {
    if (!crop) {
      navigate("/app/crops", { replace: true });
    }
  }, [crop, navigate]);

  if (!canManageCrops) return <Navigate to="/app/crops" replace />;

  if (!crop) {
    return (
      <div className="space-y-4">
        <Link
          to="/app/crops"
          className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft
            className="size-4 transition-transform group-hover:-translate-x-0.5"
            strokeWidth={1.75}
          />
          Back to Crops
        </Link>
        <div className="glass-card texture-paper highlight-edge rounded-3xl p-10 text-center">
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Crop not found
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            It may have been removed, or the link is incorrect.
          </p>
          <Button
            className="mt-4"
            onClick={() => navigate("/app/crops", { replace: true })}
          >
            Back to crops
          </Button>
        </div>
      </div>
    );
  }

  const typeName = crop.cropType?.name;
  const t = getCropType(typeName);
  const TypeIcon = t.icon;

  const handleSubmit = async (values) => {
    try {
      const updated = await updateCrop({ id: crop.id, ...values }).unwrap();
      dispatch(clearSelectedCrop());
      toast.success("Crop updated", {
        description: `${updated.name}'s details have been saved.`,
      });
      navigate("/app/crops", { replace: true });
    } catch (err) {
      toast.error("Could not update crop", {
        description: err?.data?.error?.message || "Please try again.",
      });
    }
  };

  const handleCancel = () => {
    dispatch(clearSelectedCrop());
    navigate("/app/crops");
  };

  return (
    <div className="flex flex-col lg:h-full lg:min-h-0">
      {/* ===== Compact back link ===== */}
      <Reveal duration={350}>
        <Link
          to="/app/crops"
          onClick={() => dispatch(clearSelectedCrop())}
          className="group mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <IconArrowLeft
            className="size-3.5 transition-transform group-hover:-translate-x-0.5"
            strokeWidth={1.85}
          />
          Back to Crops
        </Link>
      </Reveal>

      {/* ===== Hero — compact, no scroll ===== */}
      <Reveal delay={60} duration={450}>
        <div className="glass-card texture-paper highlight-edge relative mb-4 overflow-hidden rounded-2xl">
          <div
            className={cn(
              "absolute inset-x-0 top-0 h-1 bg-linear-to-r opacity-80",
              t.gradient
            )}
          />
          <div className="absolute inset-0 bg-linear-to-r from-leaf/8 via-wheat/4 to-lagoon/8" />
          <div className="absolute -top-16 -right-12 size-48 rounded-full bg-leaf/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-wheat/15 blur-3xl" />
          <div className="pattern-contour absolute inset-0 opacity-40 mix-blend-soft-light" />

          <div className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative shrink-0">
                <div
                  className={cn(
                    "absolute -inset-1 rounded-2xl opacity-60 blur-md",
                    t.bg
                  )}
                />
                <div
                  className={cn(
                    "relative flex size-10 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-md ring-1 ring-white/10",
                    t.gradient
                  )}
                >
                  <TypeIcon className="size-5" strokeWidth={1.85} />
                </div>
              </div>
              <div className="min-w-0">
                <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase backdrop-blur-sm",
                      t.border,
                      t.bg,
                      t.text
                    )}
                  >
                    <IconPlant2 className="size-2.5" strokeWidth={2.2} />
                    {t.label}
                  </span>
                </div>
                <h1 className="truncate font-heading text-xl font-bold tracking-tight sm:text-2xl">
                  Edit crop
                </h1>
                <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
                  Update {crop.name} on {crop.zoneName}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ===== Form body ===== */}
      <Reveal delay={140} duration={500}>
        <div className="glass-card texture-paper highlight-edge flex flex-col rounded-2xl p-4 sm:p-5 lg:min-h-0 lg:flex-1 lg:overflow-hidden">
          <CropForm
            mode="edit"
            defaultValues={toFormDefaults(crop)}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitting={submitting}
          />
        </div>
      </Reveal>
    </div>
  );
};

export default EditCrop;
