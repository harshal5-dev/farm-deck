import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  IconShieldCheck,
  IconShieldLock,
  IconLoader2,
  IconArrowRight,
  IconSparkles,
  IconRefresh,
} from "@tabler/icons-react";
import { verifyOtp, requestPasswordReset } from "../mockAuthFlow";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ErrorState from "@/components/ui/error-state";
import AuthLayout from "../components/AuthLayout";
import OtpInput from "../components/OtpInput";
import { Reveal } from "@/components/effects";

const RESEND_SECONDS = 60;

/** Obfuscate the local part of an email for display, e.g. jane@x.io -> ja••@x.io */
function maskEmail(email = "") {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, Math.min(2, local.length));
  const masked = visible + "•".repeat(Math.max(2, local.length - visible.length));
  return `${masked}@${domain}`;
}

export default function Verify() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);
  const [serverError, setServerError] = useState(null);

  const form = useForm({ defaultValues: { code: "" } });
  const { isSubmitting } = form.formState;

  // 60s resend countdown. (All hooks run before the early-return guard below.)
  useEffect(() => {
    if (seconds <= 0) return undefined;
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  // No email in route state → user landed here directly; bounce to step 1.
  if (!email) {
    return <Navigate to="/forgot-password" replace />;
  }

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      const res = await verifyOtp(email, data.code);
      if (!res?.verified) {
        form.setError("code", {
          type: "server",
          message: "Invalid or expired code. Please try again.",
        });
        return;
      }
      toast.success("Verified!", {
        description: "Now choose a new password for your account.",
      });
      navigate("/reset-password", { state: { email }, replace: true });
    } catch (err) {
      setServerError({
        title: "Couldn't verify the code",
        message: err?.message || "Something went wrong. Please try again.",
      });
    }
  };

  const handleResend = async () => {
    setResending(true);
    setServerError(null);
    try {
      await requestPasswordReset(email);
      setSeconds(RESEND_SECONDS);
      form.reset({ code: "" });
      toast.success("Code resent", {
        description: `A fresh code is on its way to ${maskEmail(email)}.`,
      });
    } catch {
      toast.error("Couldn't resend the code", {
        description: "Please try again in a moment.",
      });
    } finally {
      setResending(false);
    }
  };

  const mm = Math.floor(seconds / 60);
  const ss = String(seconds % 60).padStart(2, "0");
  const canResend = seconds <= 0 && !resending;

  return (
    <AuthLayout>
      <Reveal delay={0} duration={500} className="w-full max-w-md">
        <Card
          size="sm"
          className="glass-card texture-paper highlight-edge relative gap-0 overflow-hidden rounded-3xl border-0 p-0 ring-1 ring-foreground/5"
        >
          {/* ---------- Decorative top band ---------- */}
          <div className="relative h-1.5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-leaf via-sage-deep to-sky-warm" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent shimmer-overlay animate-shimmer" />
          </div>

          {/* ---------- Header ---------- */}
          <CardHeader className="relative gap-1 pt-7 pb-2">
            <Reveal delay={40} duration={500}>
              <div className="mb-3 inline-flex items-center gap-1.5 self-start rounded-full border border-leaf/30 bg-leaf/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-leaf uppercase backdrop-blur-sm">
                <IconShieldLock className="size-3" strokeWidth={2.25} />
                Verify it's you
              </div>
            </Reveal>
            <Reveal delay={100} duration={500}>
              <CardTitle className="font-heading text-2xl font-bold tracking-tight">
                Enter your code
              </CardTitle>
            </Reveal>
            <Reveal delay={160} duration={500}>
              <CardDescription className="text-sm">
                We sent a 6-digit code to{" "}
                <span className="font-semibold text-foreground">
                  {maskEmail(email)}
                </span>
                . It expires in 10 minutes.
              </CardDescription>
            </Reveal>
          </CardHeader>

          {/* ---------- Form ---------- */}
          <CardContent className="pt-4 pb-7">
            <Reveal delay={220} duration={500}>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  {serverError && (
                    <ErrorState
                      variant="auth"
                      title={serverError.title}
                      message={serverError.message}
                      compact
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="code"
                    rules={{
                      required: "Enter the 6-digit code",
                      pattern: {
                        value: /^\d{6}$/,
                        message: "Code must be exactly 6 digits",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                            Verification code
                          </FormLabel>
                          <span className="text-[11px] font-medium text-muted-foreground/70">
                            6 digits
                          </span>
                        </div>
                        <FormControl>
                          <OtpInput
                            value={field.value || ""}
                            onChange={field.onChange}
                            hasError={!!form.formState.errors.code}
                            disabled={isSubmitting}
                            autoFocus
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Resend row */}
                  <div className="flex items-center justify-center pt-1 text-xs">
                    {canResend ? (
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={resending}
                        className="inline-flex items-center gap-1.5 font-semibold text-leaf transition-colors hover:text-leaf/80 hover:underline disabled:opacity-60"
                      >
                        {resending ? (
                          <IconLoader2
                            className="size-3.5 animate-spin"
                            strokeWidth={2}
                          />
                        ) : (
                          <IconRefresh className="size-3.5" strokeWidth={2} />
                        )}
                        Resend code
                      </button>
                    ) : (
                      <span className="text-muted-foreground">
                        Resend code in{" "}
                        <span className="font-semibold text-foreground tabular-nums">
                          {mm}:{ss}
                        </span>
                      </span>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="group/submit relative h-11 w-full overflow-hidden rounded-xl text-sm font-semibold shadow-md shadow-leaf/20 transition-all hover:shadow-lg hover:shadow-leaf/30"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/submit:translate-x-full"
                    />
                    <span className="relative inline-flex items-center gap-2">
                      {isSubmitting ? (
                        <>
                          <IconLoader2
                            className="size-4 animate-spin"
                            strokeWidth={2}
                          />
                          Verifying…
                        </>
                      ) : (
                        <>
                          <IconShieldCheck
                            className="size-4"
                            strokeWidth={2}
                          />
                          Verify code
                          <IconArrowRight
                            className="size-4 transition-transform group-hover/submit:translate-x-0.5"
                            strokeWidth={2}
                          />
                        </>
                      )}
                    </span>
                  </Button>
                </form>
              </Form>
            </Reveal>

            {/* Demo note */}
            <Reveal delay={320} duration={500}>
              <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80">
                <IconSparkles
                  className="size-3.5 text-leaf"
                  strokeWidth={1.85}
                />
                <span>Demo mode — any 6 digits will verify.</span>
              </div>
            </Reveal>
          </CardContent>

          {/* ---------- Footer ---------- */}
          <div className="border-t border-foreground/5 bg-background/40 px-6 py-4 backdrop-blur-sm">
            <Reveal delay={400} duration={500}>
              <p className="text-center text-sm text-muted-foreground">
                Didn't get it?{" "}
                <Link
                  to="/forgot-password"
                  className="font-semibold text-leaf underline-offset-4 transition-colors hover:text-leaf/80 hover:underline"
                >
                  Try a different email
                </Link>
              </p>
            </Reveal>
          </div>
        </Card>
      </Reveal>
    </AuthLayout>
  );
}
