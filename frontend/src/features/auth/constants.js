import { IconAlertTriangle, IconClockHour4, IconMail } from "@tabler/icons-react";

export const features = [
  "Multi-workspace farm isolation",
  "Track pH, EC & growth cycles",
  "Manage fields, crops & harvests",
  "Soil-type intelligence",
];


export const REASONS = {
  missing: {
    eyebrow: "Invitation link is missing",
    title: "We couldn't find your invitation",
    message:
      "The link looks incomplete. Please open the email we sent you and click the button — or paste the full URL into your browser.",
    icon: IconMail,
  },
  expired: {
    eyebrow: "Invitation expired",
    title: "This invitation has expired",
    message:
      "Invitations are valid for a limited time. Ask the workspace owner to send you a fresh invite so you can pick a password and join.",
    icon: IconClockHour4,
  },
  consumed: {
    eyebrow: "Invitation already used",
    title: "This invitation has already been accepted",
    message:
      "Each invitation link can only be used once. If that's you, sign in instead. If not, ask the workspace owner to reissue the invitation.",
    icon: IconAlertTriangle,
  },
  invalid: {
    eyebrow: "Invitation invalid",
    title: "This invitation can't be used",
    message:
      "The link may be mistyped, revoked, or no longer valid. Ask the workspace owner to send you a new invitation.",
    icon: IconAlertTriangle,
  },
};
