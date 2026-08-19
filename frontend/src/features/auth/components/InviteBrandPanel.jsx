import { FarmScene, Reveal } from "@/components/effects";
import Logo from "@/components/layout/Logo";
import { IconCheck, IconSparkles } from "@tabler/icons-react";
import { Link } from "react-router-dom";


const InviteBrandPanel = ({ tenantName }) => {
  return (
    <div className="relative hidden w-1/2 overflow-hidden lg:block">
      <div className="absolute inset-0 bg-linear-to-br from-leaf/20 via-sage/10 to-transparent" />
      <FarmScene className="absolute! inset-0 size-full" />
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
      <div className="pattern-contour absolute inset-0 opacity-30" />

      <div className="relative flex h-full flex-col justify-between p-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.02] active:scale-95"
        >
          <Logo variant="full" withSubtitle={false} animate />
        </Link>

        <div className="max-w-md">
          <Reveal delay={0} duration={500}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-leaf/30 bg-leaf/10 px-3 py-1 text-xs font-semibold text-leaf backdrop-blur-sm">
              <IconSparkles className="size-3.5" strokeWidth={2} />
              You're invited
            </span>
          </Reveal>
          <Reveal delay={90} duration={500}>
            <h2 className="mt-4 font-heading text-4xl leading-tight font-bold tracking-tight">
              Welcome to{" "}
              <span className="bg-linear-to-r from-leaf to-sage-deep bg-clip-text text-transparent">
                {tenantName || "your new workspace"}
              </span>
              . 🌱
            </h2>
          </Reveal>
          <Reveal delay={170} duration={500}>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              You've been added to the team. Pick a password below and you'll
              be signed in — your fields, crops, and reports are waiting.
            </p>
          </Reveal>

          <Reveal delay={250} duration={500}>
            <ul className="mt-6 space-y-2.5 text-sm">
              {[
                "Full access to your assigned farms & fields",
                "Real-time updates with the rest of your team",
                "Same farm-themed UI across web & mobile",
              ].map((line) => (
                <li key={line} className="flex items-center gap-2.5">
                  <span className="flex size-5 items-center justify-center rounded-full bg-leaf/15 text-leaf">
                    <IconCheck className="size-3" strokeWidth={2.5} />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <p className="text-xs text-muted-foreground/60">
          Need help? Reply to the invitation email — we're happy to assist.
        </p>
      </div>
    </div>
  );
};

export default InviteBrandPanel;
