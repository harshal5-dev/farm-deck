import {
  IconSun,
  IconMoon,
  IconUser,
  IconSettings,
  IconLogout,
  IconBrandGithub,
  IconMenu2,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/theme";
import { useAuth, DEMO_USER } from "@/auth";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import FarmerAvatar from "@/components/effects/FarmerAvatar";

/** Single light/dark toggle — icon morphs based on current theme. */
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="group relative flex size-9 items-center justify-center overflow-hidden rounded-xl border border-border/50 bg-card/50 text-muted-foreground backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-leaf/40 hover:text-leaf hover:shadow-md hover:shadow-leaf/10 active:translate-y-0"
    >
      <IconSun
        className={cn(
          "absolute size-4 transition-all duration-300",
          isDark
            ? "scale-100 rotate-0 opacity-100"
            : "scale-0 -rotate-90 opacity-0"
        )}
        strokeWidth={1.85}
      />
      <IconMoon
        className={cn(
          "absolute size-4 transition-all duration-300",
          isDark
            ? "scale-0 rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100"
        )}
        strokeWidth={1.85}
      />
    </button>
  );
}

/** Theme toggle row used inside the user dropdown. */
function DropdownThemeRow() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center justify-between rounded-lg px-2.5 py-1.5">
      <div className="flex items-center gap-2.5">
        {isDark ? (
          <IconMoon
            className="size-4.5 text-muted-foreground"
            strokeWidth={1.85}
          />
        ) : (
          <IconSun
            className="size-4.5 text-muted-foreground"
            strokeWidth={1.85}
          />
        )}
        <span className="text-[15px] text-foreground/80">Theme</span>
      </div>
      <button
        role="switch"
        aria-checked={isDark}
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors duration-200",
          isDark ? "bg-leaf" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-all duration-200",
            isDark ? "left-4.5" : "left-0.5"
          )}
        />
      </button>
    </div>
  );
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
        <div className="relative flex items-center gap-3 overflow-hidden bg-linear-to-br from-leaf/15 via-sage/5 to-transparent px-4 py-3">
          <div className="relative size-12 shrink-0">
            <div className="size-full overflow-hidden rounded-full ring-2 ring-background">
              <FarmerAvatar className="size-full" />
            </div>
            <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full bg-leaf ring-2 ring-background" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold tracking-tight">
              {currentUser.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {currentUser.email}
            </p>
            <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-leaf/15 px-1.5 py-0.5 text-[10px] font-semibold text-leaf">
              <span className="size-1.5 rounded-full bg-leaf" />
              {currentUser.role}
            </span>
          </div>
        </div>

        <div className="p-1.5">
          <button className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[15px] text-foreground/80 transition-colors hover:bg-leaf/10 hover:text-leaf">
            <IconUser
              className="size-4.5 text-muted-foreground transition-colors group-hover:text-leaf"
              strokeWidth={1.85}
            />
            Profile
          </button>
          <button className="group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[15px] text-foreground/80 transition-colors hover:bg-leaf/10 hover:text-leaf">
            <IconSettings
              className="size-4.5 text-muted-foreground transition-colors group-hover:text-leaf"
              strokeWidth={1.85}
            />
            Settings
          </button>
          <DropdownThemeRow />
        </div>

        <Separator />

        <div className="p-1.5">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[15px] font-medium text-red-500/80 transition-colors hover:bg-red-500/10 hover:text-red-500"
          >
            <IconLogout className="size-4.5" strokeWidth={2} />
            Sign out
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-border/40 px-3 py-1">
          <span className="text-[10px] text-muted-foreground/50">
            HydroZen v1.0
          </span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground/30 transition-colors hover:text-muted-foreground"
          >
            <IconBrandGithub className="size-3" strokeWidth={1.85} />
          </a>
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

  const firstName = (user?.name || DEMO_USER.name).split(" ")[0];

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
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
