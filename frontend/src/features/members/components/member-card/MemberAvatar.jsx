import { cn } from "@/lib/utils";
import { Avatar } from "@/components/avatars/avatars";
import { DEFAULT_AVATAR_ID } from "@/components/avatars/avatars-data";
import { getRole } from "@/constants/roles";

const SIZES = {
  sm: "size-8",
  md: "size-10",
  lg: "size-14",
  xl: "size-16",
  "2xl": "size-20",
};

/** Member avatar wrapped in a role-tinted ring + glow, with an active dot. */
export function MemberAvatar({ member, size = "lg" }) {
  const avatarId = member.avatarId || DEFAULT_AVATAR_ID;
  const r = getRole(member.role);
  const px = SIZES[size] || SIZES.lg;
  return (
    <div className={cn("relative shrink-0", px)}>
      <div
        className={cn(
          "absolute -inset-0.5 rounded-full opacity-70 blur-md",
          r.bg
        )}
      />
      <div
        className={cn(
          "relative overflow-hidden rounded-full bg-background p-0.5 shadow-sm ring-2 ring-background",
          r.ring
        )}
      >
        <Avatar id={avatarId} className="size-full" />
      </div>
      {member.status === "active" && (
        <span className="absolute right-0 bottom-0 flex size-3.5 items-center justify-center rounded-full bg-background shadow-sm">
          <span className="relative flex size-2.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/50" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
          </span>
        </span>
      )}
    </div>
  );
}
