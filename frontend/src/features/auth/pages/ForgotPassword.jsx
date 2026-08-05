import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  IconMail,
  IconLoader2,
  IconArrowRight,
  IconShieldCheck,
  IconSparkles,
  IconMailFast,
} from "@tabler/icons-react";
import { requestPasswordReset } from "../mockAuthFlow";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import FieldWrapper from "../components/FieldWrapper";
import { Reveal } from "@/components/effects";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const form = useForm({ defaultValues: { email: "" } });

  const onSubmit = async (data) => {
    setServerError(null);
    setIsLoading(true);
    try {
      await requestPasswordReset(data.email);
      toast.success("Reset code sent", {
        description: `Check ${data.email} for a 6-digit verification code.`,
      });
      navigate("/verify", { state: { email: data.email } });
    } catch (err) {
      setServerError({
        title: "Couldn't send the reset code",
        message:
          err?.message ||
          "If that email exists, a reset code will arrive shortly. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                <IconSparkles className="size-3" strokeWidth={2.25} />
                Account recovery
              </div>
            </Reveal>
            <Reveal delay={100} duration={500}>
              <CardTitle className="font-heading text-2xl font-bold tracking-tight">
                Forgot password?
              </CardTitle>
            </Reveal>
            <Reveal delay={160} duration={500}>
              <CardDescription className="text-sm">
                No worries — enter your email and we'll send a verification code
                to get you back in.
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
                    name="email"
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                          Email address
                        </FormLabel>
                        <FormControl>
                          <FieldWrapper
                            icon={IconMail}
                            hasError={!!form.formState.errors.email}
                          >
                            <Input
                              type="email"
                              autoComplete="email"
                              placeholder="you@farm.app"
                              className="h-10 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
                            />
                          </FieldWrapper>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="group/submit relative h-11 w-full overflow-hidden rounded-xl text-sm font-semibold shadow-md shadow-leaf/20 transition-all hover:shadow-lg hover:shadow-leaf/30"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/submit:translate-x-full"
                    />
                    <span className="relative inline-flex items-center gap-2">
                      {isLoading ? (
                        <>
                          <IconLoader2
                            className="size-4 animate-spin"
                            strokeWidth={2}
                          />
                          Sending code…
                        </>
                      ) : (
                        <>
                          <IconMailFast className="size-4" strokeWidth={2} />
                          Send reset code
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

            {/* Trust note */}
            <Reveal delay={320} duration={500}>
              <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80">
                <IconShieldCheck
                  className="size-3.5 text-leaf"
                  strokeWidth={1.85}
                />
                <span>We'll only use this to verify it's really you.</span>
              </div>
            </Reveal>
          </CardContent>

          {/* ---------- Footer ---------- */}
          <div className="border-t border-foreground/5 bg-background/40 px-6 py-4 backdrop-blur-sm">
            <Reveal delay={400} duration={500}>
              <p className="text-center text-sm text-muted-foreground">
                Remember your password?{" "}
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
    </AuthLayout>
  );
}
