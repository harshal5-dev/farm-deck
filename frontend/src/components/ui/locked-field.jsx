import { useId } from "react";
import { IconLock } from "@tabler/icons-react";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

/**
 * LockedField — a read-only, disabled input with a lock affordance and
 * optional hint tooltip. Use it for values the user cannot edit directly
 * (e.g. system-assigned IDs, role, email managed elsewhere).
 *
 * Props:
 *  - icon:   optional leading icon component (shown in the label)
 *  - label:  field label text
 *  - value:  the read-only value to display
 *  - hint:   optional helper text under the field + tooltip body
 *            (defaults to "This field is locked")
 *  - id:     optional id; one is generated if omitted
 */
export default function LockedField({ icon: Icon, label, value, hint, id }) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  return (
    <Field>
      <FieldLabel
        htmlFor={fieldId}
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        {Icon && <Icon className="size-3.5" strokeWidth={1.75} />}
        {label}
      </FieldLabel>
      <div className="relative">
        <Input
          id={fieldId}
          value={value || ""}
          readOnly
          disabled
          className="cursor-not-allowed pr-9 font-mono text-sm opacity-90"
        />
        <Tooltip>
          <TooltipTrigger className="absolute top-1/2 right-2.5 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground">
            <IconLock className="size-3.5" strokeWidth={1.85} />
          </TooltipTrigger>
          <TooltipContent>{hint || "This field is locked"}</TooltipContent>
        </Tooltip>
      </div>
      {hint && (
        <FieldDescription className="text-[11px]">{hint}</FieldDescription>
      )}
    </Field>
  );
}
