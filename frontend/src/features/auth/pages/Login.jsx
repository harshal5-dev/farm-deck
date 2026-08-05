import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  IconMail,
  IconLock,
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconArrowRight,
  IconShieldCheck,
  IconSparkles,
  IconKey,
} from "@tabler/icons-react";
import {
  useLoginMutation,
  useLazyGetProfileQuery,
  setCredentials,
} from "@/features/auth";
import { normalizeError } from "@/lib/api-errors";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ErrorState from "@/components/ui/error-state";
import AuthLayout from "../components/AuthLayout";
import { Reveal } from "@/components/effects";
import { cn } from "@/lib/utils";

export default function Login() {
  const [login, { isLoading, error }] = useLoginMutation();
  const [fetchProfile] = useLazyGetProfileQuery();
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/app";

  const form = useForm({
    defaultValues: { emailId: "", password: "" },
  });

  const onSubmit = async (data) => {
    try {
      await login({ emailId: data.emailId, password: data.password }).unwrap();
      const profile = await fetchProfile().unwrap();
      dispatch(setCredentials(profile));
      toast.success("Welcome back!", {
        description: `Signed in as ${profile.emailId}`,
      });
      navigate(from, { replace: true });
    } catch (err) {
      const details = err?.data?.error?.details;
      if (Array.isArray(details)) {
        details.forEach((d) => {
          if (d?.field && d?.message) {
            form.setError(d.field, { type: "server", message: d.message });
          }
        });
      }
    }
  };

  const serverError = error
    ? normalizeError(error, { entity: "sign-in", action: "sign in to" })
    : null;

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
                Farmdeck
              </div>
            </Reveal>
            <Reveal delay={100} duration={500}>
              <CardTitle className="font-heading text-2xl font-bold tracking-tight">
                Welcome back
              </CardTitle>
            </Reveal>
            <Reveal delay={160} duration={500}>
              <CardDescription className="text-sm">
                Sign in to your farm dashboard to keep things growing.
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
                    name="emailId"
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
                          Email
                        </FormLabel>
                        <FormControl>
                          <FieldWrapper
                            icon={IconMail}
                            hasError={!!form.formState.errors.emailId}
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

                  <FormField
                    control={form.control}
                    name="password"
                    rules={{
                      required: "Password is required",
                      minLength: { value: 8, message: "At least 8 characters" },
                      maxLength: { value: 72, message: "At most 72 characters" },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                            Password
                          </FormLabel>
                          <button
                            type="button"
                            className="text-xs font-semibold text-leaf transition-colors hover:text-leaf/80 hover:underline"
                            tabIndex={-1}
                          >
                            Forgot?
                          </button>
                        </div>
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
                                  showPassword ? "Hide password" : "Show password"
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
                              autoComplete="current-password"
                              placeholder="Enter your password"
                              className="h-10 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
                            />
                          </FieldWrapper>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <label className="flex cursor-pointer items-center gap-2 pt-1 text-xs text-muted-foreground select-none">
                    <Checkbox
                      checked={remember}
                      onCheckedChange={(v) => setRemember(v === true)}
                      className="size-4"
                    />
                    <span>Keep me signed in on this device</span>
                  </label>

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
                          Signing in…
                        </>
                      ) : (
                        <>
                          <IconKey className="size-4" strokeWidth={2} />
                          Sign in
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
                <span>Secured with HttpOnly cookies — nothing stored locally.</span>
              </div>
            </Reveal>
          </CardContent>

          {/* ---------- Footer ---------- */}
          <div className="border-t border-foreground/5 bg-background/40 px-6 py-4 backdrop-blur-sm">
            <Reveal delay={400} duration={500}>
              <p className="text-center text-sm text-muted-foreground">
                New to Farmdeck?{" "}
                <Link
                  to="/"
                  className="font-semibold text-leaf underline-offset-4 transition-colors hover:text-leaf/80 hover:underline"
                >
                  Learn more
                </Link>
              </p>
            </Reveal>
          </div>
        </Card>
      </Reveal>
    </AuthLayout>
  );
}

function FieldWrapper({ icon: Icon, trailing, hasError, children }) {
  return (
    <div
      className={cn(
        "group/field relative flex items-center gap-2 rounded-xl border bg-card/60 px-3 transition-all",
        "border-input ring-1 ring-transparent",
        "focus-within:border-leaf/60 focus-within:ring-leaf/30 focus-within:bg-card/80",
        hasError &&
          "border-destructive/60 ring-destructive/20 focus-within:border-destructive focus-within:ring-destructive/30"
      )}
    >
      <Icon
        className={cn(
          "size-4 shrink-0 transition-colors",
          hasError ? "text-destructive" : "text-muted-foreground"
        )}
        strokeWidth={1.75}
      />
      <div className="flex-1">{children}</div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
}
