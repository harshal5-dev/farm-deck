import { cn } from "@/lib/utils";
import { IconChevronRight } from "@tabler/icons-react";
import { tenantPreview } from "../../constants";

const TenantList = () => {
  return (
    <div className="rounded-xl bg-background/55 p-2 ring-1 ring-foreground/5">
      <div className="flex items-center justify-between px-2 py-1.5 text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
        <span>Workspaces</span>
        <span className="font-mono">3 active</span>
      </div>
      <ul className="space-y-1">
        {tenantPreview.map((t) => (
          <li
            key={t.subdomain}
            className="flex items-center gap-2.5 rounded-lg bg-card/60 px-2.5 py-1.5 transition-colors hover:bg-card"
          >
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-md text-[10px] font-bold",
                t.tone
              )}
            >
              {t.name.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold tracking-tight">
                {t.name}
              </p>
              <p className="font-mono text-[9px] text-muted-foreground">
                {t.subdomain}.farmdeck.app
              </p>
            </div>
            <div className="hidden text-right sm:block">
              <p className="font-mono text-[10px] font-semibold tabular-nums">
                {t.farms} · {t.fields}
              </p>
              <p className="text-[8px] tracking-wider text-muted-foreground uppercase">
                farms · fields
              </p>
            </div>
            <IconChevronRight
              className="size-3.5 shrink-0 text-muted-foreground/40"
              strokeWidth={1.85}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TenantList;
