import { useMemo, useState } from "react";
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
  IconSparkles,
  IconPalette,
  IconBuildingWarehouse,
  IconFingerprint,
  IconWorld,
  IconUserStar,
} from "@tabler/icons-react";
import { useAuth } from "@/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Reveal } from "@/components/effects";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Avatar,
  AvatarPicker,
  DEFAULT_AVATAR_ID,
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

/** Show the first 8 chars of a uuid + ellipsis, for compact tenant-id display. */
function shortId(id) {
  if (!id) return "—";
  return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

function MetaRow({ icon: Icon, label, value, accent = "leaf" }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card/40 px-3.5 py-3 transition-colors hover:border-border/70">
      <div
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl",
          accent === "leaf" && "bg-leaf/10 text-leaf",
          accent === "sky" && "bg-sky-warm/15 text-sky-warm",
          accent === "clay" && "bg-clay/10 text-clay",
          accent === "wheat" && "bg-wheat/20 text-wheat"
        )}
      >
        <Icon className="size-4" strokeWidth={1.85} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
          {label}
        </p>
        <p className="truncate text-sm font-medium text-foreground">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-leaf/10 text-leaf ring-1 ring-leaf/15">
          <Icon className="size-4" strokeWidth={1.85} />
        </div>
        <div>
          <h3 className="font-heading text-base font-bold tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

/* ============================================================ */

export default function Profile() {
  const { user, updateUser } = useAuth();
  const u = user || {};
  const avatarId = u.avatarId || DEFAULT_AVATAR_ID;

  const [editingProfile, setEditingProfile] = useState(false);
  const [editingCompany, setEditingCompany] = useState(false);

  const memberSince = useMemo(() => formatDate(u.createdAt), [u.createdAt]);
  const currentAvatarLabel = getAvatar(avatarId).label;

  /* ---- name-only edit ---- */
  const profileForm = useForm({
    defaultValues: { fullName: u.fullName || "" },
  });
  const onProfileSave = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    updateUser({ fullName: data.fullName });
    setEditingProfile(false);
    toast.success("Profile updated", {
      description: "Your name has been saved.",
    });
  };
  const onProfileCancel = () => {
    profileForm.reset({ fullName: u.fullName || "" });
    setEditingProfile(false);
  };

  /* ---- company-name edit (tenant name, local-only) ---- */
  const companyForm = useForm({
    defaultValues: { tenantName: u.tenantName || "" },
  });
  const onCompanySave = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    updateUser({ tenantName: data.tenantName });
    setEditingCompany(false);
    toast.success("Company updated", {
      description: "Your company name has been saved.",
    });
  };
  const onCompanyCancel = () => {
    companyForm.reset({ tenantName: u.tenantName || "" });
    setEditingCompany(false);
  };

  /* ---- avatar select ---- */
  const onAvatarSelect = (id) => {
    if (id === avatarId) return;
    updateUser({ avatarId: id });
    toast.success("Avatar updated", {
      description: "Your new avatar is saved.",
    });
  };

  return (
    <div className="mx-auto space-y-5">
      {/* Back link */}
      <Reveal duration={400}>
        <Link
          to="/app"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <IconArrowLeft className="size-4" strokeWidth={1.75} />
          Back to Dashboard
        </Link>
      </Reveal>

      {/* Page heading */}
      <Reveal delay={60} duration={500}>
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            Your profile
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Manage your personal details, avatar, and company.
          </p>
        </div>
      </Reveal>

      <Reveal delay={120} duration={500}>
        <Tabs defaultValue="profile" className="mx-auto">
          {/* Tab strip */}
          <TabsList>
            <TabsTrigger value="profile" icon={IconUser}>
              Personal details
            </TabsTrigger>
            <TabsTrigger value="avatar" icon={IconPalette}>
              Avatar
            </TabsTrigger>
            <TabsTrigger value="company" icon={IconBuildingWarehouse}>
              Company
            </TabsTrigger>
          </TabsList>

          {/* §1 — Personal details */}
          <TabsContent value="profile">
            <div className="glass-card texture-paper rounded-3xl p-6 sm:p-8">
              <SectionHeader
                icon={IconUser}
                title="Personal details"
                subtitle="Your name and account email"
                action={
                  !editingProfile && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingProfile(true)}
                      className="gap-1.5"
                    >
                      <IconSparkles className="size-3.5" strokeWidth={2} />
                      Edit
                    </Button>
                  )
                }
              />

              {!editingProfile ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <MetaRow
                    icon={IconUser}
                    label="Full name"
                    value={u.fullName}
                    accent="leaf"
                  />
                  <MetaRow
                    icon={IconMail}
                    label="Email"
                    value={u.emailId}
                    accent="sky"
                  />
                  <MetaRow
                    icon={IconShieldCheck}
                    label="Role"
                    value={displayRole(u.role)}
                    accent="clay"
                  />
                  <MetaRow
                    icon={IconUserStar}
                    label="Member since"
                    value={memberSince}
                    accent="wheat"
                  />
                </div>
              ) : (
                <form
                  onSubmit={profileForm.handleSubmit(onProfileSave)}
                  className="mt-5 space-y-4"
                  noValidate
                >
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <div className="relative">
                      <IconUser
                        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        strokeWidth={1.75}
                      />
                      <Input
                        id="fullName"
                        placeholder="Your full name"
                        autoComplete="name"
                        className="pl-9"
                        aria-invalid={!!profileForm.formState.errors.fullName}
                        {...profileForm.register("fullName", {
                          required: "Full name is required",
                          minLength: { value: 2, message: "At least 2 characters" },
                          maxLength: { value: 100, message: "Too long" },
                        })}
                      />
                    </div>
                    {profileForm.formState.errors.fullName && (
                      <p className="text-xs text-red-500">
                        {profileForm.formState.errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Email — read-only */}
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
                        value={u.emailId || ""}
                        readOnly
                        disabled
                        className="cursor-not-allowed pl-9 opacity-80"
                      />
                      <IconLock
                        className="absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60"
                        strokeWidth={1.85}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Email is tied to your account and can&apos;t be changed
                      here.
                    </p>
                  </div>

                  <Separator className="my-1" />

                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onProfileCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={profileForm.formState.isSubmitting}
                      className="gap-2"
                    >
                      {profileForm.formState.isSubmitting ? (
                        <IconLoader2
                          className="size-4 animate-spin"
                          strokeWidth={2}
                        />
                      ) : (
                        <IconCheck className="size-4" strokeWidth={2} />
                      )}
                      {profileForm.formState.isSubmitting
                        ? "Saving…"
                        : "Save changes"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </TabsContent>

          {/* §2 — Avatar */}
          <TabsContent value="avatar">
            <div className="glass-card texture-paper rounded-3xl p-6 sm:p-8">
              <SectionHeader
                icon={IconPalette}
                title="Avatar"
                subtitle="Pick a character that represents you"
              />

              {/* Current avatar preview strip */}
              <div className="mt-5 flex items-center gap-4 rounded-2xl border border-border/40 bg-card/40 p-4">
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 rounded-full bg-linear-to-br from-leaf/30 to-sky-warm/30 blur-md" />
                  <Avatar
                    id={avatarId}
                    className="relative size-16 ring-4 ring-background shadow-md"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                    Current avatar
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {currentAvatarLabel}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <AvatarPicker selected={avatarId} onSelect={onAvatarSelect} />
              </div>
            </div>
          </TabsContent>

          {/* §3 — Company (tenant) */}
          <TabsContent value="company">
            <div className="glass-card texture-paper rounded-3xl p-6 sm:p-8">
              <SectionHeader
                icon={IconBuildingWarehouse}
                title="Company"
                subtitle="Your farm organization and workspace details"
                action={
                  !editingCompany && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCompany(true)}
                      className="gap-1.5"
                    >
                      <IconSparkles className="size-3.5" strokeWidth={2} />
                      Edit
                    </Button>
                  )
                }
              />

              {!editingCompany ? (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <MetaRow
                    icon={IconBuildingWarehouse}
                    label="Company name"
                    value={u.tenantName}
                    accent="clay"
                  />
                  <MetaRow
                    icon={IconFingerprint}
                    label="Tenant ID"
                    value={
                      u.tenantId ? (
                        <span className="font-mono">
                          {shortId(u.tenantId)}
                        </span>
                      ) : (
                        "—"
                      )
                    }
                    accent="sky"
                  />
                  <MetaRow
                    icon={IconUserStar}
                    label="Owner"
                    value={u.fullName}
                    accent="leaf"
                  />
                  {/* Workspace badge */}
                  <div className="flex items-center gap-3 rounded-2xl border border-border/40 bg-card/40 px-3.5 py-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-leaf/10 text-leaf">
                      <IconWorld className="size-4" strokeWidth={1.85} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                        Workspace
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {u.tenantName || "My Farm Company"}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={companyForm.handleSubmit(onCompanySave)}
                  className="mt-5 space-y-4"
                  noValidate
                >
                  <div className="space-y-2">
                    <Label htmlFor="tenantName">Company name</Label>
                    <div className="relative">
                      <IconBuildingWarehouse
                        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        strokeWidth={1.75}
                      />
                      <Input
                        id="tenantName"
                        placeholder="Your farm organization name"
                        className="pl-9"
                        aria-invalid={!!companyForm.formState.errors.tenantName}
                        {...companyForm.register("tenantName", {
                          required: "Company name is required",
                          minLength: { value: 2, message: "At least 2 characters" },
                          maxLength: { value: 100, message: "Too long" },
                        })}
                      />
                    </div>
                    {companyForm.formState.errors.tenantName && (
                      <p className="text-xs text-red-500">
                        {companyForm.formState.errors.tenantName.message}
                      </p>
                    )}
                  </div>

                  {/* Tenant ID + Owner — read-only */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tenantIdReadonly">Tenant ID</Label>
                      <div className="relative">
                        <IconFingerprint
                          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                          strokeWidth={1.75}
                        />
                        <Input
                          id="tenantIdReadonly"
                          value={u.tenantId || ""}
                          readOnly
                          disabled
                          className="cursor-not-allowed font-mono pl-9 opacity-80"
                        />
                        <IconLock
                          className="absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60"
                          strokeWidth={1.85}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerReadonly">Owner</Label>
                      <div className="relative">
                        <IconUserStar
                          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                          strokeWidth={1.75}
                        />
                        <Input
                          id="ownerReadonly"
                          value={u.fullName || ""}
                          readOnly
                          disabled
                          className="cursor-not-allowed pl-9 opacity-80"
                        />
                        <IconLock
                          className="absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/60"
                          strokeWidth={1.85}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Tenant ID and owner are managed by your account and
                    can&apos;t be changed here.
                  </p>

                  <Separator className="my-1" />

                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onCompanyCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={companyForm.formState.isSubmitting}
                      className="gap-2"
                    >
                      {companyForm.formState.isSubmitting ? (
                        <IconLoader2
                          className="size-4 animate-spin"
                          strokeWidth={2}
                        />
                      ) : (
                        <IconCheck className="size-4" strokeWidth={2} />
                      )}
                      {companyForm.formState.isSubmitting
                        ? "Saving…"
                        : "Save changes"}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Reveal>
    </div>
  );
}
