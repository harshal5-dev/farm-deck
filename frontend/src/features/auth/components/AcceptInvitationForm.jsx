import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  IconCheck,
  IconEye,
  IconEyeOff,
  IconKey,
  IconLoader2,
  IconLock,
  IconLockCheck,
  IconShield,
  IconX,
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

/**
 * AcceptInvitationForm — themed password form shown after the invitation
 * token is verified. Lets the invitee pick a password (min 8 chars, max
 * 72) and confirm it, with a live strength meter + requirements list so
 * they don't submit a weak password only to bounce off server validation.
 *
 * Props:
 *  - onSubmit: async (values) => void   parent handles the API call + redirect
 *  - serverError: { title, message }?   optional inline error from the server
 *  - isLoading: boolean                 disables the submit while the request is in flight
 */
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

  const checks = useMemo(() => buildChecks(password), [password]);
  const strength = useMemo(() => calcStrength(checks), [checks]);

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
              calcStrength(buildChecks(v)).score >= 2 ||
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
                      aria-label={showPassword ? "Hide password" : "Show password"}
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
              <StrengthMeter
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
        <RequirementsList checks={checks} />

        <Reveal delay={80} duration={400}>
          <Button
            type="submit"
            disabled={isLoading}
            className="group/submit relative h-11 w-full overflow-hidden rounded-xl text-sm font-semibold shadow-md shadow-leaf/20 transition-all hover:shadow-lg hover:shadow-leaf/30"
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

/* -------------------------------------------------------------------------- */
/*  Strength meter + checklist (file-local — no exports).                     */
/* -------------------------------------------------------------------------- */

function buildChecks(pw) {
  return {
    length: pw.length >= 8 && pw.length <= 72,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /\d/.test(pw),
    symbol: /[^A-Za-z0-9]/.test(pw),
  };
}

function calcStrength(checks) {
  const passed = Object.values(checks).filter(Boolean).length;
  // Score 0–4 (the 5th "segment" is for 5/5 = excellent)
  const score = Math.max(0, passed - 1);
  const segments = passed;
  const label =
    passed === 0
      ? "Empty"
      : passed <= 2
        ? "Weak"
        : passed === 3
          ? "Fair"
          : passed === 4
            ? "Strong"
            : "Excellent";

  const tone = STRENGTH_TONES[score] || STRENGTH_TONES[0];
  return { score, segments, label, tone };
}

const STRENGTH_TONES = [
  // index = score 0..4
  {
    bar: "bg-destructive/60",
    fill: "bg-destructive",
    text: "text-destructive",
    ring: "ring-destructive/25",
  },
  {
    bar: "bg-clay/30",
    fill: "bg-clay",
    text: "text-clay-deep dark:text-clay",
    ring: "ring-clay/30",
  },
  {
    bar: "bg-wheat/35",
    fill: "bg-wheat-deep",
    text: "text-wheat-deep dark:text-wheat",
    ring: "ring-wheat/35",
  },
  {
    bar: "bg-leaf/25",
    fill: "bg-leaf",
    text: "text-leaf",
    ring: "ring-leaf/30",
  },
  {
    bar: "bg-sage/30",
    fill: "bg-sage-deep",
    text: "text-sage-deep dark:text-sage",
    ring: "ring-sage/40",
  },
];

function StrengthMeter({ score, segments, tone }) {
  return (
    <div
      className="mt-1.5 flex gap-1.5"
      role="meter"
      aria-valuenow={score}
      aria-valuemin={0}
      aria-valuemax={4}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const filled = i < segments;
        return (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-300",
              filled ? tone.fill : tone.bar
            )}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}

const REQUIREMENTS = [
  { key: "length", label: "8–72 characters" },
  { key: "upper", label: "One uppercase letter" },
  { key: "lower", label: "One lowercase letter" },
  { key: "number", label: "One number" },
  { key: "symbol", label: "One special character" },
];

function RequirementsList({ checks }) {
  return (
    <ul className="grid grid-cols-1 gap-1 rounded-xl border border-border/40 bg-card/40 p-3 text-[11px] sm:grid-cols-2">
      {REQUIREMENTS.map((req) => {
        const passed = checks[req.key];
        return (
          <li
            key={req.key}
            className={cn(
              "flex items-center gap-1.5 transition-colors",
              passed ? "text-leaf" : "text-muted-foreground/80"
            )}
          >
            <span
              className={cn(
                "flex size-4 shrink-0 items-center justify-center rounded-full ring-1 ring-inset transition-colors",
                passed
                  ? "bg-leaf/15 ring-leaf/40"
                  : "bg-muted/40 ring-border"
              )}
              aria-hidden="true"
            >
              {passed ? (
                <IconCheck className="size-2.5" strokeWidth={3} />
              ) : (
                <IconX className="size-2.5 text-muted-foreground/60" strokeWidth={2.5} />
              )}
            </span>
            <span className="leading-none">{req.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

// Re-export the icon in case the parent wants to render an icon next to the title.
export { IconKey as AcceptInvitationKeyIcon };
