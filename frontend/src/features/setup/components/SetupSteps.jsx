import { toast } from "sonner";
import { useDispatch } from "react-redux";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconCirclePlus,
  IconLoader2,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RequiredLegend } from "@/components/ui/field-indicators";
import FarmForm from "@/features/farms/components/farm-form/FarmForm";
import ZoneForm from "@/features/fields/components/zone-form/ZoneForm";
import CropForm from "@/features/crops/components/crop-form/CropForm";
import { zoneApi } from "@/features/fields/zoneApi";
import { useCreateSetupFarmMutation, useListSetupFarmTypesQuery } from "../setupApi";

/** Small muted line above each step's form. */
export const StepHint = ({ icon: Icon, children }) => (
  <p className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
    <Icon className="size-3.5 shrink-0 text-leaf" strokeWidth={1.85} />
    {children}
  </p>
);

/** Chips listing what the wizard has created so far in this step. */
export const CreatedChips = ({ items = [] }) => {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {items.map((item) => (
        <span
          key={item.id}
          className="inline-flex max-w-full items-center gap-1.5 truncate rounded-full border border-leaf/30 bg-leaf/10 px-2.5 py-1 text-[11px] font-semibold text-leaf"
        >
          <span className="size-1.5 shrink-0 rounded-full bg-leaf" />
          <span className="truncate">{item.name}</span>
        </span>
      ))}
    </div>
  );
};

/** Continue / Skip — adapts once something has been created. Kept as a
 *  standalone primitive; the wizard itself now uses SetupFooter below. */
export const StepNav = ({ createdCount, onContinue, onBack, noun }) => (
  <div className="flex items-center justify-end gap-2">
    {onBack && (
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="gap-1.5"
      >
        <IconArrowLeft className="size-4" strokeWidth={1.85} />
        Back
      </Button>
    )}
    <Button
      type="button"
      onClick={onContinue}
      className={cn(
        "gap-1.5",
        createdCount === 0 && "shadow-none border border-border/60 bg-card/60 text-foreground hover:bg-card"
      )}
    >
      {createdCount > 0 ? `Continue to ${noun}` : `Skip ${noun} for now`}
      <IconArrowRight className="size-4" strokeWidth={1.85} />
    </Button>
  </div>
);

/**
 * SetupFooter — the wizard's single pinned footer for the add-many
 * steps (Fields, Crops). It replaces both the form's own footer and
 * the old separate step-nav bar with one cohesive row: created-items
 * chips + required-fields legend on the left, and Back · Add ·
 * Continue on the right.
 *
 * The Add button submits the step's <form> via the passed formRef
 * (requestSubmit), so the form's react-hook-form validation + submit
 * flow still run exactly as if the button lived inside the form. The
 * mutation loading state is lifted to the wizard page, which owns the
 * create handlers, so the button reflects "Adding…" correctly.
 */
export const SetupFooter = ({
  items = [],
  formRef,
  submitLabel,
  submitting = false,
  onBack,
  onContinue,
  continueNoun,
}) => {
  const createdCount = items.length;
  return (
    <div className="mt-3 flex shrink-0 flex-col gap-3 border-t border-border/40 pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
      {/* Left — created-items chips + required legend */}
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1.5 sm:order-1">
        <CreatedChips items={items} />
        <RequiredLegend />
      </div>
      {/* Right — actions */}
      <div className="flex shrink-0 flex-col-reverse gap-2 sm:flex-row sm:items-center sm:gap-2 sm:order-2">
        {onBack && (
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="gap-1.5"
          >
            <IconArrowLeft className="size-4" strokeWidth={1.85} />
            Back
          </Button>
        )}
        <Button
          type="button"
          onClick={() => formRef?.current?.requestSubmit()}
          disabled={submitting}
          className="gap-2 shadow-md shadow-leaf/20 sm:w-auto"
        >
          {submitting ? (
            <IconLoader2 className="size-4 animate-spin" strokeWidth={2} />
          ) : (
            <IconCheck className="size-4" strokeWidth={2} />
          )}
          {submitting ? "Adding…" : submitLabel}
        </Button>
        <Button
          type="button"
          onClick={onContinue}
          className={cn(
            "gap-1.5",
            createdCount === 0 &&
              "shadow-none border border-border/60 bg-card/60 text-foreground hover:bg-card"
          )}
        >
          {createdCount > 0
            ? `Continue to ${continueNoun}`
            : `Skip ${continueNoun} for now`}
          <IconArrowRight className="size-4" strokeWidth={1.85} />
        </Button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Step 1 — the farm (existing FarmForm, mock lookups injected)       */
/* ------------------------------------------------------------------ */
export const FarmStep = ({ onDone, onExit }) => {
  const [createSetupFarm, { isLoading }] = useCreateSetupFarmMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (values) => {
    try {
      const farm = await createSetupFarm(values).unwrap();
      // Refresh the field/crop pickers so the new farm is selectable.
      dispatch(zoneApi.util.invalidateTags(["FarmPicker"]));
      toast.success("Farm created", {
        description: `${farm.name} is ready — now add your first field.`,
      });
      onDone(farm);
    } catch (err) {
      toast.error("Could not create farm", {
        description: err?.data?.error?.message || "Please try again.",
      });
    }
  };

  return (
    <FarmForm
      mode="create"
      onSubmit={handleSubmit}
      onCancel={onExit}
      submitting={isLoading}
      typesQuery={useListSetupFarmTypesQuery}
    />
  );
};

/* ------------------------------------------------------------------ */
/*  Step 2 — fields (existing ZoneForm, farm locked, add-many)         */
/* ------------------------------------------------------------------ */
export const FieldsStep = ({
  farm,
  createdKey = 0,
  onSubmit,
  submitting,
  onExit,
  formRef,
  hideFooter = false,
}) => (
  <div className="flex flex-col gap-3">
    <StepHint icon={IconCirclePlus}>
      Each field is a growing area on {farm.name} — a plot, a bed, a rack.
      Add as many as you like; you can also skip and add them later.
    </StepHint>
    {/* key remounts the form fresh after each creation */}
    <ZoneForm
      key={createdKey}
      mode="create"
      defaultValues={{ farmId: farm.id }}
      lockFarmId={farm.id}
      lockFarmName={farm.name}
      onSubmit={onSubmit}
      submitting={submitting}
      onCancel={onExit}
      formRef={formRef}
      hideFooter={hideFooter}
    />
  </div>
);

/* ------------------------------------------------------------------ */
/*  Step 3 — crops (existing CropForm, first field preselected)        */
/* ------------------------------------------------------------------ */
export const CropsStep = ({
  farm,
  zones,
  createdKey = 0,
  onSubmit,
  submitting,
  onExit,
  formRef,
  hideFooter = false,
}) => (
  <div className="flex flex-col gap-3">
    <StepHint icon={IconCirclePlus}>
      Plan what's growing on {farm.name}. Pick a field, choose the crop,
      set a sow date — the cycle advances as it grows.
    </StepHint>
    <CropForm
      key={createdKey}
      mode="create"
      defaultValues={zones[0] ? { zoneId: zones[0].id } : undefined}
      onSubmit={onSubmit}
      submitting={submitting}
      onCancel={onExit}
      formRef={formRef}
      hideFooter={hideFooter}
    />
  </div>
);
