import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

/**
 * NavItem — one sidebar entry. Used by NavList inside both the desktop
 * sidebar (collapsed tooltip mode + expanded) and the mobile drawer.
 *
 * Props (via `item`):
 *   - label / href / icon / end        standard NavLink data
 *   - badge                            small numeric chip next to the label
 *   - comingSoon                       route not built yet → render as a
 *                                       disabled, non-clickable row with
 *                                       a "Soon" chip
 */

// Inner JSX shared between the live NavLink branch and the disabled
// comingSoon branch so both render identically. Declared at module scope
// so React 19's compiler can preserve identity across renders.
function NavItemInner({ item, isActive, disabled, collapsed }) {
  const Icon = item.icon;
  return (
    <>
      {isActive && (
        <span className="absolute inset-0 rounded-xl bg-linear-to-br from-leaf to-sage-deep shadow-md shadow-leaf/30" />
      )}
      {!isActive && !disabled && (
        <span className="absolute inset-0 rounded-xl bg-leaf/0 opacity-0 transition-all duration-200 group-hover/nav:bg-leaf/10 group-hover/nav:opacity-100" />
      )}
      {!isActive && disabled && (
        <span className="absolute inset-0 rounded-xl bg-muted/40 opacity-60" />
      )}
      <Icon
        className={cn(
          "relative shrink-0 transition-transform duration-200",
          collapsed ? "size-4.75" : "size-4.5",
          !isActive && !disabled && "group-hover/nav:-translate-y-px group-hover/nav:scale-110",
          isActive && "drop-shadow-sm",
          disabled && "opacity-60"
        )}
        strokeWidth={1.85}
      />
      {!collapsed && (
        <>
          <span
            className={cn(
              "relative flex-1 truncate transition-transform duration-200",
              !disabled && "group-hover/nav:translate-x-0.5",
              disabled && "text-muted-foreground/70"
            )}
          >
            {item.label}
          </span>
          {!disabled && item.badge ? (
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
          {disabled ? (
            <span className="relative inline-flex h-5 items-center rounded-full bg-muted/60 px-1.5 text-[9px] font-semibold tracking-wide text-muted-foreground uppercase ring-1 ring-border/60">
              Soon
            </span>
          ) : null}
        </>
      )}
      {collapsed && !disabled && item.badge ? (
        <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-clay text-[9px] font-bold text-white shadow-sm ring-2 ring-sidebar">
          {item.badge}
        </span>
      ) : null}
    </>
  );
}

function navItemClassName({ isActive, disabled, collapsed } = {}) {
  return cn(
    "group/nav relative flex animate-in items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 fade-in slide-in-from-left-2",
    !disabled && !isActive && "hover:-translate-y-0.5",
    collapsed ? "h-10 w-10 justify-center" : "px-3 py-2",
    disabled && "cursor-not-allowed",
    isActive
      ? "text-primary-foreground"
      : disabled
        ? "text-muted-foreground/60"
        : "text-sidebar-accent-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm hover:shadow-leaf/10"
  );
}

const NavItem = ({ item, collapsed, index, onNavigate }) => {
  const end = item.end ?? item.href === "/app";
  const disabled = !!item.comingSoon;
  const animStyle = {
    animationDelay: `${index * 50}ms`,
    animationFillMode: "both",
  };

  if (disabled) {
    return (
      <div
        aria-disabled="true"
        title={`${item.label} — coming soon`}
        style={animStyle}
        className={navItemClassName({ disabled, collapsed })}
      >
        <NavItemInner
          item={item}
          isActive={false}
          disabled
          collapsed={collapsed}
        />
      </div>
    );
  }

  return (
    <NavLink
      to={item.href}
      end={end}
      viewTransition
      onClick={onNavigate}
      style={animStyle}
      className={({ isActive }) =>
        navItemClassName({ isActive, disabled, collapsed })
      }
    >
      {({ isActive }) => (
        <NavItemInner
          item={item}
          isActive={isActive}
          disabled={false}
          collapsed={collapsed}
        />
      )}
    </NavLink>
  );
};

export default NavItem;
