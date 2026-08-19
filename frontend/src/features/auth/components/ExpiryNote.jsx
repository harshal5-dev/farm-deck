import { cn } from "@/lib/utils";
import { IconClockHour4 } from "@tabler/icons-react";



const ExpiryNote = ({ expiresAt }) => {
  const expires = new Date(expiresAt);
  const now = new Date();
  const msLeft = expires.getTime() - now.getTime();
  const daysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
  const expired = msLeft <= 0;

  const label = expired
    ? "Invitation has expired"
    : daysLeft === 1
      ? "Expires in 1 day"
      : `Expires in ${daysLeft} days`;

  return (
    <p
      className={cn(
        "mt-3 inline-flex items-center gap-1.5 text-[11px]",
        expired ? "text-destructive" : "text-muted-foreground/80"
      )}
    >
      <IconClockHour4 className="size-3.5" strokeWidth={1.85} />
      <span>{label}</span>
    </p>
  );
};

export default ExpiryNote;
