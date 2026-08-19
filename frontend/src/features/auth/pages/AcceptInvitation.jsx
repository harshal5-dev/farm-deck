import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  IconShieldCheck,
  IconSparkles,
} from "@tabler/icons-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Reveal } from "@/components/effects";
import Logo from "@/components/layout/Logo";
import ThemeToggle from "@/theme/theme-toggle";

import {
  setCredentials,
  useAcceptInvitationMutation,
  useVerifyInvitationQuery,
} from "@/features/auth";
import { useLazyGetProfileQuery } from "@/features/profile";
import { normalizeError } from "@/lib/api-errors";

import { FullPageLoader } from "@/components/feedback";
import InvitationHeader from "../components/InvitationHeader";
import AcceptInvitationForm from "../components/AcceptInvitationForm";
import InvitationInvalid from "../components/InvitationInvalid";
import InviteBrandPanel from "../components/InviteBrandPanel";

function deriveReason(error) {
  if (error?.status === 409) return "consumed";
  return "invalid";
}

const AcceptInvitation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = searchParams.get("token") || "";

  const {
    data: invitation,
    isLoading,
    isError,
    error,
    refetch,
  } = useVerifyInvitationQuery(token, { skip: !token });

  const [acceptInvitation, { isLoading: submitting, error: submitError }] =
    useAcceptInvitationMutation();
  const [fetchProfile] = useLazyGetProfileQuery();

  const serverError = submitError
    ? normalizeError(submitError, {
        entity: "invitation",
        action: "accept",
      })
    : null;

  const onSubmit = async (values) => {
    try {
      await acceptInvitation({ token, password: values.password }).unwrap();
      const profile = await fetchProfile().unwrap();
      dispatch(setCredentials(profile));
      toast.success("Welcome aboard!", {
        description: `You're now signed in to ${invitation?.tenantName || "your workspace"}.`,
      });
      navigate("/app", { replace: true });
    } catch {
      // serverError is rendered inline by AcceptInvitationForm via the
      // `error` from the mutation hook, so nothing to do here.
    }
  };

  /* ---------- Guards ---------- */

  if (!token) {
    return <InvitationInvalid reason="missing" />;
  }

  if (isLoading) {
    return <FullPageLoader message="Verifying your invitation…" caption="One moment" />;
  }

  if (isError) {
    return (
      <InvitationInvalid
        reason={deriveReason(error)}
        onRetry={() => refetch()}
      />
    );
  }

  /* ---------- Success — render the form ---------- */

  return (
    <div className="relative flex min-h-svh bg-background">
      {/* Floating theme toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left brand/art panel — invitation-specific copy */}
      <InviteBrandPanel tenantName={invitation.tenantName} />

      {/* Right form panel */}
      <div className="relative flex w-full flex-col lg:w-1/2">
        <div className="flex flex-col items-center gap-4 px-6 pt-8 pb-2">
          <Link
            to="/"
            className="lg:hidden"
            aria-label="Farmdeck home"
          >
            <Logo variant="stacked" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to home
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-sm">
            <Reveal delay={0} duration={500} className="w-full">
              <Card
                size="sm"
                className="glass-card texture-paper highlight-edge relative gap-0 overflow-hidden border-0 p-0 ring-1 ring-foreground/5"
              >
                {/* Top accent band */}
                <div className="relative h-1.5 overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-r from-leaf via-sage-deep to-sky-warm" />
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent shimmer-overlay animate-shimmer" />
                </div>

                {/* Header */}
                <CardHeader className="relative gap-1 pt-7 pb-2">
                  <Reveal delay={40} duration={500}>
                    <div className="mb-3 inline-flex items-center gap-1.5 self-start rounded-full border border-leaf/30 bg-leaf/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-leaf uppercase backdrop-blur-sm">
                      <IconSparkles className="size-3" strokeWidth={2.25} />
                      Team invitation
                    </div>
                  </Reveal>
                  <Reveal delay={100} duration={500}>
                    <CardTitle className="font-heading text-2xl font-bold tracking-tight">
                      Join {invitation.tenantName || "the workspace"}
                    </CardTitle>
                  </Reveal>
                  <Reveal delay={160} duration={500}>
                    <CardDescription className="text-sm">
                      Set a password to activate your account — you'll be signed
                      in automatically.
                    </CardDescription>
                  </Reveal>
                </CardHeader>

                {/* Invitee + form */}
                <CardContent className="space-y-4 pt-4 pb-7">
                  <Reveal delay={200} duration={500}>
                    <InvitationHeader invitation={invitation} />
                  </Reveal>

                  <Reveal delay={260} duration={500}>
                    <AcceptInvitationForm
                      onSubmit={onSubmit}
                      serverError={serverError}
                      isLoading={submitting}
                    />
                  </Reveal>

                  <Reveal delay={340} duration={500}>
                    <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80">
                      <IconShieldCheck
                        className="size-3.5 text-leaf"
                        strokeWidth={1.85}
                      />
                      <span>
                        Secured with HttpOnly cookies — nothing stored locally.
                      </span>
                    </div>
                  </Reveal>
                </CardContent>

                {/* Footer */}
                <div className="border-t border-foreground/5 bg-background/40 px-6 py-4 backdrop-blur-sm">
                  <Reveal delay={420} duration={500}>
                    <p className="text-center text-sm text-muted-foreground">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="font-semibold text-leaf underline-offset-4 transition-colors hover:text-leaf/80 hover:underline"
                      >
                        Sign in
                      </Link>
                    </p>
                  </Reveal>
                </div>
              </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitation;
