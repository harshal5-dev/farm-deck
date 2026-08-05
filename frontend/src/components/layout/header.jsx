import {
  IconUser,
  IconLogout,
  IconChevronRight,
  IconMenu2,
  IconLoader2,
  IconBuildingWarehouse,
  IconCrown,
  IconSparkles,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/features/auth";
import { useLogoutMutation, clearCredentials } from "@/features/auth";
import { useDispatch } from "react-redux";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import FarmerAvatar from "@/components/effects/FarmerAvatar";
import {
  Avatar as ChosenAvatar,
  DEFAULT_AVATAR_ID,
} from "@/components/avatars/avatars";
import ThemeToggle from "@/theme/theme-toggle";
import { cn } from "@/lib/utils";

/** Format a role like "owner" → "Owner". */
function displayRole(role) {
  if (!role) return "Member";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

/** Renders the user's chosen avatar if they have one, else the default
 *  FarmerAvatar illustration. */
function HeaderAvatar({ id, className }) {
  if (id) {
    return <ChosenAvatar id={id} className={className} />;
  }
  return (
    <div
      className={
        "overflow-hidden rounded-full ring-2 ring-background " +
        (className || "")
      }
    >
      <FarmerAvatar className="size-full" />
    </div>
  );
}

/** Small icon chip used inside menu items. */
function MenuIcon({ icon: Icon, tone = "leaf" }) {
  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-white/10 transition-all duration-300 ring-inset dark:ring-white/5",
        tone === "leaf" && "bg-gradient-to-br from-leaf/20 to-leaf/5 text-leaf",
        tone === "clay" &&
          "bg-gradient-to-br from-clay/25 to-clay/5 text-clay-deep dark:text-clay",
        tone === "danger" &&
          "bg-gradient-to-br from-red-500/20 to-red-500/5 text-red-500"
      )}
    >
      <Icon className="size-4" strokeWidth={1.85} />
    </div>
  );
}

function UserMenu() {
  const { user } = useAuth();
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = user || {};
  const avatarId = currentUser.profilePicture || DEFAULT_AVATAR_ID;
  const workspaceName =
    currentUser.tenantName ||
    currentUser.tenantDetails?.name ||
    "Your workspace";
  const isOwner = (currentUser.role || "").toLowerCase() === "owner";

  const handleSignOut = async () => {
    dispatch(clearCredentials());
    navigate("/login", { replace: true });
    try {
      await logout().unwrap();
    } catch {
      toast.error("Couldn't reach the server", {
        description: "You've been signed out locally.",
      });
    }
  };

  return (
    <Popover>
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
          <div className="absolute inset-0 bg-gradient-to-br from-leaf/20 via-sage-deep/10 to-sky-warm/15" />
          <div className="absolute -top-12 -right-12 size-32 rounded-full bg-wheat/30 blur-2xl" />
          <div className="absolute -bottom-16 -left-10 size-36 rounded-full bg-sky-warm/25 blur-2xl" />
          <div className="pattern-contour absolute inset-0 opacity-50 mix-blend-soft-light" />

          <div className="relative flex items-center gap-3 px-4 pt-4 pb-3.5">
            <div className="relative shrink-0">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-leaf/40 via-sky-warm/30 to-clay/30 opacity-70 blur-md" />
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
                      ? "bg-gradient-to-br from-clay/20 to-clay/5 text-clay-deep ring-clay/30 dark:text-clay"
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
                <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
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
            onClick={() => navigate("/app/profile")}
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

function Greeting() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  let greeting = "Good evening";
  let emoji = "🌙";
  if (hour < 12) {
    greeting = "Good morning";
    emoji = "🌅";
  } else if (hour < 17) {
    greeting = "Good afternoon";
    emoji = "☀️";
  }

  const fullName = user?.fullName || "";
  const firstName = (fullName || "there").split(" ")[0];

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="hidden text-xl sm:block">{emoji}</span>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm font-semibold tracking-tight">
          {greeting},{" "}
          <span className="bg-linear-to-r from-leaf to-sage-deep bg-clip-text text-transparent">
            {firstName}
          </span>
        </p>
        <p className="hidden truncate text-[11px] text-muted-foreground sm:block">
          Here's what's growing today 🌱
        </p>
      </div>
    </div>
  );
}

export default function Header({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/40 bg-background/70 px-4 backdrop-blur-xl sm:px-6">
      <button
        onClick={onMenuClick}
        className="flex size-9 items-center justify-center rounded-xl border border-border/50 bg-card/50 text-muted-foreground transition-all hover:text-foreground active:scale-95 lg:hidden"
        aria-label="Open menu"
      >
        <IconMenu2 className="size-4" strokeWidth={2} />
      </button>

      <Greeting />

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle variant="solid" />
        <UserMenu />
      </div>
    </header>
  );
}
