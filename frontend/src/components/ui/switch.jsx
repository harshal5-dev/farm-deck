import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@/lib/utils";

/**
 * Switch — themed toggle built on @base-ui/react's Switch. Renders a
 * leaf-tinted thumb on the leaf track so it sits natively next to
 * the rest of the form inputs.
 */
const Switch = ({ className, ...props }) => (
  <SwitchPrimitive.Root
    className={cn(
      "group/switch relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-colors duration-200 outline-none",
      "bg-muted-foreground/25 data-checked:bg-leaf data-disabled:cursor-not-allowed data-disabled:opacity-50",
      "focus-visible:ring-2 focus-visible:ring-leaf/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        "pointer-events-none block size-4 rounded-full bg-white shadow ring-0 transition-transform",
        "translate-x-0.5 data-checked:translate-x-[18px]"
      )}
    />
  </SwitchPrimitive.Root>
);

export default Switch;