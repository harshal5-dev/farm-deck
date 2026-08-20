import { Tabs as TabsPrimitive } from "@base-ui/react";

import { cn } from "@/lib/utils";

/**
 * Tabs — thin styled wrapper over @base-ui/react Tabs.
 *
 * A segmented pill strip. The active tab uses the app's leaf-gradient active
 * language (matching the sidebar nav). base-ui marks the active tab with
 * `data-active` and `aria-selected="true"`.
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
 */

function Tabs({ className, ...props }) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-5", className)}
      {...props}
    />
  );
}

function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        // inline segmented control — sits on the page background, not full-width
        "inline-flex h-auto w-fit flex-wrap items-center gap-1 rounded-2xl border border-border/60 bg-card/60 p-1 shadow-sm backdrop-blur",
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
        // Tailwind's preflight re-applies via `appearance: button`. Without
        // this, `<button>` elements can render with a dark glossy background
        // on hover/focus in some browsers.
        "appearance-none relative inline-flex h-9 items-center gap-1.5 rounded-xl px-3.5 text-sm font-medium whitespace-nowrap outline-none transition-all duration-200",
        // Inactive base — transparent background, muted text. The `!` prefix
        // is a Tailwind important modifier — it forces these to beat any
        // UA stylesheet rule for `background-color`.
        "bg-transparent! text-muted-foreground hover:bg-muted/70! hover:text-foreground!",
        // Active — solid leaf gradient. base-ui sets `data-active=""` on the
        // selected tab. `!` so it overrides the hover background even when
        // both apply.
        "data-active:bg-linear-to-br! data-active:from-leaf! data-active:to-sage-deep! data-active:text-primary-foreground! data-active:shadow-md data-active:shadow-leaf/30",
        "data-active:hover:brightness-105",
        "aria-selected:text-foreground",
        "focus-visible:ring-[3px]! focus-visible:ring-ring/50!",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {Icon && <Icon className="size-4 shrink-0" strokeWidth={1.85} />}
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
