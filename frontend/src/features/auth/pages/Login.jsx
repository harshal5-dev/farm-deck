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
} from "@tabler/icons-react";
import {
  useLoginMutation,
  useLazyGetProfileQuery,
  setCredentials,
} from "@/features/auth";
import { normalizeError } from "@/lib/api-errors";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state";
import AuthLayout from "../components/AuthLayout";
import { Reveal } from "@/components/effects";

export default function Login() {
  const [login, { isLoading, error }] = useLoginMutation();
  const [fetchProfile] = useLazyGetProfileQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || "/app";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { emailId: "", password: "" },
  });

  const onSubmit = async (data) => {
    try {
      await login({ emailId: data.emailId, password: data.password }).unwrap();
      // Cookies are set by the backend; fetch the profile to hydrate the user.
      const profile = await fetchProfile().unwrap();
      dispatch(setCredentials(profile));
      toast.success("Welcome back!", {
        description: `Signed in as ${profile.emailId}`,
      });
      navigate(from, { replace: true });
    } catch (err) {
      // Map backend field-level validation errors onto the form.
      const details = err?.data?.error?.details;
      if (Array.isArray(details)) {
        details.forEach((d) => {
          if (d?.field && d?.message) {
            setError(d.field, { type: "server", message: d.message });
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
      <Reveal delay={0} duration={500}>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to your Farmdeck dashboard.
          </p>
        </div>
      </Reveal>

      <Reveal delay={100} duration={500}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4" noValidate>
          {serverError && (
            <ErrorState
              variant="auth"
              title={serverError.title}
              message={serverError.message}
              compact
            />
          )}

          <div className="space-y-2">
            <Label htmlFor="emailId">Email</Label>
            <div className="relative">
              <IconMail
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                strokeWidth={1.75}
              />
              <Input
                id="emailId"
                type="email"
                autoComplete="email"
                placeholder="you@farm.app"
                aria-invalid={!!errors.emailId}
                className="pl-9"
                {...register("emailId", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />
            </div>
            {errors.emailId && (
              <p className="text-xs text-red-500">{errors.emailId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                className="text-xs font-medium text-leaf hover:underline"
                tabIndex={-1}
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <IconLock
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                strokeWidth={1.75}
              />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                className="px-9"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "At least 8 characters" },
                  maxLength: { value: 72, message: "At most 72 characters" },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <IconEyeOff className="size-4" strokeWidth={1.75} />
                ) : (
                  <IconEye className="size-4" strokeWidth={1.75} />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full gap-2"
          >
            {isLoading && (
              <IconLoader2 className="size-4 animate-spin" strokeWidth={2} />
            )}
            {isLoading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Reveal>

      <Reveal delay={200} duration={500}>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/" className="font-semibold text-leaf hover:underline">
            Learn about Farmdeck
          </Link>
        </p>
      </Reveal>
    </AuthLayout>
  );
}
