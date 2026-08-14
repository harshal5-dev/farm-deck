import { getRole } from "@/constants/roles";
import { cn } from "@/lib/utils";
import { IconCheck } from "@tabler/icons-react";


const ROLE_TAGLINE = {
  owner: "Full access",
  manager: "Operations lead",
  grower: "Day-to-day field work",
  viewer: "Read-only",
};

const RoleCard = ({ roleId, selected, onSelect, disabled }) => {
  const r = getRole(roleId);
  const Icon = r.icon;
  const tagline = ROLE_TAGLINE[roleId];
  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect(roleId)}
      disabled={disabled}
      className={cn(
        "group/role relative flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all duration-200",
        selected
          ? cn("border-transparent shadow-sm", r.bg, r.ring, "ring-2")
          : "border-border/50 bg-card/40 hover:border-border hover:bg-card/70"
      )}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ring-white/10 transition-transform duration-300 group-hover/role:scale-110 dark:ring-white/5",
          selected
            ? cn("bg-linear-to-br text-white shadow-sm", r.gradient)
            : cn(r.bg, r.text)
        )}
      >
        <Icon className="size-4" strokeWidth={1.85} />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-semibold tracking-tight",
            selected ? r.text : "text-foreground"
          )}
        >
          {r.label}
        </p>
        <p className="truncate text-[10px] text-muted-foreground">{tagline}</p>
      </div>
      {selected && (
        <span
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-full text-white shadow-sm",
            `bg-linear-to-br ${r.gradient}`
          )}
        >
          <IconCheck className="size-2.5" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

export default RoleCard;
