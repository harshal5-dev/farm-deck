import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  IconArrowLeft,
  IconMail,
  IconUser,
  IconShieldCheck,
  IconBuilding,
  IconCalendar,
  IconLoader2,
  IconCheck,
} from "@tabler/icons-react"
import { useAuth, DEMO_USER } from "@/auth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Reveal } from "@/components/effects"
import FarmerAvatar from "@/components/effects/FarmerAvatar"

/** Format an ISO date into "Aug 1, 2026". */
function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch {
    return "—"
  }
}

/** Format a role like "owner" → "Owner". */
function displayRole(role) {
  if (!role) return "Member"
  return role.charAt(0).toUpperCase() + role.slice(1)
}

/** Small read-only meta row used in the identity card. */
function MetaRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/40 px-3 py-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-leaf/10 text-leaf">
        <Icon className="size-4" strokeWidth={1.85} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
          {label}
        </p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}

export default function Profile() {
  const { user, updateUser } = useAuth()
  const currentUser = user || DEMO_USER
  const [editing, setEditing] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { fullName: currentUser.fullName, emailId: currentUser.emailId },
  })

  const onSubmit = async (data) => {
    // Simulated save (no backend endpoint yet). Reflect the change locally.
    await new Promise((r) => setTimeout(r, 700))
    updateUser({ fullName: data.fullName, emailId: data.emailId })
    setEditing(false)
    toast.success("Profile updated", {
      description: "Your changes have been saved.",
    })
  }

  const handleCancel = () => {
    reset({ fullName: currentUser.fullName, emailId: currentUser.emailId })
    setEditing(false)
  }

  const initials = (currentUser.fullName || "User")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="mx-auto max-w-5xl space-y-6">
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
            Profile
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Manage your personal details and account information.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        {/* Identity card */}
        <Reveal delay={120} duration={500}>
          <div className="glass-card texture-paper highlight-edge overflow-hidden rounded-3xl">
            {/* Banner */}
            <div className="relative h-28 overflow-hidden bg-linear-to-br from-leaf/25 via-sage/15 to-transparent">
              <div className="pattern-contour absolute inset-0 opacity-40" />
            </div>
            {/* Avatar + name */}
            <div className="px-6 pb-6">
              <div className="-mt-12 flex items-end justify-between">
                <div className="relative size-24 overflow-hidden rounded-3xl shadow-lg ring-4 ring-background">
                  <FarmerAvatar className="size-full" />
                </div>
                <span className="mb-1 inline-flex items-center gap-1 rounded-full border border-leaf/30 bg-leaf/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-leaf uppercase">
                  <IconShieldCheck className="size-3.5" strokeWidth={2} />
                  {displayRole(currentUser.role)}
                </span>
              </div>
              <h2 className="mt-3 font-heading text-xl font-bold tracking-tight">
                {currentUser.fullName}
              </h2>
              <p className="text-sm text-muted-foreground">
                {currentUser.emailId}
              </p>

              <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/60 bg-muted/20 py-2.5 text-lg font-bold tracking-widest text-muted-foreground">
                {initials}
              </div>
              <p className="mt-1.5 text-center text-[11px] text-muted-foreground/70">
                Avatar initials
              </p>
            </div>
          </div>
        </Reveal>

        {/* Details / edit form */}
        <Reveal delay={200} duration={500}>
          <div className="glass-card texture-paper rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold tracking-tight">
                Account details
              </h3>
              {!editing && (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              )}
            </div>

            {!editing ? (
              <>
                {/* Read-only meta grid */}
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <MetaRow icon={IconUser} label="Full name" value={currentUser.fullName} />
                  <MetaRow icon={IconMail} label="Email" value={currentUser.emailId} />
                  <MetaRow icon={IconShieldCheck} label="Role" value={displayRole(currentUser.role)} />
                  <MetaRow icon={IconBuilding} label="Company" value={currentUser.tenantName || "—"} />
                </div>

                <Separator className="my-5" />

                <MetaRow
                  icon={IconCalendar}
                  label="Member since"
                  value={formatDate(currentUser.createdAt)}
                />
              </>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    placeholder="Your full name"
                    {...register("fullName", {
                      required: "Full name is required",
                      minLength: { value: 2, message: "At least 2 characters" },
                    })}
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-500">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailId">Email</Label>
                  <Input
                    id="emailId"
                    type="email"
                    placeholder="you@farmdeck.app"
                    {...register("emailId", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email",
                      },
                    })}
                  />
                  {errors.emailId && (
                    <p className="text-xs text-red-500">{errors.emailId.message}</p>
                  )}
                </div>

                <Separator className="my-1" />

                <div className="flex items-center justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="gap-2">
                    {isSubmitting ? (
                      <IconLoader2 className="size-4 animate-spin" strokeWidth={2} />
                    ) : (
                      <IconCheck className="size-4" strokeWidth={2} />
                    )}
                    {isSubmitting ? "Saving…" : "Save changes"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  )
}
