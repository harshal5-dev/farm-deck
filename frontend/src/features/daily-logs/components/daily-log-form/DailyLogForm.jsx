import { useForm, useWatch } from "react-hook-form";
import {
  IconBucketDroplet,
  IconCalendarEvent,
  IconCheck,
  IconCloudRain,
  IconDroplet,
  IconDroplets,
  IconFlask,
  IconGrain,
  IconLeaf,
  IconLoader2,
  IconNotes,
  IconTemperature,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import Switch from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FieldWrapper from "@/components/ui/field-wrapper";
import {
  CharCount,
  RequiredLegend,
  RequiredStar,
} from "@/components/ui/field-indicators";
import {
  formatEcRange,
  formatPhRange,
  formatPpmRange,
} from "@/features/crops/lib/crop";
import {
  WATER_LEVEL_META,
  WATER_LEVEL_ORDER,
  getLogType,
} from "../../constants";
import LogIdentityPreview from "./LogIdentityPreview";

const NOTES_MAX = 1000;
const fieldLabel =
  "text-xs font-semibold tracking-wide text-muted-foreground uppercase";

const toDate = (iso) => (iso ? String(iso).slice(0, 10) : "");
const asString = (v) => (v === 0 || v ? String(v) : "");
const numOrNull = (v) => {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};
const intOrNull = (v) => {
  const n = numOrNull(v);
  return n == null ? null : Math.round(n);
};

/** DB-mirror validators — every range here maps 1:1 to a CHECK
 *  constraint on the `daily_logs` table. */
const validatePh = (v) => {
  if (v === "" || v == null) return true;
  const n = Number(v);
  if (Number.isNaN(n)) return "Enter a number";
  const s = String(v).trim();
  if (s.includes(".") && s.split(".")[1].length > 2) return "Max 2 decimals";
  if (n < 0 || n > 14) return "0 – 14";
  return true;
};
const validateEc = (v) => {
  if (v === "" || v == null) return true;
  const n = Number(v);
  if (Number.isNaN(n)) return "Enter a number";
  const s = String(v).trim();
  if (s.includes(".") && s.split(".")[1].length > 2) return "Max 2 decimals";
  if (n < 0) return "Must be ≥ 0";
  return true;
};
const validatePpm = (v) => {
  if (v === "" || v == null) return true;
  const n = Number(v);
  if (!Number.isInteger(n)) return "Whole number";
  if (n < 0) return "Must be ≥ 0";
  return true;
};
const validateHumidity = (v) => {
  if (v === "" || v == null) return true;
  const n = Number(v);
  if (Number.isNaN(n)) return "Enter a number";
  const s = String(v).trim();
  if (s.includes(".") && s.split(".")[1].length > 1) return "Max 1 decimal";
  if (n < 0 || n > 100) return "0 – 100";
  return true;
};
const validateSoilMoisture = (v) => {
  if (v === "" || v == null) return true;
  const n = Number(v);
  if (Number.isNaN(n)) return "Enter a number";
  const s = String(v).trim();
  if (s.includes(".") && s.split(".")[1].length > 2) return "Max 2 decimals";
  if (n < 0 || n > 100) return "0 – 100";
  return true;
};
const validateRainfall = (v) => {
  if (v === "" || v == null) return true;
  const n = Number(v);
  if (Number.isNaN(n)) return "Enter a number";
  const s = String(v).trim();
  if (s.includes(".") && s.split(".")[1].length > 1) return "Max 1 decimal";
  if (n < 0) return "Must be ≥ 0";
  return true;
};
const validateTemp = (v, { min = -40, max = 60 } = {}) => {
  if (v === "" || v == null) return true;
  const n = Number(v);
  if (Number.isNaN(n)) return "Enter a number";
  const s = String(v).trim();
  if (s.includes(".") && s.split(".")[1].length > 1) return "Max 1 decimal";
  if (n < min || n > max) return `${min} – ${max}°C`;
  return true;
};

/**
 * DailyLogForm — create/edit one reading. The cycle carries its
 * zone's cultivation mode, which locks the `log_type` (and therefore
 * which fields render); the catalog crop's target ranges show as
 * hints beside each numeric input so the grower knows where they
 * should land.
 */
const DailyLogForm = ({
  mode = "create",
  defaultValues,
  cycle,
  onSubmit,
  onCancel,
  submitting = false,
}) => {
  const isEdit = mode === "edit";
  const logType = cycle?.logType ?? "hydro";
  const t = getLogType(logType);
  const TypeIcon = t.icon;
  const crop = cycle?.crop ?? null;

  const form = useForm({
    defaultValues: {
      cycleId: cycle?.id || defaultValues?.cycleId || "",
      logDate:
        toDate(defaultValues?.logDate) || toDate(new Date().toISOString()),
      logType,
      ph: asString(defaultValues?.ph),
      ec: asString(defaultValues?.ec),
      ppm: asString(defaultValues?.ppm),
      waterTempC: asString(defaultValues?.waterTempC),
      airTempC: asString(defaultValues?.airTempC),
      humidityPercent: asString(defaultValues?.humidityPercent),
      waterLevelStatus: defaultValues?.waterLevelStatus ?? "",
      nutrientsAdded: defaultValues?.nutrientsAdded ?? false,
      soilMoisture: asString(defaultValues?.soilMoisture),
      rainfallMm: asString(defaultValues?.rainfallMm),
      observation: defaultValues?.observation ?? "",
    },
  });

  const watched = useWatch({ control: form.control });
  const { isDirty } = form.formState;

  const submit = async (values) => {
    await onSubmit({
      cycleId: values.cycleId,
      logDate: values.logDate,
      logType,
      ph: numOrNull(values.ph),
      ec: numOrNull(values.ec),
      ppm: intOrNull(values.ppm),
      waterTempC: numOrNull(values.waterTempC),
      airTempC: numOrNull(values.airTempC),
      humidityPercent: numOrNull(values.humidityPercent),
      waterLevelStatus: values.waterLevelStatus || null,
      nutrientsAdded: values.nutrientsAdded === true,
      soilMoisture: numOrNull(values.soilMoisture),
      rainfallMm: numOrNull(values.rainfallMm),
      observation: values.observation.trim() || null,
    });
  };

  const existingLogs = cycle?.logs ?? [];
  const dateClash =
    !isEdit &&
    existingLogs.some(
      (l) => l.logDate === watched.logDate && l.cycleId === cycle?.id
    );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        noValidate
        className="flex flex-col lg:h-full lg:min-h-0"
      >
        <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-4">
          {/* ===== Left — log identity / type preview ===== */}
          <div className="flex min-h-0 flex-col">
            <LogIdentityPreview
              logType={logType}
              logDate={watched.logDate}
              ph={watched.ph}
              ec={watched.ec}
              ppm={watched.ppm}
              waterTempC={watched.waterTempC}
              airTempC={watched.airTempC}
              humidityPercent={watched.humidityPercent}
              soilMoisture={watched.soilMoisture}
              rainfallMm={watched.rainfallMm}
              waterLevelStatus={watched.waterLevelStatus}
              nutrientsAdded={watched.nutrientsAdded}
              observation={watched.observation}
              cycle={cycle}
            />
          </div>

          {/* ===== Right — fields (scrolls on its own so the footer
               stays reachable on short viewports) ===== */}
          <div className="flex min-h-0 flex-col gap-3.5 lg:overflow-y-auto lg:pr-1">
            {/* Date + log type (read-only derived) */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr]">
              <FormField
                control={form.control}
                name="logDate"
                rules={{ required: "Pick the date for this log" }}
                render={({ field }) => (
                  <FormItem className="min-w-0 gap-1.5">
                    <FormLabel className={fieldLabel}>
                      Log date
                      <RequiredStar />
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        leadingIcon={IconCalendarEvent}
                        value={field.value || ""}
                        onChange={field.onChange}
                        hasError={!!form.formState.errors?.logDate}
                      />
                    </FormControl>
                    {dateClash && (
                      <p className="text-[11px] font-medium text-amber-700 dark:text-amber-400">
                        A log already exists for this date — pick another
                        day or edit the existing entry.
                      </p>
                    )}
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              {/* Log type — read-only badge (derived from cycle's zone) */}
              <div className="min-w-0">
                <span className={fieldLabel}>Log type</span>
                <div
                  className={cn(
                    "mt-1.5 flex h-9 w-full items-center gap-2 rounded-xl border px-3",
                    t.bgSoft,
                    "border-border/40 ring-1 ring-transparent"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded-md text-white shadow-sm bg-linear-to-br",
                      t.gradient
                    )}
                  >
                    <TypeIcon className="size-3" strokeWidth={2.2} />
                  </span>
                  <span
                    className={cn(
                      "text-sm font-semibold tracking-tight",
                      t.text
                    )}
                  >
                    {t.label}
                  </span>
                  <span className="ml-auto text-[10px] font-medium text-muted-foreground/70">
                    derived from {cycle?.zoneName ?? "the field"}
                  </span>
                </div>
              </div>
            </div>

            {/* Universal readings — pH / EC / PPM */}
            <div className="rounded-2xl border border-border/40 bg-muted/15 p-3.5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className={cn("flex items-center gap-1.5", fieldLabel)}>
                  <IconDroplet className="size-3.5" strokeWidth={1.75} />
                  Readings
                </span>
                {cycle?.crop && (
                  <span className="text-[10px] font-medium text-muted-foreground/70">
                    targets from {cycle.crop.name}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <MetricField
                  control={form.control}
                  name="ph"
                  label="pH"
                  icon={IconDroplet}
                  step="0.01"
                  placeholder="e.g. 6.1"
                  validate={validatePh}
                  hasError={!!form.formState.errors?.ph}
                  hint={
                    crop
                      ? `target ${formatPhRange(crop.targetPhMin, crop.targetPhMax) ?? "—"}`
                      : null
                  }
                />
                <MetricField
                  control={form.control}
                  name="ec"
                  label="EC"
                  icon={IconFlask}
                  step="0.01"
                  placeholder="e.g. 2.6"
                  unit="mS/cm"
                  validate={validateEc}
                  hasError={!!form.formState.errors?.ec}
                  hint={
                    crop
                      ? `target ${formatEcRange(crop.targetEcMin, crop.targetEcMax) ?? "—"}`
                      : null
                  }
                />
                <MetricField
                  control={form.control}
                  name="ppm"
                  label="PPM"
                  icon={IconGrain}
                  step="1"
                  placeholder="e.g. 1800"
                  unit="ppm"
                  validate={validatePpm}
                  hasError={!!form.formState.errors?.ppm}
                  hint={
                    crop
                      ? `target ${formatPpmRange(crop.targetPpmMin, crop.targetPpmMax) ?? "—"}`
                      : null
                  }
                />
              </div>
            </div>

            {/* Type-specific metrics */}
            <div className="rounded-2xl border border-border/40 bg-muted/15 p-3.5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className={cn("flex items-center gap-1.5", fieldLabel)}>
                  <TypeIcon className="size-3.5" strokeWidth={1.75} />
                  {t.label} details
                </span>
                <span className="text-[10px] font-medium text-muted-foreground/70">
                  only what's relevant to {t.label.toLowerCase()} zones
                </span>
              </div>

              {logType === "hydro" ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <MetricField
                    control={form.control}
                    name="waterTempC"
                    label="Water temp"
                    icon={IconTemperature}
                    step="0.1"
                    placeholder="e.g. 21.5"
                    unit="°C"
                    validate={(v) => validateTemp(v, { min: -10, max: 60 })}
                    hasError={!!form.formState.errors?.waterTempC}
                  />
                  <FormField
                    control={form.control}
                    name="waterLevelStatus"
                    render={({ field }) => (
                      <FormItem className="min-w-0 gap-1.5">
                        <FormLabel className={fieldLabel}>
                          Water level
                        </FormLabel>
                        <Select
                          value={field.value || "skip"}
                          onValueChange={(v) =>
                            field.onChange(v === "skip" ? "" : v)
                          }
                          disabled={submitting}
                        >
                          <SelectTrigger
                            aria-label="Water level"
                            className="w-full"
                          >
                            <span className="flex min-w-0 items-center gap-2">
                              <IconBucketDroplet
                                className="size-4 shrink-0 text-lagoon"
                                strokeWidth={1.85}
                              />
                              <SelectValue />
                            </span>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="skip">
                              <span className="text-muted-foreground">
                                Not measured
                              </span>
                            </SelectItem>
                            {WATER_LEVEL_ORDER.map((id) => {
                              const m = WATER_LEVEL_META[id];
                              return (
                                <SelectItem key={id} value={id}>
                                  <span className="flex items-center gap-2">
                                    <span
                                      className={cn(
                                        "size-1.5 rounded-full",
                                        m.dot
                                      )}
                                    />
                                    <span className="font-semibold tracking-tight">
                                      {m.label}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                      {m.description}
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
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <MetricField
                    control={form.control}
                    name="airTempC"
                    label="Air temp"
                    icon={IconTemperature}
                    step="0.1"
                    placeholder="e.g. 24.5"
                    unit="°C"
                    validate={(v) => validateTemp(v, { min: -40, max: 60 })}
                    hasError={!!form.formState.errors?.airTempC}
                  />
                  <MetricField
                    control={form.control}
                    name="humidityPercent"
                    label="Humidity"
                    icon={IconDroplets}
                    step="0.1"
                    placeholder="e.g. 68"
                    unit="%"
                    validate={validateHumidity}
                    hasError={!!form.formState.errors?.humidityPercent}
                  />
                  <MetricField
                    control={form.control}
                    name="soilMoisture"
                    label="Soil moisture"
                    icon={IconLeaf}
                    step="0.01"
                    placeholder="e.g. 42"
                    unit="% VWC"
                    validate={validateSoilMoisture}
                    hasError={!!form.formState.errors?.soilMoisture}
                  />
                  <MetricField
                    control={form.control}
                    name="rainfallMm"
                    label="Rainfall"
                    icon={IconCloudRain}
                    step="0.1"
                    placeholder="e.g. 6.1"
                    unit="mm"
                    validate={validateRainfall}
                    hasError={!!form.formState.errors?.rainfallMm}
                  />
                </div>
              )}

              {/* Nutrients toggle — universal across both log types */}
              <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-border/30 bg-card/40 px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-leaf/12 text-leaf">
                    <IconLeaf className="size-3.5" strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold tracking-tight">
                      Nutrients added today
                    </p>
                    <p className="text-[10px] text-muted-foreground/80">
                      Toggle if you top-fed or amended the reservoir / bed.
                    </p>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="nutrientsAdded"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                          disabled={submitting}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Observation */}
            <FormField
              control={form.control}
              name="observation"
              rules={{ maxLength: { value: NOTES_MAX, message: "Too long" } }}
              render={({ field }) => (
                <FormItem className="gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <FormLabel className={fieldLabel}>Observation</FormLabel>
                    <CharCount value={watched.observation} max={NOTES_MAX} />
                  </div>
                  <FormControl>
                    <FieldWrapper
                      icon={IconNotes}
                      align="start"
                      hasError={!!form.formState.errors?.observation}
                    >
                      <Textarea
                        placeholder="Anything worth noting — pest sightings, growth changes, irrigation quirks…"
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
                  <IconCheck className="size-3 text-leaf" strokeWidth={2.2} />
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
              disabled={
                submitting || (isEdit && !isDirty) || dateClash
              }
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
                  ? "Save log"
                  : "Add log"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

/** Compact metric input — icon, value with inline unit suffix, and
 *  validation mapped to the DB CHECK constraints. */
const MetricField = ({
  control,
  name,
  label,
  icon: Icon,
  step,
  placeholder,
  unit,
  validate,
  hasError,
  hint,
}) => (
  <FormField
    control={control}
    name={name}
    rules={{ validate }}
    render={({ field }) => (
      <FormItem className="min-w-0 gap-1.5">
        <FormLabel className={fieldLabel}>{label}</FormLabel>
        <FormControl>
          <FieldWrapper icon={Icon} hasError={hasError}>
            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                step={step}
                inputMode="decimal"
                placeholder={placeholder}
                className="h-7 border-0 bg-transparent px-0 tabular-nums shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                {...field}
              />
              {unit && (
                <span className="shrink-0 rounded-md bg-muted/70 px-1.5 py-0.5 text-[10px] font-semibold tracking-tight text-muted-foreground/80">
                  {unit}
                </span>
              )}
            </div>
          </FieldWrapper>
        </FormControl>
        {hint && !hasError && (
          <p className="text-[10px] text-muted-foreground/70">{hint}</p>
        )}
        <FormMessage className="text-[11px]" />
      </FormItem>
    )}
  />
);

export default DailyLogForm;