import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import NavItem from "./NavItem";

const NavList = ({ collapsed, onNavigate, navGroups }) => {
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
                  <NavItem item={item} collapsed index={idx} onNavigate={onNavigate} />
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ) : (
              <NavItem
                key={item.href}
                item={item}
                collapsed={false}
                index={idx}
                onNavigate={onNavigate}
              />
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export default NavList;
