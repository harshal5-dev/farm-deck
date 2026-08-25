import { useMemo, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  IconCheck,
  IconFlag,
  IconLayoutGrid,
  IconPlant2,
  IconRoute2,
  IconTractor,
  IconX,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/effects";
import { usePermissions } from "@/features/auth/usePermissions";
import { useCreateZoneMutation } from "@/features/fields/zoneApi";
import { useCreateCropMutation } from "@/features/crops/cropApi";
import SetupStepper from "../components/SetupStepper";
import SetupSuccess from "../components/SetupSuccess";
import { FarmStep, FieldsStep, CropsStep, SetupFooter } from "../components/SetupSteps";

const STEPS = [
  { id: "farm", label: "Farm", icon: IconTractor, optional: false },
  { id: "fields", label: "Fields", icon: IconLayoutGrid, optional: true },
  { id: "crops", label: "Crops", icon: IconPlant2, optional: true },
  { id: "done", label: "Done", icon: IconFlag, optional: false },
];

const SUBTITLES = [
  "Name it, pick a type, drop a pin — the fields and crops come next.",
  "Add the growing areas of your new farm. Optional — you can skip and add them later.",
  "Plan what's growing first. Optional — cycles can be planned any time.",
  "Everything is saved — here's your new farm at a glance.",
];

/**
 * FarmSetup — the guided Farm → Fields → Crops wizard.
 *
 * Every step commits progressively (farm first, then each field, then
 * each crop), so bailing at any point keeps everything created so far
 * and the regular pages pick up from there. Steps 2 and 3 are
 * skippable; the forms are the existing FarmForm/ZoneForm/CropForm
 * embedded in a stepper shell. The page fills the viewport at lg —
 * header pinned, step body scrolling internally.
 */
const FarmSetup = () => {
  const navigate = useNavigate();
  const { canManageFarms, canManageFields, canManageCrops } =
    usePermissions();

  const [step, setStep] = useState(0);
  const [farm, setFarm] = useState(null);
  const [zones, setZones] = useState([]);
  const [crops, setCrops] = useState([]);

  // Add-many step mutations, lifted here so the pinned SetupFooter can
  // drive the Add button (loading state + requestSubmit on the form).
  const [createZone, { isLoading: creatingZone }] = useCreateZoneMutation();
  const [createCrop, { isLoading: creatingCrop }] = useCreateCropMutation();
  const zoneFormRef = useRef(null);
  const cropFormRef = useRef(null);

  const counts = useMemo(
    () => ({ farm: farm ? 1 : 0, fields: zones.length, crops: crops.length }),
    [farm, zones, crops]
  );

  const handleCreateZone = async (values) => {
    try {
      const zone = await createZone(values).unwrap();
      toast.success("Field added", {
        description: `${zone.name} is part of ${farm.name}.`,
      });
      setZones((prev) => [...prev, zone]);
    } catch (err) {
      toast.error("Could not add field", {
        description: err?.data?.error?.message || "Please try again.",
      });
    }
  };

  const handleCreateCrop = async (values) => {
    try {
      const crop = await createCrop(values).unwrap();
      toast.success("Crop planned", {
        description: `${crop.name} is set up on ${crop.zoneName}.`,
      });
      setCrops((prev) => [...prev, crop]);
    } catch (err) {
      toast.error("Could not add crop", {
        description: err?.data?.error?.message || "Please try again.",
      });
    }
  };

  // Permission gate — the wizard manages all three resources at once.
  if (!canSetup(canManageFarms, canManageFields, canManageCrops)) {
    return <Navigate to="/app/farms" replace />;
  }

  const isFinished = step >= 3;

  const handleExit = () => {
    if (farm) {
      toast.info("Setup saved", {
        description: `${farm.name} and its ${zones.length} field${
          zones.length === 1 ? "" : "s"
        } are safe — finish any time from the Fields page.`,
      });
    }
    navigate("/app/farms");
  };

  return (
    <div className="flex flex-col gap-4 lg:h-[calc(100svh-6.5rem)] lg:overflow-hidden">
      {/* ============ Wizard header + stepper (pinned) =================== */}
      <Reveal duration={400} className="shrink-0">
        <div className="glass-card texture-paper highlight-edge relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-linear-to-br from-leaf/10 via-lagoon/6 to-wheat/10" />
          <div className="absolute -top-16 -right-10 size-48 rounded-full bg-leaf/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-48 rounded-full bg-lagoon/12 blur-3xl" />
          <div className="pattern-contour absolute inset-0 opacity-40 mix-blend-soft-light" />

          <div className="relative flex flex-col gap-4 p-4 sm:p-5">
            {/* Row 1 — identity + exit */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 rounded-2xl bg-linear-to-br from-leaf/30 to-lagoon/30 opacity-60 blur-md" />
                  <div className="relative flex size-10 items-center justify-center rounded-2xl bg-linear-to-br from-leaf to-lagoon-deep text-white shadow-md ring-1 ring-white/10">
                    <IconRoute2 className="size-5" strokeWidth={1.75} />
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full border border-leaf/30 bg-leaf/12 px-2 py-0.5 text-[9px] font-semibold tracking-wider text-leaf uppercase backdrop-blur-sm">
                      Guided setup
                    </span>
                    {isFinished ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-leaf/30 bg-leaf/12 px-2 py-0.5 text-[9px] font-semibold tracking-wider text-leaf uppercase">
                        <IconCheck className="size-2.5" strokeWidth={2.5} />
                        Completed
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-muted-foreground/70">
                        Step {step + 1} of 3
                        {farm ? ` · ${farm.name}` : ""}
                      </span>
                    )}
                  </div>
                  <h1 className="font-heading text-lg font-bold tracking-tight sm:text-xl">
                    Set up your farm
                  </h1>
                  <p className="max-w-xl truncate text-[11px] text-muted-foreground sm:text-xs">
                    {SUBTITLES[Math.min(step, 3)]}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleExit}
                className="gap-1.5"
              >
                <IconX className="size-3.5" strokeWidth={1.85} />
                Exit
              </Button>
            </div>

            {/* Row 2 — the stepper rail */}
            <div className="border-t border-border/30 pt-4">
              <SetupStepper steps={STEPS} current={step} counts={counts} />
            </div>
          </div>
        </div>
      </Reveal>

      {/* ============ Step body (fills the remaining height) ============ */}
      {isFinished ? (
        <Reveal duration={450} className="flex min-h-0 flex-1">
          <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-y-auto py-4">
            <SetupSuccess farm={farm} zones={zones} crops={crops} />
          </div>
        </Reveal>
      ) : (
        <Reveal
          key={step}
          delay={80}
          duration={450}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="glass-card texture-paper highlight-edge flex min-h-0 flex-1 flex-col rounded-2xl p-4 sm:p-5">
            {/* Scrollable form region — deliberately NOT a flex column:
                as a flex item the form would shrink back to the
                wrapper's height and overflow onto its own footer. In
                block flow + h-auto the form takes its natural content
                height and the region scrolls. */}
            <div className="min-h-0 flex-1 [&_form]:lg:h-auto lg:overflow-y-auto lg:pr-1">
              {step === 0 && (
                <FarmStep
                  onDone={(created) => {
                    setFarm(created);
                    setStep(1);
                  }}
                  onExit={handleExit}
                />
              )}

              {step === 1 && farm && (
                <FieldsStep
                  farm={farm}
                  createdKey={zones.length}
                  onSubmit={handleCreateZone}
                  submitting={creatingZone}
                  onExit={handleExit}
                  formRef={zoneFormRef}
                  hideFooter
                />
              )}

              {step === 2 && farm && (
                <CropsStep
                  farm={farm}
                  zones={zones}
                  createdKey={crops.length}
                  onSubmit={handleCreateCrop}
                  submitting={creatingCrop}
                  onExit={handleExit}
                  formRef={cropFormRef}
                  hideFooter
                />
              )}
            </div>

            {/* Pinned footer — created chips + Add + step navigation,
                merged into one bar (forms' own footers are hidden). */}
            {step > 0 && (
              <SetupFooter
                items={step === 1 ? zones : crops}
                formRef={step === 1 ? zoneFormRef : cropFormRef}
                submitLabel={step === 1 ? "Add field" : "Add crop"}
                submitting={step === 1 ? creatingZone : creatingCrop}
                onBack={step === 2 ? () => setStep(1) : undefined}
                onContinue={() => setStep(step + 1)}
                continueNoun={step === 1 ? "crops" : "finish"}
              />
            )}
          </div>
        </Reveal>
      )}
    </div>
  );
};

/** All three manage permissions are needed for the wizard. */
const canSetup = (farms, fields, crops) => farms && fields && crops;

export default FarmSetup;
