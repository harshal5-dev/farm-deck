import { useForm, useWatch } from "react-hook-form";
import {
  IconUser,
  IconMail,
  IconShieldCheck,
  IconCircleCheckFilled,
  IconLoader2,
  IconCheck,
  IconBolt,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
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
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ROLE_ORDER, getRole } from "@/constants/roles";
import AvatarPicker from "./AvatarPicker";
import IdentityPreview from "./IdentityPreview";
import RoleCard from "./RoleCard";
import RolePermissionsPreview from "./RolePermissionsPreview";


const fieldLabel =
  "text-xs font-semibold tracking-wide text-muted-foreground uppercase";

export default function UserForm({
  mode = "create",
  defaultValues,
  onSubmit,
  onCancel,
  submitting = false,
}) {
  const isEdit = mode === "edit";

  const form = useForm({
    defaultValues: {
      fullName: defaultValues?.fullName || "",
      emailId: defaultValues?.emailId || "",
      role: defaultValues?.role || "grower",
      profilePicture: defaultValues?.profilePicture || DEFAULT_AVATAR_ID,
    },
  });

  // Live values drive the identity preview.
  const fullName = useWatch({ control: form.control, name: "fullName" });
  const email = useWatch({ control: form.control, name: "emailId" });
  const role = useWatch({ control: form.control, name: "role" });
  const profilePicture = useWatch({ control: form.control, name: "profilePicture" });
  const { isDirty } = form.formState;

  const submit = async (values) => {
    await onSubmit({
      fullName: values.fullName.trim(),
      emailId: values.emailId.trim().toLowerCase(),
      role: values.role,
      profilePicture: values.profilePicture,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(submit)}
        noValidate
        className="flex h-full min-h-0 flex-col"
      >
        <div className="grid h-full min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
          {/* ===== Left — identity preview ===== */}
          <div className="flex min-h-0 flex-col">
            <IdentityPreview
              fullName={fullName}
              email={email}
              role={role}
              avatarId={profilePicture}
            />
          </div>

          {/* ===== Right — form fields ===== */}
          <div className="flex min-h-0 flex-col gap-3.5">
            {/* Avatar + Full name (avatar dropdown sits left of the name input) */}
            <div className="grid grid-cols-[auto_1fr] items-start gap-3 sm:gap-4">
              {/* Avatar — bound via FormField but rendered with its own layout */}
              <FormField
                control={form.control}
                name="profilePicture"
                render={({ field }) => (
                  <div>
                    <span className={cn("mb-1 flex items-center gap-1.5", fieldLabel)}>
                      <IconBolt className="size-3.5" strokeWidth={1.75} />
                      Avatar
                    </span>
                    <AvatarPicker
                      value={field.value}
                      onChange={field.onChange}
                      disabled={submitting}
                    />
                  </div>
                )}
              />

              {/* Full name */}
              <FormField
                control={form.control}
                name="fullName"
                rules={{
                  required: "Full name is required",
                  minLength: { value: 2, message: "At least 2 characters" },
                  maxLength: { value: 100, message: "Too long" },
                }}
                render={({ field, fieldState }) => (
                  <FormItem className="gap-1.5">
                    <FormLabel className={fieldLabel}>Full name</FormLabel>
                    <FormControl>
                      <FieldWrapper icon={IconUser} hasError={fieldState.invalid}>
                        <Input
                          placeholder="e.g. Priya Deshmukh"
                          autoComplete="name"
                          className="h-10 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FieldWrapper>
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            </div>

            {/* Email — editable in create, locked in edit */}
            {isEdit ? (
              <LockedField
                icon={IconMail}
                label="Email address"
                value={defaultValues?.emailId || email}
                hint="Email is managed by the workspace and can't be changed here"
              />
            ) : (
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
                    <FormLabel className={fieldLabel}>Email address</FormLabel>
                    <FormControl>
                      <FieldWrapper icon={IconMail} hasError={fieldState.invalid}>
                        <Input
                          type="email"
                          placeholder="grower@yourfarm.com"
                          autoComplete="email"
                          className="h-10 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FieldWrapper>
                    </FormControl>
                    <FormMessage className="text-[11px]" />
                  </FormItem>
                )}
              />
            )}

            {/* Role — 4 cards inline + permission preview */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <div>
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className={cn("flex items-center gap-1.5", fieldLabel)}>
                      <IconShieldCheck className="size-3.5" strokeWidth={1.75} />
                      Role
                    </span>
                    <Tooltip>
                      <TooltipTrigger className="text-[10px] font-medium text-muted-foreground hover:text-foreground">
                        What can each role do?
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <ul className="space-y-1 text-[11px]">
                          {ROLE_ORDER.map((id) => {
                            const r = getRole(id);
                            return (
                              <li key={id}>
                                <span className={cn("font-semibold", r.text)}>
                                  {r.label}:
                                </span>{" "}
                                {r.description}
                              </li>
                            );
                          })}
                        </ul>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {ROLE_ORDER.map((id) => (
                      <RoleCard
                        key={id}
                        roleId={id}
                        selected={field.value === id}
                        onSelect={field.onChange}
                      />
                    ))}
                  </div>
                  <RolePermissionsPreview roleId={field.value} />
                </div>
              )}
            />
          </div>
        </div>

        {/* ===== Footer (sticky to the bottom of the page column) ===== */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border/40 pt-3">
          <p className="text-[11px] text-muted-foreground">
            {isDirty ? (
              <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                <span className="size-1.5 rounded-full bg-amber-500" />
                Unsaved changes
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-muted-foreground/70">
                <IconCircleCheckFilled className="size-3 text-leaf" />
                {isEdit ? "All changes saved" : "Ready to add"}
              </span>
            )}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                form.reset();
                onCancel?.();
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || (isEdit && !isDirty)}
              className="gap-2 shadow-md shadow-leaf/20"
            >
              {submitting ? (
                <IconLoader2 className="size-4 animate-spin" strokeWidth={2} />
              ) : (
                <IconCheck className="size-4" strokeWidth={2} />
              )}
              {submitting
                ? isEdit
                  ? "Saving…"
                  : "Adding…"
                : isEdit
                  ? "Save changes"
                  : "Add member"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
