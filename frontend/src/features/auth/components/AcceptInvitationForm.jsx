import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  IconEye,
  IconEyeOff,
  IconKey,
  IconLoader2,
  IconLock,
  IconLockCheck,
  IconShield,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import ErrorState from "@/components/ui/error-state";
import { Reveal } from "@/components/effects";
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

const AcceptInvitationForm = ({ onSubmit, serverError, isLoading }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm({
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onChange",
  });

  const password = useWatch({ control: form.control, name: "password" }) || "";
  const confirmPassword =
    useWatch({ control: form.control, name: "confirmPassword" }) || "";

  const checks = useMemo(() => buildPasswordChecks(password), [password]);
  const strength = useMemo(() => calcPasswordStrength(checks), [checks]);

  const handleSubmit = async (values) => {
    await onSubmit({
      password: values.password,
      confirmPassword: values.confirmPassword,
    });
  };

  return (
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
                  className={cn(
                    "text-[10px] font-medium tracking-wide uppercase transition-colors",
                    strength.tone.text
                  )}
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
              {/* Strength meter */}
              <PasswordStrengthMeter
                score={strength.score}
                segments={strength.segments}
                tone={strength.tone}
              />
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />

        {/* Confirm */}
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

        <Reveal delay={80} duration={400}>
          <Button
            type="submit"
            disabled={isLoading}
            className="group/submit relative w-full overflow-hidden rounded-xl text-sm font-semibold shadow-md shadow-leaf/20 transition-all hover:shadow-lg hover:shadow-leaf/30"
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
                  Setting up your account…
                </>
              ) : (
                <>
                  <IconShield className="size-4" strokeWidth={2} />
                  Accept & join workspace
                </>
              )}
            </span>
          </Button>
        </Reveal>
      </form>
    </Form>
  );
};

export default AcceptInvitationForm;

// Re-export the icon in case the parent wants to render an icon next to the title.
export { IconKey as AcceptInvitationKeyIcon };
