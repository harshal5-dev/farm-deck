

import { cn } from "@/lib/utils";
import Logo from "./Logo";

const BrandLogo = ({ collapsed }) => {
  return (
    <div
      className={cn(
        "flex h-16 items-center gap-3 overflow-hidden transition-all duration-300",
        collapsed ? "justify-center px-2" : "px-4"
      )}
    >
      {collapsed ? (
        <Logo variant="badge" />
      ) : (
        <Logo variant="full" />
      )}
    </div>
  );
}

export default BrandLogo;
