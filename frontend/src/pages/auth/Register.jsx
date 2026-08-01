import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { IconUser, IconMail, IconLock, IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react"
import { useAuth } from "@/auth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import AuthLayout from "@/components/auth/AuthLayout"

export default function Register() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", email: "", password: "" },
  })

  const password = watch("password")

  const onSubmit = async (data) => {
    try {
      const user = await registerUser(data)
      toast.success("Account created!", {
        description: `Welcome to HydroZen, ${user.name.split(" ")[0]} 🌱`,
      })
      navigate("/app", { replace: true })
    } catch {
      toast.error("Registration failed", { description: "Please try again." })
    }
  }

  return (
    <AuthLayout>
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Create your farm</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Start managing your growing operation in minutes.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <IconUser className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
            <Input
              id="name"
              placeholder="e.g. Shraddha Harshal"
              className="pl-9"
              {...register("name", { required: "Name is required" })}
            />
          </div>
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <IconMail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
            <Input
              id="email"
              type="email"
              placeholder="you@farm.app"
              className="pl-9"
              {...register("email", { required: "Email is required" })}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <IconLock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              className="px-9"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "At least 8 characters" },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <IconEyeOff className="size-4" strokeWidth={1.75} /> : <IconEye className="size-4" strokeWidth={1.75} />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          {password && !errors.password && (
            <p className="flex items-center gap-1 text-[11px] text-leaf">
              <span className="size-1.5 rounded-full bg-leaf" />
              Looks good
            </p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
          {isSubmitting && <IconLoader2 className="size-4 animate-spin" strokeWidth={2} />}
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <div className="mt-4 rounded-xl border border-leaf/20 bg-leaf/5 px-3 py-2 text-center text-[11px] text-muted-foreground">
        Demo mode — registration signs you in instantly.
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-leaf hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
