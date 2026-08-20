import { useForm, useWatch } from "react-hook-form";
import {
  IconCamera,
  IconCheck,
  IconCircleCheckFilled,
  IconLoader2,
  IconMail,
  IconUser,
} from "@tabler/icons-react";
import { Reveal } from "@/components/effects";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FieldWrapper from "@/components/ui/field-wrapper";
import LockedField from "@/components/ui/locked-field";
import { DEFAULT_AVATAR_ID } from "@/components/avatars/avatars-data";
import ChipAvatarPicker from "./ChipAvatarPicker";
import ProfileIdentityPreview from "./ProfileIdentityPreview";

const fieldLabel =
  "text-xs font-semibold tracking-wide text-muted-foreground uppercase";

const ProfileForm = ({ onProfileSubmit, isSaving, user }) => {
  const savedAvatarId = user?.profilePicture || DEFAULT_AVATAR_ID;
  const role = user?.role || "viewer";

  const form = useForm({
    defaultValues: {
      fullName: user?.fullName || "",
      avatarId: savedAvatarId,
    },
  });

  const watchedAvatarId = useWatch({ control: form.control, name: "avatarId" });
  const watchedFullName = useWatch({ control: form.control, name: "fullName" });
  const previewAvatarId = watchedAvatarId || savedAvatarId;
  const isDirty =
    watchedFullName !== (user?.fullName || "") ||
    previewAvatarId !== savedAvatarId;

  const onProfileReset = () =>
    form.reset({
      fullName: user?.fullName || "",
      avatarId: savedAvatarId,
    });

  return (
    <Reveal delay={60} duration={500}>
      {/* `overflow-hidden` + `min-w-0` contain the grid horizontally so
          nothing inside leaks past the card edge. */}
      <div className="glass-card texture-paper highlight-edge min-w-0 overflow-hidden rounded-2xl p-4 sm:p-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onProfileSubmit)} noValidate>
            <div className="grid w-full min-w-0 items-stretch gap-5 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-5">
              {/* ===== Left — identity preview ===== */}
              <div className="min-w-0">
                <ProfileIdentityPreview
                  fullName={watchedFullName}
                  email={user?.emailId}
                  role={role}
                  avatarId={previewAvatarId}
                />
              </div>

              {/* ===== Right — form fields ===== */}
              <div className="flex min-w-0 flex-col gap-4">
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
                    <FormItem className="gap-1.5">
                      <FormLabel className={fieldLabel}>
                        Full name
                      </FormLabel>
                      <FormControl>
                        <FieldWrapper
                          icon={IconUser}
                          hasError={fieldState.invalid}
                          trailing={
                            <ChipAvatarPicker
                              value={watchedAvatarId}
                              onChange={(val) =>
                                form.setValue("avatarId", val, {
                                  shouldDirty: true,
                                })
                              }
                              disabled={isSaving}
                            />
                          }
                        >
                          <Input
                            placeholder="Your full name"
                            autoComplete="name"
                            className="border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </FieldWrapper>
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                {/* Email — locked */}
                <LockedField
                  icon={IconMail}
                  label="Email address"
                  value={user?.emailId}
                  hint="Email is tied to your account and can't be changed here."
                />

                {/* Tip — uses an icon for visual consistency */}
                <div className="mt-1 flex items-start gap-2 rounded-xl border border-border/40 bg-muted/30 px-3 py-2.5 text-[12px] text-muted-foreground">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-leaf/12 text-leaf">
                    <IconCamera className="size-3" strokeWidth={2.2} />
                  </span>
                  <span className="leading-relaxed">
                    Click the chip on the right of your name to pick a
                    different farm character — it shows up next to your name
                    across the workspace.
                  </span>
                </div>
              </div>
            </div>

            {/* ===== Footer ===== */}
            <div className="mt-4 flex flex-col gap-3 border-t border-border/40 pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
              <p className="text-[11px] text-muted-foreground sm:order-1">
                {isDirty ? (
                  <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                    <span className="size-1.5 rounded-full bg-amber-500" />
                    Unsaved changes
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground/70">
                    <IconCircleCheckFilled className="size-3 text-leaf" />
                    All changes saved
                  </span>
                )}
              </p>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:gap-2 sm:order-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onProfileReset}
                  disabled={!isDirty || isSaving}
                  className="w-full sm:w-auto"
                >
                  Discard
                </Button>
                <Button
                  type="submit"
                  disabled={!isDirty || isSaving}
                  className="w-full gap-2 shadow-md shadow-leaf/20 sm:w-auto"
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
            </div>
          </form>
        </Form>
      </div>
    </Reveal>
  );
};

export default ProfileForm;
