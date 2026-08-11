import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  IconLock,
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconArrowRight,
  IconSparkles,
  IconKey,
  IconShieldCheck,
} from "@tabler/icons-react";
import { resetPassword } from "../mockAuthFlow";
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

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState(null);

  const form = useForm({
    defaultValues: { password: "", confirmPassword: "" },
  });
  const { isSubmitting } = form.formState;

  const onSubmit = async (data) => {
    setServerError(null);
    try {
      await resetPassword(email, data.password);
      toast.success("Password reset", {
        description: "You can now sign in with your new password.",
      });
      navigate("/login", { replace: true });
    } catch (err) {
      setServerError({
        title: "Couldn't reset your password",
        message: err?.message || "Something went wrong. Please try again.",
      });
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
                Almost there
              </div>
            </Reveal>
            <Reveal delay={100} duration={500}>
              <CardTitle className="font-heading text-2xl font-bold tracking-tight">
                Set a new password
              </CardTitle>
            </Reveal>
            <Reveal delay={160} duration={500}>
              <CardDescription className="text-sm">
                Choose a strong password to secure your account going forward.
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
                      variant="error"
                      title={serverError.title}
                      message={serverError.message}
                      compact
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="password"
                    rules={{
                      required: "New password is required",
                      minLength: {
                        value: 8,
                        message: "At least 8 characters",
                      },
                      maxLength: {
                        value: 72,
                        message: "At most 72 characters",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                          New password
                        </FormLabel>
                        <FormControl>
                          <FieldWrapper
                            icon={IconLock}
                            hasError={!!form.formState.errors.password}
                            trailing={
                              <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                className="text-muted-foreground/70 transition-colors hover:text-foreground"
                                aria-label={
                                  showPassword
                                    ? "Hide password"
                                    : "Show password"
                                }
                              >
                                {showPassword ? (
                                  <IconEyeOff
                                    className="size-4"
                                    strokeWidth={1.75}
                                  />
                                ) : (
                                  <IconEye
                                    className="size-4"
                                    strokeWidth={1.75}
                                  />
                                )}
                              </button>
                            }
                          >
                            <Input
                              type={showPassword ? "text" : "password"}
                              autoComplete="new-password"
                              placeholder="At least 8 characters"
                              className="h-10 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                // Keep the confirm field's match-error in sync.
                                form.trigger("confirmPassword");
                              }}
                            />
                          </FieldWrapper>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    rules={{
                      required: "Please confirm your new password",
                      validate: (v) =>
                        v === form.getValues("password") ||
                        "Passwords don't match",
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                          Confirm password
                        </FormLabel>
                        <FormControl>
                          <FieldWrapper
                            icon={IconLock}
                            hasError={!!form.formState.errors.confirmPassword}
                            trailing={
                              <button
                                type="button"
                                onClick={() => setShowConfirm((s) => !s)}
                                className="text-muted-foreground/70 transition-colors hover:text-foreground"
                                aria-label={
                                  showConfirm
                                    ? "Hide password"
                                    : "Show password"
                                }
                              >
                                {showConfirm ? (
                                  <IconEyeOff
                                    className="size-4"
                                    strokeWidth={1.75}
                                  />
                                ) : (
                                  <IconEye
                                    className="size-4"
                                    strokeWidth={1.75}
                                  />
                                )}
                              </button>
                            }
                          >
                            <Input
                              type={showConfirm ? "text" : "password"}
                              autoComplete="new-password"
                              placeholder="Re-enter your new password"
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
                          Resetting…
                        </>
                      ) : (
                        <>
                          <IconKey className="size-4" strokeWidth={2} />
                          Reset password
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
                <span>Your new password is encrypted and never shared.</span>
              </div>
            </Reveal>
          </CardContent>

          {/* ---------- Footer ---------- */}
          <div className="border-t border-foreground/5 bg-background/40 px-6 py-4 backdrop-blur-sm">
            <Reveal delay={400} duration={500}>
              <p className="text-center text-sm text-muted-foreground">
                All set?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-leaf underline-offset-4 transition-colors hover:text-leaf/80 hover:underline"
                >
                  Back to sign in
                </Link>
              </p>
            </Reveal>
          </div>
        </Card>
      </Reveal>
    </AuthLayout>
  );
}
