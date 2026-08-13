import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  IconUserPlus,
  IconSearch,
  IconX,
  IconClock,
  IconCopy,
  IconUsers,
  IconFilter,
} from "@tabler/icons-react";
import { useAuth } from "@/features/auth";
import { useMockLoading } from "@/hooks/use-mock-loading";
import { cn, checkIsOwner } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/effects";
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
import { ROLE_ORDER } from "@/constants/roles";
import { useMembers } from "../useMembers";
import { buildPageList } from "../lib/format";
import { RoleFilterChip } from "../components/RoleFilterChip";
import { EmptyMembers } from "../components/EmptyMembers";
import { MemberCard } from "../components/member-card/MemberCard";
import { MemberCardSkeleton } from "../components/member-card/MemberCardSkeleton";

const PAGE_SIZE = 8;

const STATUS_OPTIONS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "invited", label: "Invited" },
  { id: "suspended", label: "Suspended" },
];

export default function Members() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { members, suspendMember, reinviteMember } = useMembers();
  const currentUserId = user?.id;
  const isOwner = checkIsOwner(user?.role);

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

  // Each filter change snaps the page back to 1 so users don't strand on an
  // empty page after narrowing the result set.
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

  const handleSuspend = (member) => {
    suspendMember(member.id);
    toast.success("Member suspended", {
      description: `${member.fullName} no longer has access.`,
    });
  };

  const handleReinvite = (member) => {
    reinviteMember(member.id);
  };

  return (
    <div className="flex flex-col gap-4 lg:h-[calc(100svh-6.5rem)] lg:overflow-hidden">
      {/* ============ Compact header (title + counts + actions + filters) ==== */}
      <Reveal duration={400}>
        <div className="glass-card texture-paper highlight-edge relative shrink-0 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-leaf/10 via-sage-deep/5 to-sky-warm/10" />
          <div className="absolute -top-16 -right-10 size-48 rounded-full bg-wheat/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-48 rounded-full bg-sky-warm/12 blur-3xl" />
          <div className="pattern-contour absolute inset-0 opacity-40 mix-blend-soft-light" />

          <div className="relative flex flex-col gap-3 p-4 sm:p-5">
            {/* Row 1 — title + inline counts | actions */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-leaf/30 to-sky-warm/30 opacity-60 blur-md" />
                  <div className="relative flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-leaf to-sage-deep text-white shadow-md ring-1 ring-white/10">
                    <IconUsers className="size-5" strokeWidth={1.75} />
                  </div>
                </div>
                <div className="min-w-0">
                  <h1 className="font-heading text-lg font-bold tracking-tight sm:text-xl">
                    Members
                  </h1>
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-foreground tabular-nums">
                        {counts.active}
                      </span>{" "}
                      active
                    </span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="inline-flex items-center gap-1">
                      <IconClock className="size-3 text-amber-500" strokeWidth={2} />
                      <span className="font-semibold text-foreground tabular-nums">
                        {counts.invited}
                      </span>{" "}
                      pending
                    </span>
                    {counts.suspended > 0 && (
                      <>
                        <span className="text-muted-foreground/40">·</span>
                        <span className="inline-flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-zinc-400" />
                          <span className="font-semibold text-foreground tabular-nums">
                            {counts.suspended}
                          </span>{" "}
                          suspended
                        </span>
                      </>
                    )}
                    <span className="text-muted-foreground/40">·</span>
                    <span className="inline-flex items-center gap-1">
                      <span className="font-semibold text-foreground tabular-nums">
                        {counts.all}
                      </span>{" "}
                      total
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard?.writeText(
                            user?.tenantDetails?.subdomain
                              ? `${user.tenantDetails.subdomain}.farmdeck.app`
                              : window.location.origin
                          );
                          toast.success("Workspace link copied");
                        }}
                        className="gap-1.5"
                      />
                    }
                  >
                    <IconCopy className="size-4" strokeWidth={1.85} />
                    <span className="hidden sm:inline">Copy link</span>
                  </TooltipTrigger>
                  <TooltipContent>Copy workspace invite link</TooltipContent>
                </Tooltip>
                <Button onClick={handleAdd} size="sm" className="gap-1.5 shadow-md shadow-leaf/25">
                  <IconUserPlus className="size-4" strokeWidth={1.85} />
                  Add member
                </Button>
              </div>
            </div>

            {/* Row 2 — search | status segmented */}
            <div className="flex flex-col gap-2.5 border-t border-border/30 pt-3 lg:flex-row lg:items-center lg:justify-between">
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
                {STATUS_OPTIONS.map((s) => (
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

            {/* Row 3 — role chips */}
            <div className="flex flex-wrap items-center gap-2 border-t border-border/30 pt-2.5">
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
        </div>
      </Reveal>

      {/* ============ Grid region — fills the rest, no page scroll ========= */}
      <div className="flex flex-col gap-3 lg:min-h-0 lg:flex-1">
        <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <MemberCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex min-h-64 items-center justify-center py-6">
              <EmptyMembers onAdd={handleAdd} />
            </div>
          ) : (
            <div
              key={`members-${activePage}-${roleFilter}-${statusFilter}-${search}`}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {pagedMembers.map((m, i) => (
              <MemberCard
                key={m.id}
                member={m}
                index={i}
                currentUserId={currentUserId}
                isOwner={isOwner}
                onSuspend={() => handleSuspend(m)}
                onReinvite={() => handleReinvite(m)}
                onEdit={() => handleEdit(m)}
              />
              ))}
            </div>
          )}
        </div>

        {!loading && totalPages > 1 && (
          <div className="flex shrink-0 flex-col items-center gap-2 pt-1">
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
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
      </div>
    </div>
  );
}
