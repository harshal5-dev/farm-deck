import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { IconMail, IconLock, IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react"
import { useAuth } from "@/auth"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import AuthLayout from "@/components/auth/AuthLayout"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)

  const from = location.state?.from?.pathname || "/app"

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "shraddha@hydrozen.app", password: "demo1234" },
  })

  const onSubmit = async (data) => {
    try {
      const user = await login(data)
      toast.success("Welcome back!", {
        description: `Signed in as ${user.email}`,
      })
      navigate(from, { replace: true })
    } catch {
      toast.error("Sign in failed", { description: "Please try again." })
    }
  }

  return (
    <AuthLayout>
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Sign in to your HydroZen farm dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <button type="button" className="text-xs font-medium text-leaf hover:underline">
              Forgot?
            </button>
          </div>
          <div className="relative">
            <IconLock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="px-9"
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "At least 6 characters" } })}
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
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
          {isSubmitting && <IconLoader2 className="size-4 animate-spin" strokeWidth={2} />}
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <div className="mt-4 rounded-xl border border-leaf/20 bg-leaf/5 px-3 py-2 text-center text-[11px] text-muted-foreground">
        Demo mode — any email & password will sign you in.
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="font-semibold text-leaf hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  )
}
