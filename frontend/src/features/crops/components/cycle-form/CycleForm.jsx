import { useForm, useWatch } from "react-hook-form";
import {
  IconCheck,
  IconCircleCheckFilled,
  IconLeaf,
  IconLayoutGrid,
  IconLoader2,
  IconNotes,
  IconPlant2,
  IconSeedling,
  IconSun,
  IconUser,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import DatePicker from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FieldWrapper from "@/components/ui/field-wrapper";
import {
  CharCount,
  RequiredLegend,
  RequiredStar,
} from "@/components/ui/field-indicators";
import { Reveal } from "@/components/effects";
import { useListZonesQuery } from "@/features/fields/zoneApi";
import {
  CROP_STATUS_ORDER,
  GROWTH_STAGE_ORDER,
  getCropStatus,
  getGrowthStage,
} from "../../constants";
import {
  useListCropsQuery,
} from "../../cropApi";
import CycleIdentityPreview from "./CycleIdentityPreview";
import CropPicker from "./CropPicker";

const fieldLabel =
  "text-xs font-semibold tracking-wide text-muted-foreground uppercase";

const NOTES_MAX = 1000;
const NAME_MAX = 255;

const asString = (v) => (v === 0 || v ? String(v) : "");
const toNumberOrNull = (v) => {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

/** Plant count — positive integer. */
const validatePlantCount = (v) => {
  if (v === "" || v == null) return true;
  const n = Number(v);
  if (Number.isNaN(n) || !Number.isInteger(n)) return "Whole number";
  if (n <= 0) return "Must be > 0";
  if (n > 9_999_999) return "Too large";
  return true;
};

/** ISO string → "YYYY-MM-DD" for date inputs; blank stays "". */
const asDate = (iso) => (iso ? String(iso).slice(0, 10) : "");

/**
 * CycleForm — create/edit form for ONE planting cycle. Mirrors the
 * `cycles` schema: farm/zone + crop-catalog reference, name,
 * status, growth_stage, plant_count, dates, notes.
 */
const CycleForm = ({
  mode = "create",
  defaultValues,
  onSubmit,
  onCancel,
  submitting = false,
  formRef = null,
  hideFooter = false,
  // Optional preset for the field picker (used by the setup wizard).
  initialZoneId,
}) => {
  const isEdit = mode === "edit";

  // Catalog of crops (varieties) drives the picker; field list
  // gates new cycles to ACTIVE, non-maintenance fields.
  const { data: cropData, isLoading: cropsLoading } = useListCropsQuery();
  const crops = (cropData?.crops ?? []).filter((c) => c.isActive);

  const { data: zoneData, isLoading: zonesLoading } = useListZonesQuery();
  const zones = (zoneData?.zones ?? []).filter((z) => z.isActive);

  const form = useForm({
    defaultValues: {
      name: defaultValues?.name || "",
      cropId: defaultValues?.cropId || "",
      zoneId: defaultValues?.zoneId || initialZoneId || "",
      status: defaultValues?.status || "planned",
      growthStage: defaultValues?.growthStage || "seedling",
      plantCount: asString(defaultValues?.plantCount),
      dateSeeded: asDate(defaultValues?.dateSeeded),
      expectedHarvest: asDate(defaultValues?.expectedHarvest),
      actualHarvestDate: asDate(defaultValues?.actualHarvestDate),
      notes: defaultValues?.notes || "",
    },
  });

  const watched = useWatch({ control: form.control });
  const { isDirty } = form.formState;

  const selectedCrop = crops.find((c) => c.id === watched.cropId);
  const selectedZone = zones.find((z) => z.id === watched.zoneId);

  const submit = async (values) => {
    await onSubmit({
      name: values.name.trim() || null,
      cropId: values.cropId,
      zoneId: values.zoneId,
      status: values.status || "planned",
      growthStage: values.growthStage || "seedling",
      plantCount: toNumberOrNull(values.plantCount),
      dateSeeded: values.dateSeeded || null,
      expectedHarvest: values.expectedHarvest || null,
      actualHarvestDate: values.actualHarvestDate || null,
      notes: values.notes.trim() || null,
    });
  };

  const sectionTitle = (Icon, title, hint) => (
    <div className="mb-1.5 flex items-center justify-between gap-2">
      <span className={cn("flex items-center gap-1.5", fieldLabel)}>
        <Icon className="size-3.5" strokeWidth={1.75} />
        {title}
      </span>
      {hint && (
        <span className="text-[10px] font-medium text-muted-foreground/70">
          {hint}
        </span>
      )}
    </div>
  );

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(submit)}
        noValidate
        className="flex flex-col lg:h-full lg:min-h-0"
      >
        <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-4">
          {/* ===== Left — preview ===== */}
          <div className="flex min-h-0 flex-col">
            <CycleIdentityPreview
              name={watched.name}
              crop={selectedCrop}
              zoneName={selectedZone?.name}
              status={watched.status}
              growthStage={watched.growthStage}
              plantCount={watched.plantCount}
              dateSeeded={watched.dateSeeded}
              expectedHarvest={watched.expectedHarvest}
              actualHarvestDate={watched.actualHarvestDate}
            />
          </div>

          {/* ===== Right — fields ===== */}
          <div className="flex min-h-0 flex-col gap-3.5">
            {/* Cycle name + Field */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr]">
              <FormField
                control={form.control}
                name="name"
                rules={{
                  required: "Give this cycle a name",
                  minLength: { value: 2, message: "At least 2 characters" },
                  maxLength: { value: NAME_MAX, message: "Too long" },
                }}
                render={({ field, fieldState }) => (
                  <FormItem className="gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <FormLabel className={fieldLabel}>
                        Cycle name
                        <RequiredStar />
                      </FormLabel>
                      <CharCount value={watched.name} max={NAME_MAX} />
                    </div>
                    <FormControl>
                      <FieldWrapper
                        icon={IconPlant2}
                        hasError={fieldState.invalid}
                      >
                        <Input
                          placeholder="e.g. Spring beefsteak tomatoes"
                          className="border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FieldWrapper>
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zoneId"
                rules={{ required: "Pick the field this cycle grows in" }}
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel className={fieldLabel}>
                      Field
                      <RequiredStar />
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={submitting || zonesLoading}
                      >
                        <SelectTrigger aria-label="Field" className="w-full">
                          <span className="flex min-w-0 items-center gap-2">
                            <IconLayoutGrid
                              className="size-4 shrink-0 text-lagoon"
                              strokeWidth={1.85}
                            />
                            <SelectValue
                              placeholder={
                                zonesLoading ? "Loading fields…" : "Select field"
                              }
                            />
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          {zones.map((z) => (
                            <SelectItem
                              key={z.id}
                              value={z.id}
                              disabled={z.zoneStatus === "maintenance"}
                            >
                              <span className="flex items-center gap-2">
                                <span className="truncate">{z.name}</span>
                                <span className="text-[10px] text-muted-foreground">
                                  {z.zoneStatus === "maintenance"
                                    ? "under maintenance"
                                    : z.farmName}
                                </span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Crop — catalog picker grouped by category */}
            <FormField
              control={form.control}
              name="cropId"
              rules={{ required: "Pick a crop from the catalog" }}
              render={({ field }) => (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="inline-flex size-6 items-center justify-center rounded-md bg-linear-to-br from-leaf to-sage-deep text-white shadow-sm">
                      <IconLeaf className="size-3.5" strokeWidth={2.2} />
                    </span>
                    <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                      Crop
                    </span>
                    <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-muted/60 px-1.5 text-[10px] font-bold text-muted-foreground tabular-nums">
                      {crops.length} in catalog
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground/70">
                      · pick a crop to plant this cycle
                    </span>
                  </div>
                  {cropsLoading ? (
                    <div className="space-y-2">
                      {[0, 1, 2].map((g) => (
                        <div key={g} className="space-y-1.5">
                          <Skeleton className="h-3 w-32" />
                          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                              <Skeleton
                                key={i}
                                className="h-12 rounded-xl"
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <CropPicker
                      crops={crops}
                      value={field.value}
                      onChange={field.onChange}
                      disabled={submitting}
                    />
                  )}
                  {form.formState.errors?.cropId && (
                    <p className="mt-1.5 text-[11px] font-medium text-destructive">
                      {form.formState.errors.cropId.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Lifecycle + dates */}
            <Reveal duration={300}>
              <div className="rounded-2xl border border-border/40 bg-muted/15 p-3.5">
                {sectionTitle(
                  IconCircleCheckFilled,
                  "Cycle",
                  "planned → seeding → growing → flowering → harvested → completed"
                )}
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="gap-1.5">
                          <FormLabel className={fieldLabel}>Status</FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={submitting}
                          >
                            <SelectTrigger
                              aria-label="Cycle status"
                              className="w-full"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {CROP_STATUS_ORDER.map((id) => {
                                const s = getCropStatus(id);
                                return (
                                  <SelectItem key={id} value={id}>
                                    <span className="flex items-center gap-2">
                                      <span
                                        className={cn(
                                          "size-1.5 rounded-full",
                                          s.dot
                                        )}
                                      />
                                      <span className="font-semibold tracking-tight">
                                        {s.label}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground">
                                        {s.description}
                                      </span>
                                    </span>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="growthStage"
                      render={({ field }) => (
                        <FormItem className="gap-1.5">
                          <FormLabel className={fieldLabel}>
                            Growth stage
                          </FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={submitting}
                          >
                            <SelectTrigger
                              aria-label="Growth stage"
                              className="w-full"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {GROWTH_STAGE_ORDER.map((id) => {
                                const s = getGrowthStage(id);
                                return (
                                  <SelectItem key={id} value={id}>
                                    <span className="flex items-center gap-2">
                                      <span
                                        className={cn(
                                          "size-1.5 rounded-full",
                                          s.dot
                                        )}
                                      />
                                      <span className="font-semibold tracking-tight">
                                        {s.label}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground">
                                        {s.description}
                                      </span>
                                    </span>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 [&>*]:min-w-0">
                    <FormField
                      control={form.control}
                      name="dateSeeded"
                      render={({ field }) => (
                        <FormItem className="min-w-0 gap-1.5">
                          <FormLabel className={fieldLabel}>
                            Seed date
                          </FormLabel>
                          <FormControl>
                            <DatePicker
                              leadingIcon={IconSeedling}
                              value={field.value || ""}
                              onChange={field.onChange}
                              hasError={!!form.formState.errors?.dateSeeded}
                            />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="expectedHarvest"
                      rules={{
                        validate: (v, values) => {
                          if (!v || !values.dateSeeded) return true;
                          return (
                            new Date(v) >= new Date(values.dateSeeded) ||
                            "Expected harvest must be on or after seed date"
                          );
                        },
                      }}
                      render={({ field }) => (
                        <FormItem className="min-w-0 gap-1.5">
                          <FormLabel className={fieldLabel}>
                            Expected harvest
                          </FormLabel>
                          <FormControl>
                            <DatePicker
                              leadingIcon={IconSun}
                              value={field.value || ""}
                              onChange={field.onChange}
                              min={watched.dateSeeded || undefined}
                              hasError={
                                !!form.formState.errors?.expectedHarvest
                              }
                            />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="actualHarvestDate"
                      rules={{
                        validate: (v, values) => {
                          if (!v || !values.dateSeeded) return true;
                          return (
                            new Date(v) >= new Date(values.dateSeeded) ||
                            "Harvest date must be on or after seed date"
                          );
                        },
                      }}
                      render={({ field }) => (
                        <FormItem className="min-w-0 gap-1.5">
                          <FormLabel className={fieldLabel}>
                            Actual harvest
                          </FormLabel>
                          <FormControl>
                            <DatePicker
                              leadingIcon={IconSun}
                              value={field.value || ""}
                              onChange={field.onChange}
                              min={watched.dateSeeded || undefined}
                              hasError={
                                !!form.formState.errors?.actualHarvestDate
                              }
                            />
                          </FormControl>
                          <FormMessage className="text-[11px]" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Plant count */}
            <FormField
              control={form.control}
              name="plantCount"
              rules={{ validate: validatePlantCount }}
              render={({ field, fieldState }) => (
                <FormItem className="gap-1.5 sm:max-w-50">
                  <FormLabel className={fieldLabel}>Plant count</FormLabel>
                  <FormControl>
                    <FieldWrapper
                      icon={IconUser}
                      hasError={fieldState.invalid}
                    >
                      <Input
                        type="number"
                        inputMode="numeric"
                        step="1"
                        min="1"
                        placeholder="e.g. 220"
                        className="tabular-nums border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FieldWrapper>
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              rules={{ maxLength: { value: NOTES_MAX, message: "Too long" } }}
              render={({ field }) => (
                <FormItem className="gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <FormLabel className={fieldLabel}>Notes</FormLabel>
                    <CharCount value={watched.notes} max={NOTES_MAX} />
                  </div>
                  <FormControl>
                    <FieldWrapper
                      icon={IconNotes}
                      align="start"
                      hasError={!!form.formState.errors?.notes}
                    >
                      <Textarea
                        placeholder="Anything worth remembering about this cycle — sowing notes, pests to watch, orders…"
                        rows={3}
                        className="min-h-20 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FieldWrapper>
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Footer */}
        {!hideFooter && (
          <div className="mt-4 flex flex-col gap-3 border-t border-border/40 pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
            <div className="text-[11px] text-muted-foreground sm:order-1">
              <p>
                {isDirty ? (
                  <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                    <span className="size-1.5 rounded-full bg-amber-500" />
                    Unsaved changes
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground/70">
                    <IconCircleCheckFilled className="size-3 text-leaf" />
                    {isEdit ? "All changes saved" : "Ready to add"}
                  </span>
                )}
              </p>
              <RequiredLegend />
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:gap-2 sm:order-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  form.reset();
                  onCancel?.();
                }}
                disabled={submitting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || (isEdit && !isDirty)}
                className="w-full gap-2 shadow-md shadow-leaf/20 sm:w-auto"
              >
                {submitting ? (
                  <IconLoader2 className="size-4 animate-spin" strokeWidth={2} />
                ) : (
                  <IconCheck className="size-4" strokeWidth={2} />
                )}
                {submitting
                  ? isEdit
                    ? "Saving…"
                    : "Adding…"
                  : isEdit
                    ? "Save changes"
                    : "Plan cycle"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
};

export default CycleForm;