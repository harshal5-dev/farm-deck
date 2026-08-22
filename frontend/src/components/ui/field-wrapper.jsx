import { cn } from "@/lib/utils";

/**
 * FieldWrapper — a shared, themed input affordance: a rounded bordered field
 * with a leading icon and an optional trailing slot (e.g. a "show password"
 * button). It focuses as a unit and turns red on error. Used by the auth
 * login form, the member user form, and the profile forms so input styling
 * stays consistent.
 *
 * @param {React.ElementType} icon        Leading Tabler icon component.
 * @param {React.ReactNode}   trailing    Optional trailing node.
 * @param {boolean}           hasError    Whether the field is in an error state.
 * @param {"center"|"start"}  align       Vertical alignment of the leading
 *                                        icon — "start" for multi-line
 *                                        controls (textareas).
 */
const FieldWrapper = ({
  icon: Icon,
  trailing,
  hasError,
  align = "center",
  children,
}) => {
  const start = align === "start";
  return (
    <div
      className={cn(
        "group/field relative flex gap-2 rounded-xl border bg-card/60 px-3 transition-[color,background-color,border-color,box-shadow]",
        "border-input ring-1 ring-transparent",
        "focus-within:border-leaf/60 focus-within:bg-card/80 focus-within:ring-leaf/30",
        hasError &&
          "border-destructive/60 ring-destructive/20 focus-within:border-destructive focus-within:ring-destructive/30",
        start ? "items-start py-1" : "items-center"
      )}
    >
      {Icon && (
        <Icon
          className={cn(
            "size-4 shrink-0 transition-colors",
            start && "mt-2",
            hasError ? "text-destructive" : "text-muted-foreground"
          )}
          strokeWidth={1.75}
        />
      )}
      <div className="min-w-0 flex-1">{children}</div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
};

export default FieldWrapper;
