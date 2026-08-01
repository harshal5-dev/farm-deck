import {
  IconUser,
  IconLogout,
  IconChevronRight,
  IconMenu2,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useAuth, DEMO_USER } from "@/auth";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import FarmerAvatar from "@/components/effects/FarmerAvatar";
import ThemeToggle from "@/components/theme/ThemeToggle";

/** Format a role like "owner" → "Owner". */
function displayRole(role) {
  if (!role) return "Member";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const currentUser = user || DEMO_USER;

  const handleSignOut = () => {
    logout();
    navigate("/login", { replace: true });
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
          <div className="size-full overflow-hidden rounded-full shadow-sm ring-2 ring-background transition-shadow group-hover:shadow-md group-hover:shadow-leaf/20 group-hover:ring-leaf/40">
            <FarmerAvatar className="size-full" />
          </div>
          {/* online status dot */}
          <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full bg-leaf ring-2 ring-background" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="w-64 overflow-hidden p-0"
      >
        {/* User identity header */}
        <div className="relative flex items-center gap-3 overflow-hidden bg-linear-to-br from-leaf/15 via-sage/5 to-transparent px-4 py-3.5">
          <div className="relative size-12 shrink-0">
            <div className="size-full overflow-hidden rounded-full ring-2 ring-background">
              <FarmerAvatar className="size-full" />
            </div>
            <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full bg-leaf ring-2 ring-background" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold tracking-tight">
              {currentUser.fullName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {currentUser.emailId}
            </p>
            <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-leaf/15 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-leaf uppercase">
              <span className="size-1.5 rounded-full bg-leaf" />
              {displayRole(currentUser.role)}
            </span>
          </div>
        </div>

        <Separator />

        {/* Actions — Profile + Sign out only */}
        <div className="p-1.5">
          <button
            onClick={() => navigate("/app/profile")}
            className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[15px] text-foreground/80 transition-colors hover:bg-leaf/10 hover:text-leaf"
          >
            <IconUser
              className="size-4.5 text-muted-foreground transition-colors group-hover:text-leaf"
              strokeWidth={1.85}
            />
            <span className="flex-1 text-left">Profile</span>
            <IconChevronRight
              className="size-4 text-muted-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:text-leaf"
              strokeWidth={1.85}
            />
          </button>
        </div>

        <Separator />

        <div className="p-1.5">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[15px] font-medium text-red-500/80 transition-colors hover:bg-red-500/10 hover:text-red-500"
          >
            <IconLogout className="size-4.5" strokeWidth={2} />
            Sign out
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

  const fullName = user?.fullName || DEMO_USER.fullName;
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
