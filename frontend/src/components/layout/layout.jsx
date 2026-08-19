import { useState, useEffect, useCallback, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "@/features/auth";
import { NAV_GROUPS } from "@/constants/nav-config";
import { filterNavGroups } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header/Header";
import BackgroundDecor from "./BackgroundDecor";
import DesktopSidebar from "./desktop-sidebar/DesktopSidebar";
import MobileSidebar from "./mobile-sidebar/MobileSidebar";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = useSelector(selectUser);

  // Role-aware sidebar: drop nav items the current user can't see and
  // hide whole groups that end up empty. Memoized so the child sidebars
  // don't re-render unless the role or the static config changes.
  const navGroups = useMemo(
    () => filterNavGroups(NAV_GROUPS, user?.role),
    [user?.role]
  );

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
        navGroups={navGroups}
      />
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navGroups={navGroups}
      />
      <main
        className={cn(
          "relative flex flex-1 flex-col transition-[margin] duration-300",
          collapsed ? "lg:ml-19" : "lg:ml-65"
        )}
      >
        <Header onMenuClick={() => setMobileOpen(true)} user={user} />
        <div className="w-full px-4 py-5 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
