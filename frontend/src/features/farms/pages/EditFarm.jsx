import { useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  IconArrowLeft,
  IconTractor,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/effects";
import { usePermissions } from "@/features/auth/usePermissions";
import { useListFarmTypesQuery } from "@/features/lookups";
import FarmForm from "../components/farm-form/FarmForm";
import { useUpdateFarmMutation } from "../farmApi";
import { getFarmType, DEFAULT_AREA_UNIT } from "@/constants/farms";
import { cn } from "@/lib/utils";
import {
  clearSelectedFarm,
  selectSelectedFarm,
} from "../selectedFarmSlice";

/**
 * Map a stored farm onto the form's field shape. Records created with
 * the new payload carry farmTypeId/totalArea already; legacy mock
 * records only stored the type *name* and sizeAcres, so the matching
 * lookup row supplies the UUID and the area falls back to acres.
 */
const toFormDefaults = (farm, farmTypes) => ({
  farmTypeId:
    farm.farmTypeId ||
    farmTypes.find((t) => t.name === farm.farmType)?.id ||
    "",
  name: farm.name || "",
  location: farm.location || "",
  latitude: farm.latitude != null ? String(farm.latitude) : "",
  longitude: farm.longitude != null ? String(farm.longitude) : "",
  totalArea:
    farm.totalArea != null
      ? String(farm.totalArea)
      : farm.sizeAcres != null && farm.sizeAcres !== ""
        ? String(farm.sizeAcres)
        : "",
  areaUnit:
    farm.areaUnit || (farm.sizeAcres != null && farm.sizeAcres !== "" ? "acre" : DEFAULT_AREA_UNIT),
  notes: farm.notes || farm.description || "",
});

const EditFarm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const farm = useSelector(selectSelectedFarm);
  const [updateFarm, { isLoading: submitting }] = useUpdateFarmMutation();
  const { canManageFarms } = usePermissions();
  const { data: farmTypes = [], isLoading: typesLoading } =
    useListFarmTypesQuery();

  useEffect(() => {
    if (!farm) {
      navigate("/app/farms", { replace: true });
    }
  }, [farm, navigate]);

  if (!canManageFarms) return <Navigate to="/app/farms" replace />;

  if (!farm) {
    return (
      <div className="space-y-4">
        <Link
          to="/app/farms"
          className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft
            className="size-4 transition-transform group-hover:-translate-x-0.5"
            strokeWidth={1.75}
          />
          Back to Farms
        </Link>
        <div className="glass-card texture-paper highlight-edge rounded-3xl p-10 text-center">
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Farm not found
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            It may have been removed, or the link is incorrect.
          </p>
          <Button
            className="mt-4"
            onClick={() => navigate("/app/farms", { replace: true })}
          >
            Back to farms
          </Button>
        </div>
      </div>
    );
  }

  // New records reference the type by UUID; legacy mock records by name.
  const typeName =
    farm.farmType || farmTypes.find((t) => t.id === farm.farmTypeId)?.name;
  const t = getFarmType(typeName);
  const TypeIcon = t.icon;

  const handleSubmit = async (values) => {
    try {
      await updateFarm({
        id: farm.id,
        ...values,
      }).unwrap();
      dispatch(clearSelectedFarm());
      toast.success("Farm updated", {
        description: `${values.name}'s details have been saved.`,
      });
      navigate("/app/farms", { replace: true });
    } catch (err) {
      toast.error("Could not update farm", {
        description: err?.data?.error?.message || "Please try again.",
      });
    }
  };

  const handleCancel = () => {
    dispatch(clearSelectedFarm());
    navigate("/app/farms");
  };

  return (
    <div className="flex flex-col lg:h-full lg:min-h-0">
      {/* ===== Compact back link ===== */}
      <Reveal duration={350}>
        <Link
          to="/app/farms"
          onClick={() => dispatch(clearSelectedFarm())}
          className="group mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <IconArrowLeft
            className="size-3.5 transition-transform group-hover:-translate-x-0.5"
            strokeWidth={1.85}
          />
          Back to Farms
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
          <div className="absolute inset-0 bg-linear-to-r from-leaf/8 via-sage-deep/4 to-sky-warm/8" />
          <div className="absolute -top-16 -right-12 size-48 rounded-full bg-wheat/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-sky-warm/15 blur-3xl" />
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
                  Edit farm
                </h1>
                <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
                  Update {farm.name}'s type, location, pin & details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ===== Form body — waits for farm types so legacy records can
             resolve their type name to a farmTypeId ===== */}
      <Reveal delay={140} duration={500}>
        <div className="glass-card texture-paper highlight-edge flex flex-col rounded-2xl p-4 sm:p-5 lg:min-h-0 lg:flex-1 lg:overflow-hidden">
          {typesLoading ? null : (
            <FarmForm
              mode="edit"
              defaultValues={toFormDefaults(farm, farmTypes)}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              submitting={submitting}
            />
          )}
        </div>
      </Reveal>
    </div>
  );
};

export default EditFarm;
