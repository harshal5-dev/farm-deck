import { useForm, useWatch } from "react-hook-form";
import {
  IconBuildingCommunity,
  IconCircleCheckFilled,
  IconLoader2,
  IconMapPin,
  IconRulerMeasure,
  IconCheck,
  IconNotes,
  IconPlant2,
  IconRefresh,
  IconAlertTriangle,
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
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useListFarmTypesQuery } from "@/features/lookups";
import {
  AREA_UNIT_ORDER,
  DEFAULT_AREA_UNIT,
  getAreaUnit,
} from "@/constants/farms";
import FarmIdentityPreview from "./FarmIdentityPreview";
import FarmTypeCard from "./FarmTypeCard";
import LocationSection from "./LocationSection";

const fieldLabel =
  "text-xs font-semibold tracking-wide text-muted-foreground uppercase";

const NAME_MAX = 255;
const LOCATION_MAX = 255;
const NOTES_MAX = 1000;

/** Required-field marker — appended to labels of NOT NULL fields. */
const RequiredStar = () => (
  <span className="ml-0.5 text-destructive" aria-hidden="true">
    *
  </span>
);

/** Live character counter for length-capped text fields; warns amber
 *  within the last 10% of the budget. */
const CharCount = ({ value, max }) => {
  const len = (value || "").length;
  return (
    <span
      className={cn(
        "text-[10px] font-medium tabular-nums mr-2.5",
        len > max * 0.9
          ? "text-amber-600 dark:text-amber-400"
          : "text-muted-foreground/70"
      )}
      aria-live="polite"
    >
      {len}/{max}
    </span>
  );
};

/** Stringify optional numeric defaults; blank/undefined stay "". */
const asString = (v) => (v === 0 || v ? String(v) : "");

/**
 * NUMERIC(12,2) → max 2 decimal places, and the DB CHECK requires
 * total_area > 0 when present.
 */
const validateTotalArea = (v) => {
  if (v === "" || v == null) return true;
  const n = Number(v);
  if (Number.isNaN(n)) return "Enter a number";
  const s = String(v).trim();
  if (s.includes(".") && s.split(".")[1].length > 2) {
    return "Max 2 decimal places";
  }
  if (n <= 0) return "Must be greater than 0";
  if (n > 9999999999.99) return "Too large";
  return true;
};

const FarmForm = ({
  mode = "create",
  defaultValues,
  onSubmit,
  onCancel,
  submitting = false,
}) => {
  const isEdit = mode === "edit";

  // Farm types come from the lookups API — the picker stores the row's
  // UUID, matching the farms.farm_type_id FK.
  const {
    data: farmTypes = [],
    isLoading: typesLoading,
    isError: typesError,
    refetch: refetchTypes,
  } = useListFarmTypesQuery();

  const form = useForm({
    defaultValues: {
      farmTypeId: defaultValues?.farmTypeId || "",
      name: defaultValues?.name || "",
      location: defaultValues?.location || "",
      latitude: asString(defaultValues?.latitude),
      longitude: asString(defaultValues?.longitude),
      totalArea: asString(defaultValues?.totalArea),
      areaUnit: defaultValues?.areaUnit || DEFAULT_AREA_UNIT,
      notes: defaultValues?.notes || "",
    },
  });

  // Live values drive the identity preview.
  const watched = useWatch({ control: form.control });
  const { isDirty } = form.formState;
  const selectedType = farmTypes.find((t) => t.id === watched.farmTypeId);

  const submit = async (values) => {
    // Latitude/longitude are both-or-neither — a half pair is rejected by
    // the planned farms_latlng_pair_chk constraint (GEOLOCATION_DESIGN §2).
    const latSet = values.latitude !== "" && values.latitude != null;
    const lngSet = values.longitude !== "" && values.longitude != null;
    if (latSet !== lngSet) {
      const message = "Set both latitude and longitude, or clear the pin";
      form.setError("latitude", { type: "pair", message });
      form.setError("longitude", { type: "pair", message });
      return;
    }

    await onSubmit({
      farmTypeId: values.farmTypeId,
      name: values.name.trim(),
      location: values.location.trim() || null,
      latitude: latSet ? Number(values.latitude) : null,
      longitude: lngSet ? Number(values.longitude) : null,
      totalArea:
        values.totalArea === "" || values.totalArea == null
          ? null
          : Number(values.totalArea),
      areaUnit: values.areaUnit || DEFAULT_AREA_UNIT,
      notes: values.notes.trim() || null,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        noValidate
        className="flex flex-col lg:h-full lg:min-h-0"
      >
        <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-4">
          {/* ===== Left — identity preview fills the column height ===== */}
          <div className="flex min-h-0 flex-col">
            <FarmIdentityPreview
              name={watched.name}
              location={watched.location}
              farmTypeName={selectedType?.name}
              latitude={watched.latitude}
              longitude={watched.longitude}
              totalArea={watched.totalArea}
              areaUnit={watched.areaUnit}
            />
          </div>

          {/* ===== Right — form fields ===== */}
          <div className="flex min-h-0 flex-col gap-3.5">
            {/* Name + Location — stacked */}
            <FormField
              control={form.control}
              name="name"
              rules={{
                required: "Farm name is required",
                minLength: { value: 2, message: "At least 2 characters" },
                maxLength: { value: NAME_MAX, message: "Too long" },
              }}
              render={({ field, fieldState }) => (
                <FormItem className="gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <FormLabel className={fieldLabel}>
                      Farm name
                      <RequiredStar />
                    </FormLabel>
                    <CharCount value={watched.name} max={NAME_MAX} />
                  </div>
                  <FormControl>
                    <FieldWrapper icon={IconBuildingCommunity} hasError={fieldState.invalid}>
                      <Input
                        placeholder="e.g. Sunrise Acres"
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
              name="location"
              rules={{
                maxLength: { value: LOCATION_MAX, message: "Too long" },
              }}
              render={({ field, fieldState }) => (
                <FormItem className="gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <FormLabel className={fieldLabel}>Location</FormLabel>
                    <CharCount value={watched.location} max={LOCATION_MAX} />
                  </div>
                  <FormControl>
                    <FieldWrapper icon={IconMapPin} hasError={fieldState.invalid}>
                      <Input
                        placeholder="e.g. Pune, Maharashtra"
                        className="border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FieldWrapper>
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              )}
            />

            {/* Farm type — cards from the lookups API */}
            <FormField
              control={form.control}
              name="farmTypeId"
              rules={{ required: "Pick a farm type" }}
              render={({ field }) => (
                <div>
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className={cn("flex items-center gap-1.5", fieldLabel)}>
                      <IconPlant2 className="size-3.5" strokeWidth={1.75} />
                      Farm type
                      <RequiredStar />
                    </span>
                    <Tooltip>
                      <TooltipTrigger className="text-[10px] font-medium text-muted-foreground hover:text-foreground">
                        What does each type mean?
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <ul className="space-y-1 text-[11px]">
                          {farmTypes.map((t) => (
                            <li key={t.id} className="line-clamp-2">
                              <span className="font-semibold text-foreground">
                                {t.displayName}:
                              </span>{" "}
                              {t.description}
                            </li>
                          ))}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  {typesLoading ? (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-28 rounded-2xl" />
                      ))}
                    </div>
                  ) : typesError ? (
                    <div className="flex items-center justify-between gap-2 rounded-2xl border border-dashed border-destructive/30 bg-destructive/5 px-3 py-2.5">
                      <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <IconAlertTriangle
                          className="size-3.5 text-destructive"
                          strokeWidth={1.85}
                        />
                        Couldn't load farm types.
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={refetchTypes}
                        className="h-7 gap-1.5 rounded-xl px-2.5 text-[11px]"
                      >
                        <IconRefresh className="size-3.5" strokeWidth={1.85} />
                        Retry
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                      {farmTypes.map((t) => (
                        <FarmTypeCard
                          key={t.id}
                          farmType={t}
                          selected={field.value === t.id}
                          onSelect={field.onChange}
                          disabled={submitting}
                        />
                      ))}
                    </div>
                  )}
                  {form.formState.errors?.farmTypeId && (
                    <p className="mt-1.5 text-[11px] font-medium text-destructive">
                      {form.formState.errors.farmTypeId.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Location pin — map picker (search / tap / drag / GPS) with
                manual coordinates collapsed as the advanced fallback */}
            <LocationSection disabled={submitting} />

            {/* Total area + unit — two-column on desktop */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="totalArea"
                rules={{ validate: validateTotalArea }}
                render={({ field, fieldState }) => (
                  <FormItem className="gap-1.5 sm:col-span-2">
                    <FormLabel className={fieldLabel}>Total area</FormLabel>
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
                          placeholder="e.g. 4500"
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
                name="areaUnit"
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    {/* Plain span, not FormLabel — the base-ui select
                        renders a custom trigger, so a label's htmlFor
                        would reference nothing. aria-label covers the
                        control instead. */}
                    <span className={fieldLabel}>Unit</span>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={submitting}
                    >
                      <SelectTrigger
                        aria-label="Area unit"
                        className="w-full"
                      >
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent align="end">
                        {AREA_UNIT_ORDER.map((id) => {
                          const u = getAreaUnit(id);
                          return (
                            <SelectItem key={id} value={id}>
                              <span className="flex items-center gap-2">
                                <span className="font-semibold tracking-tight">
                                  {u.label}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {u.longLabel}
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

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              rules={{
                maxLength: { value: NOTES_MAX, message: "Too long" },
              }}
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
                        placeholder="Anything worth remembering about this farm — crops, water source, access roads…"
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
            <p className="mt-0.5 text-[10px] text-muted-foreground/60">
              <span className="text-destructive">*</span> Required fields
            </p>
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
                  : "Add farm"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default FarmForm;
