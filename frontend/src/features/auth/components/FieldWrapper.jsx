import { cn } from "@/lib/utils";

const FieldWrapper = ({ icon: Icon, trailing, hasError, children }) => {
  return (
    <div
      className={cn(
        "group/field relative flex items-center gap-2 rounded-xl border bg-card/60 px-3 transition-all",
        "border-input ring-1 ring-transparent",
        "focus-within:border-leaf/60 focus-within:ring-leaf/30 focus-within:bg-card/80",
        hasError &&
          "border-destructive/60 ring-destructive/20 focus-within:border-destructive focus-within:ring-destructive/30"
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0 transition-colors",
          hasError ? "text-destructive" : "text-muted-foreground"
        )}
        strokeWidth={1.75}
      />
      <div className="flex-1">{children}</div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
};

export default FieldWrapper;
