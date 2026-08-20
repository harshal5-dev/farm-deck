import { useForm, useWatch } from "react-hook-form";
import {
  IconBuildingCommunity,
  IconCalendar,
  IconCircleCheckFilled,
  IconLoader2,
  IconMapPin,
  IconRulerMeasure,
  IconUser,
  IconCheck,
  IconNotes,
  IconPlant2,
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
import FieldWrapper from "@/components/ui/field-wrapper";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  FARM_TYPE_ORDER,
  getFarmType,
} from "@/constants/farms";
import FarmIdentityPreview from "./FarmIdentityPreview";
import FarmTypeCard from "./FarmTypeCard";
import SoilTypeSelect from "./SoilTypeSelect";
import StatusSegmented from "./StatusSegmented";

const fieldLabel =
  "text-xs font-semibold tracking-wide text-muted-foreground uppercase";

const FarmForm = ({
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
      location: defaultValues?.location || "",
      farmType: defaultValues?.farmType || "outdoor",
      soilType: defaultValues?.soilType || "loam",
      status: defaultValues?.status || "active",
      sizeAcres:
        defaultValues?.sizeAcres === 0 || defaultValues?.sizeAcres
          ? String(defaultValues.sizeAcres)
          : "",
      managerName: defaultValues?.managerName || "",
      establishedAt: defaultValues?.establishedAt || "",
      description: defaultValues?.description || "",
      fieldsCount:
        defaultValues?.fieldsCount === 0 || defaultValues?.fieldsCount
          ? String(defaultValues.fieldsCount)
          : "",
      cropsCount:
        defaultValues?.cropsCount === 0 || defaultValues?.cropsCount
          ? String(defaultValues.cropsCount)
          : "",
      yieldKg:
        defaultValues?.yieldKg === 0 || defaultValues?.yieldKg
          ? String(defaultValues.yieldKg)
          : "",
    },
  });

  // Live values drive the identity preview.
  const watched = useWatch({ control: form.control });
  const { isDirty } = form.formState;

  const submit = async (values) => {
    await onSubmit({
      name: values.name.trim(),
      location: values.location.trim(),
      farmType: values.farmType,
      soilType: values.soilType,
      status: values.status,
      sizeAcres: values.sizeAcres === "" ? 0 : Number(values.sizeAcres) || 0,
      managerName: values.managerName.trim(),
      establishedAt: values.establishedAt || null,
      description: values.description.trim(),
      fieldsCount:
        values.fieldsCount === "" ? 0 : Number(values.fieldsCount) || 0,
      cropsCount:
        values.cropsCount === "" ? 0 : Number(values.cropsCount) || 0,
      yieldKg: values.yieldKg === "" ? 0 : Number(values.yieldKg) || 0,
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
          {/* ===== Left — identity preview ===== */}
          <div className="flex min-h-0 flex-col">
            <FarmIdentityPreview
              name={watched.name}
              location={watched.location}
              farmType={watched.farmType}
              soilType={watched.soilType}
              status={watched.status}
              sizeAcres={watched.sizeAcres}
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
                maxLength: { value: 80, message: "Too long" },
              }}
              render={({ field, fieldState }) => (
                <FormItem className="gap-1.5">
                  <FormLabel className={fieldLabel}>Farm name</FormLabel>
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
                required: "Location is required",
                maxLength: { value: 120, message: "Too long" },
              }}
              render={({ field, fieldState }) => (
                <FormItem className="gap-1.5">
                  <FormLabel className={fieldLabel}>Location</FormLabel>
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

            {/* Farm type — 5 cards inline with art preview */}
            <FormField
              control={form.control}
              name="farmType"
              render={({ field }) => (
                <div>
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className={cn("flex items-center gap-1.5", fieldLabel)}>
                      <IconPlant2 className="size-3.5" strokeWidth={1.75} />
                      Farm type
                    </span>
                    <Tooltip>
                      <TooltipTrigger className="text-[10px] font-medium text-muted-foreground hover:text-foreground">
                        What does each type mean?
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <ul className="space-y-1 text-[11px]">
                          {FARM_TYPE_ORDER.map((id) => {
                            const t = getFarmType(id);
                            return (
                              <li key={id}>
                                <span className={cn("font-semibold", t.text)}>
                                  {t.label}:
                                </span>{" "}
                                {t.description}
                              </li>
                            );
                          })}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                    {FARM_TYPE_ORDER.map((id) => (
                      <FarmTypeCard
                        key={id}
                        farmTypeId={id}
                        selected={field.value === id}
                        onSelect={field.onChange}
                      />
                    ))}
                  </div>
                </div>
              )}
            />

            {/* Soil + Acres + Status — three-column on desktop */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="soilType"
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel className={fieldLabel}>Soil type</FormLabel>
                    <FormControl>
                      <SoilTypeSelect
                        value={field.value}
                        onChange={field.onChange}
                        disabled={submitting}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sizeAcres"
                rules={{
                  min: { value: 0, message: "Must be ≥ 0" },
                }}
                render={({ field, fieldState }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel className={fieldLabel}>Size (acres)</FormLabel>
                    <FormControl>
                      <FieldWrapper
                        icon={IconRulerMeasure}
                        hasError={fieldState.invalid}
                      >
                        <Input
                          type="number"
                          inputMode="decimal"
                          step="0.1"
                          min="0"
                          placeholder="e.g. 4.5"
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
                name="establishedAt"
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel className={fieldLabel}>
                      Established date
                    </FormLabel>
                    <FormControl>
                      <FieldWrapper icon={IconCalendar}>
                        <Input
                          type="date"
                          className="border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FieldWrapper>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Status segmented */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <div>
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className={cn("flex items-center gap-1.5", fieldLabel)}>
                      Status
                    </span>
                  </div>
                  <StatusSegmented
                    value={field.value}
                    onChange={field.onChange}
                    disabled={submitting}
                  />
                </div>
              )}
            />

            {/* Manager + fields/crops/yield — meta cluster */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="managerName"
                render={({ field }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel className={fieldLabel}>Manager</FormLabel>
                    <FormControl>
                      <FieldWrapper icon={IconUser}>
                        <Input
                          placeholder="e.g. Priya Deshmukh"
                          className="border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FieldWrapper>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name="fieldsCount"
                  render={({ field }) => (
                    <FormItem className="gap-1.5">
                      <FormLabel className={fieldLabel}>Fields</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min="0"
                          step="1"
                          placeholder="0"
                          className="tabular-nums"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cropsCount"
                  render={({ field }) => (
                    <FormItem className="gap-1.5">
                      <FormLabel className={fieldLabel}>Crops</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min="0"
                          step="1"
                          placeholder="0"
                          className="tabular-nums"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="yieldKg"
                  render={({ field }) => (
                    <FormItem className="gap-1.5">
                      <FormLabel className={fieldLabel}>Yield (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          inputMode="numeric"
                          min="0"
                          step="1"
                          placeholder="0"
                          className="tabular-nums"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="gap-1.5">
                  <FormLabel className={fieldLabel}>Description</FormLabel>
                  <FormControl>
                    <FieldWrapper
                      icon={IconNotes}
                      align="start"
                      hasError={!!form.formState.errors?.description}
                    >
                      <Textarea
                        placeholder="What grows here, any special techniques, recent wins…"
                        rows={3}
                        className="min-h-20 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FieldWrapper>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* ===== Footer ===== */}
        <div className="mt-4 flex flex-col gap-3 border-t border-border/40 pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
          <p className="text-[11px] text-muted-foreground sm:order-1">
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
