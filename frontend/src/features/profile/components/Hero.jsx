import { Reveal } from "@/components/effects";
import { Avatar as ProfileAvatar } from "@/components/avatars/avatars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { IconBuildingWarehouse, IconCalendar, IconCopy, IconCrown, IconFingerprint, IconLeaf, IconMail, IconShieldCheck } from "@tabler/icons-react";
import InfoTile from "./InfoTile";
import { toast } from "sonner";
import { useMemo } from "react";
import { DEFAULT_AVATAR_ID, getAvatar } from "@/components/avatars/avatars-data";

const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

const displayRole = (role) => {
  if (!role) return "Member";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

const copyToClipboard = (value, label = "Value") => {
  if (!value) return;
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard
      .writeText(String(value))
      .then(() => toast.success(`${label} copied`, { description: value }))
      .catch(() => toast.error("Could not copy"));
  } else {
    toast.error("Clipboard not available");
  }
}

const Hero = ({ user, isOwner }) => {

  const memberSince = useMemo(
    () => formatDate(user.createdAt),
    [user.createdAt],
  );

  const savedAvatarId = user.profilePicture || DEFAULT_AVATAR_ID;
  const savedAvatarLabel = getAvatar(savedAvatarId).label;

  return (
    <Reveal delay={60} duration={500}>
      <Card
        size="sm"
        className="glass-card texture-paper highlight-edge relative gap-0 overflow-hidden border-0 p-0 ring-1 ring-foreground/5"
      >
        {/* Cover with layered gradients */}
        <div className="relative h-28 overflow-hidden sm:h-36">
          <div className="absolute inset-0 bg-linear-to-br from-leaf via-sage-deep to-sky-warm" />
          <div className="absolute -top-16 -right-16 size-48 rounded-full bg-wheat/40 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-sky-warm/30 blur-3xl" />
          <div className="pattern-contour absolute inset-0 opacity-60 mix-blend-soft-light" />
          <div className="texture-paper absolute inset-0 opacity-30" />
          <svg
            className="absolute inset-x-0 bottom-0 h-12 w-full opacity-30"
            viewBox="0 0 1200 80"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 60 Q150 30 300 50 T600 40 T900 50 T1200 30 V80 H0 Z"
              fill="currentColor"
              className="text-foreground/30"
            />
            <path
              d="M0 70 Q200 50 400 60 T800 55 T1200 60 V80 H0 Z"
              fill="currentColor"
              className="text-foreground/40"
            />
          </svg>
        </div>

        {/* Identity strip */}
        <div className="relative px-6 pt-0 pb-6 sm:px-8 sm:pb-7">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:gap-6">
            {/* Avatar — overlapping the cover */}
            <div className="relative -mt-12 shrink-0 sm:-mt-14">
              <div className="absolute -inset-2 rounded-full bg-linear-to-br from-leaf/40 via-sky-warm/30 to-clay/30 opacity-70 blur-xl" />
              <div className="relative rounded-full bg-background p-1 shadow-lg ring-1 ring-foreground/5">
                <ProfileAvatar
                  id={savedAvatarId}
                  className="size-24 sm:size-28"
                  title={savedAvatarLabel}
                />
                {isOwner && (
                  <Tooltip>
                    <TooltipTrigger className="absolute right-0 bottom-0 inline-flex size-8 items-center justify-center rounded-full bg-linear-to-br from-clay to-clay-deep text-white shadow-md ring-2 ring-background transition-transform hover:scale-105">
                      <IconCrown className="size-4" strokeWidth={2} />
                    </TooltipTrigger>
                    <TooltipContent>Owner of this workspace</TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>

            {/* Name + meta */}
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                  {user.fullName || "Your name"}
                </h1>
                <Badge variant="emerald" className="gap-1">
                  <span className="relative flex size-1.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Active
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                <Tooltip>
                  <TooltipTrigger
                    onClick={(e) => {
                      e.preventDefault();
                      copyToClipboard(user.emailId, "Email");
                    }}
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                  >
                    <IconMail className="size-3.5" strokeWidth={1.75} />
                    <span className="truncate">{user.emailId || "—"}</span>
                    <IconCopy
                      className="size-3 opacity-50"
                      strokeWidth={1.75}
                    />
                  </TooltipTrigger>
                  <TooltipContent>Copy email</TooltipContent>
                </Tooltip>

                <span className="hidden h-3 w-px bg-border sm:inline-block" />

                <span className="inline-flex items-center gap-1.5">
                  <IconBuildingWarehouse
                    className="size-3.5"
                    strokeWidth={1.75}
                  />
                  {user.tenantName || user.tenantDetails?.name || "Your company"}
                </span>
              </div>
            </div>

            {/* Quick actions — hidden on mobile because the email row
                above already has a copy trigger; keeps the layout clean. */}
            <div className="hidden items-center gap-2 sm:flex sm:pb-1">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => copyToClipboard(user.emailId, "Email")}
                      aria-label="Copy email"
                      className="text-muted-foreground"
                    />
                  }
                >
                  <IconMail className="size-4" strokeWidth={1.75} />
                </TooltipTrigger>
                <TooltipContent>Copy email</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Stat strip — 2-up on mobile so the hero doesn't get too tall,
              expanding to 4 across on desktop. */}
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Reveal delay={140} duration={500} changeKey="stat-role">
              <InfoTile
                icon={IconShieldCheck}
                label="Role"
                value={displayRole(user.role)}
                accent="leaf"
              />
            </Reveal>
            <Reveal delay={200} duration={500} changeKey="stat-since">
              <InfoTile
                icon={IconCalendar}
                label="Member since"
                value={memberSince}
                accent="sky"
              />
            </Reveal>
            <Reveal delay={320} duration={500} changeKey="stat-id">
              <InfoTile
                icon={IconLeaf}
                label="Company name"
                value={user.tenantName || user.tenantDetails?.name || "Farm Deck"}
                accent="wheat"
              />
            </Reveal>
            <Reveal delay={260} duration={500} changeKey="stat-sub">
              <InfoTile
                icon={IconFingerprint}
                label="Subdomain"
                value={user.tenantDetails?.subdomain || "—"}
                accent="clay"
                mono
              />
            </Reveal>
          </div>
        </div>
      </Card>
    </Reveal>
  );
};

export default Hero;
