import { useId, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  IconUser,
  IconMail,
  IconShieldCheck,
  IconCircleCheckFilled,
  IconCircleX,
  IconLoader2,
  IconCheck,
  IconBolt,
  IconArrowRight,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  DEFAULT_AVATAR_ID,
  FARM_AVATARS,
  getAvatar,
} from "@/components/avatars/avatars";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { ROLE_ORDER, getRole } from "@/constants/roles";

/* ============================================================ */
/*  Avatar picker — compact, fits inline next to the form       */
/* ============================================================ */

function AvatarPicker({ value, onChange, disabled }) {
  const currentLabel = getAvatar(value || DEFAULT_AVATAR_ID).label;
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            disabled={disabled}
            aria-label="Choose an avatar"
            className="group relative inline-flex items-center gap-1.5 rounded-xl border border-border/50 bg-card/50 px-2.5 py-1.5 text-xs font-medium transition-all hover:border-leaf/50 hover:bg-card/80 hover:shadow-sm disabled:opacity-60"
          />
        }
      >
        <span className="size-5 overflow-hidden rounded-full ring-1 ring-background">
          <Avatar id={value || DEFAULT_AVATAR_ID} className="size-full" />
        </span>
        <span className="truncate max-w-[6.5rem]">{currentLabel}</span>
        <IconArrowRight
          className="size-3 text-muted-foreground transition-transform group-data-[popup-open]:rotate-90"
          strokeWidth={2}
        />
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-[min(22rem,calc(100vw-2rem))] p-3"
      >
        <p className="mb-2 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
          Pick an avatar
        </p>
        <div className="grid max-h-56 grid-cols-6 gap-1.5 overflow-y-auto pr-1">
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
                  "group/cell relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                  isSelected
                    ? "scale-[1.04] border-leaf shadow-sm ring-2 ring-leaf/30"
                    : "border-border/40 hover:scale-[1.04] hover:border-leaf/40"
                )}
              >
                <a.Component />
                {isSelected && (
                  <div className="absolute top-0.5 right-0.5 flex size-3.5 items-center justify-center rounded-full bg-leaf text-white shadow ring-1 ring-background">
                    <IconCheck className="size-2" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ============================================================ */
/*  Live identity preview — shown on the left of the form       */
/* ============================================================ */

function IdentityPreview({ fullName, email, role, avatarId }) {
  const safeRole = role || "viewer";
  const r = getRole(safeRole);
  const RoleIcon = r.icon;
  const displayName = (fullName || "").trim() || "New member";
  const displayEmail = (email || "").trim() || "name@yourfarm.com";
  const avatar = avatarId || DEFAULT_AVATAR_ID;

  return (
    <div className="relative h-full overflow-hidden rounded-2xl border border-border/40 bg-card/40 p-5 shadow-sm backdrop-blur">
      {/* Soft tinted glow */}
      <div
        className={cn(
          "pointer-events-none absolute -top-12 -right-12 size-40 rounded-full opacity-60 blur-3xl",
          r.bg
        )}
      />
      <div className="pointer-events-none absolute -bottom-16 -left-10 size-36 rounded-full bg-sky-warm/15 blur-3xl" />

      <div className="relative flex flex-col items-center text-center">
        <p className="mb-3 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
          Preview
        </p>

        <div className="relative">
          <div
            className={cn(
              "absolute -inset-2 rounded-full opacity-70 blur-md",
              r.bg
            )}
          />
          <div
            className={cn(
              "relative overflow-hidden rounded-full bg-background p-0.5 ring-2 shadow-md",
              r.ring
            )}
          >
            <Avatar id={avatar} className="size-20" />
          </div>
          <span
            className={cn(
              "absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-md ring-2 ring-background",
              r.gradient
            )}
          >
            <RoleIcon className="size-3.5" strokeWidth={2} />
          </span>
        </div>

        <h3 className="mt-3 truncate font-heading text-base font-bold tracking-tight">
          {displayName}
        </h3>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {displayEmail}
        </p>

        <span
          className={cn(
            "mt-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-br px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ring-1 ring-inset",
            r.chip
          )}
        >
          <RoleIcon className="size-3" strokeWidth={2.2} />
          {r.label}
        </span>
      </div>
    </div>
  );
}

/* ============================================================ */
/*  Compact role picker — inline cards, no scrolling            */
/* ============================================================ */

const ROLE_TAGLINE = {
  owner: "Full access",
  manager: "Operations lead",
  grower: "Day-to-day field work",
  viewer: "Read-only",
};

function RoleCard({ roleId, selected, onSelect, disabled }) {
  const r = getRole(roleId);
  const Icon = r.icon;
  const tagline = ROLE_TAGLINE[roleId];
  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect(roleId)}
      disabled={disabled}
      className={cn(
        "group/role relative flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all duration-200",
        selected
          ? cn("border-transparent shadow-sm", r.bg, r.ring, "ring-2")
          : "border-border/50 bg-card/40 hover:border-border hover:bg-card/70"
      )}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ring-white/10 transition-transform duration-300 group-hover/role:scale-110 dark:ring-white/5",
          selected
            ? cn("bg-gradient-to-br text-white shadow-sm", r.gradient)
            : cn(r.bg, r.text)
        )}
      >
        <Icon className="size-4" strokeWidth={1.85} />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-sm font-semibold tracking-tight",
            selected ? r.text : "text-foreground"
          )}
        >
          {r.label}
        </p>
        <p className="truncate text-[10px] text-muted-foreground">{tagline}</p>
      </div>
      {selected && (
        <span
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-full text-white shadow-sm",
            `bg-gradient-to-br ${r.gradient}`
          )}
        >
          <IconCheck className="size-2.5" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

function RolePermissionsPreview({ roleId }) {
  const r = getRole(roleId);
  const RoleIcon = r.icon;
  return (
    <div
      className={cn(
        "mt-2 flex items-start gap-2 rounded-xl border p-2.5",
        r.border,
        r.bgSoft
      )}
    >
      <RoleIcon
        className={cn("mt-0.5 size-3.5 shrink-0", r.text)}
        strokeWidth={1.85}
      />
      <div className="min-w-0 flex-1">
        <p className={cn("text-[10px] font-semibold tracking-wide uppercase", r.text)}>
          {r.label} can:
        </p>
        <ul className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          {r.permissions.map((p) => (
            <li
              key={p}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground"
            >
              <IconCircleCheckFilled
                className={cn("size-2.5 shrink-0", r.text)}
              />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ============================================================ */
/*  UserForm — shared by Add & Edit pages                       */
/* ============================================================ */

/**
 * UserForm — fullName + email + role. Designed to fit a typical viewport
 * without scrolling: single row avatar preview on the left, two-column form
 * on the right, sticky footer with Cancel + Save.
 *
 * Props:
 *   mode:        "create" | "edit"
 *   defaultValues: { fullName, emailId, role, avatarId? }
 *   onSubmit:    async (values) => void
 *   onCancel:    () => void
 *   submitting:  bool — external loading flag (optional)
 */
export default function UserForm({
  mode = "create",
  defaultValues,
  onSubmit,
  onCancel,
  submitting = false,
}) {
  const titleId = useId();
  const descId = useId();
  const isEdit = mode === "edit";

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      fullName: defaultValues?.fullName || "",
      emailId: defaultValues?.emailId || "",
      role: defaultValues?.role || "grower",
      avatarId: defaultValues?.avatarId || DEFAULT_AVATAR_ID,
    },
  });

  const fullName = watch("fullName");
  const email = watch("emailId");
  const role = watch("role");
  const avatarId = watch("avatarId");

  const roleMeta = useMemo(() => getRole(role), [role]);

  const submit = async (values) => {
    await onSubmit({
      fullName: values.fullName.trim(),
      emailId: values.emailId.trim().toLowerCase(),
      role: values.role,
      avatarId: values.avatarId,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="flex h-full min-h-0 flex-col"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <div className="grid h-full min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
        {/* ===== Left — identity preview ===== */}
        <div className="flex min-h-0 flex-col">
          <IdentityPreview
            fullName={fullName}
            email={email}
            role={role}
            avatarId={avatarId}
          />
        </div>

        {/* ===== Right — form fields ===== */}
        <div className="flex min-h-0 flex-col gap-3.5">
          {/* Full name + avatar (single row to save vertical space) */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-3">
            <div>
              <label
                htmlFor="user-fullName"
                className="mb-1 flex items-center gap-1.5 text-xs font-medium text-foreground"
              >
                <IconUser
                  className="size-3.5 text-muted-foreground"
                  strokeWidth={1.75}
                />
                Full name
              </label>
              <div className="relative">
                <IconUser
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  strokeWidth={1.75}
                />
                <Input
                  id="user-fullName"
                  placeholder="e.g. Priya Deshmukh"
                  autoComplete="name"
                  className={cn(
                    "pl-9",
                    errors.fullName &&
                      "border-destructive focus-visible:ring-destructive/20"
                  )}
                  aria-invalid={!!errors.fullName}
                  {...register("fullName", {
                    required: "Full name is required",
                    minLength: { value: 2, message: "At least 2 characters" },
                    maxLength: { value: 100, message: "Too long" },
                  })}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                  <IconCircleX className="size-3" strokeWidth={2} />
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="sm:pt-[1.4rem]">
              <p className="sr-only sm:not-sr-only sm:mb-1 sm:flex sm:items-center sm:gap-1.5 sm:text-xs sm:font-medium sm:text-foreground">
                <IconBolt
                  className="size-3.5 text-muted-foreground"
                  strokeWidth={1.75}
                />
                Avatar
              </p>
              <AvatarPicker
                value={avatarId}
                onChange={(v) =>
                  setValue("avatarId", v, { shouldDirty: true })
                }
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="user-email"
              className="mb-1 flex items-center gap-1.5 text-xs font-medium text-foreground"
            >
              <IconMail
                className="size-3.5 text-muted-foreground"
                strokeWidth={1.75}
              />
              Email address
            </label>
            <div className="relative">
              <IconMail
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                strokeWidth={1.75}
              />
              <Input
                id="user-email"
                type="email"
                placeholder="grower@yourfarm.com"
                autoComplete="email"
                className={cn(
                  "pl-9",
                  errors.emailId &&
                    "border-destructive focus-visible:ring-destructive/20"
                )}
                aria-invalid={!!errors.emailId}
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
              <p className="mt-1 flex items-center gap-1 text-[11px] text-destructive">
                <IconCircleX className="size-3" strokeWidth={2} />
                {errors.emailId.message}
              </p>
            )}
          </div>

          {/* Role — 4 cards inline + permission preview */}
          <div>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                <IconShieldCheck
                  className="size-3.5 text-muted-foreground"
                  strokeWidth={1.75}
                />
                Role
              </label>
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
                  selected={role === id}
                  onSelect={(r) => setValue("role", r, { shouldDirty: true })}
                />
              ))}
            </div>
            <RolePermissionsPreview roleId={role} />
          </div>
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
              reset();
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
  );
}
