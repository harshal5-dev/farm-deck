import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  IconDots,
  IconExternalLink,
  IconPencil,
  IconCopy,
  IconArchive,
  IconArchiveOff,
  IconTrash,
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
 * The "⋯" overflow menu for a farm: jump to the farm, edit it, duplicate it,
 * toggle its active state, or delete it. Mirrors MemberActionMenu — a Popover
 * with rich menu items plus a destructive confirmation Dialog for deletion.
 *
 * All mutations are delegated up via props (onDuplicate / onToggleActive /
 * onDelete) so the list page owns farm state. Navigation + toasts are handled
 * here since they're presentation concerns.
 */
export function FarmActionMenu({ farm, onDuplicate, onToggleActive, onDelete }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isActive = farm.isActive !== false; // default to active when unset

  const open = () => {
    setMenuOpen(false);
    navigate(`/app/farms/${farm.id}`);
  };

  const edit = () => {
    setMenuOpen(false);
    navigate(`/app/farms/${farm.id}/edit`);
  };

  const duplicate = () => {
    setMenuOpen(false);
    onDuplicate?.();
    toast.success("Farm duplicated", {
      description: `${farm.name} (copy) added to your farms`,
    });
  };

  const toggleActive = () => {
    setMenuOpen(false);
    onToggleActive?.();
    toast.success(isActive ? "Farm archived" : "Farm reactivated", {
      description: isActive
        ? `${farm.name} is now inactive`
        : `${farm.name} is active again`,
    });
  };

  const askDelete = () => {
    setMenuOpen(false);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    setConfirmOpen(false);
    onDelete?.();
    toast.success("Farm deleted", { description: farm.name });
  };

  return (
    <>
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger
          render={
            <button
              type="button"
              aria-label={`Actions for ${farm.name}`}
              onClick={(e) => e.preventDefault()}
              className="inline-flex size-8 items-center justify-center rounded-xl bg-card/60 text-muted-foreground backdrop-blur-sm transition-all hover:bg-card hover:text-foreground"
            />
          }
        >
          <IconDots className="size-4" strokeWidth={1.85} />
        </PopoverTrigger>
        <PopoverContent align="end" sideOffset={6} className="w-60 gap-0 p-1.5">
          <MenuRow
            onClick={open}
            icon={IconExternalLink}
            tone="leaf"
            title="View details"
            sub="Open farm overview"
          />
          <MenuRow
            onClick={edit}
            icon={IconPencil}
            tone="leaf"
            title="Edit farm"
            sub="Name, location & area"
          />
          <MenuRow
            onClick={duplicate}
            icon={IconCopy}
            tone="sky-warm"
            title="Duplicate"
            sub="Copy settings & structure"
          />
          <MenuRow
            onClick={toggleActive}
            icon={isActive ? IconArchive : IconArchiveOff}
            tone="wheat"
            title={isActive ? "Archive" : "Reactivate"}
            sub={isActive ? "Mark as inactive" : "Bring back to active"}
          />

          <div className="my-1 h-px bg-border/60" />
          <MenuRow
            onClick={askDelete}
            icon={IconTrash}
            tone="danger"
            title="Delete farm"
            sub="Permanently remove"
          />
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
                <DialogTitle>Delete this farm?</DialogTitle>
                <DialogDescription className="mt-1">
                  <span className="font-medium text-foreground">
                    {farm.name}
                  </span>{" "}
                  and its field layout will be permanently removed. This can't
                  be undone.
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
              onClick={confirmDelete}
              className="gap-1.5 bg-red-500 text-white shadow-sm hover:bg-red-500/90"
            >
              <IconTrash className="size-3.5" strokeWidth={1.85} />
              Delete farm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** A single rich menu row: tinted icon chip + title + muted subtitle. */
function MenuRow({ icon: Icon, tone, title, sub, onClick }) {
  const tones = {
    leaf: "bg-leaf/15 text-leaf",
    "sky-warm": "bg-sky-warm/15 text-sky-warm",
    wheat: "bg-wheat/20 text-wheat",
    danger: "bg-red-500/15 text-red-500",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className="group/menu flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted"
    >
      <span
        className={`flex size-7 items-center justify-center rounded-md ${tones[tone]}`}
      >
        <Icon className="size-3.5" strokeWidth={1.85} />
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm font-medium ${
            tone === "danger" ? "text-red-500/90" : "text-foreground"
          }`}
        >
          {title}
        </p>
        <p className="truncate text-[10px] text-muted-foreground">{sub}</p>
      </div>
    </button>
  );
}
