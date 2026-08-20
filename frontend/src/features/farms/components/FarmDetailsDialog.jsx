import { useNavigate } from "react-router-dom";
import {
  IconCalendar,
  IconLayersIntersect,
  IconMapPin,
  IconPencil,
  IconPlant2,
  IconScale,
  IconUser,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { FarmTypeArt } from "@/components/effects";
import { getFarmType, getSoilType } from "@/constants/farms";
import { setSelectedFarm } from "../selectedFarmSlice";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import {
  formatAcres,
  formatDate,
  formatNumber,
} from "../lib/format";
import FarmIconArt from "./FarmIconArt";
import FarmDetailRow from "./FarmDetailRow";
import { FarmTypePill, FarmStatusPill } from "./pills";

const FarmDetailsDialog = ({ farm, open, onOpenChange, canManage = true }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!farm) return null;

  const t = getFarmType(farm.farmType);
  const soil = getSoilType(farm.soilType);
  const TypeIcon = t.icon;
  const SoilIcon = IconPlant2;

  const handleEdit = () => {
    dispatch(setSelectedFarm(farm));
    onOpenChange?.(false);
    navigate("/app/farms/edit");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        size="lg"
        className="overflow-hidden p-0"
      >
        {/* Hero — full-width FarmTypeArt with a soft scrim */}
        <div className="relative h-32 overflow-hidden">
          <FarmTypeArt variant={t.art} className="size-full" />
          <div
            className={cn(
              "pointer-events-none absolute inset-0 bg-linear-to-br opacity-30",
              t.gradient
            )}
          />
          <div className="absolute inset-0 bg-linear-to-t from-card via-card/40 to-transparent" />
          {/* Thin top gradient strip */}
          <div className="absolute inset-x-0 top-0 h-1.5 overflow-hidden">
            <div className={cn("absolute inset-0 bg-linear-to-r", t.gradient)} />
          </div>
          {/* Floating type chip */}
          <div className="absolute top-4 left-5">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase ring-1 ring-foreground/10 backdrop-blur",
                t.text
              )}
            >
              <TypeIcon className="size-3.5" strokeWidth={2} />
              {t.label} farm
            </span>
          </div>
          {/* Floating status pill */}
          <div className="absolute top-4 right-12">
            <FarmStatusPill status={farm.status} />
          </div>
        </div>

        <div className="relative">
          {/* Subtle type-tinted background wash */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 bg-linear-to-r opacity-[0.04]",
              t.gradient
            )}
          />

          <div className="relative p-5">
            <DialogHeader className="gap-0 p-0">
              <div className="flex items-start gap-3.5">
                {/* Icon art */}
                <FarmIconArt farm={farm} size="xl" />

                {/* Identity */}
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <DialogTitle className="min-w-0 wrap-break-word font-heading text-lg font-bold tracking-tight">
                      {farm.name}
                    </DialogTitle>
                  </div>
                  <DialogDescription className="mt-0.5 truncate text-xs">
                    {farm.location || "Location not set"}
                  </DialogDescription>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <FarmTypePill farmType={farm.farmType} />
                    <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
                      <IconLayersIntersect className="size-3" strokeWidth={2.2} />
                      {formatAcres(farm.sizeAcres)} acres
                    </span>
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* Detail grid */}
            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <FarmDetailRow
                icon={IconMapPin}
                label="Location"
                value={farm.location || "Not specified"}
                accent="sky"
              />
              <FarmDetailRow
                icon={IconCalendar}
                label="Established"
                value={formatDate(farm.establishedAt)}
                accent="wheat"
              />
              <FarmDetailRow
                icon={IconUser}
                label="Manager"
                value={farm.managerName || "Unassigned"}
                accent="leaf"
              />
              <FarmDetailRow
                icon={SoilIcon}
                label="Soil"
                value={soil.label}
                accent="clay"
              />
              <FarmDetailRow
                icon={IconLayersIntersect}
                label="Fields"
                value={formatNumber(farm.fieldsCount)}
                accent="leaf"
              />
              <FarmDetailRow
                icon={IconScale}
                label="Yield to date"
                value={`${formatNumber(farm.yieldKg)} kg`}
                accent="wheat"
              />
            </div>

            {/* Description */}
            {farm.description && (
              <div className="mt-3 rounded-xl border border-border/40 bg-muted/30 px-3 py-2.5 text-[12px] leading-relaxed text-muted-foreground">
                {farm.description}
              </div>
            )}

            {/* Type description */}
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-border/40 bg-muted/30 px-3 py-2.5 text-[12px] text-muted-foreground">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-md",
                  t.bg
                )}
              >
                <TypeIcon className={cn("size-3.5", t.text)} strokeWidth={2.2} />
              </span>
              <span>{t.description}</span>
            </div>

            <DialogFooter className="mt-5 gap-2 border-t border-border/40 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange?.(false)}
              >
                Close
              </Button>
              {canManage && (
                <Button
                  type="button"
                  onClick={handleEdit}
                  className="gap-1.5 shadow-md shadow-leaf/20"
                >
                  <IconPencil className="size-4" strokeWidth={1.85} />
                  Edit farm
                </Button>
              )}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FarmDetailsDialog;
