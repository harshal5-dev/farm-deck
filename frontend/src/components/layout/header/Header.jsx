import {

  IconMenu2,
} from "@tabler/icons-react";
import ThemeToggle from "@/theme/theme-toggle";
import Greeting from "./Greeting";
import UserMenu from "./UserMenu";


const Header = ({ onMenuClick, user }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 bg-background/70 px-4 shadow-[0_1px_0_0_rgb(0_0_0/0.04)] backdrop-blur-xl sm:px-6 dark:shadow-[0_1px_0_0_rgb(255_255_255/0.06)]">
      <button
        onClick={onMenuClick}
        className="flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-leaf/10 hover:text-leaf active:scale-95 lg:hidden"
        aria-label="Open menu"
      >
        <IconMenu2 className="size-5" strokeWidth={2} />
      </button>

      <Greeting user={user} />

      <div className="ml-auto flex items-center gap-1.5">
        <ThemeToggle variant="solid" />
        <UserMenu user={user} />
      </div>
    </header>
  );
}

export default Header;
