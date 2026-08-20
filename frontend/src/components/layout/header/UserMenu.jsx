import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  IconBuildingWarehouse,
  IconChevronRight,
  IconLoader2,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { DEFAULT_AVATAR_ID } from "@/components/avatars/avatars-data";
import { FarmScene } from "@/components/effects";
import { clearCredentials, useLogoutMutation } from "@/features/auth";
import { ProfileApi } from "@/features/profile";
import { getRole } from "@/constants/roles";
import { cn } from "@/lib/utils";
import HeaderAvatar from "./HeaderAvatar";
import MenuIcon from "./MenuIcon";

const stripFarmdeckSuffix = (s) =>
  (s || "").replace(/\.farmdeck\.app$/i, "");

const UserMenu = ({ user }) => {
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const u = user || {};
  const avatarId = u.profilePicture || DEFAULT_AVATAR_ID;
  const r = getRole(u.role);
  const RoleIcon = r.icon;
  const workspaceName =
    u.tenantName || u.tenantDetails?.name || "Your workspace";
  const cleanSubdomain = useMemo(
    () => stripFarmdeckSuffix(u.tenantDetails?.subdomain),
    [u.tenantDetails?.subdomain]
  );

  const close = () => setMenuOpen(false);

  const goToProfile = () => {
    close();
    navigate("/app/profile");
  };

  const handleSignOut = async () => {
    close();
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      dispatch(ProfileApi.util.resetApiState());
      navigate("/login", { replace: true });
    } catch {
      toast.error("Couldn't reach the server", {
        description: "Please try again — your session is still active.",
      });
    }
  };

  return (
    <Popover open={menuOpen} onOpenChange={setMenuOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label="Open account menu"
            className="group relative flex size-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 hover:scale-[1.03] active:scale-95 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        }
      >
        {/* Role-tinted glow on hover */}
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute -inset-0.5 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-70 blur-md",
            r.bg
          )}
        />
        {/* Avatar with role-gradient ring — fills the button exactly */}
        <span
          className={cn(
            "absolute inset-0 overflow-hidden rounded-full bg-linear-to-br p-0.5 shadow-sm transition-shadow duration-300 group-hover:shadow-md",
            r.gradient
          )}
        >
          <HeaderAvatar id={avatarId} className="size-full" />
        </span>
        {/* Active status dot — sits outside the button so the rounded
            corner doesn't clip it. The `bg-background` notch punches a
            visual gap through the avatar at the corner. */}
        <span className="absolute -right-1 -bottom-1 z-10 flex size-3.5 items-center justify-center rounded-full bg-background shadow-sm ring-2 ring-card">
          <span className="relative flex size-2.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
          </span>
        </span>
      </PopoverTrigger>

      {/* ============ Dropdown — glass card with theme-aligned identity ============ */}
      <PopoverContent
        align="end"
        sideOffset={10}
        className="glass-card texture-paper highlight-edge w-72 overflow-hidden rounded-2xl p-0"
      >
        {/* ---------- Hero band — FarmScene + role-tinted gradient ---------- */}
        <div className="relative h-20 overflow-hidden">
          <FarmScene className="size-full" />
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 bg-linear-to-br opacity-30",
              r.gradient
            )}
          />
          <div className="absolute inset-0 bg-linear-to-t from-card via-card/40 to-transparent" />
          {/* Top accent strip */}
          <div className="absolute inset-x-0 top-0 h-0.5 overflow-hidden">
            <div
              className={cn("absolute inset-0 bg-linear-to-r opacity-90", r.gradient)}
            />
          </div>
        </div>

        {/* ---------- Identity cluster (overlapping hero by -mt-7) ---------- */}
        <div className="relative px-4 pb-3">
          <div className="-mt-7 flex items-end gap-2.5">
            {/* Avatar with role ring + active dot */}
            <div className="relative shrink-0">
              <div
                aria-hidden
                className={cn(
                  "absolute -inset-1 rounded-full opacity-70 blur-md",
                  r.bg
                )}
              />
              <div
                className={cn(
                  "relative overflow-hidden rounded-full bg-linear-to-br p-0.5 shadow-md ring-2 ring-card",
                  r.gradient
                )}
              >
                <HeaderAvatar id={avatarId} className="size-12" />
              </div>
              <span className="absolute right-0 bottom-0 flex size-3 items-center justify-center rounded-full bg-card shadow-sm">
                <span className="relative flex size-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500 ring-2 ring-card" />
                </span>
              </span>
            </div>

            {/* Name + email + role pill */}
            <div className="min-w-0 flex-1 pb-1">
              <p className="truncate font-heading text-sm font-bold tracking-tight">
                {u.fullName || "Your name"}
              </p>
              <p className="truncate text-[11px] text-muted-foreground">
                {u.emailId || "name@yourfarm.com"}
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                {/* Role pill — same gradient chip as RolePill in members */}
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full bg-linear-to-br px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ring-1 ring-inset",
                    r.chip
                  )}
                >
                  <RoleIcon className="size-3" strokeWidth={2.2} />
                  {r.label}
                </span>
              </div>
            </div>
          </div>

          {/* Workspace chip — same bottom-row style as WorkspaceIdentityPreview */}
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-border/40 bg-muted/30 px-2.5 py-1.5 text-[11px]">
            <IconBuildingWarehouse
              className="size-3.5 shrink-0 text-muted-foreground"
              strokeWidth={1.75}
            />
            <span className="min-w-0 flex-1 truncate font-semibold tracking-tight text-foreground">
              {workspaceName}
            </span>
            {cleanSubdomain && (
              <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-leaf/12 px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-tight text-leaf lowercase">
                {cleanSubdomain}.farmdeck.app
              </span>
            )}
          </div>
        </div>

        <Separator />

        {/* ---------- Actions ---------- */}
        <div className="p-1">
          <button
            type="button"
            onClick={goToProfile}
            className="group/menu relative flex w-full items-center gap-2.5 overflow-hidden rounded-lg px-2 py-2 text-left transition-all duration-200 hover:bg-leaf/8"
          >
            <div className="absolute inset-y-1 left-0 w-0.5 origin-top scale-y-0 rounded-r-full bg-leaf transition-transform duration-200 group-hover/menu:scale-y-100" />
            <MenuIcon icon={IconUser} tone="leaf" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">Profile</p>
              <p className="text-[10px] text-muted-foreground">
                Name, email & avatar
              </p>
            </div>
            <IconChevronRight
              className="size-3.5 text-muted-foreground/40 transition-all duration-200 group-hover/menu:translate-x-0.5 group-hover/menu:text-leaf"
              strokeWidth={1.85}
            />
          </button>
        </div>

        <Separator />

        {/* ---------- Sign out ---------- */}
        <div className="p-1">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="group/out flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-all duration-200 hover:bg-red-500/8 disabled:opacity-60"
          >
            <MenuIcon icon={IconLogout} tone="danger" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-red-500/90 transition-colors group-hover/out:text-red-500">
                {isLoggingOut ? "Signing out…" : "Sign out"}
              </p>
              <p className="text-[10px] text-muted-foreground">
                End your current session
              </p>
            </div>
            {isLoggingOut ? (
              <IconLoader2
                className="size-3.5 animate-spin text-red-500/60"
                strokeWidth={2}
              />
            ) : (
              <IconChevronRight
                className="size-3.5 text-muted-foreground/40 transition-all duration-200 group-hover/out:translate-x-0.5 group-hover/out:text-red-500"
                strokeWidth={1.85}
              />
            )}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserMenu;
