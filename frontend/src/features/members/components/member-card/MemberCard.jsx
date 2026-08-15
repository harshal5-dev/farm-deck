import {
  IconCalendar,
  IconClock,
} from "@tabler/icons-react";
import { Reveal } from "@/components/effects";
import { cn } from "@/lib/utils";
import { getRole } from "@/constants/roles";
import { formatDate, formatRelative } from "../../lib/format";
import { RolePill, StatusPill } from "../pills";
import MemberAvatar from "./MemberAvatar";
import MemberActionMenu from "./MemberActionMenu";
import StatTile from "./StatTile";

const MemberCard = ({
  member,
  currentUserId,
  index,
  isOwner,
  onView,
  onDelete,
  onEdit,
}) => {
  const r = getRole(member.role);
  const RoleIcon = r.icon;
  const isSelf = member.id === currentUserId;
  const isInvited = member.status === "invited";

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onView?.();
    }
  };

  return (
    <Reveal delay={Math.min(index * 50, 400)} duration={500} changeKey={member.id}>
      <div
        role="button"
        tabIndex={0}
        aria-label={`View ${member.fullName}`}
        onClick={onView}
        onKeyDown={handleKeyDown}
        className="group/member glass-card texture-paper highlight-edge relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-leaf/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        {/* External role-tinted bloom on hover */}
        <div
          className={cn(
            "pointer-events-none absolute -inset-px -z-10 rounded-3xl opacity-0 blur-2xl transition-opacity duration-500 group-hover/member:opacity-100",
            r.bg
          )}
        />

        {/* Subtle role-tinted background wash */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-br opacity-[0.05] transition-opacity duration-500 group-hover/member:opacity-[0.1]",
            r.gradient
          )}
        />

        {/* Large role-icon watermark in the background corner */}
        <RoleIcon
          className="pointer-events-none absolute -right-8 -bottom-8 size-44 text-foreground/[0.035] transition-all duration-700 group-hover/member:scale-110 group-hover/member:rotate-6 group-hover/member:text-foreground/6"
          strokeWidth={1}
        />

        {/* Thin gradient accent strip at the top */}
        <div className="relative h-1 shrink-0 overflow-hidden">
          <div className={cn("absolute inset-0 bg-linear-to-r", r.gradient)} />
        </div>

        {/* Body */}
        <div className="relative flex flex-1 flex-col p-5">
          {/* Identity row: avatar left, name center, action menu right */}
          <div className="flex items-start gap-3">
            {/* Avatar with role gradient ring */}
            <div className="relative shrink-0">
              <div
                className={cn(
                  "absolute -inset-1 rounded-full opacity-70 blur-md",
                  r.bg
                )}
              />
              <div
                className={cn(
                  "relative rounded-full bg-linear-to-br p-0.5 shadow-md ring-2 ring-card",
                  r.gradient
                )}
              >
                <MemberAvatar member={member} size="lg" />
              </div>
            </div>

            {/* Name + email + pills — on the right of the avatar */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                <h3 className="min-w-0 wrap-break-word font-heading text-sm font-bold tracking-tight">
                  {member.fullName}
                </h3>
                {isSelf && (
                  <span className="shrink-0 rounded-md bg-clay/15 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-clay-deep uppercase dark:text-clay">
                    You
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                {member.emailId}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <RolePill role={member.role} size="xs" />
                <StatusPill status={member.status} />
              </div>
            </div>

            {/* Action menu on the far right — stops propagation so it doesn't open the dialog */}
            <div
              className="shrink-0"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <MemberActionMenu
                member={member}
                currentUserId={currentUserId}
                isOwner={isOwner}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            </div>
          </div>

          {/* Stat tiles */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <StatTile
              icon={IconCalendar}
              label={isInvited ? "Invited" : "Joined"}
              value={formatDate(member.createdAt)}
            />
            <StatTile
              icon={IconClock}
              label={isInvited ? "Status" : "Last active"}
              value={isInvited ? "Pending" : formatRelative(member.lastActiveAt)}
              accent={isInvited ? "amber" : "leaf"}
            />
          </div>

          {/* Footer — role description only (card itself is clickable) */}
          <div className="mt-auto flex items-center gap-1.5 border-t border-border/30 pt-3 text-[11px] text-muted-foreground">
            <RoleIcon
              className={cn("size-3.5 shrink-0", r.text)}
              strokeWidth={1.85}
            />
            <span className="truncate">{r.description}</span>
          </div>
        </div>
      </div>
    </Reveal>
  );
};

export default MemberCard;
