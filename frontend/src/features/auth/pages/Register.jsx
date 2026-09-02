import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  IconArrowRight,
  IconCircleCheck,
  IconInfoCircle,
  IconSeedling,
  IconShieldCheck,
} from "@tabler/icons-react";
import { Reveal } from "@/components/effects";
import { normalizeError } from "@/lib/api-errors";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthLayout from "../components/AuthLayout";
import RegisterForm from "../components/RegisterForm";
import { mockRegister } from "../mockRegisterApi";

/**
 * Register — demo sign-up page. The submit flow is mocked (see
 * mockRegisterApi): nothing reaches the server, nothing is stored anywhere,
 * and no real account is created. The success panel makes that explicit so
 * portfolio visitors aren't misled.
 */
const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [registeredUser, setRegisteredUser] = useState(null);

  const onSubmit = async (values) => {
    setServerError(null);
    setIsLoading(true);
    try {
      const { data } = await mockRegister(values);
      setRegisteredUser(data.user);
      toast.success("Demo account created", {
        description: "Sign-up is simulated — nothing was sent or stored.",
      });
    } catch (err) {
      setServerError(
        normalizeError(err, {
          entity: "sign-up",
          action: "complete",
          isAuthForm: true,
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  const firstName = registeredUser?.fullName?.split(" ")[0] ?? "there";

  return (
    <AuthLayout>
      <Reveal delay={0} duration={500} className="w-full max-w-md">
        <Card
          size="sm"
          className="glass-card texture-paper highlight-edge relative gap-0 overflow-hidden border-0 p-0 ring-1 ring-foreground/5"
        >
          {/* ---------- Decorative top band ---------- */}
          <div className="relative h-1.5 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-wheat via-leaf to-sage-deep" />
            <div className="shimmer-overlay absolute inset-0 animate-shimmer bg-linear-to-r from-transparent via-white/40 to-transparent" />
          </div>

          {registeredUser ? (
            <RegisterSuccess
              firstName={firstName}
              emailId={registeredUser.emailId}
              onSignIn={() => navigate("/login")}
              onReset={() => setRegisteredUser(null)}
            />
          ) : (
            <>
              {/* ---------- Header ---------- */}
              <CardHeader className="relative gap-1 pt-7 pb-2">
                <Reveal delay={40} duration={500}>
                  <div className="mb-3 inline-flex items-center gap-1.5 self-start rounded-full border border-leaf/30 bg-leaf/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-leaf uppercase backdrop-blur-sm">
                    <IconSeedling className="size-3" strokeWidth={2.25} />
                    Get started
                  </div>
                </Reveal>
                <Reveal delay={100} duration={500}>
                  <CardTitle className="font-heading text-2xl font-bold tracking-tight">
                    Create your account
                  </CardTitle>
                </Reveal>
                <Reveal delay={160} duration={500}>
                  <CardDescription className="text-sm">
                    Set up a workspace for your farm — track every field, crop
                    and harvest from day one.
                  </CardDescription>
                </Reveal>
              </CardHeader>

              {/* ---------- Form ---------- */}
              <CardContent className="pt-4 pb-7">
                <Reveal delay={200} duration={500}>
                  <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-wheat/35 bg-wheat/10 px-3.5 py-3 text-[11.5px] leading-relaxed text-wheat-deep dark:text-wheat">
                    <IconInfoCircle
                      className="mt-0.5 size-4 shrink-0"
                      strokeWidth={1.75}
                    />
                    <p>
                      <span className="font-semibold">Demo mode:</span> sign-up
                      is simulated for this portfolio — nothing is sent to a
                      server, nothing is stored, and no real account is created.
                    </p>
                  </div>
                </Reveal>

                <RegisterForm
                  onSubmit={onSubmit}
                  serverError={serverError}
                  isLoading={isLoading}
                />

                {/* Trust note */}
                <Reveal delay={320} duration={500}>
                  <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80">
                    <IconShieldCheck
                      className="size-3.5 text-leaf"
                      strokeWidth={1.85}
                    />
                    <span>
                      100% client-side demo — your details never leave this
                      browser.
                    </span>
                  </div>
                </Reveal>
              </CardContent>

              {/* ---------- Footer ---------- */}
              <div className="border-t border-foreground/5 bg-background/40 px-6 py-4 backdrop-blur-sm">
                <Reveal delay={400} duration={500}>
                  <p className="text-center text-sm text-muted-foreground">
                    Already growing with us?{" "}
                    <Link
                      to="/login"
                      className="font-semibold text-leaf underline-offset-4 transition-colors hover:text-leaf/80 hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </Reveal>
              </div>
            </>
          )}
        </Card>
      </Reveal>
    </AuthLayout>
  );
};

/* -------------------------------------------------------------------------- */
/*  Success panel — swaps in after the mocked registration "succeeds".        */
/* -------------------------------------------------------------------------- */

const RegisterSuccess = ({ firstName, emailId, onSignIn, onReset }) => (
  <>
    <CardContent className="flex flex-col items-center gap-4 px-8 pt-10 pb-8 text-center">
      <Reveal delay={0} duration={450}>
        <div className="relative">
          <span
            aria-hidden
            className="absolute inset-0 -z-10 animate-glow-pulse rounded-full bg-leaf/20 blur-xl"
          />
          <span className="flex size-16 animate-logo-pop items-center justify-center rounded-full bg-leaf/15 ring-1 ring-leaf/30">
            <IconCircleCheck className="size-9 text-leaf" strokeWidth={1.75} />
          </span>
        </div>
      </Reveal>

      <Reveal delay={120} duration={450}>
        <div className="space-y-1.5">
          <h3 className="font-heading text-2xl font-bold tracking-tight">
            Welcome to the field, {firstName}! 🌱
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            This was a simulated sign-up for{" "}
            <span className="font-medium text-foreground">{emailId}</span> —
            nothing was saved anywhere. Farmdeck's real sign-in stays
            invite-only.
          </p>
        </div>
      </Reveal>

      <Reveal delay={220} duration={450} className="w-full">
        <Button
          onClick={onSignIn}
          className="group/continue relative w-full overflow-hidden rounded-xl text-sm font-semibold shadow-md shadow-leaf/20 transition-all hover:shadow-lg hover:shadow-leaf/30"
        >
          <span
            aria-hidden
            className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/continue:translate-x-full"
          />
          <span className="relative inline-flex items-center gap-2">
            Continue to sign in
            <IconArrowRight
              className="size-4 transition-transform group-hover/continue:translate-x-0.5"
              strokeWidth={2}
            />
          </span>
        </Button>
      </Reveal>
    </CardContent>

    <div className="border-t border-foreground/5 bg-background/40 px-6 py-4 backdrop-blur-sm">
      <Reveal delay={320} duration={450}>
        <button
          type="button"
          onClick={onReset}
          className="mx-auto block text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Register a different email
        </button>
      </Reveal>
    </div>
  </>
);

export default Register;
