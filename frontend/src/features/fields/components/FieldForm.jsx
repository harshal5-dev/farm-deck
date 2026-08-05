import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import {
  IconSeeding,
  IconPlant,
  IconArrowsMoveVertical,
  IconNote,
  IconDeviceFloppy,
  IconX,
  IconPlus,
  IconArrowLeft,
  IconLeaf,
  IconFlower,
  IconBasket,
  IconCircleOff,
  IconShovel,
  IconMapPin,
} from "@tabler/icons-react"
import { farms, soilTypes } from "@/mocks"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Reveal } from "@/components/effects"

const statusOptions = [
  { value: "", label: "Inactive", icon: IconCircleOff },
  { value: "seeding", label: "Seeding", icon: IconSeeding },
  { value: "growing", label: "Growing", icon: IconLeaf },
  { value: "flowering", label: "Flowering", icon: IconFlower },
  { value: "harvested", label: "Harvested", icon: IconBasket },
]

const areaUnits = [
  { value: "sq_ft", label: "Square Feet" },
  { value: "sq_m", label: "Square Meters" },
  { value: "acres", label: "Acres" },
  { value: "hectares", label: "Hectares" },
]

const emptyDefaults = {
  name: "",
  farmId: "",
  soilTypeId: "",
  area: "",
  areaUnit: "sq_ft",
  cropName: "",
  status: "",
  notes: "",
}

function FormHeader({ mode }) {
  const navigate = useNavigate()
  const isEdit = mode === "edit"

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
        {isEdit ? "Edit Field" : "Add New Field"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {isEdit
          ? "Update the details of this growing area."
          : "Define a new growing area within one of your farms."}
      </p>
    </div>
  )
}

function PreviewPanel({ watch }) {
  const name = watch("name") || "New Field"
  const cropName = watch("cropName")
  const area = watch("area")
  const farmId = watch("farmId")
  const soilTypeId = watch("soilTypeId")
  const farm = farms.find((f) => f.id === farmId)
  const soil = soilTypes.find((s) => s.id === soilTypeId)

  return (
    <div className="glass-card texture-paper highlight-edge sticky top-20 overflow-hidden rounded-2xl">
      {/* tinted banner */}
      <div className="relative h-16 overflow-hidden border-b border-border/40">
        <div
          className={cn(
            "absolute inset-0",
            soilTypeId ? "bg-gradient-to-r from-wheat/15 to-wheat/5" : "bg-gradient-to-r from-sky-warm/15 to-sky-warm/5"
          )}
        />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(${soilTypeId ? "var(--wheat)" : "var(--sky-warm)"} 1px, transparent 1.2px)`,
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative flex h-full items-center px-4">
          {soil ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-wheat/20 px-1.5 py-0.5 text-[10px] font-semibold text-wheat">
              <IconShovel className="size-3" strokeWidth={2} />
              {soil.displayName}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md bg-sky-warm/20 px-1.5 py-0.5 text-[10px] font-semibold text-sky-warm">
              <IconPlant className="size-3" strokeWidth={2} />
              Hydroponic
            </span>
          )}
        </div>
      </div>

      <div className="px-5 pb-5 pt-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
          Live Preview
        </p>
        <h3 className="mt-1 truncate font-heading text-lg font-bold tracking-tight">{name}</h3>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {cropName || "No active crop"}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-muted/40 p-2.5">
            <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
              <IconArrowsMoveVertical className="size-3" strokeWidth={1.85} />
              Area
            </div>
            <p className="mt-0.5 text-sm font-semibold tabular-nums">
              {area ? Number(area).toLocaleString() : "—"}
            </p>
          </div>
          <div className="rounded-xl bg-muted/40 p-2.5">
            <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
              <IconMapPin className="size-3" strokeWidth={1.85} />
              Farm
            </div>
            <p className="mt-0.5 truncate text-sm font-semibold">
              {farm ? farm.name : "—"}
            </p>
          </div>
        </div>

        {soil && (
          <div className="mt-3 rounded-xl bg-leaf/5 p-2.5 ring-1 ring-inset ring-leaf/10">
            <p className="line-clamp-3 text-[11px] leading-relaxed text-muted-foreground">
              {soil.description}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function FieldForm({ mode = "create", defaultValues = emptyDefaults, fieldId }) {
  const navigate = useNavigate()
  const isEdit = mode === "edit"

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues })

  const onSubmit = (data) => {
    const farm = farms.find((f) => f.id === data.farmId)
    const soil = soilTypes.find((s) => s.id === data.soilTypeId)
    const payload = {
      ...data,
      isActive: data.status !== "",
      farmName: farm?.name,
      soilName: soil?.displayName || "Hydroponic",
    }
    console.log(isEdit ? "Updated field:" : "New field:", payload)
    toast.success(isEdit ? "Field updated successfully!" : "Field created successfully!", {
      description: `${data.name} has been ${isEdit ? "updated" : "added"}.`,
    })
    navigate("/app/fields")
  }

  const cancel = () => navigate(-1)

  const selectedFarmId = watch("farmId")
  const selectedSoilId = watch("soilTypeId")

  return (
    <div>
      <FormHeader mode={mode} />

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Left: sticky preview */}
        <aside className="order-2 lg:order-1">
          <PreviewPanel watch={watch} />
        </aside>

        {/* Right: form */}
        <div className="glass-card texture-paper highlight-edge order-1 rounded-2xl p-5 sm:p-6 lg:order-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Reveal duration={400}>
              <div className="space-y-2">
                <Label htmlFor="name">Field Name *</Label>
                <div className="relative">
                  <IconPlant className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
                  <Input
                    id="name"
                    placeholder="e.g. West Tomato Patch"
                    className="pl-9"
                    {...register("name", { required: "Field name is required" })}
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div className="mt-4 space-y-2">
                <Label htmlFor="cropName">Crop Name</Label>
                <div className="relative">
                  <IconLeaf className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
                  <Input
                    id="cropName"
                    placeholder="e.g. Beefsteak Tomatoes"
                    className="pl-9"
                    {...register("cropName")}
                  />
                </div>
              </div>
            </Reveal>

            <Separator />

            {/* Farm picker */}
            <Reveal delay={80} duration={400}>
              <div className="space-y-2">
                <Label>Farm *</Label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {farms.map((farm) => {
                    const isSelected = selectedFarmId === farm.id
                    return (
                      <button
                        key={farm.id}
                        type="button"
                        onClick={() => setValue("farmId", farm.id, { shouldValidate: true })}
                        className={cn(
                          "group flex items-center gap-2.5 rounded-xl border-2 px-3 py-2.5 text-left transition-all duration-200",
                          isSelected
                            ? "border-leaf bg-leaf/5 shadow-sm"
                            : "border-border/60 bg-card hover:-translate-y-0.5 hover:border-muted-foreground/30 hover:bg-muted/30"
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-8 shrink-0 items-center justify-center rounded-lg",
                            isSelected ? "bg-leaf/15 text-leaf" : "bg-muted text-muted-foreground"
                          )}
                        >
                          <IconPlant className="size-4" strokeWidth={1.75} />
                        </span>
                        <div className="min-w-0">
                          <p className={cn("truncate text-xs font-semibold", isSelected ? "text-foreground" : "text-muted-foreground")}>
                            {farm.name}
                          </p>
                          <p className="truncate text-[10px] text-muted-foreground">{farm.location}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
                <input type="hidden" {...register("farmId", { required: "Please select a farm" })} />
                {errors.farmId && <p className="text-xs text-red-500">{errors.farmId.message}</p>}
              </div>
            </Reveal>

            {/* Soil type picker */}
            <Reveal delay={120} duration={400}>
              <div className="space-y-2">
                <Label>Soil Type</Label>
                <p className="text-[11px] text-muted-foreground">
                  Leave unset for hydroponic fields (NFT, DWC, aeroponics).
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {soilTypes.map((soil) => {
                    const isSelected = selectedSoilId === soil.id
                    return (
                      <button
                        key={soil.id}
                        type="button"
                        onClick={() => setValue("soilTypeId", isSelected ? "" : soil.id)}
                        className={cn(
                          "group flex items-center gap-2 rounded-xl border-2 px-2.5 py-2 text-left transition-all duration-200",
                          isSelected
                            ? "border-wheat bg-wheat/5 shadow-sm"
                            : "border-border/60 bg-card hover:-translate-y-0.5 hover:border-muted-foreground/30 hover:bg-muted/30"
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-7 shrink-0 items-center justify-center rounded-md",
                            isSelected ? "bg-wheat/20 text-wheat" : "bg-muted text-muted-foreground"
                          )}
                        >
                          <IconShovel className="size-3.5" strokeWidth={1.85} />
                        </span>
                        <span className={cn("truncate text-[11px] font-medium", isSelected ? "text-foreground" : "text-muted-foreground")}>
                          {soil.displayName}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </Reveal>

            <Separator />

            {/* Area + unit + status */}
            <Reveal delay={160} duration={400}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="area">Area *</Label>
                  <div className="relative">
                    <IconArrowsMoveVertical className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
                    <Input
                      id="area"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g. 5000"
                      className="pl-9"
                      {...register("area", {
                        required: "Area is required",
                        min: { value: 0.01, message: "Must be greater than 0" },
                      })}
                    />
                  </div>
                  {errors.area && <p className="text-xs text-red-500">{errors.area.message}</p>}
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
                        <option key={unit.value} value={unit.value} className="bg-popover text-popover-foreground">
                          {unit.label}
                        </option>
                      ))}
                    </select>
                    <svg className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Status picker */}
              <div className="mt-4 space-y-2">
                <Label>Status</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {statusOptions.map((opt) => {
                    const OptIcon = opt.icon
                    const isSelected = (watch("status") || "") === opt.value
                    return (
                      <button
                        key={opt.value || "inactive"}
                        type="button"
                        onClick={() => setValue("status", opt.value)}
                        className={cn(
                          "flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-2.5 text-center transition-all duration-200",
                          isSelected
                            ? "border-leaf bg-leaf/5 shadow-sm"
                            : "border-border/60 bg-card hover:-translate-y-0.5 hover:border-muted-foreground/30 hover:bg-muted/30"
                        )}
                      >
                        <OptIcon className={cn("size-4", isSelected ? "text-leaf" : "text-muted-foreground")} strokeWidth={1.85} />
                        <span className={cn("text-[10px] font-medium", isSelected ? "text-foreground" : "text-muted-foreground")}>
                          {opt.label}
                        </span>
                      </button>
                    )
                  })}
                </div>
                <input type="hidden" {...register("status")} />
              </div>

              <div className="mt-4 space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <div className="relative">
                  <IconNote className="absolute left-3 top-2.5 size-4 text-muted-foreground" strokeWidth={1.75} />
                  <Textarea
                    id="notes"
                    placeholder="Any additional information about this field..."
                    className="pl-9"
                    rows={3}
                    {...register("notes")}
                  />
                </div>
              </div>
            </Reveal>

            <div className="flex flex-col-reverse gap-2 border-t border-border/40 pt-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={cancel} className="gap-1.5">
                <IconX className="size-4" strokeWidth={2} />
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isEdit ? <IconDeviceFloppy className="size-4" strokeWidth={2} /> : <IconPlus className="size-4" strokeWidth={2.2} />}
                {isSubmitting ? (isEdit ? "Saving..." : "Creating...") : isEdit ? "Save Changes" : "Create Field"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
