import { useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * OtpInput — a 6-cell (configurable) one-time-code entry control.
 *
 * Behaviour:
 *  - Numeric only; one digit per cell, auto-advances to the next on type.
 *  - Backspace clears the current cell, or jumps to + clears the previous one
 *    when the current cell is empty.
 *  - Arrow / Home / End keys move between cells.
 *  - Paste anywhere fills as many cells as the pasted digits allow.
 *  - Controlled: parent owns the string via `value` + `onChange`.
 *
 * Styling matches the auth theme: `leaf`-accented focus ring, subtle filled
 * state, `destructive` ring when `hasError`.
 */
export default function OtpInput({
  value = "",
  length = 6,
  onChange,
  hasError = false,
  disabled = false,
  autoFocus = false,
  className,
}) {
  const refs = useRef([]);

  const focusCell = (i) => {
    const el = refs.current[i];
    if (el) {
      el.focus();
      el.select();
    }
  };

  // Build a fixed-length working array so we can mutate individual cells
  // regardless of how long `value` currently is.
  const toBuffer = () =>
    (value + " ".repeat(Math.max(0, length - value.length)))
      .slice(0, length)
      .split("");

  const commit = (buffer) => onChange?.(buffer.join("").trimEnd());

  const handleChange = (i, raw) => {
    const digit = raw.replace(/\D/g, "");
    if (!digit) return; // ignore non-numeric input entirely
    const ch = digit[digit.length - 1];
    const buffer = toBuffer();
    buffer[i] = ch;
    commit(buffer);
    if (i < length - 1) focusCell(i + 1);
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const buffer = toBuffer();
      if ((value[i] ?? "").trim()) {
        buffer[i] = " ";
        commit(buffer);
      } else if (i > 0) {
        buffer[i - 1] = " ";
        commit(buffer);
        focusCell(i - 1);
      }
    } else if (e.key === "Delete") {
      e.preventDefault();
      const buffer = toBuffer();
      buffer[i] = " ";
      commit(buffer);
    } else if (e.key === "ArrowLeft" && i > 0) {
      e.preventDefault();
      focusCell(i - 1);
    } else if (e.key === "ArrowRight" && i < length - 1) {
      e.preventDefault();
      focusCell(i + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusCell(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusCell(length - 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;
    onChange?.(pasted);
    focusCell(Math.min(pasted.length, length - 1));
  };

  return (
    <div
      className={cn("flex items-center justify-between gap-2", className)}
      onPaste={handlePaste}
    >
      {Array.from({ length }).map((_, i) => {
        const ch = value[i] ?? "";
        const filled = ch.trim() !== "";
        return (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            name={`otp-${i}`}
            maxLength={1}
            value={ch}
            disabled={disabled}
            autoFocus={autoFocus && i === 0}
            aria-label={`Digit ${i + 1} of ${length}`}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onFocus={(e) => e.target.select()}
            className={cn(
              "size-11 rounded-xl border bg-card/60 text-center font-heading text-lg font-semibold shadow-sm transition-all sm:size-12 sm:text-xl",
              "border-input selection:bg-leaf/20",
              "focus:outline-none focus:border-leaf focus:ring-[3px] focus:ring-leaf/30 focus:bg-card",
              filled && "border-leaf/50 bg-leaf/[0.07]",
              hasError &&
                "border-destructive/60 bg-destructive/5 focus:border-destructive focus:ring-destructive/25",
              disabled && "cursor-not-allowed opacity-60"
            )}
          />
        );
      })}
    </div>
  );
}
