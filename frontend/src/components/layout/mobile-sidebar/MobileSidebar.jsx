import { cn } from "@/lib/utils";
import { useEffect } from "react";
import BrandLogo from "../BrandLogo";
import { IconX } from "@tabler/icons-react";
import NavList from "../nav-list/NavList";


const MobileSidebar = ({ open, onClose, navGroups }) => {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Dim overlay. `backdrop-blur` was removed: combined with the
          sidebar's transform-composited layer it was producing a blurry
          Mark logo on some mobile browsers. The semi-transparent bg
          alone is enough to dim the page content. */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-soil/50 transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-sidebar shadow-2xl transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="pattern-contour pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative flex flex-1 flex-col">
          <div className="flex h-16 items-center justify-between pr-3">
            <BrandLogo collapsed={false} />
            <button
              onClick={onClose}
              className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-foreground active:scale-95"
              aria-label="Close menu"
            >
              <IconX className="size-4" strokeWidth={2} />
            </button>
          </div>
          <div className="mx-3 h-px bg-linear-to-r from-transparent via-leaf/45 to-transparent" />
          {/* onNavigate closes the drawer when a link is tapped. */}
          <NavList collapsed={false} onNavigate={onClose} navGroups={navGroups} />
        </div>
      </aside>
    </>
  );
}

export default MobileSidebar;
