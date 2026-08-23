import { IconApi, IconBolt, IconBrandGolang, IconBrandReact, IconCheck, IconCode, IconDatabase, IconLayoutGrid, IconRoute, IconServer, IconShieldCheck, IconStack2, IconStar } from "@tabler/icons-react";

export const navLinks = [
  { href: "#features", label: "Features", id: "features" },
  { href: "#stack", label: "Tech", id: "stack" },
  { href: "#about", label: "About", id: "about" },
];


export const REPO_URL = "https://github.com/harshal5-dev/farm-deck";


export const heroMetrics = [
  { key: "farms", label: "Farms", value: 12, accent: "text-leaf" },
  { key: "fields", label: "Fields", value: 48, accent: "text-sky-warm" },
  { key: "members", label: "Members", value: 6, accent: "text-clay-deep dark:text-clay" },
  { key: "ph", label: "pH", value: 6.4, accent: "text-wheat", decimals: 1 },
];


export const tenantPreview = [
  { name: "Acme Farms", subdomain: "acme", farms: "5", fields: "18", tone: "bg-leaf/15 text-leaf" },
  { name: "Green Valley", subdomain: "green-valley", farms: "3", fields: "11", tone: "bg-sky-warm/15 text-sky-warm" },
  { name: "Sunset Acres", subdomain: "sunset", farms: "4", fields: "19", tone: "bg-clay/15 text-clay-deep dark:text-clay" },
];


export const accentMap = {
  leaf: {
    icon: "bg-leaf/15 text-leaf",
    chip: "bg-leaf/10 text-leaf border-leaf/20",
    glow: "from-leaf/20",
  },
  sky: {
    icon: "bg-sky-warm/15 text-sky-warm",
    chip: "bg-sky-warm/10 text-sky-warm border-sky-warm/20",
    glow: "from-sky-warm/20",
  },
  clay: {
    icon: "bg-clay/15 text-clay-deep dark:text-clay",
    chip: "bg-clay/10 text-clay-deep border-clay/20 dark:text-clay",
    glow: "from-clay/20",
  },
  wheat: {
    icon: "bg-wheat/20 text-wheat",
    chip: "bg-wheat/15 text-wheat border-wheat/30",
    glow: "from-wheat/25",
  },
};


export const groups = [
  {
    label: "Backend",
    items: [
      { icon: IconBrandGolang, name: "Go", role: "Language" },
      { icon: IconApi, name: "Gin", role: "HTTP framework" },
      { icon: IconRoute, name: "REST API", role: "Type-safe routes" },
      { icon: IconShieldCheck, name: "JWT", role: "Auth + refresh" },
    ],
  },
  {
    label: "Data",
    items: [
      { icon: IconDatabase, name: "PostgreSQL", role: "Database" },
      { icon: IconServer, name: "sqlc", role: "Type-safe SQL" },
    ],
  },
  {
    label: "Frontend",
    items: [
      { icon: IconBrandReact, name: "React 19", role: "UI library" },
      { icon: IconLayoutGrid, name: "shadcn/ui", role: "Component system" },
      { icon: IconBolt, name: "Vite", role: "Build tool" },
      { icon: IconStack2, name: "Redux Toolkit", role: "State + cache" },
    ],
  },
];


export const highlights = [
  { label: "Type-safe SQL with sqlc", icon: IconCode },
  { label: "JWT auth + refresh tokens", icon: IconStar },
  { label: "Row-level workspace isolation", icon: IconCheck },
  { label: "RESTful API design", icon: IconCheck },
  { label: "Optimistic UI updates", icon: IconCheck },
  { label: "Dark / light theming", icon: IconCheck },
];

export const stats = [
  { value: 18, suffix: "+", label: "Pages & screens" },
  { value: 40, suffix: "+", label: "REST endpoints" },
  { value: 6, suffix: "", label: "DB tables" },
  { value: 100, suffix: "%", label: "Type-safe" },
];
