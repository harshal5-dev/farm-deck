/**
 * Avatars — 12 illustrated farm characters the user can pick on the Profile
 * page. Each is a self-contained inline SVG drawn in a single cohesive style:
 * flat shapes, a soft top light, a ground shadow, and a tiny blush — so the
 * picker grid reads as one matching set.
 *
 * Use:
 *   <Avatar id={user.profilePicture} className="size-16" />
 *   <AvatarPicker selected={user.profilePicture} onSelect={(id) => ...} />
 */
import { useId } from "react";
import { IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Shared backdrop — a soft radial tint, top sheen, ground shadow.    */
/*  `idPrefix` is unique per instance so two copies of the same avatar */
/*  (hero + picker) don't share one gradient id.                       */
/* ------------------------------------------------------------------ */

function Backdrop({ idPrefix, light, deep }) {
  const id = `bg-${idPrefix}`;
  return (
    <>
      <defs>
        <radialGradient id={id} cx="42%" cy="30%" r="80%">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={deep} />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill={`url(#${id})`} />
      {/* top sheen */}
      <ellipse cx="40" cy="20" rx="32" ry="12" fill="#ffffff" opacity="0.4" />
      {/* ground shadow */}
      <ellipse cx="50" cy="90" rx="24" ry="4.5" fill="#1f2937" opacity="0.12" />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Individual avatars                                                 */
/* ------------------------------------------------------------------ */

/* 1 — Farmer (sun hat, mustache, overalls) */
function Farmer() {
  const uid = useId().replace(/[:#]/g, "");
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <Backdrop idPrefix={uid} light="#fef9c3" deep="#fde047" />
      {/* shoulders / overalls */}
      <path d="M22 84 Q22 66 40 62 L60 62 Q78 66 78 84 Z" fill="#2563eb" />
      <path d="M40 62 L40 78 L48 78 L48 62 Z" fill="#1d4ed8" />
      <path d="M52 62 L52 78 L60 78 L60 62 Z" fill="#1d4ed8" />
      {/* shirt collar */}
      <path d="M44 62 Q50 70 56 62 Z" fill="#f8fafc" />
      {/* neck */}
      <rect x="46" y="54" width="8" height="10" rx="3" fill="#f5c89a" />
      {/* face */}
      <circle cx="50" cy="44" r="15" fill="#f5c89a" />
      {/* sun hat brim */}
      <ellipse cx="50" cy="34" rx="24" ry="5" fill="#f59e0b" />
      <path d="M30 33 Q30 24 50 24 Q70 24 70 33 Z" fill="#fbbf24" />
      <ellipse cx="50" cy="30" rx="14" ry="2" fill="#f59e0b" />
      {/* eyes */}
      <circle cx="45" cy="44" r="1.8" fill="#1f2937" />
      <circle cx="55" cy="44" r="1.8" fill="#1f2937" />
      {/* blush */}
      <circle cx="42" cy="49" r="2.2" fill="#fb7185" opacity="0.5" />
      <circle cx="58" cy="49" r="2.2" fill="#fb7185" opacity="0.5" />
      {/* mustache */}
      <path d="M44 51 Q50 54 56 51 Q53 50 50 51 Q47 50 44 51 Z" fill="#78350f" />
      {/* smile */}
      <path d="M47 53 Q50 55 53 53" stroke="#1f2937" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* 2 — Gardener (cap, watering can, cheerful) */
function Gardener() {
  const uid = useId().replace(/[:#]/g, "");
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <Backdrop idPrefix={uid} light="#dcfce7" deep="#86efac" />
      {/* shoulders */}
      <path d="M22 84 Q22 66 40 62 L60 62 Q78 66 78 84 Z" fill="#059669" />
      {/* neck */}
      <rect x="46" y="54" width="8" height="10" rx="3" fill="#e8b48a" />
      {/* face */}
      <circle cx="50" cy="44" r="15" fill="#e8b48a" />
      {/* cap */}
      <path d="M35 38 Q35 26 50 26 Q65 26 65 38 Z" fill="#16a34a" />
      <path d="M35 38 Q22 41 30 42 L65 42 Z" fill="#15803d" />
      {/* sprout on cap */}
      <path d="M50 26 Q50 20 47 21 M50 26 Q50 20 53 21" stroke="#fde047" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {/* eyes */}
      <circle cx="45" cy="45" r="1.8" fill="#1f2937" />
      <circle cx="55" cy="45" r="1.8" fill="#1f2937" />
      {/* blush */}
      <circle cx="42" cy="50" r="2.2" fill="#fb7185" opacity="0.5" />
      <circle cx="58" cy="50" r="2.2" fill="#fb7185" opacity="0.5" />
      {/* smile */}
      <path d="M45 51 Q50 56 55 51" stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* 3 — Cow */
function Cow() {
  const uid = useId().replace(/[:#]/g, "");
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <Backdrop idPrefix={uid} light="#f8fafc" deep="#cbd5e1" />
      {/* ears */}
      <ellipse cx="26" cy="46" rx="7" ry="5" fill="#f1f5f9" transform="rotate(-25 26 46)" />
      <ellipse cx="74" cy="46" rx="7" ry="5" fill="#f1f5f9" transform="rotate(25 74 46)" />
      <ellipse cx="26" cy="46" rx="3.5" ry="2.5" fill="#f9a8d4" transform="rotate(-25 26 46)" />
      <ellipse cx="74" cy="46" rx="3.5" ry="2.5" fill="#f9a8d4" transform="rotate(25 74 46)" />
      {/* horns */}
      <path d="M36 34 Q33 27 39 30 Z" fill="#fde68a" />
      <path d="M64 34 Q67 27 61 30 Z" fill="#fde68a" />
      {/* head */}
      <ellipse cx="50" cy="54" rx="24" ry="22" fill="#ffffff" />
      {/* spots */}
      <path d="M34 44 Q30 38 36 36 Q42 38 40 44 Z" fill="#1f2937" />
      <path d="M64 58 Q70 56 70 62 Q66 66 62 62 Z" fill="#1f2937" />
      {/* snout */}
      <ellipse cx="50" cy="62" rx="13" ry="9" fill="#fbcfe8" />
      <ellipse cx="46" cy="62" rx="1.4" ry="2" fill="#9d174d" />
      <ellipse cx="54" cy="62" rx="1.4" ry="2" fill="#9d174d" />
      {/* eyes */}
      <circle cx="43" cy="50" r="2.4" fill="#1f2937" />
      <circle cx="57" cy="50" r="2.4" fill="#1f2937" />
      <circle cx="43.7" cy="49.3" r="0.8" fill="#fff" />
      <circle cx="57.7" cy="49.3" r="0.8" fill="#fff" />
      {/* smile */}
      <path d="M45 68 Q50 71 55 68" stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* 4 — Hen */
function Hen() {
  const uid = useId().replace(/[:#]/g, "");
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <Backdrop idPrefix={uid} light="#fff7ed" deep="#fed7aa" />
      {/* body */}
      <ellipse cx="50" cy="58" rx="26" ry="22" fill="#fef3c7" />
      {/* wing */}
      <path d="M38 56 Q34 66 44 70 Q48 64 44 56 Z" fill="#fde68a" />
      {/* head */}
      <circle cx="58" cy="44" r="14" fill="#fef3c7" />
      {/* comb */}
      <path d="M54 30 Q56 24 58 30 Q60 24 62 30" fill="#dc2626" />
      {/* wattle */}
      <path d="M62 50 Q66 54 62 56 Z" fill="#dc2626" />
      {/* beak */}
      <path d="M70 44 L78 47 L70 50 Z" fill="#f59e0b" />
      {/* eye */}
      <circle cx="60" cy="43" r="2.4" fill="#1f2937" />
      <circle cx="60.7" cy="42.3" r="0.8" fill="#fff" />
      {/* feet */}
      <path d="M44 80 L40 86 M46 80 L46 86 M48 80 L52 86" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <path d="M54 80 L50 86 M56 80 L56 86 M58 80 L62 86" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      {/* cheek */}
      <circle cx="54" cy="48" r="2" fill="#fb7185" opacity="0.5" />
    </svg>
  );
}

/* 5 — Pig */
function Pig() {
  const uid = useId().replace(/[:#]/g, "");
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <Backdrop idPrefix={uid} light="#fdf2f8" deep="#fbcfe8" />
      {/* ears */}
      <path d="M30 38 Q22 30 34 32 Z" fill="#f472b6" />
      <path d="M70 38 Q78 30 66 32 Z" fill="#f472b6" />
      <path d="M32 36 Q28 32 33 33 Z" fill="#ec4899" />
      <path d="M68 36 Q72 32 67 33 Z" fill="#ec4899" />
      {/* head */}
      <ellipse cx="50" cy="54" rx="26" ry="23" fill="#f9a8d4" />
      {/* snout */}
      <ellipse cx="50" cy="60" rx="12" ry="9" fill="#ec4899" />
      <ellipse cx="46" cy="60" rx="1.6" ry="2.2" fill="#831843" />
      <ellipse cx="54" cy="60" rx="1.6" ry="2.2" fill="#831843" />
      {/* eyes */}
      <circle cx="42" cy="48" r="2.4" fill="#1f2937" />
      <circle cx="58" cy="48" r="2.4" fill="#1f2937" />
      <circle cx="42.7" cy="47.3" r="0.8" fill="#fff" />
      <circle cx="58.7" cy="47.3" r="0.8" fill="#fff" />
      {/* smile */}
      <path d="M45 68 Q50 71 55 68" stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* blush */}
      <circle cx="36" cy="56" r="2.6" fill="#db2777" opacity="0.4" />
      <circle cx="64" cy="56" r="2.6" fill="#db2777" opacity="0.4" />
    </svg>
  );
}

/* 6 — Lamb */
function Lamb() {
  const uid = useId().replace(/[:#]/g, "");
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <Backdrop idPrefix={uid} light="#f0fdf4" deep="#bbf7d0" />
      {/* wool puffs */}
      <circle cx="32" cy="48" r="11" fill="#f8fafc" />
      <circle cx="44" cy="40" r="12" fill="#ffffff" />
      <circle cx="56" cy="40" r="12" fill="#ffffff" />
      <circle cx="68" cy="48" r="11" fill="#f8fafc" />
      <circle cx="38" cy="62" r="11" fill="#ffffff" />
      <circle cx="62" cy="62" r="11" fill="#ffffff" />
      <circle cx="50" cy="68" r="11" fill="#f8fafc" />
      {/* ears */}
      <ellipse cx="32" cy="50" rx="4" ry="6" fill="#1f2937" transform="rotate(-20 32 50)" />
      <ellipse cx="68" cy="50" rx="4" ry="6" fill="#1f2937" transform="rotate(20 68 50)" />
      {/* face */}
      <ellipse cx="50" cy="54" rx="13" ry="12" fill="#2b2b2b" />
      {/* eyes */}
      <circle cx="45" cy="52" r="2" fill="#fde047" />
      <circle cx="55" cy="52" r="2" fill="#fde047" />
      <circle cx="45" cy="52" r="1" fill="#1f2937" />
      <circle cx="55" cy="52" r="1" fill="#1f2937" />
      {/* nose + smile */}
      <ellipse cx="50" cy="58" rx="2" ry="1.6" fill="#f9a8d4" />
      <path d="M46 62 Q50 65 54 62" stroke="#f1f5f9" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* 7 — Horse */
function Horse() {
  const uid = useId().replace(/[:#]/g, "");
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <Backdrop idPrefix={uid} light="#fef3c7" deep="#fbbf24" />
      {/* ears */}
      <path d="M34 30 L30 18 L40 26 Z" fill="#92400e" />
      <path d="M66 30 L70 18 L60 26 Z" fill="#92400e" />
      {/* mane */}
      <path d="M32 36 Q26 44 30 54 Q34 46 36 38 Z" fill="#451a03" />
      <path d="M42 28 Q50 24 58 28 L54 36 L46 36 Z" fill="#451a03" />
      {/* head */}
      <path d="M50 30 Q74 32 74 56 Q74 70 60 72 Q44 72 38 62 Q32 50 36 40 Z" fill="#b45309" />
      {/* snout */}
      <ellipse cx="56" cy="62" rx="12" ry="8" fill="#d97706" />
      <ellipse cx="52" cy="62" rx="1.4" ry="2" fill="#451a03" />
      <ellipse cx="60" cy="62" rx="1.4" ry="2" fill="#451a03" />
      {/* eye */}
      <circle cx="56" cy="50" r="2.4" fill="#1f2937" />
      <circle cx="56.7" cy="49.3" r="0.8" fill="#fff" />
      {/* blaze */}
      <path d="M50 38 Q50 50 50 60" stroke="#fde68a" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* smile */}
      <path d="M52 67 Q56 69 60 67" stroke="#451a03" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* 8 — Bee */
function Bee() {
  const uid = useId().replace(/[:#]/g, "");
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <Backdrop idPrefix={uid} light="#fef9c3" deep="#facc15" />
      {/* wings */}
      <ellipse cx="36" cy="40" rx="11" ry="8" fill="#bae6fd" opacity="0.8" transform="rotate(-25 36 40)" />
      <ellipse cx="64" cy="40" rx="11" ry="8" fill="#bae6fd" opacity="0.8" transform="rotate(25 64 40)" />
      {/* body */}
      <ellipse cx="50" cy="56" rx="20" ry="22" fill="#facc15" />
      {/* stripes */}
      <path d="M30 52 Q50 56 70 52 L70 58 Q50 62 30 58 Z" fill="#1f2937" />
      <path d="M32 66 Q50 70 68 66 L68 72 Q50 76 32 72 Z" fill="#1f2937" />
      {/* face */}
      <circle cx="44" cy="44" r="2.2" fill="#1f2937" />
      <circle cx="56" cy="44" r="2.2" fill="#1f2937" />
      <circle cx="44.6" cy="43.3" r="0.7" fill="#fff" />
      <circle cx="56.6" cy="43.3" r="0.7" fill="#fff" />
      {/* antennae */}
      <path d="M46 34 Q44 28 42 26" stroke="#1f2937" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M54 34 Q56 28 58 26" stroke="#1f2937" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <circle cx="42" cy="26" r="1.6" fill="#1f2937" />
      <circle cx="58" cy="26" r="1.6" fill="#1f2937" />
      {/* smile */}
      <path d="M45 50 Q50 54 55 50" stroke="#1f2937" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* cheeks */}
      <circle cx="40" cy="48" r="1.8" fill="#fb7185" opacity="0.5" />
      <circle cx="60" cy="48" r="1.8" fill="#fb7185" opacity="0.5" />
    </svg>
  );
}

/* 9 — Fox */
function Fox() {
  const uid = useId().replace(/[:#]/g, "");
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <Backdrop idPrefix={uid} light="#fff7ed" deep="#fdba74" />
      {/* ears */}
      <path d="M30 34 L24 16 L42 28 Z" fill="#ea580c" />
      <path d="M70 34 L76 16 L58 28 Z" fill="#ea580c" />
      <path d="M33 30 L30 22 L38 28 Z" fill="#1f2937" />
      <path d="M67 30 L70 22 L62 28 Z" fill="#1f2937" />
      {/* head */}
      <path d="M50 28 Q76 30 72 56 Q66 72 50 74 Q34 72 28 56 Q24 30 50 28 Z" fill="#f97316" />
      {/* white face mask */}
      <path d="M50 44 Q60 60 50 70 Q40 60 50 44 Z" fill="#fff7ed" />
      {/* eyes */}
      <circle cx="42" cy="48" r="2.2" fill="#1f2937" />
      <circle cx="58" cy="48" r="2.2" fill="#1f2937" />
      <circle cx="42.7" cy="47.3" r="0.7" fill="#fff" />
      <circle cx="58.7" cy="47.3" r="0.7" fill="#fff" />
      {/* nose */}
      <ellipse cx="50" cy="60" rx="2.6" ry="2" fill="#1f2937" />
      {/* smile */}
      <path d="M50 62 L50 66 M50 66 Q46 69 44 67 M50 66 Q54 69 56 67" stroke="#1f2937" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* 10 — Scarecrow */
function Scarecrow() {
  const uid = useId().replace(/[:#]/g, "");
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <Backdrop idPrefix={uid} light="#fef9c3" deep="#fde68a" />
      {/* hat brim */}
      <ellipse cx="50" cy="38" rx="30" ry="5" fill="#92400e" />
      {/* hat crown */}
      <path d="M36 38 Q36 22 50 22 Q64 22 64 38 Z" fill="#b45309" />
      <rect x="34" y="35" width="32" height="4" fill="#dc2626" />
      {/* face (burlap sack) */}
      <ellipse cx="50" cy="54" rx="18" ry="18" fill="#fde68a" />
      {/* stitched eyes (X) */}
      <path d="M42 49 L46 53 M46 49 L42 53" stroke="#78350f" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M54 49 L58 53 M58 49 L54 53" stroke="#78350f" strokeWidth="1.4" strokeLinecap="round" />
      {/* stitched smile */}
      <path d="M42 60 Q50 66 58 60" stroke="#78350f" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeDasharray="2 2" />
      {/* cheeks */}
      <circle cx="40" cy="58" r="2" fill="#fb7185" opacity="0.5" />
      <circle cx="60" cy="58" r="2" fill="#fb7185" opacity="0.5" />
      {/* straw hair */}
      <path d="M38 42 L34 50 M40 44 L34 54 M62 42 L66 50 M60 44 L66 54" stroke="#facc15" strokeWidth="1.6" strokeLinecap="round" />
      {/* collar straw */}
      <path d="M34 70 L30 76 M66 70 L70 76 M50 72 L50 78" stroke="#facc15" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* 11 — Mushroom */
function Mushroom() {
  const uid = useId().replace(/[:#]/g, "");
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <Backdrop idPrefix={uid} light="#fef2f2" deep="#fecaca" />
      {/* stem */}
      <path d="M40 56 Q40 80 50 80 Q60 80 60 56 Z" fill="#fef9c3" />
      {/* cap */}
      <path d="M24 50 Q24 26 50 26 Q76 26 76 50 Z" fill="#ef4444" />
      {/* cap underside */}
      <ellipse cx="50" cy="50" rx="26" ry="6" fill="#fde68a" />
      {/* spots */}
      <circle cx="38" cy="38" r="5" fill="#fff" />
      <circle cx="58" cy="34" r="4" fill="#fff" />
      <circle cx="66" cy="44" r="3.5" fill="#fff" />
      <circle cx="48" cy="44" r="3" fill="#fff" />
      {/* eyes */}
      <circle cx="45" cy="62" r="2.2" fill="#1f2937" />
      <circle cx="55" cy="62" r="2.2" fill="#1f2937" />
      <circle cx="45.7" cy="61.3" r="0.7" fill="#fff" />
      <circle cx="55.7" cy="61.3" r="0.7" fill="#fff" />
      {/* smile */}
      <path d="M45 68 Q50 72 55 68" stroke="#1f2937" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* blush */}
      <circle cx="40" cy="66" r="1.8" fill="#fb7185" opacity="0.5" />
      <circle cx="60" cy="66" r="1.8" fill="#fb7185" opacity="0.5" />
    </svg>
  );
}

/* 12 — Pumpkin */
function Pumpkin() {
  const uid = useId().replace(/[:#]/g, "");
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <Backdrop idPrefix={uid} light="#fff7ed" deep="#fdba74" />
      {/* stem */}
      <rect x="47" y="26" width="6" height="10" rx="2" fill="#15803d" />
      {/* leaf */}
      <path d="M53 28 Q64 22 64 30 Q58 34 53 30 Z" fill="#16a34a" />
      {/* body lobes */}
      <ellipse cx="50" cy="58" rx="28" ry="24" fill="#ea580c" />
      <ellipse cx="34" cy="58" rx="12" ry="22" fill="#f97316" />
      <ellipse cx="66" cy="58" rx="12" ry="22" fill="#f97316" />
      <ellipse cx="50" cy="58" rx="10" ry="22" fill="#fb923c" opacity="0.6" />
      {/* ridges */}
      <path d="M42 36 Q40 58 42 80" stroke="#c2410c" strokeWidth="1.2" fill="none" opacity="0.6" />
      <path d="M58 36 Q60 58 58 80" stroke="#c2410c" strokeWidth="1.2" fill="none" opacity="0.6" />
      {/* face */}
      <circle cx="44" cy="56" r="2.2" fill="#1f2937" />
      <circle cx="56" cy="56" r="2.2" fill="#1f2937" />
      <circle cx="44.7" cy="55.3" r="0.7" fill="#fff" />
      <circle cx="56.7" cy="55.3" r="0.7" fill="#fff" />
      <path d="M44 64 Q50 70 56 64" stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* cheeks */}
      <circle cx="38" cy="62" r="2" fill="#fb7185" opacity="0.5" />
      <circle cx="62" cy="62" r="2" fill="#fb7185" opacity="0.5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Registry                                                           */
/* ------------------------------------------------------------------ */

/* 13 — Rooster */
function Rooster() {
  const uid = useId().replace(/[:#]/g, "");
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <Backdrop idPrefix={uid} light="#fef2f2" deep="#fecaca" />
      {/* tail feathers */}
      <path d="M72 56 Q88 44 86 64 Q80 60 76 64 Q86 70 78 74 Z" fill="#1d4ed8" />
      <path d="M74 58 Q84 50 82 62" fill="#2563eb" />
      {/* body */}
      <ellipse cx="50" cy="58" rx="24" ry="20" fill="#1f2937" />
      {/* wing */}
      <path d="M40 56 Q36 68 46 72 Q50 64 46 56 Z" fill="#374151" />
      {/* head */}
      <circle cx="60" cy="44" r="13" fill="#1f2937" />
      {/* comb (bigger, more dramatic) */}
      <path d="M56 30 Q58 22 60 30 Q62 22 64 30 Q66 22 68 30" fill="#dc2626" />
      {/* wattle */}
      <path d="M64 50 Q69 56 64 59 Z" fill="#dc2626" />
      {/* beak (yellow, sharp) */}
      <path d="M72 44 L82 47 L72 50 Z" fill="#facc15" />
      {/* eye */}
      <circle cx="62" cy="43" r="2.6" fill="#fef3c7" />
      <circle cx="62" cy="43" r="1.6" fill="#1f2937" />
      {/* feet */}
      <path d="M44 80 L40 86 M46 80 L46 86 M48 80 L52 86" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
      <path d="M54 80 L50 86 M56 80 L56 86 M58 80 L62 86" stroke="#facc15" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* 14 — Goat */
function Goat() {
  const uid = useId().replace(/[:#]/g, "");
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <Backdrop idPrefix={uid} light="#fefce8" deep="#fef08a" />
      {/* ears (long, floppy-ish) */}
      <ellipse cx="28" cy="42" rx="5" ry="9" fill="#d6d3d1" transform="rotate(-20 28 42)" />
      <ellipse cx="72" cy="42" rx="5" ry="9" fill="#d6d3d1" transform="rotate(20 72 42)" />
      {/* horns (ridged, curving back) */}
      <path d="M34 32 Q26 22 30 18 Q36 22 38 30 Z" fill="#78350f" />
      <path d="M66 32 Q74 22 70 18 Q64 22 62 30 Z" fill="#78350f" />
      {/* head */}
      <ellipse cx="50" cy="52" rx="22" ry="22" fill="#e7e5e4" />
      {/* forehead stripe */}
      <path d="M50 32 Q50 50 50 64" stroke="#a8a29e" strokeWidth="3" fill="none" opacity="0.6" />
      {/* snout */}
      <ellipse cx="50" cy="64" rx="10" ry="8" fill="#d6d3d1" />
      <ellipse cx="46" cy="64" rx="1.3" ry="1.8" fill="#44403c" />
      <ellipse cx="54" cy="64" rx="1.3" ry="1.8" fill="#44403c" />
      {/* eyes (horizontal pupil feel) */}
      <ellipse cx="43" cy="50" rx="2.4" ry="2.6" fill="#1f2937" />
      <ellipse cx="57" cy="50" rx="2.4" ry="2.6" fill="#1f2937" />
      <ellipse cx="43.5" cy="49.5" rx="0.8" ry="1" fill="#fff" />
      <ellipse cx="57.5" cy="49.5" rx="0.8" ry="1" fill="#fff" />
      {/* beard */}
      <path d="M50 74 Q48 82 52 84 Q54 80 52 74 Z" fill="#78350f" />
      {/* smile */}
      <path d="M46 70 Q50 73 54 70" stroke="#1f2937" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* 15 — Owl */
function Owl() {
  const uid = useId().replace(/[:#]/g, "");
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <Backdrop idPrefix={uid} light="#f5f3ff" deep="#ddd6fe" />
      {/* ear tufts */}
      <path d="M34 30 L30 18 L40 26 Z" fill="#7c3aed" />
      <path d="M66 30 L70 18 L60 26 Z" fill="#7c3aed" />
      {/* body */}
      <ellipse cx="50" cy="56" rx="26" ry="26" fill="#7c3aed" />
      {/* belly */}
      <ellipse cx="50" cy="62" rx="16" ry="18" fill="#c4b5fd" />
      {/* feather V's */}
      <path d="M44 58 L50 62 L56 58 M42 66 L50 70 L58 66 M44 74 L50 78 L56 74" stroke="#7c3aed" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7" />
      {/* eye discs (big, signature owl look) */}
      <circle cx="41" cy="46" r="8" fill="#fff" />
      <circle cx="59" cy="46" r="8" fill="#fff" />
      <circle cx="41" cy="46" r="4" fill="#1f2937" />
      <circle cx="59" cy="46" r="4" fill="#1f2937" />
      <circle cx="42" cy="45" r="1.4" fill="#fff" />
      <circle cx="60" cy="45" r="1.4" fill="#fff" />
      {/* beak */}
      <path d="M50 50 L46 56 L54 56 Z" fill="#f59e0b" />
      {/* feet */}
      <path d="M44 82 L40 88 M46 82 L46 88 M48 82 L52 88" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
      <path d="M54 82 L50 88 M56 82 L56 88 M58 82 L62 88" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* 16 — Strawberry */
function Strawberry() {
  const uid = useId().replace(/[:#]/g, "");
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <Backdrop idPrefix={uid} light="#fff1f2" deep="#fecdd3" />
      {/* leaves crown */}
      <path d="M38 30 Q34 18 44 24 Q44 16 50 24 Q56 16 56 24 Q66 18 62 30 Z" fill="#16a34a" />
      <path d="M44 26 L44 30 M50 22 L50 30 M56 26 L56 30" stroke="#15803d" strokeWidth="1" fill="none" />
      {/* berry body */}
      <path d="M50 30 Q76 32 68 64 Q60 84 50 84 Q40 84 32 64 Q24 32 50 30 Z" fill="#ef4444" />
      {/* highlight */}
      <ellipse cx="42" cy="44" rx="6" ry="8" fill="#fca5a5" opacity="0.6" />
      {/* seeds */}
      <ellipse cx="44" cy="46" rx="1.4" ry="2.2" fill="#fde047" transform="rotate(-15 44 46)" />
      <ellipse cx="56" cy="46" rx="1.4" ry="2.2" fill="#fde047" transform="rotate(15 56 46)" />
      <ellipse cx="40" cy="56" rx="1.4" ry="2.2" fill="#fde047" transform="rotate(-15 40 56)" />
      <ellipse cx="60" cy="56" rx="1.4" ry="2.2" fill="#fde047" transform="rotate(15 60 56)" />
      <ellipse cx="50" cy="58" rx="1.4" ry="2.2" fill="#fde047" />
      <ellipse cx="45" cy="68" rx="1.4" ry="2.2" fill="#fde047" transform="rotate(-15 45 68)" />
      <ellipse cx="55" cy="68" rx="1.4" ry="2.2" fill="#fde047" transform="rotate(15 55 68)" />
      {/* face */}
      <circle cx="45" cy="54" r="2.2" fill="#1f2937" />
      <circle cx="55" cy="54" r="2.2" fill="#1f2937" />
      <circle cx="45.6" cy="53.3" r="0.7" fill="#fff" />
      <circle cx="55.6" cy="53.3" r="0.7" fill="#fff" />
      <path d="M45 62 Q50 67 55 62" stroke="#1f2937" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* cheeks */}
      <circle cx="39" cy="60" r="1.8" fill="#fb7185" opacity="0.6" />
      <circle cx="61" cy="60" r="1.8" fill="#fb7185" opacity="0.6" />
    </svg>
  );
}

/* 17 — Tomato */
function Tomato() {
  const uid = useId().replace(/[:#]/g, "");
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <Backdrop idPrefix={uid} light="#fef2f2" deep="#fecaca" />
      {/* body */}
      <path d="M50 36 Q78 38 76 64 Q72 84 50 84 Q28 84 24 64 Q22 38 50 36 Z" fill="#dc2626" />
      {/* highlight */}
      <ellipse cx="38" cy="52" rx="6" ry="9" fill="#fca5a5" opacity="0.6" />
      {/* calyx (green leafy top) */}
      <path d="M34 36 Q30 26 40 30 Q42 24 48 30 Q50 22 52 30 Q58 24 60 30 Q70 26 66 36 Z" fill="#16a34a" />
      {/* stem */}
      <path d="M50 24 Q50 18 50 16" stroke="#15803d" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* calyx veins */}
      <path d="M40 32 L38 36 M50 30 L50 36 M60 32 L62 36" stroke="#15803d" strokeWidth="0.8" fill="none" />
      {/* face */}
      <circle cx="44" cy="58" r="2.2" fill="#1f2937" />
      <circle cx="56" cy="58" r="2.2" fill="#1f2937" />
      <circle cx="44.6" cy="57.3" r="0.7" fill="#fff" />
      <circle cx="56.6" cy="57.3" r="0.7" fill="#fff" />
      <path d="M44 66 Q50 71 56 66" stroke="#1f2937" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      {/* cheeks */}
      <circle cx="38" cy="64" r="2" fill="#fb7185" opacity="0.6" />
      <circle cx="62" cy="64" r="2" fill="#fb7185" opacity="0.6" />
    </svg>
  );
}

/* 18 — Wheat */
function Wheat() {
  const uid = useId().replace(/[:#]/g, "");
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <Backdrop idPrefix={uid} light="#fefce8" deep="#fde68a" />
      {/* stem */}
      <path d="M50 84 L50 50" stroke="#a16207" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* lower leaves */}
      <path d="M50 70 Q40 64 38 72 Q44 74 50 70" fill="#ca8a04" />
      <path d="M50 70 Q60 64 62 72 Q56 74 50 70" fill="#ca8a04" />
      {/* ear — central grain cluster */}
      {/* left grains */}
      <ellipse cx="40" cy="48" rx="4.5" ry="7" fill="#facc15" transform="rotate(-30 40 48)" />
      <ellipse cx="40" cy="36" rx="4.5" ry="7" fill="#eab308" transform="rotate(-30 40 36)" />
      <ellipse cx="40" cy="24" rx="4.5" ry="7" fill="#facc15" transform="rotate(-30 40 24)" />
      {/* right grains */}
      <ellipse cx="60" cy="48" rx="4.5" ry="7" fill="#facc15" transform="rotate(30 60 48)" />
      <ellipse cx="60" cy="36" rx="4.5" ry="7" fill="#eab308" transform="rotate(30 60 36)" />
      <ellipse cx="60" cy="24" rx="4.5" ry="7" fill="#facc15" transform="rotate(30 60 24)" />
      {/* center top grain */}
      <ellipse cx="50" cy="20" rx="4.5" ry="7" fill="#eab308" />
      {/* awns (whiskers) */}
      <path d="M50 16 Q48 10 44 8 M50 16 Q52 10 56 8 M50 16 Q50 9 50 6" stroke="#ca8a04" strokeWidth="1" fill="none" strokeLinecap="round" />
      {/* face on the central grain */}
      <circle cx="50" cy="20" r="1.6" fill="#1f2937" />
      <circle cx="50.5" cy="19.5" r="0.5" fill="#fff" />
      <path d="M48 23 Q50 25 52 23" stroke="#1f2937" strokeWidth="1" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export const FARM_AVATARS = [
  { id: "farmer", label: "Farmer", Component: Farmer },
  { id: "gardener", label: "Gardener", Component: Gardener },
  { id: "cow", label: "Cow", Component: Cow },
  { id: "hen", label: "Hen", Component: Hen },
  { id: "pig", label: "Pig", Component: Pig },
  { id: "lamb", label: "Lamb", Component: Lamb },
  { id: "horse", label: "Horse", Component: Horse },
  { id: "bee", label: "Bee", Component: Bee },
  { id: "fox", label: "Fox", Component: Fox },
  { id: "scarecrow", label: "Scarecrow", Component: Scarecrow },
  { id: "mushroom", label: "Mushroom", Component: Mushroom },
  { id: "pumpkin", label: "Pumpkin", Component: Pumpkin },
  { id: "rooster", label: "Rooster", Component: Rooster },
  { id: "goat", label: "Goat", Component: Goat },
  { id: "owl", label: "Owl", Component: Owl },
  { id: "strawberry", label: "Strawberry", Component: Strawberry },
  { id: "tomato", label: "Tomato", Component: Tomato },
  { id: "wheat", label: "Wheat", Component: Wheat },
];

export const DEFAULT_AVATAR_ID = "farmer";

export function getAvatar(id) {
  return FARM_AVATARS.find((a) => a.id === id) || FARM_AVATARS[0];
}

/* ------------------------------------------------------------------ */
/*  Public components                                                  */
/* ------------------------------------------------------------------ */

/** Render a single avatar (circular crop). */
export function Avatar({ id, className, title }) {
  const a = getAvatar(id);
  return (
    <div
      className={cn(
        "overflow-hidden rounded-full ring-2 ring-background",
        className
      )}
      title={title || a.label}
    >
      <a.Component />
    </div>
  );
}

/**
 * AvatarPicker — grid of selectable illustrated avatars.
 *
 * Props:
 *   selected   - currently selected avatar id
 *   onSelect   - (id) => void
 */
export function AvatarPicker({ selected, onSelect }) {
  return (
    <div className="mx-auto grid max-w-xl grid-cols-4 gap-2.5 sm:grid-cols-6 sm:gap-3">
      {FARM_AVATARS.map((a) => {
        const isSelected = a.id === selected;
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => onSelect(a.id)}
            aria-label={`Select ${a.label} avatar`}
            aria-pressed={isSelected}
            className={cn(
              "group relative aspect-square overflow-hidden rounded-xl border-2 transition-all duration-200",
              isSelected
                ? "scale-[1.04] border-leaf shadow-md shadow-leaf/25 ring-2 ring-leaf/30"
                : "border-border/40 hover:scale-[1.03] hover:border-leaf/50 hover:shadow-sm hover:shadow-leaf/10"
            )}
          >
            <a.Component />
            {/* label on hover (always visible on selected) */}
            <div
              className={cn(
                "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-1 py-1 text-center transition-opacity",
                isSelected
                  ? "opacity-100"
                  : "opacity-0 group-hover:opacity-100"
              )}
            >
              <p className="text-[9px] font-semibold tracking-wide text-white uppercase">
                {a.label}
              </p>
            </div>
            {/* selected check */}
            {isSelected && (
              <div className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-leaf text-white shadow ring-1.5 ring-background">
                <IconCheck className="size-2.5" strokeWidth={3} />
              </div>
             )}
           </button>
         );
       })}
     </div>
   );
 }

