import { useState, useEffect, useCallback } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  IconLayoutDashboard,
  IconPlant,
  IconChartDots,
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconTractor,
  IconSeedling,
  IconLeaf,
  IconBasket,
  IconShovel,
  IconBuildingWarehouse,
  IconDroplet,
  IconUserCircle,
  IconBuilding,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import Logo from "@/components/layout/Logo";

/** Sidebar navigation, grouped into labeled sections. */
const navGroups = [
  {
    label: "Grow",
    items: [
      { label: "Dashboard", href: "/app", icon: IconLayoutDashboard },
      { label: "Farms", href: "/app/farms", icon: IconPlant },
      { label: "Fields", href: "/app/fields", icon: IconChartDots },
    ],
  },
  {
    label: "Cultivate",
    items: [
      { label: "Crops", href: "/app/crops", icon: IconSeedling },
      { label: "Harvest", href: "/app/harvest", icon: IconBasket },
    ],
  },
  {
    label: "Resources",
    items: [
      {
        label: "Farm Types",
        href: "/app/farm-types",
        icon: IconBuildingWarehouse,
      },
      { label: "Soil Types", href: "/app/soil-types", icon: IconShovel },
      { label: "Grow Systems", href: "/app/system-types", icon: IconDroplet },
      {
        label: "Crop Categories",
        href: "/app/crop-categories",
        icon: IconLeaf,
      },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Profile", href: "/app/profile", icon: IconUserCircle },
      { label: "Company", href: "/app/tenant", icon: IconBuilding },
    ],
  },
];

function NavItem({ item, collapsed, index }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.href}
      // Dashboard (index route /app) must only match exactly — otherwise every
      // /app/* route also marks it active. All other links use prefix matching
      // so e.g. /app/farms stays active on /app/farms/:id.
      end={item.href === "/app"}
      viewTransition
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
      className={({ isActive }) =>
        cn(
          "group/nav relative flex animate-in items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 fade-in slide-in-from-left-2 hover:-translate-y-0.5",
          collapsed ? "h-10 w-10 justify-center" : "px-3 py-2",
          isActive
            ? "text-primary-foreground"
            : "text-sidebar-accent-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm hover:shadow-leaf/10"
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Active pill — solid farm-green with depth. First child so it sits
              behind the icon/label without needing a negative z-index (which
              would push it behind the sidebar). */}
          {isActive && (
            <span className="absolute inset-0 rounded-xl bg-linear-to-br from-leaf to-sage-deep shadow-md shadow-leaf/30" />
          )}
          {/* Hover spotlight — soft glow behind inactive items */}
          {!isActive && (
            <span className="absolute inset-0 rounded-xl bg-leaf/0 opacity-0 transition-all duration-200 group-hover/nav:bg-leaf/10 group-hover/nav:opacity-100" />
          )}
          <Icon
            className={cn(
              "relative shrink-0 transition-transform duration-200",
              collapsed ? "size-4.75" : "size-4.5",
              !isActive &&
                "group-hover/nav:-translate-y-px group-hover/nav:scale-110",
              isActive && "drop-shadow-sm"
            )}
            strokeWidth={1.85}
          />
          {!collapsed && (
            <span className="relative truncate transition-transform duration-200 group-hover/nav:translate-x-0.5">
              {item.label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

function BrandLogo({ collapsed }) {
  return (
    <div
      className={cn(
        "flex h-16 items-center gap-3 overflow-hidden transition-all duration-300",
        collapsed ? "justify-center px-2" : "px-4"
      )}
    >
      {collapsed ? (
        <Logo variant="badge" className="size-9" withSubtitle={false} />
      ) : (
        <Logo variant="full" withSubtitle />
      )}
    </div>
  );
}

/** Compact "your harvest" stat panel shown at the bottom of the sidebar. */
function HarvestPanel({ collapsed }) {
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger render={<span />}>
          <div className="flex aspect-square w-full flex-col items-center justify-center rounded-xl bg-leaf/15 ring-1 ring-leaf/20 ring-inset">
            <IconLeaf className="size-5 text-leaf" strokeWidth={1.85} />
            <span className="mt-1 text-xs font-bold text-leaf">8</span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="right">8 crops growing</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-leaf/15 via-sage/10 to-transparent p-3.5 ring-1 ring-leaf/20 ring-inset">
      {/* decorative sprout */}
      <IconSeedling
        className="absolute -top-2 -right-2 size-14 text-leaf/15"
        strokeWidth={1.4}
      />
      <div className="relative">
        <div className="flex items-center gap-1.5">
          <IconLeaf className="size-3.5 text-leaf" strokeWidth={2} />
          <span className="text-[10px] font-bold tracking-wider text-leaf uppercase">
            Growing now
          </span>
        </div>
        <p className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">
          8{" "}
          <span className="text-sm font-medium text-muted-foreground">
            crops
          </span>
        </p>
        <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
          <IconTractor className="size-3" strokeWidth={1.85} />3 ready to
          harvest
        </div>
      </div>
    </div>
  );
}

/** Renders the grouped navigation with section labels + staggered entrance. */
function NavList({ collapsed }) {
  let runningIndex = 0;
  return (
    <nav className="flex flex-1 flex-col gap-4 p-3">
      {navGroups.map((group) => (
        <div key={group.label} className="space-y-1">
          {!collapsed && (
            <p className="animate-in px-3 pt-2 pb-0.5 text-[10px] font-semibold tracking-wider text-muted-foreground/50 uppercase fade-in slide-in-from-left-2">
              {group.label}
            </p>
          )}
          {group.items.map((item) => {
            const idx = runningIndex++;
            return collapsed ? (
              <Tooltip key={item.href}>
                <TooltipTrigger
                  render={<span className="flex justify-center" />}
                >
                  <NavItem item={item} collapsed index={idx} />
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ) : (
              <NavItem
                key={item.href}
                item={item}
                collapsed={false}
                index={idx}
              />
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function MobileSidebar({ open, onClose }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-soil/40 backdrop-blur-sm transition-all duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-70 flex-col bg-sidebar shadow-2xl transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="pattern-contour absolute inset-0 opacity-40" />
        <div className="relative flex flex-1 flex-col">
          <div className="flex h-16 items-center justify-between pr-3">
            <BrandLogo collapsed={false} />
            <button
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <IconX className="size-4" strokeWidth={2} />
            </button>
          </div>
          <Separator />
          <NavList collapsed={false} />
          <div className="p-3">
            <HarvestPanel collapsed={false} />
          </div>
        </div>
      </aside>
    </>
  );
}

function DesktopSidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 lg:flex",
        collapsed ? "w-19" : "w-65"
      )}
    >
      <div className="pattern-contour absolute inset-0 opacity-30" />
      <div className="relative flex flex-1 flex-col">
        <BrandLogo collapsed={collapsed} />
        <Separator />
        <NavList collapsed={collapsed} />
        <div className="p-3">
          <HarvestPanel collapsed={collapsed} />
        </div>
        <div className="border-t border-sidebar-border/60 p-2">
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
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}

function BackgroundDecor() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Soft sage glow — top right (sunlight on a field) */}
      <div className="absolute -top-48 -right-40 size-150 animate-glow-pulse rounded-full bg-sage/10 blur-[100px] dark:bg-sage/12" />
      {/* Clay/warm tint — bottom left */}
      <div className="absolute -bottom-48 -left-44 size-140 animate-glow-pulse rounded-full bg-clay/8 blur-[100px] [animation-delay:1.2s] dark:bg-clay-deep/10" />
      {/* Sky tint near center */}
      <div className="absolute right-1/4 bottom-1/4 size-95 rounded-full bg-sky-warm/8 blur-[90px] dark:bg-sky-warm/6" />
    </div>
  );
}

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleKeyDown = useCallback((e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "b") {
      e.preventDefault();
      setCollapsed((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="relative flex min-h-svh bg-background">
      <BackgroundDecor />
      <DesktopSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main
        className={cn(
          "relative flex flex-1 flex-col transition-all duration-300",
          collapsed ? "lg:ml-19" : "lg:ml-65"
        )}
      >
        <Header onMenuClick={() => setMobileOpen(true)} />
        <div className="w-full px-4 py-5 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
