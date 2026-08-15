import { useState } from "react";
import { toast } from "sonner";
import {
  IconDots,
  IconTrash,
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

const MemberActionMenu = ({
  member,
  currentUserId,
  isOwner,
  onDelete,
  onEdit,
}) => {
  const isSelf = member.id === currentUserId;
  const canDelete = isOwner && !isSelf;

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const askDelete = () => {
    setMenuOpen(false);
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

          {canDelete && (
            <>
              <div className="my-1 h-px bg-border/60" />
              <button
                type="button"
                onClick={askDelete}
                className="group/menu flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-red-500/8"
              >
                <span className="flex size-7 items-center justify-center rounded-md bg-red-500/15 text-red-500">
                  <IconTrash className="size-3.5" strokeWidth={1.85} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-red-500/90">
                    Delete user
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Permanently remove from workspace
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
    </>
  );
}

export default MemberActionMenu;
