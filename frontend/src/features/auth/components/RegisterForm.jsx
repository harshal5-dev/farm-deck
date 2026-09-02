import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  IconArrowRight,
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconLock,
  IconLockCheck,
  IconMail,
  IconUser,
  IconUserPlus,
} from "@tabler/icons-react";
import { Reveal } from "@/components/effects";
import ErrorState from "@/components/ui/error-state";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FieldWrapper from "@/components/ui/field-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { buildPasswordChecks, calcPasswordStrength } from "./password-strength";
import {
  PasswordRequirementsList,
  PasswordStrengthMeter,
} from "./PasswordStrength";

const NAME_PATTERN = /^[\p{L}][\p{L}\s'.-]*$/u;

/**
 * RegisterForm — the demo sign-up form. Follows the same conventions as
 * LoginForm / AcceptInvitationForm (FieldWrapper inputs, uppercase labels,
 * shimmer submit button). `onSubmit(values, form)` receives the form instance
 * so the page can surface mock-server field errors via form.setError().
 */
const RegisterForm = ({ onSubmit, serverError, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm({
    defaultValues: {
      fullName: "",
      emailId: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const password = useWatch({ control: form.control, name: "password" }) || "";
  const confirmPassword =
    useWatch({ control: form.control, name: "confirmPassword" }) || "";

  const checks = useMemo(() => buildPasswordChecks(password), [password]);
  const strength = useMemo(() => calcPasswordStrength(checks), [checks]);

  const handleSubmit = async (values) => {
    await onSubmit(values, form);
  };

  return (
    <Reveal delay={220} duration={500}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
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

          {/* Full name */}
          <FormField
            control={form.control}
            name="fullName"
            rules={{
              required: "Name is required",
              minLength: { value: 2, message: "At least 2 characters" },
              maxLength: { value: 80, message: "At most 80 characters" },
              validate: (v) =>
                NAME_PATTERN.test(v.trim()) ||
                "Letters, spaces, hyphens and apostrophes only",
            }}
            render={({ field, fieldState }) => (
              <FormItem className="gap-1.5">
                <FormLabel className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Full name
                </FormLabel>
                <FormControl>
                  <FieldWrapper icon={IconUser} hasError={fieldState.invalid}>
                    <Input
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Aisha Kumbhar"
                      className="border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      {...field}
                    />
                  </FieldWrapper>
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />

          {/* Email */}
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
            render={({ field, fieldState }) => (
              <FormItem className="gap-1.5">
                <FormLabel className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  Email
                </FormLabel>
                <FormControl>
                  <FieldWrapper icon={IconMail} hasError={fieldState.invalid}>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="you@farm.app"
                      className="border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      {...field}
                    />
                  </FieldWrapper>
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            rules={{
              required: "Password is required",
              minLength: { value: 8, message: "At least 8 characters" },
              maxLength: { value: 72, message: "At most 72 characters" },
              validate: (v) =>
                calcPasswordStrength(buildPasswordChecks(v)).score >= 2 ||
                "Pick a stronger password (mix of letters, numbers & symbols)",
            }}
            render={({ field, fieldState }) => (
              <FormItem className="gap-1.5">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Password
                  </FormLabel>
                  <span
                    className={`text-[10px] font-medium tracking-wide uppercase transition-colors ${strength.tone.text}`}
                  >
                    {strength.label}
                  </span>
                </div>
                <FormControl>
                  <FieldWrapper
                    icon={IconLock}
                    hasError={fieldState.invalid}
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
                          <IconEyeOff className="size-4" strokeWidth={1.75} />
                        ) : (
                          <IconEye className="size-4" strokeWidth={1.75} />
                        )}
                      </button>
                    }
                  >
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Create a strong password"
                      className="border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      {...field}
                    />
                  </FieldWrapper>
                </FormControl>
                <PasswordStrengthMeter
                  score={strength.score}
                  segments={strength.segments}
                  tone={strength.tone}
                />
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />

          {/* Confirm password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            rules={{
              required: "Please confirm your password",
              validate: (v) => v === password || "Passwords don't match",
            }}
            render={({ field, fieldState }) => {
              const matches =
                confirmPassword.length > 0 && confirmPassword === password;
              return (
                <FormItem className="gap-1.5">
                  <FormLabel className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Confirm password
                  </FormLabel>
                  <FormControl>
                    <FieldWrapper
                      icon={matches ? IconLockCheck : IconLock}
                      hasError={fieldState.invalid}
                      trailing={
                        <button
                          type="button"
                          onClick={() => setShowConfirm((s) => !s)}
                          className="text-muted-foreground/70 transition-colors hover:text-foreground"
                          aria-label={
                            showConfirm ? "Hide password" : "Show password"
                          }
                        >
                          {showConfirm ? (
                            <IconEyeOff className="size-4" strokeWidth={1.75} />
                          ) : (
                            <IconEye className="size-4" strokeWidth={1.75} />
                          )}
                        </button>
                      }
                    >
                      <Input
                        type={showConfirm ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Re-enter your password"
                        className="border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FieldWrapper>
                  </FormControl>
                  <FormMessage className="text-[11px]" />
                </FormItem>
              );
            }}
          />

          {/* Requirements checklist */}
          <PasswordRequirementsList checks={checks} />

          <Button
            type="submit"
            disabled={isLoading}
            className="group/submit relative mt-2 w-full overflow-hidden rounded-xl text-sm font-semibold shadow-md shadow-leaf/20 transition-all hover:shadow-lg hover:shadow-leaf/30"
          >
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/submit:translate-x-full"
            />
            <span className="relative inline-flex items-center gap-2">
              {isLoading ? (
                <>
                  <IconLoader2
                    className="size-4 animate-spin"
                    strokeWidth={2}
                  />
                  Creating your account…
                </>
              ) : (
                <>
                  <IconUserPlus className="size-4" strokeWidth={2} />
                  Create account
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
  );
};

export default RegisterForm;
