import { Avatar } from "@/components/avatars/avatars";
import { DEFAULT_AVATAR_ID } from "@/components/avatars/avatars-data";
import { getRole } from "@/constants/roles";
import { cn } from "@/lib/utils";

const ProfileIdentityPreview = ({ fullName, email, role, avatarId }) => {
  const safeRole = role || "viewer";
  const r = getRole(safeRole);
  const RoleIcon = r.icon;
  const displayName = (fullName || "").trim() || "Your name";
  const displayEmail = (email || "").trim() || "name@yourfarm.com";
  const avatar = avatarId || DEFAULT_AVATAR_ID;

  return (
    <div className="relative flex w-full min-w-0 flex-col items-center justify-center overflow-hidden rounded-2xl border border-border/40 bg-card/40 p-5 shadow-sm backdrop-blur lg:h-full">
      {/* Soft tinted glow */}
      <div
        className={cn(
          "pointer-events-none absolute -top-12 -right-12 size-40 rounded-full opacity-60 blur-3xl",
          r.bg
        )}
      />
      <div className="pointer-events-none absolute -bottom-16 -left-10 size-36 rounded-full bg-sky-warm/15 blur-3xl" />

      <div className="relative flex w-full min-w-0 flex-col items-center text-center">
        <p className="mb-3 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
          Preview
        </p>

        <div className="relative shrink-0">
          <div
            className={cn(
              "absolute -inset-2 rounded-full opacity-70 blur-md",
              r.bg
            )}
          />
          <div
            className={cn(
              "relative overflow-hidden rounded-full bg-background p-0.5 shadow-md ring-2",
              r.ring
            )}
          >
            <Avatar id={avatar} className="size-20" />
          </div>
          <span
            className={cn(
              "absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full bg-linear-to-br text-white shadow-md ring-2 ring-background",
              r.gradient
            )}
          >
            <RoleIcon className="size-3.5" strokeWidth={2} />
          </span>
        </div>

        <h3 className="mt-3 line-clamp-2 w-full max-w-full font-heading text-base font-bold tracking-tight wrap-break-word">
          {displayName}
        </h3>
        <p className="mt-0.5 w-full max-w-full truncate text-xs text-muted-foreground">
          {displayEmail}
        </p>

        <span
          className={cn(
            "mt-3 inline-flex items-center gap-1 rounded-full bg-linear-to-br px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ring-1 ring-inset",
            r.chip
          )}
        >
          <RoleIcon className="size-3" strokeWidth={2.2} />
          {r.label}
        </span>

        <p className="mt-4 max-w-full text-[11px] leading-relaxed text-muted-foreground/80">
          This is how your profile looks to teammates across the workspace.
        </p>
      </div>
    </div>
  );
};

export default ProfileIdentityPreview;
