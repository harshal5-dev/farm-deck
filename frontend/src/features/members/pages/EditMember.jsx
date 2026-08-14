import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  IconArrowLeft,
  IconUser,
  IconPlayerPause,
  IconShieldCheck,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/effects";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import UserForm from "../components/user-form/UserForm";
import { updateMember, suspendMember, selectMemberById } from "../membersSlice";
import { getRole, getStatus } from "@/constants/roles";
import { useAuth } from "@/features/auth";
import { cn, checkIsOwner } from "@/lib/utils";

/**
 * EditMember — `/app/members/:memberId/edit`
 *
 * Single-page form for editing an existing workspace member. Same no-scroll
 * layout as AddMember, with a danger zone (Suspend) tucked into the header
 * for owner-only access.
 */
export default function EditMember() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { memberId } = useParams();
  const { user } = useAuth();
  const member = useSelector((state) => selectMemberById(state, memberId));
  const [submitting, setSubmitting] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);

  const isSelf = member && user?.id === member.id;
  const isOwnerEditing = checkIsOwner(user?.role);

  if (!member) {
    return (
      <div className="space-y-4">
        <Link
          to="/app/members"
          className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <IconArrowLeft
            className="size-4 transition-transform group-hover:-translate-x-0.5"
            strokeWidth={1.75}
          />
          Back to Members
        </Link>
        <div className="glass-card texture-paper highlight-edge rounded-3xl p-10 text-center">
          <h2 className="font-heading text-lg font-semibold tracking-tight">
            Member not found
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            They may have been removed, or the link is incorrect.
          </p>
          <Button
            className="mt-4"
            onClick={() => navigate("/app/members", { replace: true })}
          >
            Back to members
          </Button>
        </div>
      </div>
    );
  }

  const roleMeta = getRole(member.role);
  const statusMeta = getStatus(member.status);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 550));
    dispatch(updateMember(member.id, values));
    setSubmitting(false);
    toast.success("Member updated", {
      description: `${values.fullName}'s details have been saved.`,
    });
    navigate("/app/members", { replace: true });
  };

  const handleCancel = () => navigate("/app/members");

  const handleSuspend = () => {
    dispatch(suspendMember(member.id));
    setSuspendOpen(false);
    toast.success("Member suspended", {
      description: `${member.fullName} no longer has access.`,
    });
    navigate("/app/members", { replace: true });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* ===== Compact back link ===== */}
      <Reveal duration={350}>
        <Link
          to="/app/members"
          className="group mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <IconArrowLeft
            className="size-3.5 transition-transform group-hover:-translate-x-0.5"
            strokeWidth={1.85}
          />
          Back to Members
        </Link>
      </Reveal>

      {/* ===== Hero — compact, no scroll ===== */}
      <Reveal delay={60} duration={450}>
        <div className="glass-card texture-paper highlight-edge relative mb-4 overflow-hidden rounded-2xl">
          {/* Role-tinted top accent strip */}
          <div
            className={cn(
              "absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-80",
              roleMeta.gradient
            )}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-leaf/8 via-sage-deep/4 to-sky-warm/8" />
          <div className="absolute -top-16 -right-12 size-48 rounded-full bg-wheat/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-sky-warm/15 blur-3xl" />
          <div className="pattern-contour absolute inset-0 opacity-40 mix-blend-soft-light" />

          <div className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative shrink-0">
                <div
                  className={cn(
                    "absolute -inset-1 rounded-2xl opacity-60 blur-md",
                    roleMeta.bg
                  )}
                />
                <div
                  className={cn(
                    "relative flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-md ring-1 ring-white/10",
                    roleMeta.gradient
                  )}
                >
                  <IconUser className="size-5" strokeWidth={1.85} />
                </div>
              </div>
              <div className="min-w-0">
                <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase backdrop-blur-sm",
                      roleMeta.border,
                      roleMeta.bg,
                      roleMeta.text
                    )}
                  >
                    <IconShieldCheck
                      className="size-2.5"
                      strokeWidth={2.2}
                    />
                    {roleMeta.label}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase",
                      statusMeta.chip
                    )}
                  >
                    <span
                      className={cn("size-1.5 rounded-full", statusMeta.dot)}
                    />
                    {statusMeta.label}
                  </span>
                  {isSelf && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-clay/15 px-2 py-0.5 text-[9px] font-semibold tracking-wider text-clay-deep uppercase dark:text-clay">
                      You
                    </span>
                  )}
                </div>
                <h1 className="truncate font-heading text-xl font-bold tracking-tight sm:text-2xl">
                  Edit member
                </h1>
                <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
                  Update {member.fullName.split(" ")[0]}'s name, email, and
                  role.
                </p>
              </div>
            </div>

            {/* Danger zone — owner can suspend (not delete) a member. */}
            {isOwnerEditing && !isSelf && member.status !== "suspended" && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSuspendOpen(true)}
                className="gap-1.5 border-red-500/30 text-red-500/90 hover:border-red-500/50 hover:bg-red-500/8 hover:text-red-500"
              >
                <IconPlayerPause className="size-3.5" strokeWidth={1.85} />
                Suspend
              </Button>
            )}
          </div>
        </div>
      </Reveal>

      {/* ===== Form body ===== */}
      <Reveal delay={140} duration={500}>
        <div className="glass-card texture-paper highlight-edge flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl p-4 sm:p-5">
          <UserForm
            mode="edit"
            defaultValues={{
              fullName: member.fullName,
              emailId: member.emailId,
              role: member.role,
              avatarId: member.avatarId,
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitting={submitting}
          />
        </div>
      </Reveal>

      {isOwnerEditing && !isSelf && member.status !== "suspended" && (
        <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
          <DialogContent showCloseButton={false} size="sm" className="p-0">
            <DialogHeader className="p-5 pb-3">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-500">
                  <IconPlayerPause className="size-5" strokeWidth={1.85} />
                </span>
                <div className="min-w-0">
                  <DialogTitle>Suspend this member?</DialogTitle>
                  <DialogDescription className="mt-1">
                    {member.fullName} will lose access to the workspace
                    immediately. Their record stays so you can re-invite them
                    anytime.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <DialogFooter className="border-border/40 bg-muted/20 px-5 py-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSuspendOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSuspend}
                className="gap-1.5 bg-red-500 text-white shadow-sm hover:bg-red-500/90"
              >
                <IconPlayerPause className="size-3.5" strokeWidth={1.85} />
                Suspend user
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
