import * as React from "react";
import { IconCheck, IconChevronDown, IconSearch, IconX } from "@tabler/icons-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * SearchableSelect — a themed, searchable single-select combobox built on
 * the existing Popover primitive. The trigger mirrors the FieldWrapper
 * affordance (rounded-xl, leading icon, leaf focus ring) so it sits
 * alongside the form's text inputs as one. The dropdown has a sticky
 * search input with a live filter, a scrollable option list with full
 * keyboard navigation (↑/↓/Enter/Esc), a check indicator on the selected
 * option, and an empty state.
 *
 * Each item: { value, label, description?, badge?, thumbnail?, icon? }
 *  - `thumbnail`  a React node (e.g. <SoilTypeArt variant=… />) shown
 *                 in the trigger and at the start of the option row.
 *  - `badge`     a small node (e.g. a coloured dot) shown after the label.
 *  - `description` secondary text shown under the label in the option row.
 *
 * Controlled: `value` / `onValueChange(value)`.
 */
const SearchableSelect = ({
  items,
  value,
  onValueChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No matches",
  leadingIcon: LeadingIcon,
  disabled,
  "aria-label": ariaLabel,
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(-1);

  const searchRef = React.useRef(null);
  const listRef = React.useRef(null);
  const itemRefs = React.useRef([]);

  const selected = React.useMemo(
    () => items.find((it) => it.value === value) ?? null,
    [items, value],
  );

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const hay = [it.label, it.description, it.keywords]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [items, query]);

  // Keep the active item scrolled into view during keyboard navigation.
  React.useEffect(() => {
    if (open && active >= 0) {
      itemRefs.current[active]?.scrollIntoView({ block: "nearest" });
    }
  }, [active, open]);

  const choose = React.useCallback(
    (item) => {
      onValueChange?.(item.value);
      setOpen(false);
    },
    [onValueChange],
  );

  const handleOpenChange = (next) => {
    setOpen(next);
    if (!next) return;
    // Reset transient state on open: clear the filter and start the
    // highlight on the selected item (or the first) so Enter re-selects
    // the current value without a round-trip to the mouse.
    setQuery("");
    const idx = value
      ? items.findIndex((it) => it.value === value)
      : -1;
    setActive(idx >= 0 ? idx : 0);
    // Focus the search input on the next frame (after the popup mounts).
    requestAnimationFrame(() => searchRef.current?.focus());
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (filtered.length ? (i + 1) % filtered.length : -1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) =>
        filtered.length ? (i - 1 + filtered.length) % filtered.length : -1,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[active];
      if (item) choose(item);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  const TriggerIcon = LeadingIcon ?? selected?.icon;
  const TriggerThumb = selected?.thumbnail;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        aria-label={ariaLabel}
        disabled={disabled}
        className={cn(
          // Mirrors FieldWrapper so it lines up with the form's text inputs.
          "group relative flex h-9 w-full items-center gap-2 rounded-xl border bg-card/60 px-3 text-left text-sm transition-[color,background-color,border-color,box-shadow]",
          "border-input ring-1 ring-transparent",
          "hover:bg-card/80 data-[popup-open]:border-leaf/60 data-[popup-open]:bg-card/80 data-[popup-open]:ring-leaf/30",
          "focus-visible:border-leaf/60 focus-visible:bg-card/80 focus-visible:ring-leaf/30 focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        {TriggerIcon && !TriggerThumb && (
          <TriggerIcon
            className="size-4 shrink-0 text-muted-foreground"
            strokeWidth={1.75}
          />
        )}
        {TriggerThumb && (
          <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted ring-1 ring-border/40">
            {TriggerThumb}
          </span>
        )}
        <span className="min-w-0 flex-1 truncate font-medium tracking-tight text-foreground">
          {selected ? (
            selected.label
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </span>
        <IconChevronDown
          className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-popup-open:rotate-180"
          strokeWidth={1.85}
        />
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-(--anchor-width) min-w-60 gap-0 p-0"
      >
        {/* Sticky search header */}
        <div className="relative border-b border-border/60 p-1.5">
          <IconSearch
            className="pointer-events-none absolute top-1/2 left-3.5 size-3.5 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.85}
          />
          <Input
            ref={searchRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder={searchPlaceholder}
            className="h-7 border-0 bg-muted/50 pl-7 pr-7 text-xs shadow-none focus-visible:ring-0"
          />
          {query && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => {
                setQuery("");
                searchRef.current?.focus();
              }}
              className="absolute top-1/2 right-2 flex size-4 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              aria-label="Clear search"
            >
              <IconX className="size-3" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Option list */}
        <div
          ref={listRef}
          role="listbox"
          className="max-h-52 space-y-0.5 overflow-y-auto p-1"
        >
          {filtered.length === 0 ? (
            <p className="px-3 py-5 text-center text-xs text-muted-foreground">
              {emptyText}
            </p>
          ) : (
            filtered.map((it, i) => {
              const isSelected = it.value === value;
              const isActive = i === active;
              // Row background tiers: idle → selected → active, each
              // leaf-tinted so the brand colour carries the state instead
              // of a flat gray block.
              const rowBg = isActive
                ? "bg-leaf/12 ring-1 ring-leaf/25"
                : isSelected
                  ? "bg-leaf/6 ring-1 ring-leaf/15 hover:bg-leaf/10"
                  : "hover:bg-muted/55";
              return (
                <button
                  key={it.value}
                  type="button"
                  ref={(el) => (itemRefs.current[i] = el)}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(it)}
                  className={cn(
                    "group/opt relative flex w-full items-center gap-2 rounded-lg py-1.5 pr-7 pl-2 text-left text-xs outline-hidden transition-[background-color,box-shadow] duration-150",
                    rowBg,
                  )}
                >
                  {/* Left-edge gradient accent — appears on hover/active,
                      the same leaf→sage indicator language as the tabs. */}
                  <span
                    className={cn(
                      "pointer-events-none absolute top-1 bottom-1 left-0 w-0.5 rounded-full bg-linear-to-b from-leaf to-sage-deep opacity-0 transition-opacity duration-150",
                      isActive && "opacity-100",
                    )}
                  />
                  {it.thumbnail && (
                    <span
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center overflow-hidden rounded bg-muted ring-1 transition-shadow duration-150",
                        isActive || isSelected
                          ? "ring-leaf/40"
                          : "ring-border/40",
                      )}
                    >
                      {it.thumbnail}
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      {it.badge}
                      <span className="truncate text-[13px] font-semibold tracking-tight text-foreground">
                        {it.label}
                      </span>
                    </span>
                    {it.description && (
                      <span className="mt-0.5 block truncate text-[10px] leading-tight text-muted-foreground">
                        {it.description}
                      </span>
                    )}
                  </span>
                  {isSelected && (
                    <IconCheck
                      className="absolute right-2 size-3.5 text-leaf"
                      strokeWidth={2.5}
                    />
                  )}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SearchableSelect;
