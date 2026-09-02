/**
 * Password strength helpers — shared by the auth forms (register +
 * accept-invitation). Evaluates the backend's password policy and derives a
 * 0–4 score plus label/tone for the strength meter.
 */

export function buildPasswordChecks(pw) {
  return {
    length: pw.length >= 8 && pw.length <= 72,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /\d/.test(pw),
    symbol: /[^A-Za-z0-9]/.test(pw),
  };
}

export const STRENGTH_TONES = [
  // index = score 0..4
  {
    bar: "bg-destructive/60",
    fill: "bg-destructive",
    text: "text-destructive",
    ring: "ring-destructive/25",
  },
  {
    bar: "bg-clay/30",
    fill: "bg-clay",
    text: "text-clay-deep dark:text-clay",
    ring: "ring-clay/30",
  },
  {
    bar: "bg-wheat/35",
    fill: "bg-wheat-deep",
    text: "text-wheat-deep dark:text-wheat",
    ring: "ring-wheat/35",
  },
  {
    bar: "bg-leaf/25",
    fill: "bg-leaf",
    text: "text-leaf",
    ring: "ring-leaf/30",
  },
  {
    bar: "bg-sage/30",
    fill: "bg-sage-deep",
    text: "text-sage-deep dark:text-sage",
    ring: "ring-sage/40",
  },
];

export function calcPasswordStrength(checks) {
  const passed = Object.values(checks).filter(Boolean).length;
  // Score 0–4 (the 5th "segment" is for 5/5 = excellent)
  const score = Math.max(0, passed - 1);
  const segments = passed;
  const label =
    passed === 0
      ? "Empty"
      : passed <= 2
        ? "Weak"
        : passed === 3
          ? "Fair"
          : passed === 4
            ? "Strong"
            : "Excellent";

  const tone = STRENGTH_TONES[score] || STRENGTH_TONES[0];
  return { score, segments, label, tone };
}
