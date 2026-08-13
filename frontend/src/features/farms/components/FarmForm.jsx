import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  IconPlant,
  IconMapPin,
  IconArrowsMoveVertical,
  IconNote,
  IconDeviceFloppy,
  IconX,
  IconPlus,
  IconArrowLeft,
  IconBuildingWarehouse,
  IconArrowsExchange,
  IconBuilding,
  IconSun,
  IconChartArea,
  IconClipboardList,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { farmTypes } from "@/mocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Reveal, FarmTypeArt } from "@/components/effects";

const typeIcons = {
  outdoor: IconSun,
  greenhouse: IconBuildingWarehouse,
  mixed: IconArrowsExchange,
  indoor: IconBuilding,
};

const typeMeta = {
  outdoor: {
    icon: IconSun,
    gradient: "from-amber-500/20 via-amber-400/10 to-transparent",
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
  },
  greenhouse: {
    icon: IconBuildingWarehouse,
    gradient: "from-emerald-500/20 via-emerald-400/10 to-transparent",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  mixed: {
    icon: IconArrowsExchange,
    gradient: "from-violet-500/20 via-violet-400/10 to-transparent",
    bg: "bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
  },
  indoor: {
    icon: IconBuilding,
    gradient: "from-sky-500/20 via-sky-400/10 to-transparent",
    bg: "bg-sky-500/10",
    text: "text-sky-600 dark:text-sky-400",
  },
};

const areaUnits = [
  { value: "sq_ft", label: "Square Feet" },
  { value: "sq_m", label: "Square Meters" },
  { value: "acres", label: "Acres" },
  { value: "hectares", label: "Hectares" },
];

const emptyDefaults = {
  name: "",
  location: "",
  farmTypeId: "",
  totalArea: "",
  areaUnit: "sq_ft",
  notes: "",
};

function FormHeader({ mode }) {
  const navigate = useNavigate();
  const isEdit = mode === "edit";

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <IconArrowLeft className="size-4" strokeWidth={1.75} />
        Back
      </button>
      <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
        {isEdit ? "Edit Farm" : "Add New Farm"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {isEdit
          ? "Update the details of your growing location."
          : "Set up a new growing location for your operation."}
      </p>
    </div>
  );
}

/** Live preview panel — reflects the form as the user fills it in. */
function PreviewPanel({ watch }) {
  const name = watch("name") || "Your Farm Name";
  const location = watch("location") || "Location not set";
  const area = watch("totalArea");
  const typeId = watch("farmTypeId");
  const selectedType = farmTypes.find((t) => t.id === typeId);
  const typeName = selectedType?.name || "outdoor";
  const meta = typeMeta[typeName] || typeMeta.outdoor;
  const TypeIcon = meta.icon;

  return (
    <div className="glass-card texture-paper highlight-edge sticky top-20 overflow-hidden rounded-2xl">
      {/* Art banner */}
      <div className="relative h-28 overflow-hidden">
        <div
          className={cn("absolute inset-0 bg-gradient-to-br", meta.gradient)}
        />
        <FarmTypeArt variant={typeName} className="relative size-full" />
        <div
          className={cn(
            "absolute -bottom-5 left-5 flex size-12 items-center justify-center rounded-2xl ring-4 ring-card",
            meta.bg
          )}
        >
          <TypeIcon className={cn("size-6", meta.text)} strokeWidth={1.7} />
        </div>
      </div>

      <div className="px-5 pt-8 pb-5">
        <p className="text-[10px] font-bold tracking-wider text-muted-foreground/60 uppercase">
          Live Preview
        </p>
        <h3 className="mt-1 truncate font-heading text-lg font-bold tracking-tight">
          {name}
        </h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <IconMapPin className="size-3" strokeWidth={1.75} />
          {location}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-muted/40 p-2.5">
            <div className="flex items-center gap-1 text-[10px] font-medium tracking-wider text-muted-foreground/70 uppercase">
              <IconChartArea className="size-3" strokeWidth={1.85} />
              Area
            </div>
            <p className="mt-0.5 text-sm font-semibold tabular-nums">
              {area ? Number(area).toLocaleString() : "—"}
            </p>
          </div>
          <div className="rounded-xl bg-muted/40 p-2.5">
            <div className="flex items-center gap-1 text-[10px] font-medium tracking-wider text-muted-foreground/70 uppercase">
              <IconClipboardList className="size-3" strokeWidth={1.85} />
              Type
            </div>
            <p className="mt-0.5 truncate text-sm font-semibold">
              {selectedType ? selectedType.displayName.split(" / ")[0] : "—"}
            </p>
          </div>
        </div>

        {selectedType && (
          <div className="mt-3 rounded-xl bg-leaf/5 p-2.5 ring-1 ring-leaf/10 ring-inset">
            <p className="line-clamp-3 text-[11px] leading-relaxed text-muted-foreground">
              {selectedType.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FarmForm({
  mode = "create",
  defaultValues = emptyDefaults,
  farmId,
}) {
  const navigate = useNavigate();
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues });

  const selectedTypeId = watch("farmTypeId");
  const selectedType = farmTypes.find((t) => t.id === selectedTypeId);

  const onSubmit = (data) => {
    const farmType = farmTypes.find((t) => t.id === data.farmTypeId);
    const payload = { ...data, farmTypeName: farmType?.displayName };
    console.log(isEdit ? "Updated farm:" : "New farm:", payload);
    toast.success(
      isEdit ? "Farm updated successfully!" : "Farm created successfully!",
      {
        description: `${data.name} has been ${isEdit ? "updated" : "added"}.`,
      }
    );
    navigate(isEdit && farmId ? `/app/farms/${farmId}` : "/app/farms");
  };

  const cancel = () => navigate(-1);

  return (
    <div>
      <FormHeader mode={mode} />

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Left: sticky preview (hidden on mobile, shows below) */}
        <aside className="order-2 lg:order-1">
          <PreviewPanel watch={watch} />
        </aside>

        {/* Right: form fields */}
        <div className="glass-card texture-paper highlight-edge order-1 rounded-2xl p-5 sm:p-6 lg:order-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Reveal duration={400}>
              <div className="space-y-2">
                <Label htmlFor="name">Farm Name *</Label>
                <div className="relative">
                  <IconPlant
                    className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    strokeWidth={1.75}
                  />
                  <Input
                    id="name"
                    placeholder="e.g. Sunrise Valley Farm"
                    className="pl-9"
                    {...register("name", { required: "Farm name is required" })}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <IconMapPin
                    className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                    strokeWidth={1.75}
                  />
                  <Input
                    id="location"
                    placeholder="e.g. Napa Valley, CA"
                    className="pl-9"
                    {...register("location")}
                  />
                </div>
              </div>
            </Reveal>

            <Separator />

            <Reveal delay={80} duration={400}>
              <div className="space-y-2">
                <Label>Farm Type *</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {farmTypes.map((type) => {
                    const isSelected = selectedTypeId === type.id;
                    const TypeIcon = typeIcons[type.name] || IconPlant;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() =>
                          setValue("farmTypeId", type.id, {
                            shouldValidate: true,
                          })
                        }
                        className={cn(
                          "group flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-3 text-center transition-all duration-200",
                          isSelected
                            ? "border-leaf bg-leaf/5 shadow-sm shadow-leaf/10"
                            : "border-border/60 bg-card hover:-translate-y-0.5 hover:border-muted-foreground/30 hover:bg-muted/30"
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-8 items-center justify-center rounded-lg transition-transform duration-200",
                            isSelected
                              ? "scale-110 bg-leaf/15 text-leaf"
                              : "bg-muted text-muted-foreground group-hover:scale-105"
                          )}
                        >
                          <TypeIcon className="size-4" strokeWidth={1.75} />
                        </span>
                        <span
                          className={cn(
                            "text-[11px] leading-tight font-medium",
                            isSelected
                              ? "text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {type.displayName.split(" / ")[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <input
                  type="hidden"
                  {...register("farmTypeId", {
                    required: "Farm type is required",
                  })}
                />
                {errors.farmTypeId && (
                  <p className="text-xs text-red-500">
                    {errors.farmTypeId.message}
                  </p>
                )}
                {selectedType && (
                  <div className="flex items-start gap-2 rounded-lg bg-leaf/5 px-3 py-2 ring-1 ring-leaf/10 ring-inset">
                    <IconPlant
                      className="mt-0.5 size-4 shrink-0 text-leaf"
                      strokeWidth={1.75}
                    />
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {selectedType.description}
                    </p>
                  </div>
                )}
              </div>
            </Reveal>

            <Separator />

            <Reveal delay={160} duration={400}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="totalArea">Total Area *</Label>
                  <div className="relative">
                    <IconArrowsMoveVertical
                      className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                      strokeWidth={1.75}
                    />
                    <Input
                      id="totalArea"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g. 5000"
                      className="pl-9"
                      {...register("totalArea", {
                        required: "Total area is required",
                        min: { value: 0.01, message: "Must be greater than 0" },
                      })}
                    />
                  </div>
                  {errors.totalArea && (
                    <p className="text-xs text-red-500">
                      {errors.totalArea.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="areaUnit">Area Unit</Label>
                  <div className="relative">
                    <select
                      id="areaUnit"
                      className="flex h-9 w-full appearance-none rounded-xl border border-input bg-transparent px-3 py-1 pr-8 text-sm shadow-xs transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                      {...register("areaUnit")}
                    >
                      {areaUnits.map((unit) => (
                        <option
                          key={unit.value}
                          value={unit.value}
                          className="bg-popover text-popover-foreground"
                        >
                          {unit.label}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="m6 9 6 6 6-6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <div className="relative">
                  <IconNote
                    className="absolute top-2.5 left-3 size-4 text-muted-foreground"
                    strokeWidth={1.75}
                  />
                  <Textarea
                    id="notes"
                    placeholder="Any additional information about this farm..."
                    className="pl-9"
                    rows={3}
                    {...register("notes")}
                  />
                </div>
              </div>
            </Reveal>

            <div className="flex flex-col-reverse gap-2 border-t border-border/40 pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={cancel}
                className="gap-1.5"
              >
                <IconX className="size-4" strokeWidth={2} />
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isEdit ? (
                  <IconDeviceFloppy className="size-4" strokeWidth={2} />
                ) : (
                  <IconPlus className="size-4" strokeWidth={2.2} />
                )}
                {isSubmitting
                  ? isEdit
                    ? "Saving..."
                    : "Creating..."
                  : isEdit
                    ? "Save Changes"
                    : "Create Farm"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
