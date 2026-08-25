import { useForm, useWatch } from "react-hook-form";
import {
  IconAlertTriangle,
  IconCheck,
  IconCircleCheckFilled,
  IconDroplets,
  IconFlask,
  IconGrain,
  IconLayoutGrid,
  IconLoader2,
  IconNotes,
  IconPlant2,
  IconRulerMeasure,
  IconTractor,
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
  RequiredStar,
  CharCount,
  RequiredLegend,
} from "@/components/ui/field-indicators";
import { Reveal } from "@/components/effects";
import {
  AREA_UNIT_ORDER,
  DEFAULT_AREA_UNIT,
  getAreaUnit,
} from "@/constants/farms";
import {
  GROW_MEDIUM_SUGGESTIONS,
  ZONE_STATUS_ORDER,
  getZoneStatus,
} from "../../constants";
import {
  useListFarmsForPickerQuery,
  useListZoneTypesQuery,
  useListSoilTypesQuery,
  useListHydroSystemTypesQuery,
} from "../../zoneApi";
import ZoneIdentityPreview from "./ZoneIdentityPreview";
import ZoneTypeCard from "./ZoneTypeCard";

const fieldLabel =
  "text-xs font-semibold tracking-wide text-muted-foreground uppercase";

const NAME_MAX = 255;
const MEDIUM_MAX = 100;

/** Stringify optional numeric defaults; blank/undefined stay "". */
const asString = (v) => (v === 0 || v ? String(v) : "");

/**
 * NUMERIC(p,2) validation — max 2 decimal places, and the DB CHECKs
 * require the value to be positive when present.
 */
const makeDecimalValidator = ({ max }) => (v) => {
  if (v === "" || v == null) return true;
  const n = Number(v);
  if (Number.isNaN(n)) return "Enter a number";
  const s = String(v).trim();
  if (s.includes(".") && s.split(".")[1].length > 2) {
    return "Max 2 decimal places";
  }
  if (n <= 0) return "Must be greater than 0";
  if (n > max) return "Too large";
  return true;
};

/** zones.area → NUMERIC(12,2). */
const validateArea = makeDecimalValidator({ max: 9999999999.99 });
/** zone_hydro_details.reservoir_volume_liters → NUMERIC(10,2). */
const validateReservoir = makeDecimalValidator({ max: 99999999.99 });

/** zone_hydro_details.number_of_slots → positive INTEGER. */
const validateSlots = (v) => {
  if (v === "" || v == null) return true;
  const n = Number(v);
  if (!Number.isInteger(n)) return "Whole numbers only";
  if (n <= 0) return "Must be greater than 0";
  return true;
};

const toNumberOrNull = (v) =>
  v === "" || v == null || Number.isNaN(Number(v)) ? null : Number(v);

const ZoneForm = ({
  mode = "create",
  defaultValues,
  onSubmit,
  onCancel,
  submitting = false,
  // Setup wizard passes the just-created farm — the picker locks to it.
  lockFarmId = null,
  lockFarmName = null,
  // Setup wizard renders its own pinned footer, so the form's built-in
  // footer can be suppressed and the form element exposed for an
  // external submit trigger (requestSubmit).
  formRef = null,
  hideFooter = false,
}) => {
  const isEdit = mode === "edit";

  // Lookups — zone types drive the conditional detail section; the
  // picker stores the row's UUID, matching the zones.zone_type_id FK.
  const { data: zoneTypes = [], isLoading: typesLoading } =
    useListZoneTypesQuery();
  const { data: farms = [], isLoading: farmsLoading } =
    useListFarmsForPickerQuery();
  const { data: soilTypes = [] } = useListSoilTypesQuery();
  const { data: hydroSystemTypes = [] } = useListHydroSystemTypesQuery();

  const form = useForm({
    defaultValues: {
      farmId: defaultValues?.farmId || "",
      name: defaultValues?.name || "",
      zoneTypeId: defaultValues?.zoneTypeId || "",
      soilTypeId: defaultValues?.soilTypeId || "",
      hydroSystemTypeId: defaultValues?.hydroSystemTypeId || "",
      growMedium: defaultValues?.growMedium || "",
      reservoirVolumeLiters: asString(defaultValues?.reservoirVolumeLiters),
      numberOfSlots: asString(defaultValues?.numberOfSlots),
      zoneStatus: defaultValues?.zoneStatus || "idle",
      area: asString(defaultValues?.area),
      areaUnit: defaultValues?.areaUnit || DEFAULT_AREA_UNIT,
      notes: defaultValues?.notes || "",
    },
  });

  const watched = useWatch({ control: form.control });
  const { isDirty } = form.formState;

  const selectedType = zoneTypes.find((t) => t.id === watched.zoneTypeId);
  const cultivationMode = selectedType?.cultivationMode ?? null;
  const selectedFarm = farms.find((f) => f.id === watched.farmId);
  const selectedSoil = soilTypes.find((s) => s.id === watched.soilTypeId);

  const submit = async (values) => {
    const zoneType = zoneTypes.find((t) => t.id === values.zoneTypeId);
    const m = zoneType?.cultivationMode;

    // Compose the detail payload for the zone's cultivation mode —
    // the DB trigger (assert_zone_cultivation_mode) rejects a mismatch,
    // and the mock honours the same rule.
    await onSubmit({
      farmId: values.farmId,
      zoneTypeId: values.zoneTypeId,
      name: values.name.trim(),
      zoneStatus: values.zoneStatus || "idle",
      area: toNumberOrNull(values.area),
      areaUnit: values.areaUnit || DEFAULT_AREA_UNIT,
      notes: values.notes.trim() || null,
      soilDetails:
        m === "soil" && values.soilTypeId
          ? { soilTypeId: values.soilTypeId }
          : null,
      hydroDetails:
        m === "hydro" && values.hydroSystemTypeId
          ? {
              hydroSystemTypeId: values.hydroSystemTypeId,
              growMedium: values.growMedium.trim() || null,
              reservoirVolumeLiters: toNumberOrNull(
                values.reservoirVolumeLiters
              ),
              numberOfSlots:
                values.numberOfSlots === "" || values.numberOfSlots == null
                  ? null
                  : Number(values.numberOfSlots),
            }
          : null,
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
            <ZoneIdentityPreview
              name={watched.name}
              farmName={selectedFarm?.name}
              zoneTypeName={selectedType?.name}
              zoneStatus={watched.zoneStatus}
              area={watched.area}
              areaUnit={watched.areaUnit}
            />
          </div>

          {/* ===== Right — form fields ===== */}
          <div className="flex min-h-0 flex-col gap-3.5">
            {/* Farm + Name — two-column on desktop */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="farmId"
                rules={{ required: "Pick the farm this field belongs to" }}
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel className={fieldLabel}>
                      Farm
                      <RequiredStar />
                    </FormLabel>
                    <FormControl>
                      {lockFarmId && lockFarmName ? (
                        /* Locked context (setup wizard) — a static display
                           beats a disabled select that can't resolve its
                           label before the options load. */
                        <FieldWrapper icon={IconTractor}>
                          <Input
                            value={lockFarmName}
                            readOnly
                            disabled
                            className="border-0 bg-transparent text-foreground shadow-none"
                          />
                        </FieldWrapper>
                      ) : (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={submitting || farmsLoading || !!lockFarmId}
                        >
                          <SelectTrigger aria-label="Farm" className="w-full">
                            <span className="flex min-w-0 items-center gap-2">
                              <IconTractor
                                className="size-4 shrink-0 text-leaf"
                                strokeWidth={1.85}
                              />
                              <SelectValue
                                placeholder={
                                  farmsLoading ? "Loading farms…" : "Select farm"
                                }
                              />
                            </span>
                          </SelectTrigger>
                          <SelectContent>
                            {farms.map((f) => (
                              <SelectItem key={f.id} value={f.id}>
                                {f.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                rules={{
                  required: "Field name is required",
                  minLength: { value: 2, message: "At least 2 characters" },
                  maxLength: { value: NAME_MAX, message: "Too long" },
                }}
                render={({ field, fieldState }) => (
                  <FormItem className="gap-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <FormLabel className={fieldLabel}>
                        Field name
                        <RequiredStar />
                      </FormLabel>
                      <CharCount value={watched.name} max={NAME_MAX} />
                    </div>
                    <FormControl>
                      <FieldWrapper
                        icon={IconLayoutGrid}
                        hasError={fieldState.invalid}
                      >
                        <Input
                          placeholder="e.g. Beefsteak High-Wire Bay 1"
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

            {/* Zone type — cards from the lookups */}
            <FormField
              control={form.control}
              name="zoneTypeId"
              rules={{ required: "Pick a zone type" }}
              render={({ field }) => (
                <div>
                  {sectionTitle(IconPlant2, "Zone type")}
                  {typesLoading ? (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-28 rounded-2xl" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {zoneTypes.map((t) => (
                        <ZoneTypeCard
                          key={t.id}
                          zoneType={t}
                          selected={field.value === t.id}
                          onSelect={field.onChange}
                          disabled={submitting}
                        />
                      ))}
                    </div>
                  )}
                  {form.formState.errors?.zoneTypeId && (
                    <p className="mt-1.5 text-[11px] font-medium text-destructive">
                      {form.formState.errors.zoneTypeId.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* ===== Cultivation details — conditional on the mode =====
                Mirrors the schema's detail tables: soil zones carry
                zone_soil_details, hydro zones zone_hydro_details, and
                'other' types take neither until their sections ship. */}
            {cultivationMode && (
              <Reveal key={cultivationMode} duration={300}>
                <div className="rounded-2xl border border-border/40 bg-muted/15 p-3.5">
                  {cultivationMode === "soil" && (
                    <>
                      {sectionTitle(
                        IconGrain,
                        "Soil details",
                        "zone_soil_details"
                      )}
                      <FormField
                        control={form.control}
                        name="soilTypeId"
                        rules={{
                          validate: (v) =>
                            cultivationMode === "soil" && !v
                              ? "Pick the soil this plot grows in"
                              : true,
                        }}
                        render={({ field }) => (
                          <FormItem className="gap-1.5">
                            <FormLabel className={fieldLabel}>
                              Soil type
                              <RequiredStar />
                            </FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                                disabled={submitting}
                              >
                                <SelectTrigger
                                  aria-label="Soil type"
                                  className="w-full"
                                >
                                  <SelectValue placeholder="Select soil" />
                                </SelectTrigger>
                                <SelectContent>
                                  {soilTypes.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>
                                      <span className="flex items-center gap-2">
                                        <span className="font-semibold tracking-tight">
                                          {s.displayName}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                          {s.waterRetention} retention ·{" "}
                                          {s.drainage} drainage
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
                      {selectedSoil && (
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/25 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-700 dark:text-sky-400">
                            <IconDroplets className="size-3" strokeWidth={2} />
                            {selectedSoil.waterRetention} water retention
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full border border-wheat/30 bg-wheat/10 px-2 py-0.5 text-[10px] font-semibold text-wheat-deep dark:text-wheat">
                            {selectedSoil.drainage} drainage
                          </span>
                          <span className="text-[10px] text-muted-foreground/70">
                            drives watering suggestions later
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {cultivationMode === "hydro" && (
                    <>
                      {sectionTitle(
                        IconFlask,
                        "Hydroponic setup",
                        "zone_hydro_details"
                      )}
                      <div className="flex flex-col gap-3">
                        <FormField
                          control={form.control}
                          name="hydroSystemTypeId"
                          rules={{
                            validate: (v) =>
                              cultivationMode === "hydro" && !v
                                ? "Pick the system type"
                                : true,
                          }}
                          render={({ field }) => (
                            <FormItem className="gap-1.5">
                              <FormLabel className={fieldLabel}>
                                System type
                                <RequiredStar />
                              </FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  disabled={submitting}
                                >
                                  <SelectTrigger
                                    aria-label="Hydro system type"
                                    className="w-full"
                                  >
                                    <SelectValue placeholder="Select system" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {hydroSystemTypes.map((h) => (
                                      <SelectItem key={h.id} value={h.id}>
                                        <span className="flex items-center gap-2">
                                          <span className="font-semibold tracking-tight">
                                            {h.displayName}
                                          </span>
                                          <span className="text-[10px] text-muted-foreground">
                                            {h.name}
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
                          name="growMedium"
                          rules={{
                            maxLength: {
                              value: MEDIUM_MAX,
                              message: "Too long",
                            },
                          }}
                          render={({ field, fieldState }) => (
                            <FormItem className="gap-1.5">
                              <FormLabel className={fieldLabel}>
                                Grow medium
                              </FormLabel>
                              <FormControl>
                                <FieldWrapper
                                  icon={IconGrain}
                                  hasError={fieldState.invalid}
                                >
                                  <Input
                                    placeholder="e.g. 50/50 coco-perlite"
                                    className="border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                    {...field}
                                  />
                                </FieldWrapper>
                              </FormControl>
                              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                {GROW_MEDIUM_SUGGESTIONS.map((m) => (
                                  <button
                                    key={m}
                                    type="button"
                                    disabled={submitting}
                                    onClick={() =>
                                      form.setValue("growMedium", m, {
                                        shouldDirty: true,
                                      })
                                    }
                                    className={cn(
                                      "rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors",
                                      field.value === m
                                        ? "border-lagoon/40 bg-lagoon/15 text-lagoon-deep dark:text-lagoon"
                                        : "border-border/50 bg-card/40 text-muted-foreground hover:border-border hover:text-foreground"
                                    )}
                                  >
                                    {m}
                                  </button>
                                ))}
                              </div>
                              <FormMessage className="text-[11px]" />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <FormField
                            control={form.control}
                            name="reservoirVolumeLiters"
                            rules={{ validate: validateReservoir }}
                            render={({ field, fieldState }) => (
                              <FormItem className="gap-1.5">
                                <FormLabel className={fieldLabel}>
                                  Reservoir (L)
                                </FormLabel>
                                <FormControl>
                                  <FieldWrapper
                                    icon={IconDroplets}
                                    hasError={fieldState.invalid}
                                  >
                                    <Input
                                      type="number"
                                      inputMode="decimal"
                                      step="0.01"
                                      min="0"
                                      placeholder="e.g. 5400"
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
                            name="numberOfSlots"
                            rules={{ validate: validateSlots }}
                            render={({ field, fieldState }) => (
                              <FormItem className="gap-1.5">
                                <FormLabel className={fieldLabel}>
                                  Plant slots
                                </FormLabel>
                                <FormControl>
                                  <FieldWrapper
                                    icon={IconLayoutGrid}
                                    hasError={fieldState.invalid}
                                  >
                                    <Input
                                      type="number"
                                      inputMode="numeric"
                                      step="1"
                                      min="0"
                                      placeholder="e.g. 120"
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
                    </>
                  )}

                  {cultivationMode === "other" && (
                    <div className="flex items-start gap-3 rounded-xl border border-dashed border-wheat/40 bg-wheat/8 p-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-wheat/15 text-wheat-deep dark:text-wheat">
                        <IconAlertTriangle
                          className="size-4"
                          strokeWidth={1.85}
                        />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold tracking-tight">
                          Mode-specific details coming soon
                        </p>
                        <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
                          Aquaponic and mushroom zones get their own detail
                          sections in a later release — everything else can
                          be set up now.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            )}

            {/* Operation — status + area/unit */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="zoneStatus"
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
                          aria-label="Zone status"
                          className="w-full"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ZONE_STATUS_ORDER.map((id) => {
                            const s = getZoneStatus(id);
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

              <FormField
                control={form.control}
                name="area"
                rules={{ validate: validateArea }}
                render={({ field, fieldState }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel className={fieldLabel}>Area</FormLabel>
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
                    {/* Plain span, not FormLabel — the select renders a
                        custom trigger, so a label's htmlFor would
                        reference nothing. */}
                    <span className={fieldLabel}>Unit</span>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={submitting}
                    >
                      <SelectTrigger aria-label="Area unit" className="w-full">
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

            {/* Notes — TEXT column, unlimited */}
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
                        placeholder="Anything worth remembering about this field — crop plans, water source, quirks…"
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
                  : "Add field"}
            </Button>
          </div>
        </div>
        )}
      </form>
    </Form>
  );
};

export default ZoneForm;
