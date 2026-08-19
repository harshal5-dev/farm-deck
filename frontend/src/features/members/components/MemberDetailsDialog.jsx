import { useNavigate } from "react-router-dom";
import {
  IconAt,
  IconCalendar,
  IconClock,
  IconPencil,
  IconShieldCheck,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { RolePill, StatusPill } from "./pills";
import { getRole } from "@/constants/roles";
import { setSelectedMember } from "../selectedMemberSlice";
import { useDispatch } from "react-redux";
import { cn } from "@/lib/utils";
import { formatDate, formatRelative } from "../lib/format";
import DetailRow from "./DetailRow";
import MemberAvatar from "./member-card/MemberAvatar";

const MemberDetailsDialog = ({ member, open, onOpenChange, canManage = true }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!member) return null;

  const roleMeta = getRole(member.role);
  const isInvited = member.status === "invited";

  const handleEdit = () => {
    dispatch(setSelectedMember(member));
    onOpenChange?.(false);
    navigate("/app/members/edit");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        size="lg"
        className="overflow-hidden p-0"
      >
        {/* Role-tinted top strip */}
        <div className="relative h-1.5 overflow-hidden">
          <div className={cn("absolute inset-0 bg-linear-to-r", roleMeta.gradient)} />
        </div>

        <div className="relative">
          {/* Subtle role-tinted background */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 bg-linear-to-r opacity-[0.05]",
              roleMeta.gradient
            )}
          />
          {/* Background watermark */}
          <roleMeta.icon
            className="pointer-events-none absolute -right-8 -bottom-8 size-44 text-foreground/4"
            strokeWidth={1}
          />

          <div className="relative p-5">
            <DialogHeader className="gap-0 p-0">
              <div className="flex items-start gap-3.5">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div
                    className={cn(
                      "absolute -inset-1 rounded-full opacity-70 blur-md",
                      roleMeta.bg
                    )}
                  />
                  <div
                    className={cn(
                      "relative rounded-full bg-linear-to-br p-0.5 shadow-md ring-2 ring-card",
                      roleMeta.gradient
                    )}
                  >
                    <MemberAvatar member={member} size="xl" />
                  </div>
                </div>

                {/* Identity */}
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <DialogTitle className="min-w-0 wrap-break-word font-heading text-lg font-bold tracking-tight">
                      {member.fullName}
                    </DialogTitle>
                  </div>
                  <DialogDescription className="mt-0.5 truncate text-xs">
                    {member.emailId}
                  </DialogDescription>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <RolePill role={member.role} />
                    <StatusPill status={member.status} />
                  </div>
                </div>
              </div>
            </DialogHeader>

            {/* Detail grid */}
            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <DetailRow
                icon={IconAt}
                label="Email"
                value={member.emailId}
              />
              <DetailRow
                icon={IconCalendar}
                label={isInvited ? "Invited" : "Joined"}
                value={formatDate(member.createdAt)}
              />
              <DetailRow
                icon={IconClock}
                label={isInvited ? "Status" : "Last active"}
                value={isInvited ? "Pending" : formatRelative(member.lastActiveAt)}
                accent={isInvited ? "amber" : null}
              />
              <DetailRow
                icon={IconShieldCheck}
                label="Role"
                value={roleMeta.label}
                accent="role"
                roleMeta={roleMeta}
              />
            </div>

            {/* Role description */}
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-border/40 bg-muted/30 px-3 py-2.5 text-[12px] text-muted-foreground">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-md",
                  roleMeta.bg
                )}
              >
                <roleMeta.icon
                  className={cn("size-3.5", roleMeta.text)}
                  strokeWidth={2.2}
                />
              </span>
              <span>{roleMeta.description}</span>
            </div>

            <DialogFooter className="mt-5 gap-2 border-t border-border/40 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange?.(false)}
              >
                Close
              </Button>
              {canManage && (
                <Button
                  type="button"
                  onClick={handleEdit}
                  className="gap-1.5 shadow-md shadow-leaf/20"
                >
                  <IconPencil className="size-4" strokeWidth={1.85} />
                  Edit details
                </Button>
              )}
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default MemberDetailsDialog;
