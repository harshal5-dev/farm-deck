import { IconCheck, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

/**
 * Password strength UI — a 5-segment strength meter and a live requirements
 * checklist. Policy + scoring live in ./password-strength (pure helpers).
 */

export function PasswordStrengthMeter({ score, segments, tone }) {
  return (
    <div
      className="mt-1.5 flex gap-1.5"
      role="meter"
      aria-label="Password strength"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={4}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = i < segments;
        return (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              filled ? tone.fill : tone.bar
            )}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

const REQUIREMENTS = [
  { key: "length", label: "8–72 characters" },
  { key: "upper", label: "One uppercase letter" },
  { key: "lower", label: "One lowercase letter" },
  { key: "number", label: "One number" },
  { key: "symbol", label: "One special character" },
];

export function PasswordRequirementsList({ checks }) {
  return (
    <ul className="grid grid-cols-1 gap-1 rounded-xl border border-border/40 bg-card/40 p-3 text-[11px] sm:grid-cols-2">
      {REQUIREMENTS.map((req) => {
        const passed = checks[req.key];
        return (
          <li
            key={req.key}
            className={cn(
              "flex items-center gap-1.5 transition-colors",
              passed ? "text-leaf" : "text-muted-foreground/80"
            )}
          >
            <span
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full ring-1 transition-colors ring-inset",
                passed ? "bg-leaf/15 ring-leaf/40" : "bg-muted/40 ring-border"
              )}
              aria-hidden="true"
            >
              {passed ? (
                <IconCheck className="size-2.5" strokeWidth={3} />
              ) : (
                <IconX
                  className="size-2.5 text-muted-foreground/60"
                  strokeWidth={2.5}
                />
              )}
            </span>
            <span className="leading-none">{req.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
