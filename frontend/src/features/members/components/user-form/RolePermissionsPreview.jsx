import { getRole } from "@/constants/roles";
import { cn } from "@/lib/utils";
import { IconCircleCheckFilled } from "@tabler/icons-react";



const RolePermissionsPreview = ({ roleId }) => {
  const r = getRole(roleId);
  const RoleIcon = r.icon;
  return (
    <div
      className={cn(
        "mt-2 flex items-start gap-2 rounded-xl border p-2.5",
        r.border,
        r.bgSoft
      )}
    >
      <RoleIcon
        className={cn("mt-0.5 size-3.5 shrink-0", r.text)}
        strokeWidth={1.85}
      />
      <div className="min-w-0 flex-1">
        <p className={cn("text-[10px] font-semibold tracking-wide uppercase", r.text)}>
          {r.label} can:
        </p>
        <ul className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          {r.permissions.map((p) => (
            <li
              key={p}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"
            >
              <IconCircleCheckFilled
                className={cn("size-2.5 shrink-0", r.text)}
              />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default RolePermissionsPreview;
