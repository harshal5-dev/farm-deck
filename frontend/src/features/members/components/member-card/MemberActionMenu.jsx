import { useState } from "react";
import { toast } from "sonner";
import {
  IconDots,
  IconPlayerPause,
  IconMailForward,
  IconCopy,
  IconPencil,
} from "@tabler/icons-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * The "⋯" actions for a member card: edit, copy email, and (for the workspace
 * owner) re-invite + suspend. Suspend replaces hard removal — the member
 * record stays, they just lose access until re-invited.
 */
export function MemberActionMenu({
  member,
  currentUserId,
  isOwner,
  onSuspend,
  onReinvite,
  onEdit,
}) {
  const isSelf = member.id === currentUserId;
  const isSuspended = member.status === "suspended";
  const isInvited = member.status === "invited";
  const canSuspend = isOwner && !isSelf && !isSuspended;
  const canReinvite = isOwner && (isSuspended || isInvited);

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const askSuspend = () => {
    setMenuOpen(false);
    setConfirmOpen(true);
  };

  const handleReinvite = () => {
    setMenuOpen(false);
    navigator.clipboard?.writeText(window.location.origin);
    onReinvite();
    toast.success("Re-invite link sent", {
      description: `Sent to ${member.emailId}`,
    });
  };

  const copyEmail = () => {
    setMenuOpen(false);
    navigator.clipboard?.writeText(member.emailId);
    toast.success("Email copied", { description: member.emailId });
  };

  return (
    <>
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger
          render={
            <button
              type="button"
              aria-label="Member actions"
              className="inline-flex size-8 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
            />
          }
        >
          <IconDots className="size-4" strokeWidth={1.85} />
        </PopoverTrigger>
        <PopoverContent align="end" sideOffset={6} className="w-56 gap-0 p-1.5">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              onEdit();
            }}
            className="group/menu flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted"
          >
            <span className="flex size-7 items-center justify-center rounded-md bg-leaf/15 text-leaf">
              <IconPencil className="size-3.5" strokeWidth={1.85} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">
                {isSelf ? "Edit my profile" : "Edit details"}
              </p>
              <p className="text-[10px] text-muted-foreground">Name, email & role</p>
            </div>
          </button>
          <button
            type="button"
            onClick={copyEmail}
            className="group/menu flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted"
          >
            <span className="flex size-7 items-center justify-center rounded-md bg-sky-warm/15 text-sky-warm">
              <IconCopy className="size-3.5" strokeWidth={1.85} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">Copy email</p>
              <p className="truncate text-[10px] text-muted-foreground">
                {member.emailId}
              </p>
            </div>
          </button>

          {canReinvite && (
            <button
              type="button"
              onClick={handleReinvite}
              className="group/menu flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted"
            >
              <span className="flex size-7 items-center justify-center rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <IconMailForward className="size-3.5" strokeWidth={1.85} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">
                  {isSuspended ? "Re-invite" : "Resend invite"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {isSuspended ? "Reactivate & send link" : "Send a fresh invite link"}
                </p>
              </div>
            </button>
          )}

          {canSuspend && (
            <>
              <div className="my-1 h-px bg-border/60" />
              <button
                type="button"
                onClick={askSuspend}
                className="group/menu flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-red-500/8"
              >
                <span className="flex size-7 items-center justify-center rounded-md bg-red-500/15 text-red-500">
                  <IconPlayerPause className="size-3.5" strokeWidth={1.85} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-red-500/90">
                    Suspend user
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Revoke access, keep the record
                  </p>
                </div>
              </button>
            </>
          )}
        </PopoverContent>
      </Popover>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
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
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setConfirmOpen(false);
                onSuspend();
              }}
              className="gap-1.5 bg-red-500 text-white shadow-sm hover:bg-red-500/90"
            >
              <IconPlayerPause className="size-3.5" strokeWidth={1.85} />
              Suspend user
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
