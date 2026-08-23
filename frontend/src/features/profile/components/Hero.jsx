import { useMemo } from "react";
import { toast } from "sonner";
import {
  IconBuildingWarehouse,
  IconCalendar,
  IconCopy,
  IconCrown,
  IconFingerprint,
  IconMail,
  IconShieldCheck,
} from "@tabler/icons-react";
import { Reveal } from "@/components/effects";
import { Avatar as ProfileAvatar } from "@/components/avatars/avatars";
import { DEFAULT_AVATAR_ID, getAvatar } from "@/components/avatars/avatars-data";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getRole } from "@/constants/roles";
import InfoTile from "./InfoTile";

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
};

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
};

const Hero = ({ user, isOwner }) => {
  const r = getRole(user?.role);
  const RoleIcon = r.icon;

  const memberSince = useMemo(
    () => formatDate(user?.createdAt),
    [user?.createdAt]
  );

  const savedAvatarId = user?.profilePicture || DEFAULT_AVATAR_ID;
  const savedAvatarLabel = getAvatar(savedAvatarId).label;

  return (
    <Reveal delay={60} duration={450}>
      <div className="glass-card texture-paper highlight-edge relative overflow-hidden rounded-2xl">
        {/* Role-tinted top accent strip — same language as EditMember */}
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-1 bg-linear-to-r opacity-80",
            r.gradient
          )}
        />
        {/* Layered gradient wash — matches the Members/Farms hero */}
        <div className="absolute inset-0 bg-linear-to-r from-leaf/8 via-sage-deep/4 to-sky-warm/8" />
        <div className="absolute -top-16 -right-12 size-48 rounded-full bg-wheat/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-sky-warm/15 blur-3xl" />
        <div className="pattern-contour absolute inset-0 opacity-40 mix-blend-soft-light" />

        {/* Cover band — soft, role-tinted sky → field */}
        <div className="relative h-28 overflow-hidden sm:h-32">
          <div
            className={cn(
              "absolute inset-0 bg-linear-to-br opacity-60",
              r.gradient
            )}
          />
          <div className="absolute -top-12 -right-12 size-40 rounded-full bg-wheat/30 blur-3xl" />
          <div className="absolute -bottom-16 -left-10 size-48 rounded-full bg-sky-warm/25 blur-3xl" />
          <div className="pattern-contour absolute inset-0 opacity-50 mix-blend-soft-light" />
        </div>

        {/* Identity strip */}
        <div className="relative px-5 pt-0 pb-5 sm:px-7 sm:pb-6">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:gap-6">
            {/* Avatar — overlapping the cover, role-tinted ring */}
            <div className="relative -mt-12 shrink-0 sm:-mt-14">
              <div
                className={cn(
                  "absolute -inset-2 rounded-full opacity-70 blur-md",
                  r.bg
                )}
              />
              <div
                className={cn(
                  "relative overflow-hidden rounded-full bg-linear-to-br p-0.5 shadow-md ring-2 ring-card",
                  r.gradient
                )}
              >
                <ProfileAvatar
                  id={savedAvatarId}
                  className="size-24 sm:size-28"
                  title={savedAvatarLabel}
                />
              </div>
              {isOwner && (
                <Tooltip>
                  <TooltipTrigger className="absolute right-0 bottom-0 inline-flex size-8 items-center justify-center rounded-full bg-linear-to-br from-clay to-clay-deep text-white shadow-md ring-2 ring-background transition-transform hover:scale-105">
                    <IconCrown className="size-4" strokeWidth={2} />
                  </TooltipTrigger>
                  <TooltipContent>Owner of this workspace</TooltipContent>
                </Tooltip>
              )}
            </div>

            {/* Name + meta */}
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                  {user?.fullName || "Your name"}
                </h1>
                {/* Role pill — uses roleMeta.chip gradient like MemberCard */}
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full bg-linear-to-br px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ring-1 ring-inset",
                    r.chip
                  )}
                >
                  <RoleIcon className="size-3" strokeWidth={2.2} />
                  {r.label}
                </span>
                {/* Active status pill */}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/12 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700 uppercase dark:text-emerald-400">
                  <span className="relative flex size-1.5">
                    <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Active
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                <Tooltip>
                  <TooltipTrigger
                    onClick={(e) => {
                      e.preventDefault();
                      copyToClipboard(user?.emailId, "Email");
                    }}
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                  >
                    <IconMail className="size-3.5" strokeWidth={1.75} />
                    <span className="truncate">{user?.emailId || "—"}</span>
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
                  {user?.tenantName ||
                    user?.tenantDetails?.name ||
                    "Your workspace"}
                </span>
              </div>
            </div>
          </div>

          {/* Stat strip — same 2-up mobile / 4-up desktop as Members/Farms */}
          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <InfoTile
              icon={IconShieldCheck}
              label="Role"
              value={r.label}
              accent="leaf"
            />
            <InfoTile
              icon={IconCalendar}
              label="Member since"
              value={memberSince}
              accent="sky"
            />
            <InfoTile
              icon={IconBuildingWarehouse}
              label="Workspace"
              value={
                user?.tenantName || user?.tenantDetails?.name || "Farm Deck"
              }
              accent="wheat"
            />
            <InfoTile
              icon={IconFingerprint}
              label="Subdomain"
              value={user?.tenantDetails?.subdomain || "—"}
              accent="clay"
              mono
            />
          </div>
        </div>
      </div>
    </Reveal>
  );
};

export default Hero;
