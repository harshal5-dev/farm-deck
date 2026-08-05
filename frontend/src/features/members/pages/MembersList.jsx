import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  IconUserPlus,
  IconSearch,
  IconX,
  IconClock,
  IconDots,
  IconTrash,
  IconCopy,
  IconPencil,
  IconUsers,
  IconUserCheck,
  IconMailForward,
  IconUserOff,
  IconFilter,
} from "@tabler/icons-react";
import { useAuth } from "@/features/auth";
import { useMockLoading } from "@/hooks/use-mock-loading";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, DEFAULT_AVATAR_ID } from "@/components/avatars/avatars";
import { Reveal } from "@/components/effects";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { ROLE_ORDER, getRole, getStatus } from "@/constants/roles";
import { useMembers } from "../MembersContext";

/* ============================================================ */
/*  helpers                                                     */
/* ============================================================ */

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

function formatRelative(iso) {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMs = now - then;
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

/** Build the page-number list with ellipses, e.g. [1, "...", 4, 5, "...", 9]. */
function buildPageList(current, totalPages) {
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = new Set([1, totalPages, current, current - 1, current + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);
  const result = [];
  sorted.forEach((p, i) => {
    result.push(p);
    const next = sorted[i + 1];
    if (next && next - p > 1) result.push("...");
  });
  return result;
}

/* ============================================================ */
/*  atoms                                                       */
/* ============================================================ */

function RolePill({ role, size = "sm", withIcon = true }) {
  const r = getRole(role);
  const Icon = r.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-gradient-to-br font-semibold tracking-wide ring-1 ring-inset uppercase",
        r.chip,
        size === "xs" && "px-1.5 py-0.5 text-[9px]",
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "md" && "px-2.5 py-0.5 text-[11px]"
      )}
    >
      {withIcon && (
        <Icon
          className={cn(size === "xs" ? "size-2.5" : "size-3")}
          strokeWidth={2.2}
        />
      )}
      {r.label}
    </span>
  );
}

function StatusPill({ status }) {
  const s = getStatus(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
        s.chip
      )}
    >
      {status === "active" ? (
        <span className="relative flex size-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
          <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
        </span>
      ) : (
        <span className={cn("size-1.5 rounded-full", s.dot)} />
      )}
      {s.label}
    </span>
  );
}

function MemberAvatar({ member, size = "lg" }) {
  const avatarId = member.avatarId || DEFAULT_AVATAR_ID;
  const r = getRole(member.role);
  const px =
    size === "xl"
      ? "size-16"
      : size === "lg"
        ? "size-14"
        : size === "md"
          ? "size-10"
          : "size-8";
  return (
    <div className={cn("relative shrink-0", px)}>
      <div
        className={cn(
          "absolute -inset-0.5 rounded-full opacity-70 blur-md",
          r.bg
        )}
      />
      <div
        className={cn(
          "relative overflow-hidden rounded-full bg-background p-0.5 ring-2 ring-background shadow-sm",
          r.ring
        )}
      >
        <Avatar id={avatarId} className="size-full" />
      </div>
      {member.status === "active" && (
        <span className="absolute right-0 bottom-0 flex size-3.5 items-center justify-center rounded-full bg-background shadow-sm">
          <span className="relative flex size-2.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/50" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
          </span>
        </span>
      )}
    </div>
  );
}

/* ============================================================ */
/*  stat tile                                                   */
/* ============================================================ */

function StatTile({
  icon: Icon,
  label,
  value,
  sub,
  accent = "leaf",
  delay = 0,
}) {
  const accentMap = {
    leaf: { text: "text-leaf", bg: "from-leaf/20 to-leaf/5", glow: "bg-leaf/20" },
    sky: { text: "text-sky-warm", bg: "from-sky-warm/20 to-sky-warm/5", glow: "bg-sky-warm/20" },
    clay: {
      text: "text-clay-deep dark:text-clay",
      bg: "from-clay/20 to-clay/5",
      glow: "bg-clay/15",
    },
    wheat: { text: "text-wheat", bg: "from-wheat/30 to-wheat/5", glow: "bg-wheat/20" },
  };
  const a = accentMap[accent] || accentMap.leaf;

  return (
    <Reveal delay={delay} duration={500}>
      <div className="glass-card texture-paper highlight-edge group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-leaf/10">
        <div
          className={cn(
            "pointer-events-none absolute -right-6 -top-6 size-20 rounded-full opacity-50 blur-2xl transition-opacity duration-500 group-hover:opacity-90",
            a.glow
          )}
        />
        <div className="relative flex items-center gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ring-1 ring-white/10 ring-inset dark:ring-white/5",
              a.bg
            )}
          >
            <Icon className={cn("size-5", a.text)} strokeWidth={1.75} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              {label}
            </p>
            <p className="font-heading text-2xl font-semibold tracking-tight tabular-nums">
              {value}
            </p>
            {sub && (
              <p className="truncate text-[11px] text-muted-foreground">
                {sub}
              </p>
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ============================================================ */
/*  role filter chip                                            */
/* ============================================================ */

function RoleFilterChip({ roleId, count, active, onClick }) {
  const r = getRole(roleId);
  const Icon = r.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group/chip relative inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200",
        active
          ? cn("border-transparent shadow-sm", r.bg, r.text)
          : "border-border/50 bg-card/40 text-muted-foreground hover:border-border hover:bg-card/80 hover:text-foreground"
      )}
    >
      {active && (
        <span
          className={cn(
            "absolute inset-0 -z-10 rounded-full bg-gradient-to-br opacity-25 blur-md",
            r.gradient
          )}
        />
      )}
      <Icon className="size-3.5" strokeWidth={1.85} />
      {r.label}
      <span
        className={cn(
          "ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums",
          active
            ? "bg-background/40 text-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {count}
      </span>
    </button>
  );
}

/* ============================================================ */
/*  member card + action menu                                   */
/* ============================================================ */

function MemberActionMenu({ member, currentUserId, onRemove, onEdit }) {
  const isSelf = member.id === currentUserId;
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label="Member actions"
            className="inline-flex size-8 items-center justify-center rounded-xl text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          />
        }
      >
        <IconDots className="size-4" strokeWidth={1.85} />
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={6} className="w-56 p-1.5">
        <button
          type="button"
          onClick={onEdit}
          className="group/menu flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted"
        >
          <span className="flex size-7 items-center justify-center rounded-md bg-leaf/15 text-leaf">
            <IconPencil className="size-3.5" strokeWidth={1.85} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">
              {isSelf ? "Edit my profile" : "Edit details"}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Name, email & role
            </p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(member.emailId);
            toast.success("Email copied", { description: member.emailId });
          }}
          className="group/menu flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted"
        >
          <span className="flex size-7 items-center justify-center rounded-md bg-sky-warm/15 text-sky-warm">
            <IconCopy className="size-3.5" strokeWidth={1.85} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">Copy email</p>
            <p className="truncate text-[10px] text-muted-foreground">
              {member.emailId}
            </p>
          </div>
        </button>
        {!isSelf && (
          <>
            <div className="my-1 h-px bg-border/60" />
            <button
              type="button"
              onClick={onRemove}
              className="group/menu flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-red-500/8"
            >
              <span className="flex size-7 items-center justify-center rounded-md bg-red-500/15 text-red-500">
                <IconTrash className="size-3.5" strokeWidth={1.85} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-red-500/90">
                  Remove member
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Can't be undone
                </p>
              </div>
            </button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

function MemberCard({ member, currentUserId, index, onRemove, onEdit }) {
  const r = getRole(member.role);
  const RoleIcon = r.icon;
  const isSelf = member.id === currentUserId;
  const isInvited = member.status === "invited";

  return (
    <Reveal
      delay={Math.min(index * 50, 400)}
      duration={500}
      changeKey={member.id}
    >
      <div
        className={cn(
          "group/member glass-card texture-paper highlight-edge relative overflow-hidden rounded-2xl p-5 transition-all duration-300",
          "hover:-translate-y-1 hover:shadow-xl hover:shadow-leaf/10"
        )}
      >
        <div
          className={cn(
            "absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-80",
            r.gradient
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute -top-10 -right-10 size-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover/member:opacity-50",
            r.bg
          )}
        />

        <div className="relative flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <MemberAvatar member={member} size="lg" />
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex items-center gap-1.5">
                <h3 className="truncate font-heading text-sm font-bold tracking-tight">
                  {member.fullName}
                </h3>
                {isSelf && (
                  <span className="rounded-md bg-clay/15 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-clay-deep uppercase dark:text-clay">
                    You
                  </span>
                )}
              </div>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {member.emailId}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <RolePill role={member.role} />
                <StatusPill status={member.status} />
              </div>
            </div>
          </div>
          <MemberActionMenu
            member={member}
            currentUserId={currentUserId}
            onRemove={onRemove}
            onEdit={onEdit}
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-muted/40 px-2.5 py-2">
            <p className="text-[9px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
              {isInvited ? "Invited" : "Joined"}
            </p>
            <p className="mt-0.5 truncate text-xs font-semibold tabular-nums">
              {formatDate(member.joinedAt)}
            </p>
          </div>
          <div className="rounded-lg bg-muted/40 px-2.5 py-2">
            <p className="text-[9px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
              {isInvited ? "Status" : "Last active"}
            </p>
            <p className="mt-0.5 truncate text-xs font-semibold">
              {isInvited ? (
                <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400">
                  <IconClock className="size-3" strokeWidth={1.85} />
                  Pending
                </span>
              ) : (
                <span className="tabular-nums">
                  {formatRelative(member.lastActive)}
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5 border-t border-border/30 pt-3 text-[11px] text-muted-foreground">
          <RoleIcon
            className={cn("size-3.5 shrink-0", r.text)}
            strokeWidth={1.85}
          />
          <span className="truncate">{r.description}</span>
        </div>
      </div>
    </Reveal>
  );
}

function MemberCardSkeleton() {
  return (
    <div className="glass-card relative overflow-hidden rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <Skeleton className="size-14 rounded-full" />
        <div className="flex-1 space-y-2 pt-0.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-44" />
          <div className="flex gap-1.5 pt-1">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
      <Skeleton className="mt-3 h-3 w-3/4" />
    </div>
  );
}

/* ============================================================ */
/*  empty state                                                 */
/* ============================================================ */

function EmptyMembers({ onAdd }) {
  return (
    <div className="glass-card texture-paper highlight-edge relative overflow-hidden rounded-3xl py-16 text-center">
      <div className="pointer-events-none absolute -top-10 left-1/2 size-48 -translate-x-1/2 rounded-full bg-leaf/10 blur-3xl" />
      <div className="relative flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-leaf/30 to-sky-warm/30 opacity-60 blur-lg" />
          <div className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-leaf to-sage-deep text-white shadow-md ring-1 ring-white/10">
            <IconUsers className="size-8" strokeWidth={1.5} />
          </div>
        </div>
        <div className="space-y-1.5">
          <h3 className="font-heading text-lg font-semibold tracking-tight">
            No members match your filters
          </h3>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            Try adjusting your search or add someone new to the team.
          </p>
        </div>
        <Button onClick={onAdd} className="mt-2 gap-2">
          <IconUserPlus className="size-4" strokeWidth={1.85} />
          Add a member
        </Button>
      </div>
    </div>
  );
}

/* ============================================================ */
/*  page                                                        */
/* ============================================================ */

const PAGE_SIZE = 6;

export default function Members() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { members, removeMember } = useMembers();
  const currentUserId = user?.id;

  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const loading = useMockLoading(700, []);

  const counts = useMemo(() => {
    const c = {
      all: members.length,
      ...Object.fromEntries(ROLE_ORDER.map((r) => [r, 0])),
      active: 0,
      invited: 0,
      suspended: 0,
    };
    for (const m of members) {
      c[m.role] = (c[m.role] || 0) + 1;
      c[m.status] = (c[m.status] || 0) + 1;
    }
    return c;
  }, [members]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members.filter((m) => {
      if (roleFilter !== "all" && m.role !== roleFilter) return false;
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      if (q) {
        const hay = `${m.fullName} ${m.emailId}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [members, roleFilter, statusFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // Clamp the active page to a valid range — derived, so no setState effect.
  const activePage = Math.min(page, totalPages);

  const pagedMembers = useMemo(() => {
    const start = (activePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, activePage]);

  const pageItems = buildPageList(activePage, totalPages);
  const startIndex =
    filtered.length === 0 ? 0 : (activePage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(activePage * PAGE_SIZE, filtered.length);

  // Filter handlers — each one also snaps the page back to 1 so users don't
  // get stranded on an empty page after narrowing the result set.
  const onRoleFilterChange = (next) => {
    setRoleFilter(next);
    setPage(1);
  };
  const onStatusFilterChange = (next) => {
    setStatusFilter(next);
    setPage(1);
  };
  const onSearchChange = (next) => {
    setSearch(next);
    setPage(1);
  };

  const handleAdd = () => navigate("/app/members/new");
  const handleEdit = (m) => navigate(`/app/members/${m.id}/edit`);

  const handleRemove = (member) => {
    removeMember(member.id);
    toast.success("Member removed", {
      description: `${member.fullName} no longer has access.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* ============ Hero ============ */}
      <Reveal duration={450}>
        <div className="glass-card texture-paper highlight-edge relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-leaf/12 via-sage-deep/6 to-sky-warm/12" />
          <div className="absolute -top-20 -right-20 size-72 rounded-full bg-wheat/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 size-72 rounded-full bg-sky-warm/20 blur-3xl" />
          <div className="pattern-contour absolute inset-0 opacity-50 mix-blend-soft-light" />

          <div className="relative flex flex-col gap-5 p-6 sm:p-8 sm:pr-10 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-leaf/30 bg-leaf/12 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-leaf uppercase backdrop-blur-sm">
                  <IconUsers className="size-3" strokeWidth={2.2} />
                  Workspace · Team
                </span>
                <Badge variant="emerald" className="gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  {counts.active} active
                </Badge>
                {counts.invited > 0 && (
                  <Badge variant="amber" className="gap-1">
                    <IconClock className="size-2.5" strokeWidth={2.2} />
                    {counts.invited} pending
                  </Badge>
                )}
              </div>
              <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                Members
              </h1>
              <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
                Manage who has access to your farm workspace. Add teammates
                and assign roles that match how they help grow your operation.
              </p>
            </div>

            <div className="flex items-center gap-2 md:shrink-0">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => {
                        navigator.clipboard?.writeText(
                          user?.tenantDetails?.subdomain
                            ? `${user.tenantDetails.subdomain}.farmdeck.app`
                            : window.location.origin
                        );
                        toast.success("Workspace link copied");
                      }}
                      className="gap-2"
                    />
                  }
                >
                  <IconCopy className="size-4" strokeWidth={1.85} />
                  <span className="hidden sm:inline">Copy link</span>
                </TooltipTrigger>
                <TooltipContent>Copy workspace invite link</TooltipContent>
              </Tooltip>
              <Button
                onClick={handleAdd}
                size="default"
                className="gap-2 shadow-md shadow-leaf/25"
              >
                <IconUserPlus className="size-4" strokeWidth={1.85} />
                Add member
              </Button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ============ Stats row ============ */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          icon={IconUsers}
          label="Total members"
          value={counts.all}
          sub={`Across ${ROLE_ORDER.length} roles`}
          accent="leaf"
          delay={60}
        />
        <StatTile
          icon={IconUserCheck}
          label="Active"
          value={counts.active}
          sub="Currently in the workspace"
          accent="sky"
          delay={120}
        />
        <StatTile
          icon={IconMailForward}
          label="Pending invites"
          value={counts.invited}
          sub="Awaiting acceptance"
          accent="clay"
          delay={180}
        />
        <StatTile
          icon={IconUserOff}
          label="Suspended"
          value={counts.suspended}
          sub="No current access"
          accent="wheat"
          delay={240}
        />
      </div>

      {/* ============ Filter bar ============ */}
      <Reveal delay={180} duration={500}>
        <div className="glass-card texture-paper rounded-2xl p-3 sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-xs">
              <IconSearch
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                strokeWidth={1.75}
              />
              <Input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by name or email…"
                className="pl-9"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  aria-label="Clear search"
                  className="absolute top-1/2 right-2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <IconX className="size-3.5" strokeWidth={2} />
                </button>
              )}
            </div>

            <div className="inline-flex h-9 w-fit items-center gap-0.5 rounded-2xl border border-border/50 bg-card/60 p-1 shadow-sm">
              {[
                { id: "all", label: "All" },
                { id: "active", label: "Active" },
                { id: "invited", label: "Invited" },
                { id: "suspended", label: "Suspended" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onStatusFilterChange(s.id)}
                  className={cn(
                    "inline-flex h-7 items-center gap-1.5 rounded-xl px-2.5 text-xs font-semibold transition-all duration-200",
                    statusFilter === s.id
                      ? "bg-linear-to-br from-leaf to-sage-deep text-primary-foreground shadow-sm shadow-leaf/30"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/30 pt-3">
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
              <IconFilter className="size-3" strokeWidth={1.85} />
              Role
            </span>
            <button
              type="button"
              onClick={() => onRoleFilterChange("all")}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                roleFilter === "all"
                  ? "border-transparent bg-foreground/90 text-background shadow-sm"
                  : "border-border/50 bg-card/40 text-muted-foreground hover:border-border hover:bg-card/80 hover:text-foreground"
              )}
            >
              All
              <span
                className={cn(
                  "ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums",
                  roleFilter === "all"
                    ? "bg-background/20 text-background"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {counts.all}
              </span>
            </button>
            {ROLE_ORDER.map((id) => (
              <RoleFilterChip
                key={id}
                roleId={id}
                count={counts[id]}
                active={roleFilter === id}
                onClick={() => onRoleFilterChange(id)}
              />
            ))}
          </div>
        </div>
      </Reveal>

      {/* ============ Members grid ============ */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <MemberCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyMembers onAdd={handleAdd} />
      ) : (
        <>
          <div
            key={`members-${activePage}-${roleFilter}-${statusFilter}-${search}`}
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {pagedMembers.map((m, i) => (
              <MemberCard
                key={m.id}
                member={m}
                index={i}
                currentUserId={currentUserId}
                onRemove={() => handleRemove(m)}
                onEdit={() => handleEdit(m)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-3 pt-2">
              <Pagination className="justify-center">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      aria-disabled={activePage === 1}
                      className={cn(
                        activePage === 1 && "pointer-events-none opacity-40"
                      )}
                    />
                  </PaginationItem>

                  {pageItems.map((item, idx) =>
                    item === "..." ? (
                      <PaginationItem key={`e-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          isActive={item === activePage}
                          onClick={() => setPage(item)}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      aria-disabled={activePage === totalPages}
                      className={cn(
                        activePage === totalPages &&
                          "pointer-events-none opacity-40"
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>

              <p className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground tabular-nums">
                  {startIndex}–{endIndex}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground tabular-nums">
                  {filtered.length}
                </span>{" "}
                {filtered.length === 1 ? "member" : "members"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
