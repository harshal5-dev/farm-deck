import { useId } from "react";
import { IconLock } from "@tabler/icons-react";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import FieldWrapper from "@/components/ui/field-wrapper";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

/** Uppercase tracking label style — matches the form labels app-wide. */
const fieldLabel =
  "text-xs font-semibold tracking-wide text-muted-foreground uppercase";

/**
 * LockedField — a read-only, disabled input with a lock affordance and
 * optional hint tooltip. Rendered with the same FieldWrapper look as editable
 * inputs (leading icon + lock trailing) so locked and editable fields sit
 * side by side consistently. Use it for values the user cannot edit directly
 * (e.g. system-assigned IDs, role, email managed elsewhere).
 *
 * Props:
 *  - icon:   optional leading icon component (shown inside the field)
 *  - label:  field label text
 *  - value:  the read-only value to display
 *  - hint:   optional helper text under the field + tooltip body
 *            (defaults to "This field is locked")
 *  - id:     optional id; one is generated if omitted
 */
export default function LockedField({ icon: Icon, label, value, hint, id }) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  const Leading = Icon || IconLock;
  return (
    <Field>
      <FieldLabel htmlFor={fieldId} className={fieldLabel}>
        {label}
      </FieldLabel>
      <FieldWrapper
        icon={Leading}
        trailing={
          <Tooltip>
            <TooltipTrigger className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground">
              <IconLock className="size-3.5" strokeWidth={1.85} />
            </TooltipTrigger>
            <TooltipContent>{hint || "This field is locked"}</TooltipContent>
          </Tooltip>
        }
      >
        <Input
          id={fieldId}
          value={value || ""}
          readOnly
          disabled
          className="h-10 cursor-not-allowed border-0 bg-transparent font-mono text-sm shadow-none opacity-90 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </FieldWrapper>
      {hint && (
        <FieldDescription className="text-[11px]">{hint}</FieldDescription>
      )}
    </Field>
  );
}
