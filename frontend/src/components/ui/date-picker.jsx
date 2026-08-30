import * as React from "react";
import {
  IconCalendarEvent,
  IconChevronLeft,
  IconChevronRight,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * DatePicker — a themed, popover-driven single-date picker that mirrors
 * FieldWrapper's affordance (rounded-xl, leading icon, leaf focus ring)
 * so it slots into the form alongside text inputs as one. The trigger
 * shows the formatted date + a relative hint; the popover carries the
 * calendar, a row of quick-set shortcuts, and an explicit Clear action.
 *
 * Controlled: `value` / `onChange(value)` — both are ISO date strings
 * ("YYYY-MM-DD"), the same shape `<input type="date">` produces, so
 * the picker is a drop-in replacement inside react-hook-form controlled
 * fields. Empty / unset values are `""`.
 *
 *   <DatePicker value={field.value} onChange={field.onChange} />
 *
 * Validation: pass `disabled` (a Matcher / range of dates from
 * react-day-picker) to lock out days the user shouldn't pick — e.g.
 * before a seed date.
 */

const DAY_MS = 86_400_000;

const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const toIso = (d) => {
  if (!d) return "";
  const x = startOfDay(d);
  const y = x.getFullYear();
  const m = String(x.getMonth() + 1).padStart(2, "0");
  const day = String(x.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const fromIso = (iso) => {
  if (!iso) return undefined;
  // Parse as a local date so the displayed day matches the typed day.
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

const formatLong = (iso) => {
  if (!iso) return "";
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

/** "in 5 days" / "today" / "yesterday" / "3 days ago" */
const relativeHint = (iso) => {
  if (!iso) return "";
  const today = startOfDay(new Date()).getTime();
  const target = startOfDay(new Date(`${iso}T00:00:00`)).getTime();
  const diff = Math.round((target - today) / DAY_MS);
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  if (diff === -1) return "yesterday";
  if (diff > 0) return `in ${diff} days`;
  return `${-diff} days ago`;
};

const QUICK_PRESETS = [
  { id: "today", label: "Today", days: 0 },
  { id: "tomorrow", label: "Tomorrow", days: 1 },
  { id: "week", label: "+ 1 wk", days: 7 },
  { id: "twoweeks", label: "+ 2 wks", days: 14 },
  { id: "month", label: "+ 1 mo", days: 30 },
];

const DatePicker = ({
  value,
  onChange,
  placeholder = "Pick a date",
  leadingIcon: LeadingIcon = IconCalendarEvent,
  disabled,
  disabledDays,
  min,
  max,
  hasError = false,
  className,
  align = "start",
  id,
  name,
}) => {
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState(() => fromIso(value) ?? new Date());
  const [quickTargets, setQuickTargets] = React.useState(() =>
    QUICK_PRESETS.map((p) => ({
      ...p,
      iso: toIso(new Date(Date.now() + p.days * DAY_MS)),
    }))
  );

  // Sync the visible month to a far-future value picked from the
  // quick-set chips — calling setState during render based on a
  // previous-prop snapshot is the React-documented pattern for
  // derived state (https://react.dev/reference/react/useState#storing-information-from-previous-renders).
  const [prevValue, setPrevValue] = React.useState(value);
  if (prevValue !== value) {
    setPrevValue(value);
    const d = fromIso(value);
    if (d && (d.getMonth() !== month.getMonth() || d.getFullYear() !== month.getFullYear())) {
      setMonth(d);
    }
  }

  const handleOpenChange = React.useCallback((next) => {
    if (next) {
      // Refresh quick-set chips when the popover opens so they stay
      // anchored to "now" — `Today` is always today.
      const now = Date.now();
      setQuickTargets(
        QUICK_PRESETS.map((p) => ({
          ...p,
          iso: toIso(new Date(now + p.days * DAY_MS)),
        }))
      );
    }
    setOpen(next);
  }, []);

  // Compose the disabled matcher from min/max bounds + any caller
  // supplied matcher. The Calendar forwards this straight to DayPicker.
  const composedDisabled = React.useMemo(() => {
    const list = [];
    if (min) list.push({ before: fromIso(min) });
    if (max) list.push({ after: fromIso(max) });
    if (disabledDays) list.push(disabledDays);
    if (list.length === 0) return undefined;
    if (list.length === 1) return list[0];
    return list;
  }, [min, max, disabledDays]);

  const handleSelect = (d) => {
    if (!d) {
      onChange?.("");
      setOpen(false);
      return;
    }
    onChange?.(toIso(d));
    setOpen(false);
  };

  const clear = (e) => {
    e?.stopPropagation();
    onChange?.("");
    setMonth(new Date());
  };

  const selected = fromIso(value);
  const hint = relativeHint(value);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <div className="w-full">
        <PopoverTrigger
          type="button"
          id={id}
          data-name={name}
          disabled={disabled}
          className={cn(
            // Mirror FieldWrapper so it sits alongside the text inputs
            // as one — same height, padding, border, focus ring.
            "group/date relative flex h-9 w-full min-w-0 items-center gap-2 rounded-xl border bg-card/60 px-3 text-left text-sm transition-[color,background-color,border-color,box-shadow]",
            "border-input ring-1 ring-transparent",
            "hover:bg-card/80 data-[popup-open]:border-leaf/60 data-[popup-open]:bg-card/80 data-[popup-open]:ring-leaf/30",
            "focus-visible:border-leaf/60 focus-visible:bg-card/80 focus-visible:ring-leaf/30 focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            hasError &&
              "border-destructive/60 ring-destructive/20 data-[popup-open]:border-destructive data-[popup-open]:ring-destructive/30 focus-visible:border-destructive focus-visible:ring-destructive/30",
            className,
          )}
        >
          <LeadingIcon
            className={cn(
              "size-4 shrink-0",
              hasError ? "text-destructive" : "text-muted-foreground"
            )}
            strokeWidth={1.75}
          />
          <span className="flex min-w-0 flex-1 items-baseline gap-1.5 truncate">
            {value ? (
              <>
                <span className="truncate font-medium tracking-tight text-foreground">
                  {formatLong(value)}
                </span>
                {hint && (
                  <span
                    className={cn(
                      "shrink-0 text-[10px] font-semibold tracking-wider uppercase",
                      hint === "today"
                        ? "text-leaf"
                        : "text-muted-foreground/70"
                    )}
                  >
                    · {hint}
                  </span>
                )}
              </>
            ) : (
              <span className="truncate text-muted-foreground">
                {placeholder}
              </span>
            )}
          </span>
          {value && !disabled && (
            <span
              role="button"
              tabIndex={-1}
              onClick={clear}
              aria-label="Clear date"
              className="inline-flex size-5 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <IconX className="size-3.5" strokeWidth={2} />
            </span>
          )}
        </PopoverTrigger>
      </div>

      <PopoverContent
        align={align}
        sideOffset={6}
        className="w-[18rem] gap-0 overflow-hidden p-0"
      >
        {/* Quick-set shortcuts — common seed/harvest offsets one tap away */}
        <div className="flex flex-wrap gap-1 border-b border-border/40 bg-muted/30 p-2">
          {quickTargets.map((preset) => {
            const isActive = value === preset.iso;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelect(new Date(`${preset.iso}T00:00:00`))}
                className={cn(
                  "inline-flex h-7 items-center rounded-lg px-2.5 text-[11px] font-semibold transition-colors",
                  isActive
                    ? "bg-leaf/15 text-leaf ring-1 ring-leaf/25"
                    : "text-muted-foreground hover:bg-card hover:text-foreground"
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Calendar — controlled so the trigger and the grid stay in sync */}
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          month={month}
          onMonthChange={setMonth}
          disabled={composedDisabled}
          autoFocus
          className="rounded-none border-0 [--cell-size:--spacing(9)]"
          classNames={{
            month_caption:
              "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size) text-sm font-semibold",
          }}
          components={{
            Chevron: ({ orientation, ...props }) =>
              orientation === "left" ? (
                <IconChevronLeft className="size-4" {...props} />
              ) : (
                <IconChevronRight className="size-4" {...props} />
              ),
          }}
        />

        {/* Footer — selected value + Clear */}
        <div className="flex items-center justify-between gap-2 border-t border-border/40 bg-muted/30 px-3 py-2">
          <p className="truncate text-[11px] text-muted-foreground">
            {value ? (
              <>
                <span className="font-semibold text-foreground tabular-nums">
                  {formatLong(value)}
                </span>
                {hint && (
                  <span className="ml-1 text-muted-foreground/70">
                    · {hint}
                  </span>
                )}
              </>
            ) : (
              <span className="italic">No date selected</span>
            )}
          </p>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clear}
              className="h-7 gap-1 rounded-lg px-2 text-[11px]"
            >
              <IconX className="size-3" strokeWidth={2} />
              Clear
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;