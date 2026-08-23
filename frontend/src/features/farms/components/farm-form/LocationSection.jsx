import { useRef, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  IconCircleCheck,
  IconMapPin,
  IconMapPinOff,
  IconWorldLatitude,
  IconWorldLongitude,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FieldWrapper from "@/components/ui/field-wrapper";
import { validateCoordinate } from "../../lib/geolocation";
import { formatPlace } from "../../lib/geocode";
import LocationPicker from "./LocationPicker";

const fieldLabel =
  "text-xs font-semibold tracking-wide text-muted-foreground uppercase";

const isSet = (v) => v !== "" && v != null;

/**
 * LocationSection — the farm form's location-pin block
 * (docs/GEOLOCATION_DESIGN.md §5).
 *
 * The section itself stays compact: a status card that opens the
 * interactive map in a dialog. Inside the dialog: search, tap-to-place,
 * draggable pin, GPS, and manual coordinate entry. The farmer never
 * sees a number in the main form flow.
 *
 * Picking a place from search also refreshes the `location` text field
 * — it replaces the previous auto-filled suggestion, but never text the
 * farmer typed themselves.
 */
const LocationSection = ({ disabled = false }) => {
  const form = useFormContext();
  const latitude = useWatch({ control: form.control, name: "latitude" });
  const longitude = useWatch({ control: form.control, name: "longitude" });
  const coordsError =
    form.formState.errors?.latitude || form.formState.errors?.longitude;

  const [open, setOpen] = useState(false);
  const lastAutofilledRef = useRef("");

  const value =
    isSet(latitude) && isSet(longitude)
      ? { latitude: Number(latitude), longitude: Number(longitude) }
      : null;

  const handleChange = (next) => {
    form.setValue("latitude", next ? String(next.latitude) : "", {
      shouldValidate: true,
      shouldDirty: true,
    });
    form.setValue("longitude", next ? String(next.longitude) : "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  // A search pick knows its place name — sync the location text field.
  // Empty or our own previous suggestion gets replaced; farmer-typed
  // text always wins. Taps/GPS carry no name (reverse geocoding is a
  // deferred phase in the design doc).
  const handlePlaceSelected = (place) => {
    const label = formatPlace(place);
    const current = (form.getValues("location") || "").trim();
    if (!current || current === lastAutofilledRef.current) {
      lastAutofilledRef.current = label;
      form.setValue("location", label, { shouldDirty: true });
    }
  };

  const handleClear = () => handleChange(null);

  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <span className={cn("flex items-center gap-1.5", fieldLabel)}>
          <IconMapPin className="size-3.5" strokeWidth={1.75} />
          Location pin
        </span>
        <span
          className={cn(
            "text-[11px] font-medium",
            value
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-muted-foreground/70"
          )}
        >
          {value
            ? "Pin set — open to fine-tune"
            : "Optional — unlocks weather & map features"}
        </span>
      </div>

      {/* ===== Launcher card ===== */}
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3",
          coordsError
            ? "border-destructive/40 bg-destructive/5"
            : value
              ? "border-emerald-500/25 bg-emerald-500/[0.06]"
              : "border-dashed border-border/60 bg-muted/20"
        )}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-xl",
              value
                ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400"
                : "bg-muted text-muted-foreground"
            )}
          >
            {value ? (
              <IconCircleCheck className="size-4.5" strokeWidth={1.85} />
            ) : (
              <IconMapPin className="size-4.5" strokeWidth={1.85} />
            )}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-tight">
              {value
                ? "Farm location pinned"
                : "No pin yet"}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {coordsError ? (
                <span className="inline-flex items-center gap-1 font-medium text-destructive">
                  <IconAlertTriangle className="size-3" strokeWidth={2} />
                  {coordsError.message}
                </span>
              ) : value ? (
                "Search, tap the map, or use GPS to adjust."
              ) : (
                "Pick your farm on the map — search, tap, or GPS."
              )}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={disabled}
              className="h-8 gap-1.5 px-2.5 text-[11px] text-muted-foreground"
            >
              <IconMapPinOff className="size-3.5" strokeWidth={1.85} />
              Clear
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            disabled={disabled}
            className="h-8 gap-1.5 px-3 text-[11px]"
          >
            <IconMapPin className="size-3.5" strokeWidth={1.85} />
            {value ? "Adjust on map" : "Choose on map"}
          </Button>
        </div>
      </div>

      {/* ===== Map dialog ===== */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton size="xl" className="p-0">
          <DialogHeader className="pb-3">
            <DialogTitle>Choose farm location</DialogTitle>
            <DialogDescription>
              Search for a village or town, tap the map, drag the pin, or
              use your device's GPS.
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="px-6 py-0">
            <LocationPicker
              value={value}
              onChange={handleChange}
              onPlaceSelected={handlePlaceSelected}
              disabled={disabled}
            />

            {/* Manual entry — secondary, no collapsing */}
            <div className="mt-3 grid grid-cols-1 gap-3 pb-1 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="latitude"
                rules={{ validate: (v) => validateCoordinate(v, 90) }}
                render={({ field, fieldState }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel className={fieldLabel}>Latitude</FormLabel>
                    <FormControl>
                      <FieldWrapper icon={IconWorldLatitude} hasError={fieldState.invalid}>
                        <Input
                          type="number"
                          inputMode="decimal"
                          step="any"
                          min="-90"
                          max="90"
                          placeholder="e.g. 18.5204"
                          disabled={disabled}
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
                name="longitude"
                rules={{ validate: (v) => validateCoordinate(v, 180) }}
                render={({ field, fieldState }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel className={fieldLabel}>Longitude</FormLabel>
                    <FormControl>
                      <FieldWrapper icon={IconWorldLongitude} hasError={fieldState.invalid}>
                        <Input
                          type="number"
                          inputMode="decimal"
                          step="any"
                          min="-180"
                          max="180"
                          placeholder="e.g. 73.8567"
                          disabled={disabled}
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
          </DialogBody>

          <DialogFooter className="sm:px-6">
            {value && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  handleClear();
                  setOpen(false);
                }}
                disabled={disabled}
                className="gap-1.5"
              >
                <IconMapPinOff className="size-4" strokeWidth={1.85} />
                Remove pin
              </Button>
            )}
            <Button type="button" onClick={() => setOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationSection;
