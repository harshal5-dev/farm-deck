import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

const NavItem = ({ item, collapsed, index, onNavigate }) => {
  const Icon = item.icon;
  const end = item.end ?? item.href === "/app";

  return (
    <NavLink
      to={item.href}
      end={end}
      viewTransition
      onClick={onNavigate}
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
              behind the icon/label without needing a negative z-index. */}
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
            <>
              <span className="relative flex-1 truncate transition-transform duration-200 group-hover/nav:translate-x-0.5">
                {item.label}
              </span>
              {item.badge ? (
                <span
                  className={cn(
                    "relative inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold tabular-nums",
                    isActive
                      ? "bg-white/20 text-primary-foreground ring-1 ring-white/20"
                      : "bg-clay/15 text-clay-deep ring-1 ring-clay/25 dark:text-clay"
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
            </>
          )}
          {collapsed && item.badge ? (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-clay text-[9px] font-bold text-white shadow-sm ring-2 ring-sidebar">
              {item.badge}
            </span>
          ) : null}
        </>
      )}
    </NavLink>
  );
}

export default NavItem;
