import { useState } from "react";
import { toast } from "sonner";
import {
  IconCalendar,
  IconClock,
  IconCopy,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { Reveal } from "@/components/effects";
import { cn } from "@/lib/utils";
import { getRole } from "@/constants/roles";
import { formatDate, formatRelative } from "../../lib/format";
import { RolePill, StatusPill } from "../pills";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import MemberAvatar from "./MemberAvatar";
import StatTile from "./StatTile";

const MemberCard = ({
  member,
  index,
  onView,
  onDelete,
  onEdit,
  canManage = true,
}) => {
  const r = getRole(member.role);
  const RoleIcon = r.icon;
  const isInvited = member.status === "invited";
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onView?.();
    }
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(member.emailId);
    toast.success("Email copied", { description: member.emailId });
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.();
  };

  const askDelete = (e) => {
    e.stopPropagation();
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await onDelete?.();
      setConfirmOpen(false);
    } catch {
      toast.error("Could not delete member", {
        description: "Please try again.",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Same icon-button base the farm cards use — keeps both sections'
  // action styling in lockstep.
  const iconAction =
    "inline-flex size-8 items-center justify-center rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

  return (
    <Reveal delay={Math.min(index * 50, 400)} duration={500} changeKey={member.id}>
      <div
        role="button"
        tabIndex={0}
        aria-label={`View ${member.fullName}`}
        onClick={onView}
        onKeyDown={handleKeyDown}
        className="group/member glass-card texture-paper highlight-edge relative flex h-full min-h-64 cursor-pointer flex-col overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-leaf/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
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
        <div className="relative flex flex-1 flex-col p-5 pb-3">
          {/* Identity row: avatar left, name + email + pills on the right */}
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

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                <h3 className="min-w-0 wrap-break-word font-heading text-sm font-bold tracking-tight">
                  {member.fullName}
                </h3>
              </div>
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                {member.emailId}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <RolePill role={member.role} size="xs" />
                <StatusPill status={member.status} />
              </div>
            </div>
          </div>

          {/* Stat tiles */}
          <div className="mt-5 grid grid-cols-2 gap-2">
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

          {/* Role info — what this role can do, in the main body */}
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <RoleIcon
              className={cn("size-3.5 shrink-0", r.text)}
              strokeWidth={1.85}
            />
            <span className="truncate">{r.description}</span>
          </div>
        </div>

        {/* Footer — icon-only colored actions (farm-card style). The card
            itself is clickable, so stop the actions from opening it. */}
        <div
          className="relative flex items-center justify-end gap-2 border-t border-border/40 bg-muted/25 px-3.5 py-2"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {canManage && (
              <button
                type="button"
                onClick={handleEdit}
                aria-label={`Edit ${member.fullName}`}
                title="Edit details"
                className={cn(
                  iconAction,
                  "bg-sky-warm/12 text-sky-warm hover:bg-sky-warm/22 hover:-translate-y-px"
                )}
              >
                <IconPencil className="size-4" strokeWidth={1.85} />
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              aria-label={`Copy ${member.fullName}'s email`}
              title="Copy email"
              className={cn(
                iconAction,
                "bg-leaf/12 text-leaf hover:bg-leaf/22 hover:-translate-y-px"
              )}
            >
              <IconCopy className="size-4" strokeWidth={1.85} />
            </button>

            {canManage && (
              <button
                type="button"
                onClick={askDelete}
                aria-label={`Delete ${member.fullName}`}
                title="Delete user"
                className={cn(
                  iconAction,
                  "bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:-translate-y-px"
                )}
              >
                <IconTrash className="size-4" strokeWidth={1.85} />
              </button>
            )}
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton={false} size="sm" className="p-0">
          <DialogHeader className="p-5 pb-3">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-500">
                <IconTrash className="size-5" strokeWidth={1.85} />
              </span>
              <div className="min-w-0">
                <DialogTitle>Delete this member?</DialogTitle>
                <DialogDescription className="mt-1">
                  {member.fullName} will be permanently removed from the
                  workspace. This action cannot be undone.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="border-border/40 bg-muted/20 px-5 py-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setConfirmOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="gap-1.5 bg-red-500 text-white shadow-sm hover:bg-red-500/90"
            >
              <IconTrash className="size-3.5" strokeWidth={1.85} />
              {deleting ? "Deleting…" : "Delete user"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Reveal>
  );
};

export default MemberCard;
