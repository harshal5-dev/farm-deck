import { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import {
  IconArrowLeft,
  IconBuilding,
  IconBuildingWarehouse,
  IconFingerprint,
  IconUser,
  IconLoader2,
  IconCheck,
  IconWorld,
} from "@tabler/icons-react"
import { useAuth, DEMO_USER } from "@/auth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Reveal } from "@/components/effects"

/** Shorten a uuid for display: "a2e727e2-…651c". */
function shortId(id) {
  if (!id) return "—"
  if (id.length <= 12) return id
  return `${id.slice(0, 8)}…${id.slice(-4)}`
}

/** Small read-only meta row. */
function MetaRow({ icon: Icon, label, value, mono = false }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-card/40 px-3 py-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-leaf/10 text-leaf">
        <Icon className="size-4" strokeWidth={1.85} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
          {label}
        </p>
        <p
          className={`truncate text-sm font-medium text-foreground ${
            mono ? "font-mono tracking-tight" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  )
}

export default function Tenant() {
  const { user, updateUser } = useAuth()
  const currentUser = user || DEMO_USER
  const tenantName = currentUser.tenantName || "My Farm Company"
  const [editing, setEditing] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { tenantName },
  })

  const onSubmit = async (data) => {
    // Simulated save — reflect the change locally via the auth user.
    await new Promise((r) => setTimeout(r, 700))
    updateUser({ tenantName: data.tenantName })
    setEditing(false)
    toast.success("Company updated", {
      description: `“${data.tenantName}” is now your company name.`,
    })
  }

  const handleCancel = () => {
    reset({ tenantName })
    setEditing(false)
  }

  const initial = (tenantName || "?").charAt(0).toUpperCase()

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
            Company
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Your farm organization and workspace details.
          </p>
        </div>
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        {/* Company identity card */}
        <Reveal delay={120} duration={500}>
          <div className="glass-card texture-paper highlight-edge overflow-hidden rounded-3xl">
            {/* Banner */}
            <div className="relative h-28 overflow-hidden bg-linear-to-br from-sky-warm/20 via-leaf/15 to-transparent">
              <div className="pattern-contour absolute inset-0 opacity-40" />
            </div>
            {/* Logo monogram + name */}
            <div className="px-6 pb-6">
              <div className="-mt-12 flex items-end justify-between">
                <div className="flex size-24 items-center justify-center rounded-3xl bg-linear-to-br from-leaf to-sage-deep font-heading text-4xl font-bold text-white shadow-lg ring-4 ring-background">
                  {initial}
                </div>
                <span className="mb-1 inline-flex items-center gap-1 rounded-full border border-sky-warm/30 bg-sky-warm/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-sky-warm uppercase">
                  <IconWorld className="size-3.5" strokeWidth={2} />
                  Workspace
                </span>
              </div>
              <h2 className="mt-3 font-heading text-xl font-bold tracking-tight">
                {tenantName}
              </h2>
              <p className="text-sm text-muted-foreground">
                Your farming organization
              </p>
            </div>
          </div>
        </Reveal>

        {/* Details / edit form */}
        <Reveal delay={200} duration={500}>
          <div className="glass-card texture-paper rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold tracking-tight">
                Company details
              </h3>
              {!editing && (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              )}
            </div>

            {!editing ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <MetaRow
                  icon={IconBuildingWarehouse}
                  label="Company name"
                  value={tenantName}
                />
                <MetaRow
                  icon={IconFingerprint}
                  label="Tenant ID"
                  value={shortId(currentUser.tenantId)}
                  mono
                />
                <MetaRow
                  icon={IconUser}
                  label="Owner"
                  value={currentUser.fullName}
                />
                <MetaRow
                  icon={IconBuilding}
                  label="Plan"
                  value="Free · Portfolio demo"
                />
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tenantName">Company name</Label>
                  <Input
                    id="tenantName"
                    placeholder="e.g. Ganbote Farms"
                    {...register("tenantName", {
                      required: "Company name is required",
                      minLength: { value: 2, message: "At least 2 characters" },
                    })}
                  />
                  {errors.tenantName && (
                    <p className="text-xs text-red-500">
                      {errors.tenantName.message}
                    </p>
                  )}
                </div>

                <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 px-3 py-2.5">
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    <span className="font-semibold text-foreground/80">
                      Note:
                    </span>{" "}
                    This demo saves changes locally. The backend update endpoint
                    isn&apos;t wired up yet.
                  </p>
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
