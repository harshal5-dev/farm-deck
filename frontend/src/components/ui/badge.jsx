import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20",
        outline: "text-foreground",
        amber: "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400",
        emerald: "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
        violet: "border-transparent bg-violet-500/15 text-violet-700 dark:text-violet-400",
        sky: "border-transparent bg-sky-500/15 text-sky-700 dark:text-sky-400",
        green: "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant = "default", ...props }) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
