import { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { IconArrowLeft, IconTractor } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/effects";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/features/auth/usePermissions";
import { DEFAULT_AREA_UNIT } from "@/constants/farms";
import { getZoneType } from "../constants";
import ZoneForm from "../components/zone-form/ZoneForm";
import { useUpdateZoneMutation, useListZoneTypesQuery } from "../zoneApi";
import { clearSelectedZone, selectSelectedZone } from "../selectedZoneSlice";

/**
 * Map a stored zone onto the form's flat field shape. Zone records
 * arrive decorated from the list (zoneType lookup row included).
 */
const toFormDefaults = (zone) => ({
  farmId: zone.farmID || "",
  name: zone.name || "",
  zoneTypeId: zone.zoneTypeID || "",
  soilTypeId: zone.soilTypeDetails?.soilTypeID || "",
  hydroSystemTypeId: zone.hydroSystemTypeDetails?.hydroSystemTypeID || "",
  growMedium: zone.hydroSystemTypeDetails?.growMedium || "",
  reservoirVolumeLiters:
    zone.hydroSystemTypeDetails?.reservoirVolumeLiters != null
      ? String(zone.hydroSystemTypeDetails.reservoirVolumeLiters)
      : "",
  numberOfSlots:
    zone.hydroSystemTypeDetails?.numberOfSlots != null
      ? String(zone.hydroSystemTypeDetails.numberOfSlots)
      : "",
  zoneStatus: zone.zoneStatus || "idle",
  area: zone.area != null ? String(zone.area) : "",
  areaUnit: zone.areaUnit || DEFAULT_AREA_UNIT,
  notes: zone.notes || "",
});

const EditField = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const zone = useSelector(selectSelectedZone);
  const [updateZone, { isLoading: submitting }] = useUpdateZoneMutation();
  const { canManageFields } = usePermissions();
  const { data: zoneTypes = [] } = useListZoneTypesQuery();

  useEffect(() => {
    if (!zone) {
      navigate("/app/fields", { replace: true });
    }
  }, [zone, navigate]);

  if (!canManageFields) return <Navigate to="/app/fields" replace />;

  if (!zone) {
    return (
      <div className="space-y-4">
        <Link
          to="/app/fields"
          className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft
            className="size-4 transition-transform group-hover:-translate-x-0.5"
            strokeWidth={1.75}
          />
          Back to Fields
        </Link>
        <div className="glass-card texture-paper highlight-edge rounded-3xl p-10 text-center">
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Field not found
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            It may have been removed, or the link is incorrect.
          </p>
          <Button
            className="mt-4"
            onClick={() => navigate("/app/fields", { replace: true })}
          >
            Back to fields
          </Button>
        </div>
      </div>
    );
  }

  // Records reference the type by UUID; resolve its name for the header.
  const typeName =
    zone.zoneType?.name ||
    zoneTypes.find((t) => t.id === zone.zoneTypeID)?.name;
  const t = getZoneType(typeName);
  const TypeIcon = t.icon;

  const handleSubmit = async (values) => {
    try {
      const updated = await updateZone({ id: zone.id, ...values }).unwrap();
      dispatch(clearSelectedZone());
      toast.success("Field updated", {
        description: `${updated.name}'s details have been saved.`,
      });
      navigate("/app/fields", { replace: true });
    } catch (err) {
      toast.error("Could not update field", {
        description: err?.data?.error?.message || "Please try again.",
      });
    }
  };

  const handleCancel = () => {
    dispatch(clearSelectedZone());
    navigate("/app/fields");
  };

  return (
    <div className="flex flex-col lg:h-full lg:min-h-0">
      {/* ===== Compact back link ===== */}
      <Reveal duration={350}>
        <Link
          to="/app/fields"
          onClick={() => dispatch(clearSelectedZone())}
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
          <div
            className={cn(
              "absolute inset-x-0 top-0 h-1 bg-linear-to-r opacity-80",
              t.gradient
            )}
          />
          <div className="absolute inset-0 bg-linear-to-r from-lagoon/8 via-leaf/4 to-sky-warm/8" />
          <div className="absolute -top-16 -right-12 size-48 rounded-full bg-lagoon/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-leaf/15 blur-3xl" />
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
                    <IconTractor className="size-2.5" strokeWidth={2.2} />
                    {t.label}
                  </span>
                </div>
                <h1 className="truncate font-heading text-xl font-bold tracking-tight sm:text-2xl">
                  Edit field
                </h1>
                <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
                  Update {zone.name} on {zone.farmName}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ===== Form body ===== */}
      <Reveal delay={140} duration={500}>
        <div className="glass-card texture-paper highlight-edge flex flex-col rounded-2xl p-4 sm:p-5 lg:min-h-0 lg:flex-1 lg:overflow-hidden">
          <ZoneForm
            mode="edit"
            defaultValues={toFormDefaults(zone)}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitting={submitting}
          />
        </div>
      </Reveal>
    </div>
  );
};

export default EditField;
