import * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { IconX } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

function Dialog({ ...props }) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-soil/45",
        "transition-opacity duration-200",
        "data-open:opacity-100",
        "data-closed:opacity-0",
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  size = "default",
  ...props
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        data-size={size}
        className={cn(
          // Centered fixed positioning — base-ui doesn't auto-center.
          "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
          // Layout + surface
          "flex max-h-[calc(100dvh-2rem)] w-full flex-col gap-0 overflow-hidden",
          "rounded-3xl bg-card text-card-foreground shadow-2xl shadow-foreground/15",
          "ring-1 ring-foreground/10",
          // Sizing
          "data-[size=default]:max-w-lg data-[size=lg]:max-w-2xl data-[size=sm]:max-w-sm data-[size=xl]:max-w-4xl",
          // Animations — use CSS transitions (not keyframe animations) so the
          // close is smooth and doesn't flash. Scale composes with the
          // -translate centering (in Tailwind v4 they're separate CSS
          // properties), whereas translate-y variants would override it and
          // push the dialog below centre. Transition only the properties we
          // animate — never transition-all.
          "transition-[opacity,scale] duration-200 ease-out outline-none",
          "data-open:scale-100 data-open:opacity-100",
          "data-closed:scale-95 data-closed:opacity-0",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            render={
              <button
                type="button"
                aria-label="Close"
                className="absolute top-3.5 right-3.5 z-10 inline-flex size-8 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
              />
            }
          >
            <IconX className="size-4" strokeWidth={1.85} />
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-1.5 p-6 pb-4 text-left", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-lg font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function DialogBody({ className, ...props }) {
  return (
    <div
      data-slot="dialog-body"
      className={cn("flex-1 overflow-y-auto px-6 py-2", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 border-t border-border/40 p-4 sm:flex-row sm:items-center sm:justify-end sm:px-6 sm:py-4",
        className
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
};
