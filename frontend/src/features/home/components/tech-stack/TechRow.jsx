import { cn } from "@/lib/utils";


const TechRow = ({ item, index }) => {
  const Icon = item.icon;
  return (
    <li
      className={cn(
        "group flex items-center gap-3 rounded-xl border border-transparent bg-background/40 px-3 py-2.5 transition-all duration-200",
        "hover:border-leaf/20 hover:bg-card hover:shadow-sm hover:shadow-leaf/5"
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-leaf/10 text-leaf ring-1 ring-leaf/15 transition-transform group-hover:scale-105">
        <Icon className="size-4.5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold tracking-tight">{item.name}</p>
        <p className="truncate text-[11px] text-muted-foreground">
          {item.role}
        </p>
      </div>
      <span className="font-mono text-[10px] text-muted-foreground/40">
        {String(index).padStart(2, "0")}
      </span>
    </li>
  );
}

export default TechRow;
