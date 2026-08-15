import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  IconArrowLeft,
  IconUser,
  IconShieldCheck,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/effects";
import UserForm from "../components/user-form/UserForm";
import { useUpdateMemberMutation } from "../memberApi";
import { getRole, getStatus } from "@/constants/roles";
import { cn } from "@/lib/utils";
import {
  clearSelectedMember,
  selectSelectedMember,
} from "../selectedMemberSlice";

const EditMember = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const member = useSelector(selectSelectedMember);
  const [updateMember, { isLoading: submitting }] = useUpdateMemberMutation();

  useEffect(() => {
    if (!member) {
      navigate("/app/members", { replace: true });
    }
  }, [member, navigate]);

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
    try {
      await updateMember({
        id: member.id,
        fullName: values.fullName,
        role: values.role,
        profilePicture: values.profilePicture,
      }).unwrap();
      dispatch(clearSelectedMember());
      toast.success("Member updated", {
        description: `${values.fullName}'s details have been saved.`,
      });
      navigate("/app/members", { replace: true });
    } catch (err) {
      toast.error("Could not update member", {
        description: err?.data?.error?.message || "Please try again.",
      });
    }
  };

  const handleCancel = () => {
    dispatch(clearSelectedMember());
    navigate("/app/members");
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* ===== Compact back link ===== */}
      <Reveal duration={350}>
        <Link
          to="/app/members"
          onClick={() => dispatch(clearSelectedMember())}
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
          <div
            className={cn(
              "absolute inset-x-0 top-0 h-1 bg-linear-to-r opacity-80",
              roleMeta.gradient
            )}
          />
          <div className="absolute inset-0 bg-linear-to-r from-leaf/8 via-sage-deep/4 to-sky-warm/8" />
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
                    "relative flex size-10 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-md ring-1 ring-white/10",
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
                </div>
                <h1 className="truncate font-heading text-xl font-bold tracking-tight sm:text-2xl">
                  Edit member
                </h1>
                <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
                  Update {member.fullName.split(" ")[0]}'s name and role.
                </p>
              </div>
            </div>
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
              profilePicture: member.profilePicture,
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitting={submitting}
          />
        </div>
      </Reveal>
    </div>
  );
}

export default EditMember;
