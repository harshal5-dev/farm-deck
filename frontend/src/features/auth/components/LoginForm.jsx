import { useState } from "react";
import { useForm } from "react-hook-form";
import { Reveal } from "@/components/effects";
import ErrorState from "@/components/ui/error-state";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import FieldWrapper from "./FieldWrapper";
import { IconArrowRight, IconEye, IconEyeOff, IconKey, IconLoader2, IconLock, IconMail } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";


const LoginForm = ({ onSubmit, serverError, isLoading }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(true);

  const form = useForm({
    defaultValues: { emailId: "", password: "" },
  });


  return (
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
              className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/submit:translate-x-full"
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
  )
};

export default LoginForm;
