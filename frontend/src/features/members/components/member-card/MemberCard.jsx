import { IconCalendar, IconClock } from "@tabler/icons-react";
import { Reveal } from "@/components/effects";
import { cn } from "@/lib/utils";
import { getRole } from "@/constants/roles";
import { formatDate, formatRelative } from "../../lib/format";
import { RolePill, StatusPill } from "../pills";
import { MemberAvatar } from "./MemberAvatar";
import { MemberActionMenu } from "./MemberActionMenu";

function MetaItem({ icon: Icon, label, value, tone }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <Icon
        className={cn(
          "size-3.5 shrink-0",
          tone === "pending" ? "text-amber-500" : "text-muted-foreground/70"
        )}
        strokeWidth={1.75}
      />
      <div className="min-w-0">
        <p className="text-[9px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
          {label}
        </p>
        <p
          className={cn(
            "truncate text-xs font-semibold tabular-nums",
            tone === "pending" && "text-amber-700 not-italic dark:text-amber-400"
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/**
 * MemberCard — the redesigned (bolder) card: a subtle role-tinted surface, a
 * centered avatar headline with name + role/status pills, then condensed
 * icon-led meta and a one-line role summary.
 */
export function MemberCard({
  member,
  currentUserId,
  index,
  isOwner,
  onSuspend,
  onReinvite,
  onEdit,
}) {
  const r = getRole(member.role);
  const RoleIcon = r.icon;
  const isSelf = member.id === currentUserId;
  const isInvited = member.status === "invited";

  return (
    <Reveal delay={Math.min(index * 50, 400)} duration={500} changeKey={member.id}>
      <div className="group/member glass-card highlight-edge relative overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-leaf/15">
        {/* Soft role-tinted glow fading from the top — keeps the glass clean below */}
        <div
          className={cn(
            r.gradient,
            "pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b to-transparent opacity-50"
          )}
        />
        {/* Refined role hairline */}
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-70",
            r.gradient
          )}
        />
        {/* Hover glow in the role's colour */}
        <div
          className={cn(
            "pointer-events-none absolute -top-12 -right-12 size-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover/member:opacity-60",
            r.bg
          )}
        />

        {/* Action menu pinned to the top-right */}
        <div className="absolute top-3 right-3 z-10">
          <MemberActionMenu
            member={member}
            currentUserId={currentUserId}
            isOwner={isOwner}
            onSuspend={onSuspend}
            onReinvite={onReinvite}
            onEdit={onEdit}
          />
        </div>

        {/* Centered avatar headline */}
        <div className="relative flex flex-col items-center pt-1.5 text-center">
          <MemberAvatar member={member} size="2xl" />
          <div className="mt-3 flex items-center justify-center gap-1.5">
            <h3 className="truncate font-heading text-base font-bold tracking-tight">
              {member.fullName}
            </h3>
            {isSelf && (
              <span className="rounded-md bg-clay/15 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-clay-deep uppercase dark:text-clay">
                You
              </span>
            )}
          </div>
          <p className="mt-0.5 w-full truncate text-xs text-muted-foreground">
            {member.emailId}
          </p>
          <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5">
            <RolePill role={member.role} />
            <StatusPill status={member.status} />
          </div>
        </div>

        {/* Condensed icon-led meta */}
        <div className="relative mt-4 grid grid-cols-2 gap-2 border-t border-border/30 pt-3">
          <MetaItem
            icon={IconCalendar}
            label={isInvited ? "Invited" : "Joined"}
            value={formatDate(member.joinedAt)}
          />
          <MetaItem
            icon={IconClock}
            label={isInvited ? "Status" : "Last active"}
            value={isInvited ? "Pending" : formatRelative(member.lastActive)}
            tone={isInvited ? "pending" : undefined}
          />
        </div>

        {/* Role summary */}
        <div className="relative mt-3 flex items-center gap-1.5 border-t border-border/30 pt-3 text-[11px] text-muted-foreground">
          <RoleIcon
            className={cn("size-3.5 shrink-0", r.text)}
            strokeWidth={1.85}
          />
          <span className="truncate">{r.description}</span>
        </div>
      </div>
    </Reveal>
  );
}
