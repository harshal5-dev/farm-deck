import { Avatar as ProfileAvatar } from "@/components/avatars/avatars";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import FieldWrapper from "@/components/ui/field-wrapper";
import { IconCamera, IconCheck, IconLoader2, IconMail, IconUser } from "@tabler/icons-react";
import AvatarPopover from "./AvatarPopover";
import { Input } from "@/components/ui/input";
import LockedField from "@/components/ui/locked-field";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DEFAULT_AVATAR_ID } from "@/components/avatars/avatars-data";
import { cn } from "@/lib/utils";
import { useForm, useWatch } from "react-hook-form";

/** Uppercase tracking label style — matches the form labels app-wide. */
const fieldLabel =
  "text-xs font-semibold tracking-wide text-muted-foreground uppercase";

const ProfileForm = ({ onProfileSubmit, isSaving, user }) => {
  const savedAvatarId = user.profilePicture || DEFAULT_AVATAR_ID;

  const form = useForm({
    defaultValues: {
      fullName: user.fullName || "",
      avatarId: savedAvatarId,
    },
  });

  const watchedAvatarId = useWatch({ control: form.control, name: "avatarId" });
  const watchedFullName = useWatch({ control: form.control, name: "fullName" });
  const previewAvatarId = watchedAvatarId || savedAvatarId;
  const isDirty =
    watchedFullName !== (user.fullName || "") || previewAvatarId !== savedAvatarId;

  const onProfileReset = () =>
    form.reset({
      fullName: user.fullName || "",
      avatarId: savedAvatarId,
    });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onProfileSubmit)} noValidate>
        <Card className="glass-card texture-paper rounded-3xl">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-leaf/20 to-leaf/5 text-leaf ring-1 ring-white/10 ring-inset dark:ring-white/5">
                <IconUser className="size-4.5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading text-base font-semibold tracking-tight">
                  Personal info
                </h3>
                <p className="text-xs text-muted-foreground">
                  Your name, email, and profile avatar
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <FieldGroup>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-7">
                {/* Left column — Profile avatar */}
                <FormField
                  control={form.control}
                  name="avatarId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center">
                      <span
                        className={cn(
                          "flex items-center gap-1.5 leading-none select-none",
                          fieldLabel
                        )}
                      >
                        <IconCamera
                          className="size-3.5 text-muted-foreground"
                          strokeWidth={1.75}
                        />
                        Profile avatar
                      </span>
                      <div className="flex flex-col items-center gap-3">
                        <div className="relative shrink-0">
                          <div className="absolute -inset-1 rounded-full bg-linear-to-br from-leaf/30 to-sky-warm/30 blur-md" />
                          <ProfileAvatar
                            id={field.value || savedAvatarId}
                            className="relative size-20 shadow-md ring-4 ring-background"
                          />
                        </div>
                        <AvatarPopover
                          value={field.value || savedAvatarId}
                          onChange={field.onChange}
                        />
                      </div>
                      <FormDescription>
                        Pick a farm character to represent you.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* Right column — Name + locked email */}
                <div className="flex flex-col gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    rules={{
                      required: "Full name is required",
                      minLength: {
                        value: 2,
                        message: "At least 2 characters",
                      },
                      maxLength: {
                        value: 100,
                        message: "Too long",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className={fieldLabel}>Full name</FormLabel>
                        <FormControl>
                          <FieldWrapper
                            icon={IconUser}
                            hasError={fieldState.invalid}
                          >
                            <Input
                              placeholder="Your full name"
                              autoComplete="name"
                              className="border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                              {...field}
                            />
                          </FieldWrapper>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <LockedField
                    icon={IconMail}
                    label="Email"
                    value={user.emailId}
                    hint="Email is tied to your account and can't be changed here."
                  />
                </div>
              </div>
            </FieldGroup>
          </CardContent>

          <Separator />

          <div className="flex flex-wrap items-center justify-end gap-2 px-6 py-4 sm:px-8">
            <Button
              type="button"
              variant="ghost"
              onClick={onProfileReset}
              disabled={!isDirty || isSaving}
            >
              Discard
            </Button>
            <Button
              type="submit"
              disabled={!isDirty || isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <IconLoader2
                  className="size-4 animate-spin"
                  strokeWidth={2}
                />
              ) : (
                <IconCheck className="size-4" strokeWidth={2} />
              )}
              {isSaving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </Card>
      </form>
    </Form>
  );
};

export default ProfileForm;
