import { cn } from "@/lib/utils";

/**
 * Shared label affordances used by every form in the app
 * (farm, member, and profile forms).
 *
 * - RequiredStar — red asterisk appended to labels of required fields
 * - CharCount — live used/limit counter for length-capped text fields,
 *   turning amber within the last 10% of the budget
 * - RequiredLegend — the "* Required fields" footnote for form footers
 */

export const RequiredStar = () => (
  <span className="ml-0.5 text-destructive" aria-hidden="true">
    *
  </span>
);

export const CharCount = ({ value, max }) => {
  const len = (value || "").length;
  return (
    <span
      className={cn(
        "mr-2.5 text-[10px] font-medium tabular-nums",
        len > max * 0.9
          ? "text-amber-600 dark:text-amber-400"
          : "text-muted-foreground/70"
      )}
      aria-live="polite"
    >
      {len}/{max}
    </span>
  );
};

export const RequiredLegend = () => (
  <p className="mt-0.5 text-[10px] text-muted-foreground/60">
    <span className="text-destructive">*</span> Required fields
  </p>
);
