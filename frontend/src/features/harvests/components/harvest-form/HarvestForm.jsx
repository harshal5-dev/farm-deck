import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  IconBasket,
  IconCalendarEvent,
  IconCash,
  IconCheck,
  IconCoin,
  IconLoader2,
  IconNotes,
  IconScale,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import DatePicker from "@/components/ui/date-picker";
import SearchableSelect from "@/components/ui/searchable-select";
import FieldWrapper from "@/components/ui/field-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CharCount,
  RequiredLegend,
  RequiredStar,
} from "@/components/ui/field-indicators";
import { GRADE_ORDER, QUALITY_GRADES } from "../../constants";
import { formatMoney, gramsToKgHint } from "../../lib/format";
import HarvestIdentityPreview from "./HarvestIdentityPreview";

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

/** DB-mirror validators — every rule maps to the `harvests` CHECKs. */
const validateYield = (v) => {
  if (v === "" || v == null) return "Enter the total yield";
  const n = Number(v);
  if (Number.isNaN(n)) return "Enter a number";
  if (n <= 0) return "Must be > 0";
  if (n > 10_000_000) return "Unrealistically large";
  const s = String(v).trim();
  if (s.includes(".") && s.split(".")[1].length > 2) return "Max 2 decimals";
  return true;
};
const validatePrice = (v) => {
  if (v === "" || v == null) return true;
  const n = Number(v);
  if (Number.isNaN(n)) return "Enter a number";
  if (n < 0) return "Must be ≥ 0";
  const s = String(v).trim();
  if (s.includes(".") && s.split(".")[1].length > 2) return "Max 2 decimals";
  return true;
};

/**
 * HarvestForm — create/edit one harvest off a cycle. `total_revenue`
 * is never an input: it's computed live (yield kg × price) the same
 * way the service recomputes it, and rendered as a read-only figure
 * so the grower sees the math as they type.
 */
const HarvestForm = ({
  mode = "create",
  defaultValues,
  cycles = [],
  onSubmit,
  onCancel,
  submitting = false,
}) => {
  const isEdit = mode === "edit";

  const form = useForm({
    defaultValues: {
      cycleId: defaultValues?.cycleId ?? "",
      harvestDate:
        toDate(defaultValues?.harvestDate) ||
        toDate(new Date().toISOString()),
      totalYieldGrams: asString(defaultValues?.totalYieldGrams),
      qualityGrade: defaultValues?.qualityGrade ?? "",
      soldPricePerKg: asString(defaultValues?.soldPricePerKg),
      notes: defaultValues?.notes ?? "",
    },
  });

  const watched = useWatch({ control: form.control });
  const { isDirty } = form.formState;

  const selectedCycle = useMemo(
    () => cycles.find((c) => c.id === watched.cycleId) ?? null,
    [cycles, watched.cycleId]
  );

  // Live revenue — same formula the service applies on write.
  const liveRevenue = useMemo(() => {
    const grams = Number(watched.totalYieldGrams);
    const price = Number(watched.soldPricePerKg);
    if (!watched.soldPricePerKg || !grams || grams <= 0) return null;
    if (Number.isNaN(price) || Number.isNaN(grams)) return null;
    return Math.round((grams / 1000) * price * 100) / 100;
  }, [watched.totalYieldGrams, watched.soldPricePerKg]);

  const submit = async (values) => {
    await onSubmit({
      cycleId: values.cycleId,
      harvestDate: values.harvestDate,
      totalYieldGrams: numOrNull(values.totalYieldGrams),
      qualityGrade: values.qualityGrade || null,
      soldPricePerKg: numOrNull(values.soldPricePerKg),
      notes: values.notes.trim() || null,
    });
  };

  const yieldHint = gramsToKgHint(watched.totalYieldGrams);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        noValidate
        className="flex flex-col lg:h-full lg:min-h-0"
      >
        <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-4">
          {/* ===== Left — identity preview ===== */}
          <div className="flex min-h-0 flex-col">
            <HarvestIdentityPreview
              cycle={selectedCycle}
              harvestDate={watched.harvestDate}
              totalYieldGrams={
                watched.totalYieldGrams === "" || Number.isNaN(Number(watched.totalYieldGrams))
                  ? null
                  : Number(watched.totalYieldGrams)
              }
              qualityGrade={watched.qualityGrade}
              soldPricePerKg={
                watched.soldPricePerKg === "" ? null : Number(watched.soldPricePerKg)
              }
              notes={watched.notes}
            />
          </div>

          {/* ===== Right — fields (own scroll on short viewports) ===== */}
          <div className="flex min-h-0 flex-col gap-3.5 lg:overflow-y-auto lg:pr-1">
            {/* Cycle + date */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,15rem)]">
              <FormField
                control={form.control}
                name="cycleId"
                rules={{ required: "Pick the cycle this harvest came off" }}
                render={({ field }) => (
                  <FormItem className="min-w-0 gap-1.5">
                    <FormLabel className={fieldLabel}>
                      Cycle
                      <RequiredStar />
                    </FormLabel>
                    <FormControl>
                      <SearchableSelect
                        items={cycles.map((c) => ({
                          value: c.id,
                          label: `${c.cropName ?? "Crop"} — ${c.name}`,
                          description: `${c.zoneName ?? "Field"}${c.farmName ? ` · ${c.farmName}` : ""}`,
                          keywords: [c.name, c.cropName, c.zoneName, c.farmName, c.status]
                            .filter(Boolean)
                            .join(" "),
                        }))}
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        leadingIcon={IconBasket}
                        placeholder="Pick a cycle…"
                        searchPlaceholder="Search crop, cycle or field…"
                        aria-label="Cycle"
                        disabled={submitting}
                        className={
                          form.formState.errors?.cycleId
                            ? "border-destructive/60 ring-destructive/20"
                            : undefined
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="harvestDate"
                rules={{ required: "Pick the harvest date" }}
                render={({ field }) => (
                  <FormItem className="min-w-0 gap-1.5">
                    <FormLabel className={fieldLabel}>
                      Harvest date
                      <RequiredStar />
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        leadingIcon={IconCalendarEvent}
                        value={field.value || ""}
                        onChange={field.onChange}
                        hasError={!!form.formState.errors?.harvestDate}
                      />
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Yield + price */}
            <div className="rounded-2xl border border-border/40 bg-muted/15 p-3.5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className={cn("flex items-center gap-1.5", fieldLabel)}>
                  <IconScale className="size-3.5" strokeWidth={1.75} />
                  The numbers
                </span>
                <span className="text-[10px] font-medium text-muted-foreground/70">
                  revenue is computed for you
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="totalYieldGrams"
                  rules={{ required: "Enter the total yield", validate: validateYield }}
                  render={({ field }) => (
                    <FormItem className="min-w-0 gap-1.5">
                      <FormLabel className={fieldLabel}>
                        Total yield
                        <RequiredStar />
                      </FormLabel>
                      <FormControl>
                        <FieldWrapper
                          icon={IconScale}
                          hasError={!!form.formState.errors?.totalYieldGrams}
                        >
                          <div className="flex items-center gap-1.5">
                            <Input
                              type="number"
                              step="0.01"
                              inputMode="decimal"
                              placeholder="e.g. 4800"
                              className="h-7 border-0 bg-transparent px-0 tabular-nums shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
                            />
                            <span className="shrink-0 rounded-md bg-muted/70 px-1.5 py-0.5 text-[10px] font-semibold tracking-tight text-muted-foreground/80">
                              g
                            </span>
                          </div>
                        </FieldWrapper>
                      </FormControl>
                      {yieldHint &&
                        !form.formState.errors?.totalYieldGrams && (
                          <p className="text-[10px] text-muted-foreground/70">
                            {yieldHint}
                          </p>
                        )}
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="soldPricePerKg"
                  rules={{ validate: validatePrice }}
                  render={({ field }) => (
                    <FormItem className="min-w-0 gap-1.5">
                      <FormLabel className={fieldLabel}>
                        Sold price / kg
                      </FormLabel>
                      <FormControl>
                        <FieldWrapper
                          icon={IconCoin}
                          hasError={!!form.formState.errors?.soldPricePerKg}
                        >
                          <div className="flex items-center gap-1.5">
                            <Input
                              type="number"
                              step="0.01"
                              inputMode="decimal"
                              placeholder="e.g. 24"
                              className="h-7 border-0 bg-transparent px-0 tabular-nums shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
                            />
                            <span className="shrink-0 rounded-md bg-muted/70 px-1.5 py-0.5 text-[10px] font-semibold tracking-tight text-muted-foreground/80">
                              $/kg
                            </span>
                          </div>
                        </FieldWrapper>
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Computed revenue — read-only, mirrors the service rule. */}
              <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-wheat/25 bg-wheat/8 px-3 py-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-wheat/15 text-wheat-deep dark:text-wheat">
                    <IconCash className="size-3.5" strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold tracking-tight">
                      Total revenue
                    </p>
                    <p className="text-[10px] text-muted-foreground/80">
                      auto — yield kg × price / kg
                    </p>
                  </div>
                </div>
                <p className="shrink-0 font-heading text-sm font-bold tracking-tight text-wheat-deep tabular-nums dark:text-wheat">
                  {liveRevenue != null ? formatMoney(liveRevenue) : "—"}
                </p>
              </div>
            </div>

            {/* Quality grade */}
            <div className="rounded-2xl border border-border/40 bg-muted/15 p-3.5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className={cn("flex items-center gap-1.5", fieldLabel)}>
                  Quality grade
                </span>
                <button
                  type="button"
                  onClick={() =>
                    form.setValue("qualityGrade", "", { shouldDirty: true })
                  }
                  disabled={!watched.qualityGrade || submitting}
                  className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                >
                  <IconX className="size-3" strokeWidth={2.2} />
                  Clear
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {GRADE_ORDER.map((id) => {
                  const g = QUALITY_GRADES[id];
                  const active = watched.qualityGrade === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() =>
                        form.setValue("qualityGrade", id, {
                          shouldDirty: true,
                        })
                      }
                      disabled={submitting}
                      aria-pressed={active}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-center transition-all",
                        active
                          ? cn("border-transparent ring-1 shadow-sm bg-linear-to-br text-white", g.gradient, "ring-white/20")
                          : "border-border/40 bg-card/50 hover:-translate-y-px hover:border-border hover:bg-card"
                      )}
                    >
                      <g.icon
                        className={cn("size-5", active ? "text-white" : g.text)}
                        strokeWidth={1.9}
                      />
                      <span
                        className={cn(
                          "text-[11px] font-bold tracking-tight",
                          active ? "text-white" : "text-foreground"
                        )}
                      >
                        {g.label}
                      </span>
                      <span
                        className={cn(
                          "text-[9px] leading-tight",
                          active ? "text-white/80" : "text-muted-foreground/70"
                        )}
                      >
                        {g.description}
                      </span>
                    </button>
                  );
                })}
              </div>
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
                        placeholder="Anything worth noting — buyers, condition, post-harvest handling…"
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
                  {isEdit ? "All changes saved" : "Ready to log"}
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
                  : "Logging…"
                : isEdit
                  ? "Save harvest"
                  : "Log harvest"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default HarvestForm;
