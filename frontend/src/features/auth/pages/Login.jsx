
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  IconShieldCheck,
  IconSparkles,
} from "@tabler/icons-react";
import {
  useLoginMutation,
  useLazyGetProfileQuery,
  setCredentials,
} from "@/features/auth";
import { normalizeError } from "@/lib/api-errors";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AuthLayout from "../components/AuthLayout";
import { Reveal } from "@/components/effects";
import LoginForm from "../components/LoginForm";

const Login = () => {
  const [login, { isLoading, error }] = useLoginMutation();
  const [fetchProfile] = useLazyGetProfileQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/app";

  const form = useForm({
    defaultValues: { emailId: "", password: "" },
  });

  const onSubmit = async (data) => {
    try {
      await login({ emailId: data.emailId, password: data.password }).unwrap();
      const profile = await fetchProfile().unwrap();
      dispatch(setCredentials(profile));
      toast.success("Welcome back!", {
        description: `Signed in as ${profile.emailId}`,
      });
      navigate(from, { replace: true });
    } catch (err) {
      const details = err?.data?.error?.details;
      if (Array.isArray(details)) {
        details.forEach((d) => {
          if (d?.field && d?.message) {
            form.setError(d.field, { type: "server", message: d.message });
          }
        });
      }
    }
  };

  const serverError = error
    ? normalizeError(error, { entity: "sign-in", action: "sign in to" })
    : null;

  return (
    <AuthLayout>
      <Reveal delay={0} duration={500} className="w-full max-w-md">
        <Card
          size="sm"
          className="glass-card texture-paper highlight-edge relative gap-0 overflow-hidden rounded-3xl border-0 p-0 ring-1 ring-foreground/5"
        >
          {/* ---------- Decorative top band ---------- */}
          <div className="relative h-1.5 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-leaf via-sage-deep to-sky-warm" />
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent shimmer-overlay animate-shimmer" />
          </div>

          {/* ---------- Header ---------- */}
          <CardHeader className="relative gap-1 pt-7 pb-2">
            <Reveal delay={40} duration={500}>
              <div className="mb-3 inline-flex items-center gap-1.5 self-start rounded-full border border-leaf/30 bg-leaf/10 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-leaf uppercase backdrop-blur-sm">
                <IconSparkles className="size-3" strokeWidth={2.25} />
                Farmdeck
              </div>
            </Reveal>
            <Reveal delay={100} duration={500}>
              <CardTitle className="font-heading text-2xl font-bold tracking-tight">
                Welcome back
              </CardTitle>
            </Reveal>
            <Reveal delay={160} duration={500}>
              <CardDescription className="text-sm">
                Sign in to your farm dashboard to keep things growing.
              </CardDescription>
            </Reveal>
          </CardHeader>

          {/* ---------- Form ---------- */}
          <CardContent className="pt-4 pb-7">
            <LoginForm onSubmit={onSubmit} serverError={serverError} isLoading={isLoading} />

            {/* Trust note */}
            <Reveal delay={320} duration={500}>
              <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/80">
                <IconShieldCheck
                  className="size-3.5 text-leaf"
                  strokeWidth={1.85}
                />
                <span>Secured with HttpOnly cookies — nothing stored locally.</span>
              </div>
            </Reveal>
          </CardContent>

          {/* ---------- Footer ---------- */}
          <div className="border-t border-foreground/5 bg-background/40 px-6 py-4 backdrop-blur-sm">
            <Reveal delay={400} duration={500}>
              <p className="text-center text-sm text-muted-foreground">
                New to Farmdeck?{" "}
                <Link
                  to="/"
                  className="font-semibold text-leaf underline-offset-4 transition-colors hover:text-leaf/80 hover:underline"
                >
                  Learn more
                </Link>
              </p>
            </Reveal>
          </div>
        </Card>
      </Reveal>
    </AuthLayout>
  );
}

export default Login;
