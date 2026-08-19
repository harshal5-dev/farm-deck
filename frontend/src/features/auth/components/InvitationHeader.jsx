import {
  IconBuildingCommunity,
  IconMail,
} from "@tabler/icons-react";
import { Avatar } from "@/components/avatars/avatars";
import { DEFAULT_AVATAR_ID } from "@/components/avatars/avatars-data";
import { getRole } from "@/constants/roles";
import { cn } from "@/lib/utils";
import ExpiryNote from "./ExpiryNote";

const InvitationHeader = ({ invitation }) => {
  const { fullName, emailId, role, tenantName, expiresAt } = invitation || {};
  const roleMeta = getRole(role);
  const RoleIcon = roleMeta.icon;

  return (
    <div
      className={cn(
        "glass-card texture-paper relative overflow-hidden rounded-2xl",
        "px-4 py-5 sm:px-5"
      )}
    >
      {/* Far + mid soft glows tinted to the role's accent */}
      <div
        className={cn(
          "pointer-events-none absolute -top-12 left-1/2 size-40 -translate-x-1/2 rounded-full opacity-50 blur-3xl",
          roleMeta.bgSoft
        )}
        aria-hidden="true"
      />
      <div
        className={cn(
          "pointer-events-none absolute -top-6 left-1/2 size-28 -translate-x-1/2 rounded-full opacity-40 blur-2xl",
          roleMeta.bg
        )}
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center text-center">
        {/* Avatar + soft halo */}
        <div className="relative">
          <div
            className={cn(
              "absolute -inset-2 rounded-full opacity-50 blur-xl",
              roleMeta.bg
            )}
            aria-hidden="true"
          />
          <div
            className={cn(
              "relative rounded-full ring-2 ring-card ring-offset-2 ring-offset-card",
              roleMeta.ring
            )}
          >
            <Avatar
              id={DEFAULT_AVATAR_ID}
              className="size-16"
              title={fullName}
            />
          </div>
        </div>

        {/* Name + email */}
        <h3 className="mt-3 font-heading text-lg font-bold tracking-tight text-foreground">
          {fullName || "Invited teammate"}
        </h3>
        {emailId && (
          <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <IconMail className="size-3.5" strokeWidth={1.75} />
            {emailId}
          </p>
        )}

        {/* Hairline divider */}
        <div
          className="mx-auto mt-3 h-px w-16 bg-linear-to-r from-transparent via-border to-transparent"
          aria-hidden="true"
        />

        {/* Role + tenant chips */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full bg-linear-to-br px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
              roleMeta.chip
            )}
          >
            <RoleIcon className="size-3.5" strokeWidth={2} />
            {roleMeta.label}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            <IconBuildingCommunity className="size-3.5" strokeWidth={1.85} />
            {tenantName || "Workspace"}
          </span>
        </div>

        {/* Expiry countdown */}
        {expiresAt && (
          <ExpiryNote expiresAt={expiresAt} />
        )}
      </div>
    </div>
  );
};

export default InvitationHeader;
