import { cn } from "@/lib/utils";


const MenuIcon = ({ icon: Icon, tone = "leaf" }) => {
  return (
    <div
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-white/10 transition-all duration-300 ring-inset dark:ring-white/5",
        tone === "leaf" && "bg-linear-to-br from-leaf/20 to-leaf/5 text-leaf",
        tone === "clay" &&
          "bg-linear-to-br from-clay/25 to-clay/5 text-clay-deep dark:text-clay",
        tone === "danger" &&
          "bg-linear-to-br from-red-500/20 to-red-500/5 text-red-500"
      )}
    >
      <Icon className="size-4" strokeWidth={1.85} />
    </div>
  );
}

export default MenuIcon;
