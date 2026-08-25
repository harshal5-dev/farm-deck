import { useForm, useWatch } from "react-hook-form";
import {
  IconBasket,
  IconCheck,
  IconCircleCheckFilled,
  IconLayoutGrid,
  IconLoader2,
  IconNotes,
  IconPlant2,
  IconRulerMeasure,
  IconSeedling,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import { RequiredStar, RequiredLegend } from "@/components/ui/field-indicators";
import { Reveal } from "@/components/effects";
import { useListZonesQuery } from "@/features/fields/zoneApi";
import {
  CROP_STATUS_ORDER,
  QUANTITY_UNITS,
  getCropStatus,
} from "../../constants";
import {
  useListCropTypesQuery,
} from "../../cropApi";
import CropIdentityPreview from "./CropIdentityPreview";
import CropTypeCard from "./CropTypeCard";

const fieldLabel =
  "text-xs font-semibold tracking-wide text-muted-foreground uppercase";

const VARIETY_MAX = 100;

/** ISO string → "YYYY-MM-DD" for date inputs; blank stays "". */
const asDate = (iso) => (iso ? String(iso).slice(0, 10) : "");
const asString = (v) => (v === 0 || v ? String(v) : "");

const toNumberOrNull = (v) =>
  v === "" || v == null || Number.isNaN(Number(v)) ? null : Number(v);

/** Planted quantity — positive, ≤ 2 decimals, ≤ NUMERIC(12,2). */
const validateQuantity = (v) => {
  if (v === "" || v == null) return true;
  const n = Number(v);
  if (Number.isNaN(n)) return "Enter a number";
  if (n <= 0) return "Must be greater than 0";
  if (n > 9999999999.99) return "Too large";
  return true;
};

const CropForm = ({
  mode = "create",
  defaultValues,
  onSubmit,
  onCancel,
  submitting = false,
  // Setup wizard renders its own pinned footer, so the form's built-in
  // footer can be suppressed and the form element exposed for an
  // external submit trigger (requestSubmit).
  formRef = null,
  hideFooter = false,
}) => {
  const isEdit = mode === "edit";

  // Crop types + fields (zones) drive the form; the field picker only
  // offers ACTIVE zones and refuses maintenance ones — matching the
  // domain rule that you don't sow into a broken field.
  const { data: cropTypes = [], isLoading: typesLoading } =
    useListCropTypesQuery();
  const { data: zoneData, isLoading: zonesLoading } = useListZonesQuery();
  const zones = (zoneData?.zones ?? []).filter((z) => z.isActive);

  const form = useForm({
    defaultValues: {
      zoneId: defaultValues?.zoneId || "",
      cropTypeId: defaultValues?.cropTypeId || "",
      variety: defaultValues?.variety || "",
      status: defaultValues?.status || "planned",
      sowDate: asDate(defaultValues?.sowDate),
      harvestDateExpected: asDate(defaultValues?.harvestDateExpected),
      quantity: asString(defaultValues?.quantity),
      quantityUnit: defaultValues?.quantityUnit || "plants",
      notes: defaultValues?.notes || "",
    },
  });

  const watched = useWatch({ control: form.control });
  const { isDirty } = form.formState;

  const selectedType = cropTypes.find((t) => t.id === watched.cropTypeId);
  const selectedZone = zones.find((z) => z.id === watched.zoneId);

  const submit = async (values) => {
    await onSubmit({
      zoneId: values.zoneId,
      cropTypeId: values.cropTypeId,
      variety: values.variety.trim() || null,
      status: values.status || "planned",
      sowDate: values.sowDate || null,
      harvestDateExpected: values.harvestDateExpected || null,
      quantity: toNumberOrNull(values.quantity),
      quantityUnit: values.quantityUnit || "plants",
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
          {/* ===== Left — identity preview fills the column height ===== */}
          <div className="flex min-h-0 flex-col">
            <CropIdentityPreview
              variety={watched.variety}
              cropTypeName={selectedType?.name}
              zoneName={selectedZone?.name}
              status={watched.status}
              quantity={watched.quantity}
              quantityUnit={watched.quantityUnit}
              sowDate={watched.sowDate}
              harvestDateExpected={watched.harvestDateExpected}
            />
          </div>

          {/* ===== Right — form fields ===== */}
          <div className="flex min-h-0 flex-col gap-3.5">
            {/* Field (zone) + Variety */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="zoneId"
                rules={{ required: "Pick the field this crop grows in" }}
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

              <FormField
                control={form.control}
                name="variety"
                rules={{
                  maxLength: { value: VARIETY_MAX, message: "Too long" },
                }}
                render={({ field, fieldState }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel className={fieldLabel}>Variety</FormLabel>
                    <FormControl>
                      <FieldWrapper
                        icon={IconSeedling}
                        hasError={fieldState.invalid}
                      >
                        <Input
                          placeholder="e.g. Trust F1, Rex, Nantes…"
                          className="border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FieldWrapper>
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Crop type — cards from the lookups */}
            <FormField
              control={form.control}
              name="cropTypeId"
              rules={{ required: "Pick a crop type" }}
              render={({ field }) => (
                <div>
                  {sectionTitle(IconPlant2, "Crop type")}
                  {typesLoading ? (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-28 rounded-2xl" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                      {cropTypes.map((t) => (
                        <CropTypeCard
                          key={t.id}
                          cropType={t}
                          selected={field.value === t.id}
                          onSelect={field.onChange}
                          disabled={submitting}
                        />
                      ))}
                    </div>
                  )}
                  {form.formState.errors?.cropTypeId && (
                    <p className="mt-1.5 text-[11px] font-medium text-destructive">
                      {form.formState.errors.cropTypeId.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Lifecycle + dates */}
            <Reveal key="cycle" duration={300}>
              <div className="rounded-2xl border border-border/40 bg-muted/15 p-3.5">
                {sectionTitle(
                  IconCircleCheckFilled,
                  "Cycle",
                  "planned → sown → growing → ready → harvested"
                )}
                <div className="flex flex-col gap-3">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="gap-1.5">
                        <FormLabel className={fieldLabel}>Status</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={submitting}
                          >
                            <SelectTrigger
                              aria-label="Crop status"
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
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="sowDate"
                      render={({ field }) => (
                        <FormItem className="gap-1.5">
                          <FormLabel className={fieldLabel}>Sow date</FormLabel>
                          <FormControl>
                            <FieldWrapper icon={IconSeedling}>
                              <Input
                                type="date"
                                className="tabular-nums border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
                      name="harvestDateExpected"
                      rules={{
                        validate: (v, values) => {
                          if (!v || !values.sowDate) return true;
                          return (
                            new Date(v) > new Date(values.sowDate) ||
                            "Harvest must be after the sow date"
                          );
                        },
                      }}
                      render={({ field }) => (
                        <FormItem className="gap-1.5">
                          <FormLabel className={fieldLabel}>
                            Expected harvest
                          </FormLabel>
                          <FormControl>
                            <FieldWrapper icon={IconBasket}>
                              <Input
                                type="date"
                                className="tabular-nums border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
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
              </div>
            </Reveal>

            {/* Quantity + unit + notes */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="quantity"
                rules={{ validate: validateQuantity }}
                render={({ field, fieldState }) => (
                  <FormItem className="gap-1.5 sm:col-span-2">
                    <FormLabel className={fieldLabel}>Quantity</FormLabel>
                    <FormControl>
                      <FieldWrapper
                        icon={IconRulerMeasure}
                        hasError={fieldState.invalid}
                      >
                        <Input
                          type="number"
                          inputMode="decimal"
                          step="0.01"
                          min="0"
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

              <FormField
                control={form.control}
                name="quantityUnit"
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <span className={fieldLabel}>Unit</span>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={submitting}
                    >
                      <SelectTrigger
                        aria-label="Quantity unit"
                        className="w-full"
                      >
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent align="end">
                        {QUANTITY_UNITS.map((u) => (
                          <SelectItem key={u.id} value={u.id}>
                            {u.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="gap-1.5">
                  <FormLabel className={fieldLabel}>Notes</FormLabel>
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

        {/* ===== Footer ===== (hidden in the setup wizard, which
            renders its own pinned footer with the submit action) */}
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
                  : "Plan crop"}
            </Button>
          </div>
        </div>
        )}
      </form>
    </Form>
  );
};

export default CropForm;
