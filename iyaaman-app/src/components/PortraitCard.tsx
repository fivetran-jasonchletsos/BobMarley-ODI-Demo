"use client";

import Link from "next/link";
import type { Person } from "@/lib/people";
import { portraitFor } from "@/lib/portraits";

// Deterministic hash — server-safe, no randomness
function djb2(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

// Six Tuff Gong palette pairs (bg, fg) drawn from tailwind.config.js
const PALETTES: [string, string][] = [
  ["#0d1a10", "#e6b800"], // jam_black + jam_gold
  ["#0f7438", "#f4ecd6"], // jam_green + sand
  ["#c0382b", "#e6b800"], // jam_red + jam_gold
  ["#1f2e22", "#1f9446"], // bark_2 + leaf_2
  ["#3d5430", "#f5d33a"], // cocoa + gold_2
  ["#0d1a10", "#c0382b"], // jam_black + jam_red
  ["#1f2e22", "#e6b800"], // bark_2 + jam_gold
  ["#0f7438", "#e6b800"], // jam_green + jam_gold
];

const SHAPES = ["diagonal", "quadrant", "stripe", "offset", "thirds"] as const;

function initialsFromName(name: string): string {
  const parts = name
    .replace(/[".]/g, "")
    .split(/\s+/)
    .filter((p) => p.length > 0 && !/^(Jr|Sr|III|II|IV)$/i.test(p));
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function ProceduralAvatar({ name }: { name: string }) {
  const seed = djb2(name);
  const [bg, fg] = PALETTES[seed % PALETTES.length];
  const shape = SHAPES[(seed >> 4) % SHAPES.length];

  const blockA =
    shape === "diagonal" ? `M0,0 L100,0 L100,${40 + ((seed >> 12) % 30)} L0,${60 + ((seed >> 16) % 20)} Z`
    : shape === "quadrant" ? `M0,0 L55,0 L55,55 L0,55 Z`
    : shape === "stripe" ? `M0,0 L100,0 L100,42 L0,42 Z`
    : shape === "offset" ? `M22,0 L100,0 L100,68 L22,68 Z`
    : `M0,0 L100,0 L100,33 L0,33 Z`;

  const blockB =
    shape === "diagonal" ? `M0,82 L78,52 L100,52 L100,100 L0,100 Z`
    : shape === "quadrant" ? `M58,58 L100,58 L100,100 L58,100 Z`
    : shape === "stripe" ? `M0,62 L100,62 L100,100 L0,100 Z`
    : shape === "offset" ? `M0,74 L82,74 L82,100 L0,100 Z`
    : `M0,72 L100,72 L100,100 L0,100 Z`;

  const grainDots = Array.from({ length: 22 }, (_, i) => {
    const gx = ((seed * (i + 7) * 1999) >>> 0) % 100;
    const gy = ((seed * (i + 3) * 3001) >>> 0) % 100;
    return { gx, gy };
  });

  const initials = initialsFromName(name);

  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full block"
    >
      <rect width="100" height="100" fill={bg} />
      <path d={blockA} fill={fg} opacity="0.88" />
      <path d={blockB} fill={fg} opacity="0.55" />
      {grainDots.map(({ gx, gy }, i) => (
        <circle key={i} cx={gx} cy={gy} r="0.55" fill={fg} opacity="0.2" />
      ))}
      <text
        x="50"
        y="56"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Anton', 'Bebas Neue', sans-serif"
        fontSize="44"
        fontWeight="400"
        fill={bg}
        opacity="0.78"
        letterSpacing="0.04em"
      >
        {initials}
      </text>
    </svg>
  );
}

// Generation tint → border color (tailwind class on the outer card)
function tintClassFor(p: Person): { base: string; hover: string } {
  const t = p.tags ?? [];
  if (t.includes("founder") || t.includes("ancestor")) {
    return { base: "border-jam_red/50", hover: "hover:border-jam_red" };
  }
  if (t.includes("i-three") || t.includes("original-trio")) {
    return { base: "border-jam_green/50", hover: "hover:border-jam_green" };
  }
  // wailer (but not original-trio) handled above; remaining wailer falls here
  if (t.includes("wailer")) {
    return { base: "border-jam_green/40", hover: "hover:border-jam_green" };
  }
  if (t.includes("second-generation")) {
    return { base: "border-jam_gold/55", hover: "hover:border-jam_gold" };
  }
  if (t.includes("third-generation")) {
    return { base: "border-jam_black/55", hover: "hover:border-bark" };
  }
  if (t.includes("producer") || t.includes("extended-family") || t.includes("partner")) {
    return { base: "border-bark/30", hover: "hover:border-ember" };
  }
  return { base: "border-bark/20", hover: "hover:border-ember" };
}

export type PortraitCardSize = "default" | "feature";

export default function PortraitCard({
  person,
  size = "default",
  priority = false,
}: {
  person: Person;
  size?: PortraitCardSize;
  priority?: boolean;
}) {
  const portrait = portraitFor(person.slug);
  const tint = tintClassFor(person);
  const yearRange =
    person.born || person.died
      ? `${person.born ? person.born.slice(0, 4) : "?"}${
          person.died ? `–${person.died.slice(0, 4)}` : ""
        }`
      : null;

  const isFeature = size === "feature";

  return (
    <Link
      href={`/family/${person.slug}/`}
      className={
        "group block bg-sand_2/40 transition-all duration-300 rounded overflow-hidden " +
        "border-2 " +
        tint.base +
        " " +
        tint.hover +
        " hover:-translate-y-0.5 hover:shadow-xl hover:bg-sand_2/70"
      }
    >
      <div
        className={
          "relative w-full overflow-hidden bg-bark " +
          (isFeature ? "aspect-[4/5]" : "aspect-[3/4]")
        }
      >
        {portrait ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={portrait}
            alt={person.name}
            loading={priority ? "eager" : "lazy"}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            onError={(e) => {
              // Hide broken image so the procedural fallback shows through
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : null}
        {/* Procedural avatar — always rendered behind. If portrait img loads
            it covers this; if it errors, onError hides it and this shows. */}
        <div className="absolute inset-0 z-0">
          <ProceduralAvatar name={person.name} />
        </div>

        {/* Year chip top-right */}
        {yearRange && (
          <span
            className="absolute right-2 top-2 z-10 bg-bark/85 backdrop-blur-sm
              border border-sand/15 px-2 py-0.5 rounded
              mono text-[9px] tracking-widest uppercase text-sand"
          >
            {yearRange}
          </span>
        )}

        {/* Gradient + name overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-bark/95 via-bark/60 to-transparent pt-10 pb-3 px-3">
          <h3
            className={
              "display text-sand tracking-tight leading-tight " +
              (isFeature ? "text-3xl sm:text-4xl" : "text-lg sm:text-xl")
            }
          >
            {person.name.split(" ").slice(0, 3).join(" ")}
          </h3>
        </div>
      </div>

      {/* Lower text panel */}
      <div className={isFeature ? "p-4" : "p-3"}>
        <p
          className={
            "serif italic text-cocoa leading-snug " +
            (isFeature ? "text-base" : "text-xs sm:text-sm")
          }
        >
          {person.role}
        </p>
      </div>
    </Link>
  );
}
