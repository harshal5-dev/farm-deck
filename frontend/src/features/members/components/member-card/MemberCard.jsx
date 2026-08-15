import {
  IconCalendar,
  IconClock,
  IconChevronRight,
} from "@tabler/icons-react";
import { Reveal } from "@/components/effects";
import { cn } from "@/lib/utils";
import { getRole } from "@/constants/roles";
import { formatDate, formatRelative } from "../../lib/format";
import { RolePill, StatusPill } from "../pills";
import { MemberAvatar } from "./MemberAvatar";
import { MemberActionMenu } from "./MemberActionMenu";

function StatTile({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-2.5 py-2">
      <Icon
        className={cn(
          "size-3.5 shrink-0",
          accent === "amber"
            ? "text-amber-500"
            : accent === "leaf"
              ? "text-leaf"
              : "text-muted-foreground/70"
        )}
        strokeWidth={1.85}
      />
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
          {label}
        </p>
        <p
          className={cn(
            "truncate text-xs font-bold tabular-nums",
            accent === "amber" && "text-amber-700 dark:text-amber-400"
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/**
 * MemberCard — clean horizontal card on a role-tinted glass surface.
 * Thin gradient accent at the top, large role-icon watermark in the
 * background, avatar on the left, identity in the center, action menu on
 * the right. Everything sits on the card surface for clear contrast.
 */
export function MemberCard({
  member,
  currentUserId,
  index,
  isOwner,
  onView,
  onDelete,
  onEdit,
}) {
  const r = getRole(member.role);
  const RoleIcon = r.icon;
  const isSelf = member.id === currentUserId;
  const isInvited = member.status === "invited";

  return (
    <Reveal delay={Math.min(index * 50, 400)} duration={500} changeKey={member.id}>
      <div className="group/member glass-card texture-paper highlight-edge relative flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-leaf/20">
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
          <div className={cn("absolute inset-0 bg-linear-to-br", r.gradient)} />
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
                <h3 className="min-w-0 wrap-break-word font-heading text-sm font-bold tracking-tight truncate">
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

            {/* Action menu on the far right */}
            <div className="shrink-0">
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
          <div className="my-4 grid grid-cols-2 gap-2">
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

          {/* Footer — role description + view link (pushed to bottom) */}
          <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/30 pt-3">
            <span className="flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground">
              <RoleIcon
                className={cn("size-3.5 shrink-0", r.text)}
                strokeWidth={1.85}
              />
              <span className="truncate">{r.description}</span>
            </span>
            <button
              type="button"
              onClick={onView}
              aria-label="View member"
              className={cn(
                "flex shrink-0 items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold transition-all duration-200 group-hover/member:gap-1.5",
                r.text,
                "hover:bg-muted/60"
              )}
            >
              View
              <IconChevronRight className="size-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
