import { Tabs as TabsPrimitive } from "@base-ui/react";

import { cn } from "@/lib/utils";

/**
 * Tabs — thin styled wrapper over @base-ui/react Tabs.
 *
 * A compact underline strip: the active tab is marked by an animated
 * leaf→sage gradient bar that slides in under the label. Inactive tabs
 * sit transparent on the page background and lift to foreground on hover.
 * base-ui marks the active tab with `data-active` and
 * `aria-selected="true"`.
 *
 *   <Tabs defaultValue="details">
 *     <TabsList>
 *       <TabsTrigger value="details" icon={IconUser}>Personal details</TabsTrigger>
 *     </TabsList>
 *     <TabsContent value="details">…</TabsContent>
 *   </Tabs>
 *
 * Notes on the trigger styling:
 *   - base-ui's Tab renders as `<button>`, and Tailwind's preflight applies
 *     `appearance: button` to all buttons — that re-applies the OS-native
 *     styling (the dark glossy background visible in some browsers).
 *     `appearance-none` strips that, and the `!` important prefix on the
 *     background utilities locks the colours in so they can't be overridden
 *     by UA stylesheets on hover/focus.
 *   - The active underline is a `::after` pseudo on the trigger itself, so
 *     `data-active:after:scale-x-100` animates it in when base-ui sets
 *     `data-active`. `after:origin-left` keeps the scale anchored at the
 *     left edge for a natural "wipe" entrance.
 */

function Tabs({ className, ...props }) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        // underline strip — a single hairline border carries the row,
        // the tabs sit transparent on the page background.
        "inline-flex h-auto w-fit items-center gap-0.5 border-b border-border/60",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, icon: Icon, children, ...props }) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        // `appearance-none` strips the OS-native button styling that
        // Tailwind's preflight re-applies via `appearance: button`.
        "appearance-none relative inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 text-[13px] font-medium outline-none transition-colors duration-200",
        // Inactive base — transparent, muted. The `!` prefix forces these
        // past any UA stylesheet rule for `background-color`.
        "bg-transparent! text-muted-foreground hover:bg-muted/50! hover:text-foreground!",
        // Active — foreground text + the gradient underline wipes in.
        "data-active:text-foreground! data-active:hover:text-foreground!",
        "aria-selected:text-foreground",
        "focus-visible:ring-[3px]! focus-visible:ring-ring/40! focus-visible:ring-offset-0",
        "disabled:pointer-events-none disabled:opacity-50",
        // Active underline indicator (leaf→sage gradient, scales in from left).
        "after:pointer-events-none after:absolute after:inset-x-1 after:bottom-[-1px] after:h-[2px] after:origin-left after:scale-x-0 after:rounded-full after:bg-linear-to-r after:from-leaf after:to-sage-deep after:transition-transform after:duration-300 after:ease-out data-active:after:scale-x-100",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="size-3.5 shrink-0" strokeWidth={1.85} />}
      {children}
    </TabsPrimitive.Tab>
  );
}

function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      // Keep panels mounted; base-ui toggles attributes on each during a switch:
      //   - inactive/never-shown  →  `hidden`            (display:none via [&[hidden]])
      //   - outgoing (exiting)    →  `data-ending-style` (we force display:none below)
      //   - incoming (entering)   →  animates in with fade-in + slide-up
      // Hiding the `data-ending-style` panel immediately is what prevents the
      // "flash of previous tab content" — otherwise the outgoing panel lingers
      // at display:block through the incoming panel's entrance animation.
      keepMounted
      className={cn(
        "animate-in fade-in slide-in-from-bottom-2 duration-300 outline-none [[hidden]]:hidden data-ending-style:hidden",
        className
      )}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
