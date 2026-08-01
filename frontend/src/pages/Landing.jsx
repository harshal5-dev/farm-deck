import { Link } from "react-router-dom"
import {
  IconArrowRight,
  IconCheck,
  IconDatabase,
  IconBrandGolang,
  IconBrandReact,
  IconApi,
  IconLayoutGrid,
  IconBuildingWarehouse,
  IconLeaf,
  IconChartDots,
  IconSeedling,
  IconShieldLock,
  IconUsers,
  IconServer,
  IconBrandGithub,
} from "@tabler/icons-react"
import { FarmScene } from "@/components/effects"
import { useAuth } from "@/auth"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: IconBuildingWarehouse,
    title: "Multi-Tenant Architecture",
    desc: "Complete data isolation per tenant — every farm, field, and crop is scoped and secure.",
    accent: "text-leaf",
    bg: "bg-leaf/15",
  },
  {
    icon: IconChartDots,
    title: "Field & Crop Tracking",
    desc: "Monitor growth stages, pH, EC, soil types, and yields across indoor, outdoor & greenhouse farms.",
    accent: "text-sky-warm",
    bg: "bg-sky-warm/15",
  },
  {
    icon: IconUsers,
    title: "Role-Based Access",
    desc: "JWT auth with RBAC — farm owners, workers, and viewers each get the right access level.",
    accent: "text-clay",
    bg: "bg-clay/15",
  },
  {
    icon: IconLeaf,
    title: "Soil Intelligence",
    desc: "Built-in soil-type knowledge base — drainage, nutrients, pH ranges, and amendments per soil.",
    accent: "text-wheat",
    bg: "bg-wheat/20",
  },
]

const techStack = [
  { icon: IconBrandGolang, name: "Go", role: "Backend language" },
  { icon: IconApi, name: "Gin", role: "HTTP framework" },
  { icon: IconDatabase, name: "PostgreSQL", role: "Database" },
  { icon: IconServer, name: "sqlc", role: "Type-safe SQL" },
  { icon: IconBrandReact, name: "React", role: "UI library" },
  { icon: IconLayoutGrid, name: "shadcn/ui", role: "Component system" },
]

const highlights = [
  "Type-safe SQL with sqlc",
  "JWT authentication & refresh",
  "Row-level tenant isolation",
  "RESTful API design",
  "Optimistic UI updates",
  "Dark / light theming",
]

const heroDots = [
  "bg-leaf",
  "bg-sky-warm",
  "bg-wheat",
]

export default function Landing() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="relative min-h-svh bg-background">
      {/* Decorative background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="animate-glow-pulse absolute -right-40 -top-48 size-[600px] rounded-full bg-sage/10 blur-[100px] dark:bg-sage/12" />
        <div className="animate-glow-pulse absolute -bottom-48 -left-44 size-[560px] rounded-full bg-clay/8 blur-[100px] dark:bg-clay-deep/10 [animation-delay:1.2s]" />
        <div className="pattern-contour absolute inset-0 opacity-40" />
      </div>

      {/* Nav */}
      <header className="glass sticky top-0 z-30 border-b border-border/40">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="size-8">
              <FarmMark />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Hydro<span className="text-leaf">Zen</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">Features</a>
            <a href="#stack" className="transition-colors hover:text-foreground">Tech Stack</a>
            <a href="#about" className="transition-colors hover:text-foreground">About</a>
          </nav>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Link to="/">
                <Button size="sm" className="gap-1.5">
                  Dashboard <IconArrowRight className="size-4" strokeWidth={2} />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="gap-1.5">
                    Get Started <IconArrowRight className="size-4" strokeWidth={2} />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="relative">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-leaf/30 bg-leaf/10 px-3 py-1 text-xs font-semibold text-leaf">
                <IconSeedling className="size-3.5" strokeWidth={2} />
                Portfolio Project · Farm Management System
              </span>
              <h1 className="mt-5 font-heading text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
                Smart farming,{" "}
                <span className="bg-gradient-to-r from-leaf to-sage-deep bg-clip-text text-transparent">
                  beautifully managed.
                </span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
                HydroZen is a full-stack, multi-tenant platform for hydroponics
                and soil farming. Track fields, crops, harvests, pH, and EC —
                all in one modern dashboard.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Link to={isAuthenticated ? "/" : "/register"}>
                  <Button size="lg" className="gap-2">
                    {isAuthenticated ? "Open Dashboard" : "Start Free"}
                    <IconArrowRight className="size-4" strokeWidth={2.2} />
                  </Button>
                </Link>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" className="gap-2">
                    <IconBrandGithub className="size-4" strokeWidth={1.85} />
                    View Source
                  </Button>
                </a>
              </div>
              <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <IconShieldLock className="size-4 text-leaf" strokeWidth={1.85} />
                  JWT Auth
                </span>
                <span className="flex items-center gap-1.5">
                  <IconUsers className="size-4 text-leaf" strokeWidth={1.85} />
                  Multi-tenant
                </span>
                <span className="flex items-center gap-1.5">
                  <IconDatabase className="size-4 text-leaf" strokeWidth={1.85} />
                  PostgreSQL
                </span>
              </div>
            </div>

            {/* Hero art card */}
            <div className="glass-card texture-paper highlight-edge relative h-72 overflow-hidden rounded-3xl sm:h-96">
              <FarmScene className="!absolute inset-0 size-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-leaf">Live overview</p>
                  <p className="mt-0.5 font-heading text-xl font-bold">5 farms · 10 fields</p>
                </div>
                <div className="flex gap-2">
                  {heroDots.map((c) => (
                    <span key={c} className={`size-2.5 rounded-full ${c}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Everything your farm needs
            </h2>
            <p className="mt-3 text-muted-foreground">
              A complete backend and frontend built to demonstrate real-world,
              production-style architecture.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {features.map((f) => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="glass-card texture-paper group relative overflow-hidden rounded-2xl p-6 transition-shadow duration-200 hover:shadow-lg hover:shadow-leaf/10"
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${f.bg}`}>
                      <Icon className={`size-6 ${f.accent}`} strokeWidth={1.7} />
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold tracking-tight">{f.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Tech Stack */}
        <section id="stack" className="border-y border-border/40 bg-card/40">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
                <IconServer className="size-3.5" strokeWidth={2} />
                Built with modern tools
              </span>
              <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                The tech stack
              </h2>
              <p className="mt-3 text-muted-foreground">
                A pragmatic, type-safe full-stack architecture.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {techStack.map((t) => {
                const Icon = t.icon
                return (
                  <div
                    key={t.name}
                    className="glass-card flex flex-col items-center rounded-2xl p-5 text-center transition-shadow duration-200 hover:shadow-md hover:shadow-leaf/10"
                  >
                    <div className="flex size-12 items-center justify-center rounded-xl bg-leaf/10 text-leaf">
                      <Icon className="size-6" strokeWidth={1.7} />
                    </div>
                    <p className="mt-3 text-sm font-bold">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground">{t.role}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* About / Highlights */}
        <section id="about" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                A portfolio built to showcase
              </h2>
              <p className="mt-4 text-muted-foreground">
                HydroZen demonstrates end-to-end system design: a Go + Gin REST
                API backed by PostgreSQL with sqlc-generated type-safe queries,
                secure multi-tenant data isolation, and a polished React +
                shadcn/ui frontend. It&apos;s a study in clean architecture,
                separation of concerns, and developer experience.
              </p>
              <p className="mt-3 text-muted-foreground">
                This is a personal project by{" "}
                <span className="font-semibold text-foreground">Shraddha Harshal</span>{" "}
                — built to learn and demonstrate real-world full-stack engineering.
              </p>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-leaf hover:underline">
                <IconBrandGithub className="size-4" strokeWidth={1.85} />
                Explore the repository
              </a>
            </div>

            <div className="glass-card texture-paper rounded-2xl p-6">
              <h3 className="font-heading text-lg font-bold tracking-tight">Engineering highlights</h3>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2.5 text-sm">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-leaf/15 text-leaf">
                      <IconCheck className="size-3" strokeWidth={2.5} />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <div className="glass-card texture-paper highlight-edge relative overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="absolute inset-0 bg-gradient-to-br from-leaf/10 to-transparent" />
            <div className="relative">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to grow? 🌱
              </h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                Explore the dashboard with a demo account — no setup required.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link to={isAuthenticated ? "/" : "/register"}>
                  <Button size="lg" className="gap-2">
                    {isAuthenticated ? "Open Dashboard" : "Create an account"}
                    <IconArrowRight className="size-4" strokeWidth={2.2} />
                  </Button>
                </Link>
                {!isAuthenticated && (
                  <Link to="/login">
                    <Button variant="outline" size="lg">Sign in</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <div className="size-6"><FarmMark /></div>
            <span>HydroZen · Portfolio Project</span>
          </div>
          <p>Built with Go, Gin, PostgreSQL & React · {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}

/** Small inline logo mark for the landing nav/footer. */
function FarmMark() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-full">
      <defs>
        <linearGradient id="lm-drop" x1="12" y1="6" x2="34" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7FD66E" />
          <stop offset="100%" stopColor="#2E7D52" />
        </linearGradient>
      </defs>
      <path d="M24 4 C 16 14, 11 21, 11 29 a 13 13 0 0 0 26 0 C 37 21, 32 14, 24 4 Z" fill="url(#lm-drop)" />
      <path d="M24 33 C 18 31, 16 25, 18 19 C 24 20, 30 24, 30 30 C 30 32, 28 33, 24 33 Z" fill="#E8F8D8" opacity="0.95" />
    </svg>
  )
}
