import { useForm, useWatch } from "react-hook-form";
import {
  IconBeach,
  IconCheck,
  IconCircleCheckFilled,
  IconClockHour4,
  IconDroplet,
  IconLeaf,
  IconLoader2,
  IconNotes,
  IconPlant2,
  IconSun,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
import { CROP_TYPE_ORDER, getCropType } from "../../constants";
import CropCatalogPreview from "./CropCatalogPreview";

const fieldLabel =
  "text-xs font-semibold tracking-wide text-muted-foreground uppercase";

const NAME_MAX = 255;
const NOTES_MAX = 1000;

/** Number-or-empty validator — empty stays empty (nullable in DB). */
const asString = (v) => (v === 0 || v ? String(v) : "");

const toNumberOrNull = (v) => {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};

/**
 * NUMERIC(3,1) / NUMERIC(5,2) — pH is one decimal, EC is two.
 * DB constraint: `crops_ph_min_chk` requires 0 ≤ pH ≤ 14.
 */
const validatePh = (v) => {
  if (v === "" || v == null) return true;
  const n = Number(v);
  if (Number.isNaN(n)) return "Enter a number";
  const s = String(v).trim();
  if (s.includes(".") && s.split(".")[1].length > 1)
    return "Max 1 decimal";
  if (n < 0 || n > 14) return "Must be 0–14";
  return true;
};

/** EC in mS/cm — two decimals. */
const validateEc = (v) => {
  if (v === "" || v == null) return true;
  const n = Number(v);
  if (Number.isNaN(n)) return "Enter a number";
  const s = String(v).trim();
  if (s.includes(".") && s.split(".")[1].length > 2)
    return "Max 2 decimals";
  if (n < 0) return "Must be ≥ 0";
  if (n > 99.99) return "Too large";
  return true;
};

/** PPM — integer. */
const validatePpm = (v) => {
  if (v === "" || v == null) return true;
  const n = Number(v);
  if (Number.isNaN(n) || !Number.isInteger(n)) return "Whole number";
  if (n < 0) return "Must be ≥ 0";
  if (n > 999999) return "Too large";
  return true;
};

/** Days to harvest — positive integer (DB CHECK). */
const validateDays = (v) => {
  if (v === "" || v == null) return true;
  const n = Number(v);
  if (Number.isNaN(n) || !Number.isInteger(n)) return "Whole number";
  if (n <= 0) return "Must be > 0";
  return true;
};

/** Light hours/day — 0 to 24 (DB CHECK). */
const validateLight = (v) => {
  if (v === "" || v == null) return true;
  const n = Number(v);
  if (Number.isNaN(n)) return "Enter a number";
  const s = String(v).trim();
  if (s.includes(".") && s.split(".")[1].length > 1)
    return "Max 1 decimal";
  if (n < 0 || n > 24) return "Must be 0–24";
  return true;
};

/**
 * Form payload shape used by both Create and Edit. The mock API
 * coerces to the DB row shape (numbers, trimmed strings, null for
 * empty), so we only need to forward the user-entered strings here.
 */
const CropCatalogForm = ({
  mode = "create",
  defaultValues,
  onSubmit,
  onCancel,
  submitting = false,
}) => {
  const isEdit = mode === "edit";

  const form = useForm({
    defaultValues: {
      name: defaultValues?.name || "",
      category: defaultValues?.category || "leafy_green",
      targetPhMin: asString(defaultValues?.targetPhMin),
      targetPhMax: asString(defaultValues?.targetPhMax),
      targetEcMin: asString(defaultValues?.targetEcMin),
      targetEcMax: asString(defaultValues?.targetEcMax),
      targetPpmMin: asString(defaultValues?.targetPpmMin),
      targetPpmMax: asString(defaultValues?.targetPpmMax),
      daysToHarvest: asString(defaultValues?.daysToHarvest),
      lightHoursPerDay: asString(defaultValues?.lightHoursPerDay),
      notes: defaultValues?.notes || "",
    },
  });

  const watched = useWatch({ control: form.control });
  const { isDirty } = form.formState;

  const submit = async (values) => {
    await onSubmit({
      name: values.name,
      category: values.category,
      targetPhMin: toNumberOrNull(values.targetPhMin),
      targetPhMax: toNumberOrNull(values.targetPhMax),
      targetEcMin: toNumberOrNull(values.targetEcMin),
      targetEcMax: toNumberOrNull(values.targetEcMax),
      targetPpmMin: toNumberOrNull(values.targetPpmMin),
      targetPpmMax: toNumberOrNull(values.targetPpmMax),
      daysToHarvest: toNumberOrNull(values.daysToHarvest),
      lightHoursPerDay: toNumberOrNull(values.lightHoursPerDay),
      notes: values.notes.trim() || null,
    });
  };

  // Live values for the preview pane — coerce the strings back to
  // numbers so the preview shows the actual ranges, not raw input.
  const previewCrop = {
    name: watched.name || "New crop",
    category: watched.category,
    targetPhMin: toNumberOrNull(watched.targetPhMin),
    targetPhMax: toNumberOrNull(watched.targetPhMax),
    targetEcMin: toNumberOrNull(watched.targetEcMin),
    targetEcMax: toNumberOrNull(watched.targetEcMax),
    targetPpmMin: toNumberOrNull(watched.targetPpmMin),
    targetPpmMax: toNumberOrNull(watched.targetPpmMax),
    daysToHarvest: toNumberOrNull(watched.daysToHarvest),
    lightHoursPerDay: toNumberOrNull(watched.lightHoursPerDay),
    notes: watched.notes,
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
        onSubmit={form.handleSubmit(submit)}
        noValidate
        className="flex flex-col lg:h-full lg:min-h-0"
      >
        <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-4">
          {/* ===== Left — preview ========================================= */}
          <div className="flex min-h-0 flex-col">
            <CropCatalogPreview crop={previewCrop} />
          </div>

          {/* ===== Right — form fields =================================== */}
          <div className="flex min-h-0 flex-col gap-3.5">
            {/* Name + Category */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr]">
              <FormField
                control={form.control}
                name="name"
                rules={{
                  required: "Crop name is required",
                  minLength: { value: 2, message: "At least 2 characters" },
                  maxLength: { value: NAME_MAX, message: "Too long" },
                }}
                render={({ field, fieldState }) => (
                  <FormItem className="gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <FormLabel className={fieldLabel}>
                        Crop name
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
                          placeholder="e.g. Genovese Basil"
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
                name="category"
                rules={{ required: "Pick a category" }}
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel className={fieldLabel}>
                      Category
                      <RequiredStar />
                    </FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={submitting}
                    >
                      <SelectTrigger aria-label="Category" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="end">
                        {CROP_TYPE_ORDER.map((id) => {
                          const t = getCropType(id);
                          const Icon = t.icon;
                          return (
                            <SelectItem key={id} value={id}>
                              <span className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "flex size-4 items-center justify-center rounded-md bg-linear-to-br text-white",
                                    t.gradient
                                  )}
                                >
                                  <Icon
                                    className="size-2.5"
                                    strokeWidth={2.4}
                                  />
                                </span>
                                <span className="font-semibold tracking-tight">
                                  {t.label}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {t.tagline}
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

            {/* Target ranges — pH / EC / PPM */}
            <div className="rounded-2xl border border-border/40 bg-muted/15 p-3.5">
              {sectionTitle(
                IconLeaf,
                "Target ranges",
                "what this crop thrives in"
              )}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* pH */}
                <div className="space-y-1.5">
                  <p
                    className={cn(
                      "inline-flex items-center gap-1",
                      fieldLabel
                    )}
                  >
                    <IconDroplet
                      className="size-3 text-lagoon"
                      strokeWidth={2.2}
                    />
                    pH
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <FormField
                      control={form.control}
                      name="targetPhMin"
                      rules={{
                        validate: validatePh,
                      }}
                      render={({ field, fieldState }) => (
                        <FormItem className="gap-0">
                          <FormControl>
                            <FieldWrapper
                              compact
                              hasError={fieldState.invalid}
                            >
                              <Input
                                type="number"
                                step="0.1"
                                min="0"
                                max="14"
                                inputMode="decimal"
                                placeholder="min"
                                className="h-7 border-0 bg-transparent text-center text-xs tabular-nums shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                {...field}
                              />
                            </FieldWrapper>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="targetPhMax"
                      rules={{
                        validate: (v, vals) => {
                          const base = validatePh(v);
                          if (base !== true) return base;
                          if (
                            v !== "" &&
                            v != null &&
                            vals.targetPhMin !== "" &&
                            vals.targetPhMin != null &&
                            Number(v) < Number(vals.targetPhMin)
                          )
                            return "Max must be ≥ min";
                          return true;
                        },
                      }}
                      render={({ field, fieldState }) => (
                        <FormItem className="gap-0">
                          <FormControl>
                            <FieldWrapper
                              compact
                              hasError={fieldState.invalid}
                            >
                              <Input
                                type="number"
                                step="0.1"
                                min="0"
                                max="14"
                                inputMode="decimal"
                                placeholder="max"
                                className="h-8 border-0 bg-transparent text-center text-xs tabular-nums shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                {...field}
                              />
                            </FieldWrapper>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground/70">
                    0 – 14 · 1 decimal
                  </p>
                </div>

                {/* EC */}
                <div className="space-y-1.5">
                  <p
                    className={cn("inline-flex items-center gap-1", fieldLabel)}
                  >
                    <IconLeaf
                      className="size-3 text-leaf"
                      strokeWidth={2.2}
                    />
                    EC
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <FormField
                      control={form.control}
                      name="targetEcMin"
                      rules={{ validate: validateEc }}
                      render={({ field, fieldState }) => (
                        <FormItem className="gap-0">
                          <FormControl>
                            <FieldWrapper
                              compact
                              hasError={fieldState.invalid}
                            >
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                inputMode="decimal"
                                placeholder="min"
                                className="h-8 border-0 bg-transparent text-center text-xs tabular-nums shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                {...field}
                              />
                            </FieldWrapper>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="targetEcMax"
                      rules={{ validate: validateEc }}
                      render={({ field, fieldState }) => (
                        <FormItem className="gap-0">
                          <FormControl>
                            <FieldWrapper
                              compact
                              hasError={fieldState.invalid}
                            >
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                inputMode="decimal"
                                placeholder="max"
                                className="h-8 border-0 bg-transparent text-center text-xs tabular-nums shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                {...field}
                              />
                            </FieldWrapper>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground/70">
                    mS/cm · 2 decimals
                  </p>
                </div>

                {/* PPM */}
                <div className="space-y-1.5">
                  <p
                    className={cn("inline-flex items-center gap-1", fieldLabel)}
                  >
                    <IconBeach
                      className="size-3 text-wheat-deep dark:text-wheat"
                      strokeWidth={2.2}
                    />
                    PPM
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <FormField
                      control={form.control}
                      name="targetPpmMin"
                      rules={{ validate: validatePpm }}
                      render={({ field, fieldState }) => (
                        <FormItem className="gap-0">
                          <FormControl>
                            <FieldWrapper
                              compact
                              hasError={fieldState.invalid}
                            >
                              <Input
                                type="number"
                                step="1"
                                min="0"
                                inputMode="numeric"
                                placeholder="min"
                                className="h-8 border-0 bg-transparent text-center text-xs tabular-nums shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                {...field}
                              />
                            </FieldWrapper>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="targetPpmMax"
                      rules={{ validate: validatePpm }}
                      render={({ field, fieldState }) => (
                        <FormItem className="gap-0">
                          <FormControl>
                            <FieldWrapper
                              compact
                              hasError={fieldState.invalid}
                            >
                              <Input
                                type="number"
                                step="1"
                                min="0"
                                inputMode="numeric"
                                placeholder="max"
                                className="h-8 border-0 bg-transparent text-center text-xs tabular-nums shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                {...field}
                              />
                            </FieldWrapper>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground/70">
                    ppm · whole numbers
                  </p>
                </div>
              </div>
            </div>

            {/* Days to harvest + Light hours */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="daysToHarvest"
                rules={{ validate: validateDays }}
                render={({ field, fieldState }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel className={fieldLabel}>Days to harvest</FormLabel>
                    <FormControl>
                      <FieldWrapper
                        icon={IconClockHour4}
                        hasError={fieldState.invalid}
                      >
                        <Input
                          type="number"
                          step="1"
                          min="1"
                          inputMode="numeric"
                          placeholder="e.g. 55"
                          className="border-0 bg-transparent tabular-nums shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
                name="lightHoursPerDay"
                rules={{ validate: validateLight }}
                render={({ field, fieldState }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel className={fieldLabel}>Light (h/day)</FormLabel>
                    <FormControl>
                      <FieldWrapper
                        icon={IconSun}
                        hasError={fieldState.invalid}
                      >
                        <Input
                          type="number"
                          step="0.5"
                          min="0"
                          max="24"
                          inputMode="decimal"
                          placeholder="e.g. 14"
                          className="border-0 bg-transparent tabular-nums shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FieldWrapper>
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

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
                        placeholder="Growing tips, sourcing notes, pest watch — anything worth remembering about this variety."
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

        {/* ===== Footer ===== */}
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
                  : "Add to catalog"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CropCatalogForm;