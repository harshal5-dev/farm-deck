import { cn } from "@/lib/utils";
import { IconChevronLeft, IconChevronRight, IconCommand } from "@tabler/icons-react";
import BrandLogo from "../BrandLogo";
import NavList from "../nav-list/NavList";

const DesktopSidebar = ({ collapsed, onToggle, navGroups }) => {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden flex-col bg-sidebar transition-all duration-300 lg:flex",
        collapsed ? "w-19" : "w-65"
      )}
    >
      <div className="pattern-contour pointer-events-none absolute inset-0 opacity-30" />
      {/* Outer leaf-tinted glow — gives the sidebar a soft farm-green halo
          on its right edge, sitting on the page surface. */}
      <div className="pointer-events-none absolute inset-y-2 -right-3 w-3 bg-linear-to-b from-transparent via-leaf/20 to-transparent blur-md" />
      {/* Themed right edge — fades at top/bottom, peaks in leaf through
          sage-deep so the boundary reads clearly without a hard line. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-linear-to-b from-leaf/10 via-sage-deep/60 to-leaf/10" />
      <div className="relative flex flex-1 flex-col">
        <BrandLogo collapsed={collapsed} />
        <div className="mx-3 h-px bg-linear-to-r from-transparent via-leaf/45 to-transparent" />
        <NavList collapsed={collapsed} navGroups={navGroups} />
        <div className="p-2">
          <button
            onClick={onToggle}
            className="group flex h-9 w-full items-center justify-center gap-1.5 rounded-xl text-xs font-medium text-muted-foreground transition-colors duration-200 hover:bg-sidebar-accent hover:text-foreground"
          >
            {collapsed ? (
              <IconChevronRight
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                strokeWidth={1.85}
              />
            ) : (
              <>
                <IconChevronLeft
                  className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
                  strokeWidth={1.85}
                />
                Collapse
                <kbd className="ml-auto inline-flex h-5 items-center gap-0.5 rounded-md bg-background/60 px-1.5 font-mono text-[10px] text-muted-foreground ring-1 ring-inset ring-leaf/40">
                  <IconCommand className="size-2.5" strokeWidth={2.2} />
                  <span>B</span>
                </kbd>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}

export default DesktopSidebar;
