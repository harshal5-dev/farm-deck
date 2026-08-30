import { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { IconArrowLeft, IconBook } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/effects";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/features/auth/usePermissions";
import { getCropType } from "../constants";
import CropCatalogForm from "../components/crop-catalog-form/CropCatalogForm";
import { useUpdateCropMutation } from "../cropApi";
import {
  clearSelectedCatalogCrop,
  selectSelectedCatalogCrop,
} from "../selectedCatalogCropSlice";

const asString = (v) => (v === 0 || v ? String(v) : "");

const toFormDefaults = (crop) => ({
  name: crop.name || "",
  category: crop.category || "leafy_green",
  targetPhMin: asString(crop.targetPhMin),
  targetPhMax: asString(crop.targetPhMax),
  targetEcMin: asString(crop.targetEcMin),
  targetEcMax: asString(crop.targetEcMax),
  targetPpmMin: asString(crop.targetPpmMin),
  targetPpmMax: asString(crop.targetPpmMax),
  daysToHarvest: asString(crop.daysToHarvest),
  lightHoursPerDay: asString(crop.lightHoursPerDay),
  notes: crop.notes || "",
});

const EditCrop = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const crop = useSelector(selectSelectedCatalogCrop);
  const [updateCrop, { isLoading: submitting }] = useUpdateCropMutation();
  const { canManageCrops } = usePermissions();

  useEffect(() => {
    if (!crop) {
      navigate("/app/crops?tab=catalog", { replace: true });
    }
  }, [crop, navigate]);

  if (!canManageCrops) return <Navigate to="/app/crops?tab=catalog" replace />;

  if (!crop) {
    return (
      <div className="space-y-4">
        <Link
          to="/app/crops?tab=catalog"
          className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft
            className="size-4 transition-transform group-hover:-translate-x-0.5"
            strokeWidth={1.75}
          />
          Back to Catalog
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
            onClick={() =>
              navigate("/app/crops?tab=catalog", { replace: true })
            }
          >
            Back to catalog
          </Button>
        </div>
      </div>
    );
  }

  const t = getCropType(crop.category);
  const TypeIcon = t.icon;

  const handleSubmit = async (values) => {
    try {
      const updated = await updateCrop({ id: crop.id, ...values }).unwrap();
      dispatch(clearSelectedCatalogCrop());
      toast.success("Crop updated", {
        description: `${updated.name}'s details have been saved.`,
      });
      navigate("/app/crops?tab=catalog", { replace: true });
    } catch (err) {
      toast.error("Could not update crop", {
        description: err?.data?.error?.message || "Please try again.",
      });
    }
  };

  const handleCancel = () => {
    dispatch(clearSelectedCatalogCrop());
    navigate("/app/crops?tab=catalog");
  };

  return (
    <div className="flex flex-col lg:h-full lg:min-h-0">
      <Reveal duration={350}>
        <Link
          to="/app/crops?tab=catalog"
          onClick={() => dispatch(clearSelectedCatalogCrop())}
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
                    <IconBook className="size-2.5" strokeWidth={2.2} />
                    {t.label}
                  </span>
                </div>
                <h1 className="truncate font-heading text-xl font-bold tracking-tight sm:text-2xl">
                  Edit crop
                </h1>
                <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
                  Update {crop.name} in the catalog.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={140} duration={500}>
        <div className="glass-card texture-paper highlight-edge flex flex-col rounded-2xl p-4 sm:p-5 lg:min-h-0 lg:flex-1 lg:overflow-hidden">
          <CropCatalogForm
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