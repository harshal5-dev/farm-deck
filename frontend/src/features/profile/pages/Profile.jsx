import { useEffect, useId, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  IconArrowLeft,
  IconUser,
  IconMail,
  IconShieldCheck,
  IconLoader2,
  IconCheck,
  IconLock,
  IconBuildingWarehouse,
  IconFingerprint,
  IconCopy,
  IconCalendar,
  IconCrown,
  IconCamera,
  IconChevronDown,
  IconLeaf,
  IconNote,
  IconBuilding,
} from "@tabler/icons-react";
import { useAuth } from "@/features/auth";
import {
  useUpdateProfileMutation,
  useUpdateTenantMutation,
} from "@/features/auth";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import {
  Form,
  FormField,
  FormItem,
  FormLabel as RHFLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Reveal } from "@/components/effects";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Avatar,
  DEFAULT_AVATAR_ID,
  FARM_AVATARS,
  getAvatar,
} from "@/components/avatars/avatars";
import { cn } from "@/lib/utils";

/* ---------- formatters ---------- */

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

function displayRole(role) {
  if (!role) return "Member";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function copyToClipboard(value, label = "Value") {
  if (!value) return;
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard
      .writeText(String(value))
      .then(() => toast.success(`${label} copied`, { description: value }))
      .catch(() => toast.error("Could not copy"));
  } else {
    toast.error("Clipboard not available");
  }
}

/* ---------- shared atoms ---------- */

function InfoTile({ icon: Icon, label, value, accent = "leaf", mono = false }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card/40 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-border/70 hover:bg-card/60 hover:shadow-md hover:shadow-foreground/5">
      <div
        className={cn(
          "pointer-events-none absolute -top-8 -right-8 size-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60",
          accent === "leaf" && "bg-leaf/25",
          accent === "sky" && "bg-sky-warm/25",
          accent === "clay" && "bg-clay/20",
          accent === "wheat" && "bg-wheat/30"
        )}
      />
      <div className="relative flex items-center gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-white/10 transition-transform duration-300 ring-inset group-hover:scale-105 dark:ring-white/5",
            accent === "leaf" &&
              "bg-gradient-to-br from-leaf/20 to-leaf/5 text-leaf",
            accent === "sky" &&
              "bg-gradient-to-br from-sky-warm/25 to-sky-warm/5 text-sky-warm",
            accent === "clay" &&
              "bg-gradient-to-br from-clay/25 to-clay/5 text-clay-deep dark:text-clay",
            accent === "wheat" &&
              "bg-gradient-to-br from-wheat/30 to-wheat/5 text-wheat"
          )}
        >
          <Icon className="size-4.5" strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
            {label}
          </p>
          <p
            className={cn(
              "truncate text-sm font-semibold text-foreground",
              mono && "font-mono"
            )}
          >
            {value || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

function LockedField({ icon: Icon, label, value, hint, id }) {
  const generatedId = useId();
  const fieldId = id || generatedId;
  return (
    <Field>
      <FieldLabel
        htmlFor={fieldId}
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        {Icon && <Icon className="size-3.5" strokeWidth={1.75} />}
        {label}
      </FieldLabel>
      <div className="relative">
        <Input
          id={fieldId}
          value={value || ""}
          readOnly
          disabled
          className="cursor-not-allowed pr-9 font-mono text-sm opacity-90"
        />
        <Tooltip>
          <TooltipTrigger className="absolute top-1/2 right-2.5 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground">
            <IconLock className="size-3.5" strokeWidth={1.85} />
          </TooltipTrigger>
          <TooltipContent>{hint || "This field is locked"}</TooltipContent>
        </Tooltip>
      </div>
      {hint && (
        <FieldDescription className="text-[11px]">{hint}</FieldDescription>
      )}
    </Field>
  );
}

/* ---------- avatar picker (popover) ---------- */

/**
 * AvatarPopover — click the trigger to open a popover containing the full
 * grid of farm illustrations. No page scroll, no auto-save: the user picks
 * one and the parent decides when to persist it.
 */
function AvatarPopover({ value, onChange }) {
  const currentLabel = getAvatar(value).label;
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label="Choose a profile avatar"
            className="group inline-flex items-center gap-1.5 rounded-xl border border-border/40 bg-card/40 px-3 py-2 text-sm font-medium transition-all hover:border-leaf/50 hover:bg-card/70 hover:shadow-sm"
          />
        }
      >
        <IconCamera
          className="size-3.5 text-muted-foreground"
          strokeWidth={1.75}
        />
        <span className="truncate">{currentLabel}</span>
        <IconChevronDown
          className="size-3.5 text-muted-foreground transition-transform group-data-[popup-open]:rotate-180"
          strokeWidth={1.75}
        />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={8}
        className="w-[min(28rem,calc(100vw-2rem))] p-4"
      >
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">
            Pick a profile avatar
          </p>
          <Badge variant="amber" className="gap-1">
            {FARM_AVATARS.length} styles
          </Badge>
        </div>
        <div className="grid max-h-72 grid-cols-6 gap-2 overflow-y-auto pr-1 sm:gap-2.5">
          {FARM_AVATARS.map((a) => {
            const isSelected = a.id === value;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => onChange(a.id)}
                title={a.label}
                aria-label={`Select ${a.label} avatar`}
                aria-pressed={isSelected}
                className={cn(
                  "group/cell relative aspect-square overflow-hidden rounded-xl border-2 transition-all",
                  isSelected
                    ? "scale-[1.04] border-leaf shadow-md ring-2 shadow-leaf/25 ring-leaf/30"
                    : "border-border/40 hover:scale-[1.03] hover:border-leaf/50 hover:shadow-sm hover:shadow-leaf/10"
                )}
              >
                <a.Component />
                {isSelected && (
                  <div className="absolute top-0.5 right-0.5 flex size-4 items-center justify-center rounded-full bg-leaf text-white shadow ring-1 ring-background">
                    <IconCheck className="size-2.5" strokeWidth={3} />
                  </div>
                )}
                <div
                  className={cn(
                    "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-0.5 py-0.5 text-center transition-opacity",
                    isSelected
                      ? "opacity-100"
                      : "opacity-0 group-hover/cell:opacity-100"
                  )}
                >
                  <p className="truncate text-[8px] font-semibold tracking-wide text-white uppercase">
                    {a.label}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Your choice saves when you click{" "}
          <span className="font-medium text-foreground">Save changes</span>{" "}
          below.
        </p>
      </PopoverContent>
    </Popover>
  );
}

/* ============================================================ */

export default function Profile() {
  const { user, updateUser } = useAuth();
  const u = user || {};
  const savedAvatarId = u.profilePicture || DEFAULT_AVATAR_ID;

  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const [updateTenant, { isLoading: isSavingTenant }] =
    useUpdateTenantMutation();

  const memberSince = useMemo(() => formatDate(u.createdAt), [u.createdAt]);
  const isOwner = (u.role || "").toLowerCase() === "owner";

  const tenantName = u.tenantDetails?.name || u.tenantName || "";
  const tenantDescription = u.tenantDetails?.description || "";
  const tenantInitial =
    (tenantName || "F").trim().charAt(0).toUpperCase() || "F";

  /* ---- profile form (fullName + avatarId) ---- */
  const form = useForm({
    defaultValues: {
      fullName: u.fullName || "",
      avatarId: savedAvatarId,
    },
  });

  // Re-sync the form when the loaded user changes (e.g. after refetch).
  const lastUserIdRef = useRef(u.id);
  useEffect(() => {
    if (lastUserIdRef.current !== u.id) {
      lastUserIdRef.current = u.id;
      form.reset({
        fullName: u.fullName || "",
        avatarId: u.profilePicture || DEFAULT_AVATAR_ID,
      });
    }
  }, [u.id, u.fullName, u.profilePicture, form]);

  const watchedAvatarId = form.watch("avatarId");
  const watchedFullName = form.watch("fullName");
  const previewAvatarId = watchedAvatarId || savedAvatarId;
  const previewLabel = getAvatar(previewAvatarId).label;
  const isDirty =
    watchedFullName !== (u.fullName || "") || previewAvatarId !== savedAvatarId;

  const onProfileSubmit = async (values) => {
    try {
      const payload = {
        fullName: values.fullName,
        profilePicture: values.avatarId,
      };
      await updateProfile(payload).unwrap();
      updateUser({
        fullName: values.fullName,
        profilePicture: values.avatarId,
      });
      toast.success("Profile updated", {
        description: "Your changes have been saved.",
      });
    } catch (err) {
      toast.error("Could not save profile", {
        description: err?.data?.error?.message || "Please try again.",
      });
    }
  };

  const onProfileReset = () =>
    form.reset({
      fullName: u.fullName || "",
      avatarId: savedAvatarId,
    });

  /* ---- tenant form (name + description) ---- */
  const tenantForm = useForm({
    defaultValues: {
      name: tenantName,
      description: tenantDescription,
    },
  });

  // Re-sync tenant form when the loaded user changes.
  const lastTenantIdRef = useRef(u.tenantDetails?.id);
  useEffect(() => {
    if (lastTenantIdRef.current !== u.tenantDetails?.id) {
      lastTenantIdRef.current = u.tenantDetails?.id;
      tenantForm.reset({
        name: tenantName,
        description: tenantDescription,
      });
    }
  }, [u.tenantDetails?.id, tenantName, tenantDescription, tenantForm]);

  const watchedName = tenantForm.watch("name");
  const watchedDescription = tenantForm.watch("description");
  const tenantIsDirty =
    (watchedName ?? "") !== tenantName ||
    (watchedDescription ?? "") !== tenantDescription;

  const onTenantSubmit = async (values) => {
    try {
      const payload = {
        name: values.name?.trim(),
        description: values.description?.trim() || null,
      };
      const updated = await updateTenant(payload).unwrap();
      // Merge the response into the cached user (preserves the rest of the
      // profile — getProfile will be re-fetched via the "Profile" tag too).
      const nextTenant = updated?.tenantDetails ?? {
        ...u.tenantDetails,
        ...payload,
      };
      updateUser({ tenantDetails: nextTenant, tenantName: nextTenant.name });
      toast.success("Company updated", {
        description: "Your company details have been saved.",
      });
    } catch (err) {
      toast.error("Could not save company", {
        description: err?.data?.error?.message || "Please try again.",
      });
    }
  };

  const onTenantReset = () =>
    tenantForm.reset({ name: tenantName, description: tenantDescription });

  return (
    <TooltipProvider delay={200}>
      <div className="mx-auto space-y-6">
        {/* Back link */}
        <Reveal duration={400}>
          <Link
            to="/app"
            className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <IconArrowLeft
              className="size-4 transition-transform group-hover:-translate-x-0.5"
              strokeWidth={1.75}
            />
            Back to Dashboard
          </Link>
        </Reveal>

        {/* ---------------- Hero ---------------- */}
        <Reveal delay={60} duration={500}>
          <Card
            size="sm"
            className="glass-card texture-paper highlight-edge relative gap-0 overflow-hidden rounded-3xl border-0 p-0 ring-1 ring-foreground/5 [--card-spacing:--spacing(0)]"
          >
            {/* Cover with layered gradients */}
            <div className="relative h-32 overflow-hidden sm:h-40">
              <div className="absolute inset-0 bg-gradient-to-br from-leaf via-sage-deep to-sky-warm" />
              <div className="absolute -top-16 -right-16 size-48 rounded-full bg-wheat/40 blur-3xl" />
              <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-sky-warm/30 blur-3xl" />
              <div className="pattern-contour absolute inset-0 opacity-60 mix-blend-soft-light" />
              <div className="texture-paper absolute inset-0 opacity-30" />
              <svg
                className="absolute inset-x-0 bottom-0 h-12 w-full opacity-30"
                viewBox="0 0 1200 80"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M0 60 Q150 30 300 50 T600 40 T900 50 T1200 30 V80 H0 Z"
                  fill="currentColor"
                  className="text-foreground/30"
                />
                <path
                  d="M0 70 Q200 50 400 60 T800 55 T1200 60 V80 H0 Z"
                  fill="currentColor"
                  className="text-foreground/40"
                />
              </svg>
            </div>

            {/* Identity strip */}
            <div className="relative px-6 pt-0 pb-6 sm:px-8 sm:pb-7">
              <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-end sm:gap-6">
                {/* Avatar — overlapping the cover */}
                <div className="relative -mt-12 shrink-0 sm:-mt-14">
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-leaf/40 via-sky-warm/30 to-clay/30 opacity-70 blur-xl" />
                  <div className="relative rounded-full bg-background p-1 shadow-lg ring-1 ring-foreground/5">
                    <Avatar
                      id={previewAvatarId}
                      className="size-24 sm:size-28"
                      title={previewLabel}
                    />
                    {isOwner && (
                      <Tooltip>
                        <TooltipTrigger className="absolute right-0 bottom-0 inline-flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-clay to-clay-deep text-white shadow-md ring-2 ring-background transition-transform hover:scale-105">
                          <IconCrown className="size-4" strokeWidth={2} />
                        </TooltipTrigger>
                        <TooltipContent>Owner of this workspace</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>

                {/* Name + meta */}
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                      {u.fullName || "Your name"}
                    </h1>
                    <Badge variant="emerald" className="gap-1">
                      <span className="relative flex size-1.5">
                        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                      </span>
                      Active
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                    <Tooltip>
                      <TooltipTrigger
                        onClick={(e) => {
                          e.preventDefault();
                          copyToClipboard(u.emailId, "Email");
                        }}
                        className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                      >
                        <IconMail className="size-3.5" strokeWidth={1.75} />
                        <span className="truncate">{u.emailId || "—"}</span>
                        <IconCopy
                          className="size-3 opacity-50"
                          strokeWidth={1.75}
                        />
                      </TooltipTrigger>
                      <TooltipContent>Copy email</TooltipContent>
                    </Tooltip>

                    <span className="hidden h-3 w-px bg-border sm:inline-block" />

                    <span className="inline-flex items-center gap-1.5">
                      <IconBuildingWarehouse
                        className="size-3.5"
                        strokeWidth={1.75}
                      />
                      {u.tenantName || u.tenantDetails?.name || "Your company"}
                    </span>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex items-center gap-2 sm:pb-1">
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => copyToClipboard(u.emailId, "Email")}
                          aria-label="Copy email"
                          className="text-muted-foreground"
                        />
                      }
                    >
                      <IconMail className="size-4" strokeWidth={1.75} />
                    </TooltipTrigger>
                    <TooltipContent>Copy email</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Stat strip — sits at bottom of hero */}
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Reveal delay={140} duration={500} changeKey="stat-role">
                  <InfoTile
                    icon={IconShieldCheck}
                    label="Role"
                    value={displayRole(u.role)}
                    accent="leaf"
                  />
                </Reveal>
                <Reveal delay={200} duration={500} changeKey="stat-since">
                  <InfoTile
                    icon={IconCalendar}
                    label="Member since"
                    value={memberSince}
                    accent="sky"
                  />
                </Reveal>
                <Reveal delay={260} duration={500} changeKey="stat-sub">
                  <InfoTile
                    icon={IconFingerprint}
                    label="Subdomain"
                    value={u.tenantDetails?.subdomain || "—"}
                    accent="clay"
                    mono
                  />
                </Reveal>
                <Reveal delay={320} duration={500} changeKey="stat-id">
                  <InfoTile
                    icon={IconLeaf}
                    label="Company name"
                    value={u.tenantName || u.tenantDetails?.name || "Farm Deck"}
                    accent="wheat"
                  />
                </Reveal>
              </div>
            </div>
          </Card>
        </Reveal>

        {/* ---------------- Tabs ---------------- */}
        <Reveal delay={180} duration={500}>
          <Tabs defaultValue="profile" className="mx-auto">
            <div className="flex items-center justify-between gap-3">
              <TabsList>
                <TabsTrigger value="profile" icon={IconUser}>
                  Personal info
                </TabsTrigger>
                <TabsTrigger value="company" icon={IconBuildingWarehouse}>
                  Company
                </TabsTrigger>
              </TabsList>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Changes save when you press the Save button.
              </p>
            </div>

            {/* §1 — Personal info (always-on form, popover avatar) */}
            <TabsContent value="profile">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onProfileSubmit)} noValidate>
                  <Card className="glass-card texture-paper rounded-3xl">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-leaf/20 to-leaf/5 text-leaf ring-1 ring-white/10 ring-inset dark:ring-white/5">
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
                                <span className="flex items-center gap-1.5 text-sm leading-none font-medium select-none">
                                  <IconCamera
                                    className="size-3.5 text-muted-foreground"
                                    strokeWidth={1.75}
                                  />
                                  Profile avatar
                                </span>
                                <div className="flex flex-col items-center gap-3">
                                  <div className="relative shrink-0">
                                    <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-leaf/30 to-sky-warm/30 blur-md" />
                                    <Avatar
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
                              render={({ field }) => (
                                <FormItem>
                                  <RHFLabel className="flex items-center gap-1.5">
                                    <IconUser
                                      className="size-3.5 text-muted-foreground"
                                      strokeWidth={1.75}
                                    />
                                    Full name
                                  </RHFLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <IconUser
                                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                                        strokeWidth={1.75}
                                      />
                                      <Input
                                        placeholder="Your full name"
                                        autoComplete="name"
                                        className="pl-9"
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <LockedField
                              icon={IconMail}
                              label="Email"
                              value={u.emailId}
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
            </TabsContent>

            {/* §2 — Company (tenant) */}
            <TabsContent value="company">
              <Form {...tenantForm}>
                <form
                  onSubmit={tenantForm.handleSubmit(onTenantSubmit)}
                  noValidate
                >
                  <Card className="glass-card texture-paper rounded-3xl">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-warm/25 to-sky-warm/5 text-sky-warm ring-1 ring-white/10 ring-inset dark:ring-white/5">
                          <IconBuildingWarehouse
                            className="size-4.5"
                            strokeWidth={1.75}
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-heading text-base font-semibold tracking-tight">
                            Company
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Your farm organization and workspace details
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <FieldGroup>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-7">
                          {/* Left column — Workspace identity card */}
                          <div className="flex flex-col items-center sm:items-start">
                            <FieldLabel className="flex items-center gap-1.5">
                              <IconBuilding
                                className="size-3.5 text-muted-foreground"
                                strokeWidth={1.75}
                              />
                              Workspace
                            </FieldLabel>
                            <div className="relative w-full max-w-[12rem]">
                              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-sky-warm/30 via-leaf/20 to-clay/30 opacity-70 blur-md" />
                              <div className="relative overflow-hidden rounded-2xl border border-foreground/5 bg-card/40 p-4 shadow-md">
                                <div className="absolute inset-0 bg-gradient-to-br from-sky-warm/15 via-transparent to-leaf/10" />
                                <div className="pattern-contour absolute inset-0 opacity-50 mix-blend-soft-light" />
                                <div className="relative flex flex-col items-center gap-3 text-center">
                                  <div className="relative shrink-0">
                                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-sky-warm/40 to-leaf/40 opacity-70 blur-md" />
                                    <div className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-warm via-leaf to-sage-deep text-3xl font-bold text-white shadow-md ring-2 ring-background">
                                      {tenantInitial}
                                    </div>
                                  </div>
                                  <div className="w-full min-w-0">
                                    <p className="truncate text-sm font-semibold tracking-tight text-foreground">
                                      {tenantName || "Your company"}
                                    </p>
                                    {u.tenantDetails?.subdomain && (
                                      <p className="mt-0.5 truncate rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                                        {u.tenantDetails.subdomain}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right column — Editable form + locked fields */}
                          <div className="flex flex-col gap-4">
                            <FormField
                              control={tenantForm.control}
                              name="name"
                              rules={{
                                required: "Company name is required",
                                minLength: {
                                  value: 2,
                                  message: "At least 2 characters",
                                },
                                maxLength: {
                                  value: 100,
                                  message: "Too long",
                                },
                              }}
                              render={({ field }) => (
                                <FormItem>
                                  <RHFLabel className="flex items-center gap-1.5">
                                    <IconBuildingWarehouse
                                      className="size-3.5 text-muted-foreground"
                                      strokeWidth={1.75}
                                    />
                                    Company name
                                  </RHFLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <IconBuildingWarehouse
                                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                                        strokeWidth={1.75}
                                      />
                                      <Input
                                        placeholder="Your farm organization name"
                                        autoComplete="organization"
                                        className="pl-9"
                                        {...field}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={tenantForm.control}
                              name="description"
                              rules={{
                                maxLength: {
                                  value: 500,
                                  message: "Description is too long",
                                },
                              }}
                              render={({ field }) => (
                                <FormItem>
                                  <div className="flex items-center justify-between gap-2">
                                    <RHFLabel className="flex items-center gap-1.5">
                                      <IconNote
                                        className="size-3.5 text-muted-foreground"
                                        strokeWidth={1.75}
                                      />
                                      Description
                                    </RHFLabel>
                                    <span className="text-[10px] text-muted-foreground/70 tabular-nums">
                                      {field.value?.length ?? 0}/500
                                    </span>
                                  </div>
                                  <FormControl>
                                    <div className="relative">
                                      <IconNote
                                        className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground"
                                        strokeWidth={1.75}
                                      />
                                      <Textarea
                                        placeholder="Tell members what this workspace is for…"
                                        className="resize-y pl-9"
                                        {...field}
                                        value={field.value ?? ""}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormDescription>
                                    A short blurb about your farm organization.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
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
                        onClick={onTenantReset}
                        disabled={!tenantIsDirty || isSavingTenant}
                      >
                        Discard
                      </Button>
                      <Button
                        type="submit"
                        disabled={!tenantIsDirty || isSavingTenant}
                        className="gap-2"
                      >
                        {isSavingTenant ? (
                          <IconLoader2
                            className="size-4 animate-spin"
                            strokeWidth={2}
                          />
                        ) : (
                          <IconCheck className="size-4" strokeWidth={2} />
                        )}
                        {isSavingTenant ? "Saving…" : "Save changes"}
                      </Button>
                    </div>
                  </Card>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </Reveal>

        {/* Footer hint */}
        <Reveal delay={240} duration={500}>
          <p className="text-center text-[11px] text-muted-foreground/70">
            Your profile syncs to your account across devices.
          </p>
        </Reveal>
      </div>
    </TooltipProvider>
  );
}
