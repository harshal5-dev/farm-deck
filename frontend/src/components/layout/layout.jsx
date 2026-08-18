import { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  IconLayoutDashboard,
  IconUsers,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Header from "@/components/layout/header/Header";
import BackgroundDecor from "./BackgroundDecor";
import DesktopSidebar from "./desktop-sidebar/DesktopSidebar";
import MobileSidebar from "./mobile-sidebar/MobileSidebar";
import { useGetProfileQuery } from "@/features/profile";

import { FullPageLoader, FullPageError } from "@/components/feedback";
import { normalizeError } from "@/lib/api-errors";

/**
 * Sidebar navigation — three sections:
 *   1. Overview (Dashboard)
 *   2. Farming (Farms)
 *   3. Team (Members)
 *
 * Members shows a small "pending invites" count chip when collapsed or
 * expanded, so the workspace owner always sees pending work at a glance.
 */
const navGroups = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/app",
        icon: IconLayoutDashboard,
        end: true,
      },
    ],
  },
  {
    label: "Team",
    items: [
      {
        label: "Members",
        href: "/app/members",
        icon: IconUsers,
      },
    ],
  },
];

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [retrying, setRetrying] = useState(false);

  const location = useLocation();
  const { isLoading, isError, error, refetch, data: user } = useGetProfileQuery();

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

  const handleRetry = useCallback(async () => {
    setRetrying(true);
    try {
      await refetch();
    } finally {
      setTimeout(() => setRetrying(false), 400);
    }
  }, [refetch]);

  // While the profile is being fetched, show the themed full-page loader so the
  // app shell (sidebar + header) only paints once we know who the user is.
  if (isLoading) {
    return <FullPageLoader message="Loading your workspace…" caption="Bootstrapping" />;
  }

  // If the profile fetch fails, decide whether it's a session problem (redirect
  // to /login) or a generic failure (show themed full-page error with retry).
  if (isError) {
    const norm = normalizeError(error, { entity: "workspace" });

    if (norm?.isAuthError) {
      setTimeout(() => {
        window.location.assign(
          `/login?from=${encodeURIComponent(location.pathname)}`
        );
      }, 0);
      return <FullPageLoader message="Session expired — signing you in…" />;
    }

    return (
      <FullPageError
        title={norm?.title}
        message={norm?.message}
        onRetry={handleRetry}
        retrying={retrying}
      />
    );
  }

  return (
    <div className="relative flex min-h-svh bg-background">
      <BackgroundDecor />
      <DesktopSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        navGroups={navGroups}
      />
      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} navGroups={navGroups} />
      <main
        className={cn(
          "relative flex flex-1 flex-col transition-all duration-300",
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
}

export default Layout;
