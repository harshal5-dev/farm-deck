import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  IconArrowLeft,
  IconUserPlus,
  IconUsers,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/effects";
import UserForm from "../components/UserForm";
import { useMembers } from "../useMembers";

/**
 * AddMember — `/app/members/new`
 *
 * Single-page form for creating a new workspace member. Designed to fit a
 * laptop viewport without scrolling: compact hero + 2-column body
 * (identity preview | form fields) + inline footer.
 */
export default function AddMember() {
  const navigate = useNavigate();
  const { addMember } = useMembers();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    // Simulate a tiny network round-trip so the spinner is visible.
    await new Promise((r) => setTimeout(r, 550));
    addMember(values);
    setSubmitting(false);
    toast.success("Member added", {
      description: `${values.fullName} is now part of the workspace.`,
    });
    navigate("/app/members", { replace: true });
  };

  const handleCancel = () => navigate("/app/members");

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
          <div className="absolute inset-0 bg-gradient-to-br from-leaf/12 via-sage-deep/6 to-sky-warm/12" />
          <div className="absolute -top-16 -right-12 size-48 rounded-full bg-wheat/25 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-sky-warm/20 blur-3xl" />
          <div className="pattern-contour absolute inset-0 opacity-40 mix-blend-soft-light" />

          <div className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-leaf/30 to-sky-warm/30 opacity-60 blur-md" />
                <div className="relative flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-leaf to-sage-deep text-white shadow-md ring-1 ring-white/10">
                  <IconUserPlus className="size-5" strokeWidth={1.85} />
                </div>
              </div>
              <div className="min-w-0">
                <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full border border-leaf/30 bg-leaf/12 px-2 py-0.5 text-[9px] font-semibold tracking-wider text-leaf uppercase backdrop-blur-sm">
                    <IconUsers className="size-2.5" strokeWidth={2.2} />
                    New
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground/70">
                    Step 1 of 1
                  </span>
                </div>
                <h1 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
                  Add a new member
                </h1>
                <p className="text-[11px] text-muted-foreground sm:text-xs">
                  Set their name, email, and role. They'll appear in the
                  workspace immediately.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={submitting}
                className="gap-1.5"
              >
                <IconArrowLeft className="size-3.5" strokeWidth={1.85} />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ===== Form body ===== */}
      <Reveal delay={140} duration={500}>
        <div className="glass-card texture-paper highlight-edge flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl p-4 sm:p-5">
          <UserForm
            mode="create"
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitting={submitting}
          />
        </div>
      </Reveal>
    </div>
  );
}
