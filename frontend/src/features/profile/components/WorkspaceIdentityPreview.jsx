import { FarmScene } from "@/components/effects";

const WorkspaceIdentityPreview = ({ name, subdomain, description }) => {
  const displayName = (name || "").trim() || "Your workspace";
  const displaySub = (subdomain || "").trim() || "your-workspace";
  const initial = (displayName.charAt(0) || "F").toUpperCase();
  const hasDescription = !!description?.trim();

  return (
    <div className="relative flex w-full min-w-0 flex-col items-stretch overflow-hidden rounded-2xl border border-border/40 bg-card/40 p-0 shadow-sm backdrop-blur lg:h-full">
      <div className="relative h-28 w-full shrink-0 overflow-hidden">
        <FarmScene className="size-full" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-sky-warm/30 via-leaf/15 to-clay/30 opacity-80" />
        <div className="absolute inset-0 bg-linear-to-t from-card via-card/40 to-transparent" />
      </div>

      <div className="relative flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-2 px-5 py-5">
        <div className="-mt-7 flex w-full min-w-0 flex-col items-center text-center">
          <div className="relative shrink-0">
            <div className="absolute -inset-2 rounded-2xl bg-linear-to-br from-sky-warm/30 via-leaf/20 to-clay/30 opacity-70 blur-md" />
            <div className="relative flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-sky-warm via-leaf to-sage-deep text-xl font-bold text-white shadow-md ring-2 ring-card">
              {initial}
            </div>
          </div>

          <h3 className="mt-3 line-clamp-2 w-full max-w-full font-heading text-base font-bold tracking-tight wrap-break-word">
            {displayName}
          </h3>

          {/* Subdomain pill — mono, leaf-tinted. `min-w-0` + `truncate`
              so a long subdomain never pushes the card wider. */}
          <span className="mt-1 inline-flex w-full max-w-full min-w-0 items-center justify-center gap-1 rounded-full border border-leaf/30 bg-leaf/12 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-leaf uppercase">
            <span className="min-w-0 truncate font-mono lowercase">
              {displaySub}
            </span>
            <span className="shrink-0 text-leaf/60">.farmdeck.app</span>
          </span>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Active workspace
            </span>
          </div>

          {/* Description preview — only when present. `line-clamp-3`
              keeps the card height stable regardless of input length. */}
          {hasDescription && (
            <p className="mt-3 line-clamp-3 w-full max-w-full text-[11px] leading-relaxed text-muted-foreground/80 wrap-break-word">
              {description}
            </p>
          )}

          {/* Bottom meta row — single line, ellipsis on long subdomains.
              `min-w-0` on the flex-1 item is what makes truncate work. */}
          <div className="mt-4 flex w-full min-w-0 items-center gap-2 rounded-xl bg-muted/40 px-3 py-2 text-[11px]">
            <div className="flex min-w-0 flex-1 items-center gap-1.5 text-muted-foreground">
              <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-sky-warm/12 text-sky-warm">
                <span className="font-mono text-[9px] font-bold">@</span>
              </span>
              <span className="min-w-0 truncate font-semibold tracking-tight lowercase">
                {displaySub}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 text-muted-foreground">
              <span className="inline-flex size-5 items-center justify-center rounded-md bg-leaf/12 text-leaf">
                <span className="font-mono text-[9px] font-bold">F</span>
              </span>
              <span className="font-semibold tracking-tight">Farmdeck</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceIdentityPreview;
