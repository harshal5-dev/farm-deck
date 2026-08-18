import { DEFAULT_AVATAR_ID } from "@/components/avatars/avatars-data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { clearCredentials, useLogoutMutation } from "@/features/auth";
import { ProfileApi } from "@/features/profile";
import { checkIsOwner, cn } from "@/lib/utils";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import HeaderAvatar from "./HeaderAvatar";
import { IconBuildingWarehouse, IconChevronRight, IconCrown, IconLoader2, IconLogout, IconSparkles, IconUser } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import MenuIcon from "./MenuIcon";

function displayRole(role) {
  if (!role) return "Member";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

const UserMenu = ({ user }) => {
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = user || {};
  const avatarId = currentUser.profilePicture || DEFAULT_AVATAR_ID;
  const workspaceName =
    currentUser.tenantName ||
    currentUser.tenantDetails?.name ||
    "Your workspace";
  const isOwner = checkIsOwner(currentUser.role);

  const goToProfile = () => {
    setMenuOpen(false);
    navigate("/app/profile");
  };

  const handleSignOut = async () => {
    setMenuOpen(false);
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
            className="group relative rounded-full transition-all hover:scale-105 active:scale-95"
            aria-label="Open account menu"
          />
        }
      >
        <div className="relative size-10 shrink-0">
          <HeaderAvatar
            id={avatarId}
            className="size-full shadow-sm transition-shadow group-hover:shadow-md group-hover:shadow-leaf/20"
          />
          <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full bg-leaf shadow-sm ring-2 ring-background">
            <span className="absolute inset-0.5 rounded-full bg-emerald-400" />
          </span>
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={12}
        className="glass-card texture-paper highlight-edge w-[20rem] overflow-hidden rounded-2xl p-0"
      >
        {/* ---------- Identity card ---------- */}
        <div className="relative overflow-hidden">
          {/* layered gradient + blobs */}
          <div className="absolute inset-0 bg-linear-to-br from-leaf/20 via-sage-deep/10 to-sky-warm/15" />
          <div className="absolute -top-12 -right-12 size-32 rounded-full bg-wheat/30 blur-2xl" />
          <div className="absolute -bottom-16 -left-10 size-36 rounded-full bg-sky-warm/25 blur-2xl" />
          <div className="pattern-contour absolute inset-0 opacity-50 mix-blend-soft-light" />

          <div className="relative flex items-center gap-3 px-4 pt-4 pb-3.5">
            <div className="relative shrink-0">
              <div className="absolute -inset-1 rounded-full bg-linear-to-br from-leaf/40 via-sky-warm/30 to-clay/30 opacity-70 blur-md" />
              <div className="relative rounded-full bg-background p-0.5 shadow-md ring-1 ring-foreground/5">
                <HeaderAvatar id={avatarId} className="size-12" />
                <span className="absolute right-0 bottom-0 flex size-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-background">
                  <span className="size-1.5 rounded-full bg-white" />
                </span>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold tracking-tight text-foreground">
                {currentUser.fullName || "Your name"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {currentUser.emailId}
              </p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ring-1 ring-inset",
                    isOwner
                      ? "bg-linear-to-br from-clay/20 to-clay/5 text-clay-deep ring-clay/30 dark:text-clay"
                      : "bg-leaf/10 text-leaf ring-leaf/20"
                  )}
                >
                  {isOwner ? (
                    <IconCrown className="size-2.5" strokeWidth={2.5} />
                  ) : (
                    <span className="size-1.5 rounded-full bg-current" />
                  )}
                  {displayRole(currentUser.role)}
                </span>
              </div>
            </div>
          </div>

          {/* Workspace chip — sits at the bottom of the identity block */}
          <div className="relative flex items-center gap-2 border-t border-foreground/5 bg-background/40 px-4 py-2 backdrop-blur">
            <IconBuildingWarehouse
              className="size-3.5 text-muted-foreground"
              strokeWidth={1.75}
            />
            <span className="truncate text-[11px] font-medium text-muted-foreground">
              {workspaceName}
            </span>
            {currentUser.tenantDetails?.subdomain && (
              <>
                <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground truncate">
                  {currentUser.tenantDetails.subdomain}
                </span>
              </>
            )}
          </div>
        </div>

        <Separator />

        {/* ---------- Actions ---------- */}
        <div className="space-y-0.5 p-1.5">
          <button
            onClick={goToProfile}
            className="group/menu relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-2.5 py-2.5 text-left transition-all duration-200 hover:bg-leaf/8"
          >
            <div className="absolute inset-y-1.5 left-0 w-0.5 origin-top scale-y-0 rounded-r-full bg-leaf transition-transform duration-200 group-hover/menu:scale-y-100" />
            <MenuIcon icon={IconUser} tone="leaf" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">Profile</p>
              <p className="text-[11px] text-muted-foreground">
                Manage your name, email & avatar
              </p>
            </div>
            <IconChevronRight
              className="size-4 text-muted-foreground/40 transition-all duration-200 group-hover/menu:translate-x-0.5 group-hover/menu:text-leaf"
              strokeWidth={1.85}
            />
          </button>

          <button
            disabled
            className="group/menu flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left opacity-50"
          >
            <MenuIcon icon={IconSparkles} tone="clay" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                What's new
              </p>
              <p className="text-[11px] text-muted-foreground">Coming soon</p>
            </div>
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
              Soon
            </span>
          </button>
        </div>

        <Separator />

        {/* ---------- Sign out ---------- */}
        <div className="p-1.5">
          <button
            onClick={handleSignOut}
            disabled={isLoggingOut}
            className="group/out flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-all duration-200 hover:bg-red-500/8 disabled:opacity-60"
          >
            <MenuIcon icon={IconLogout} tone="danger" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-red-500/90 transition-colors group-hover/out:text-red-500">
                {isLoggingOut ? "Signing out…" : "Sign out"}
              </p>
              <p className="text-[11px] text-muted-foreground">
                End your current session
              </p>
            </div>
            {isLoggingOut ? (
              <IconLoader2
                className="size-4 animate-spin text-red-500/60"
                strokeWidth={2}
              />
            ) : (
              <IconChevronRight
                className="size-4 text-muted-foreground/40 transition-all duration-200 group-hover/out:translate-x-0.5 group-hover/out:text-red-500"
                strokeWidth={1.85}
              />
            )}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default UserMenu;
