"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import TopNav from "@/components/TopNav";
import { people, personBySlug, type Person } from "@/lib/people";
import { albums as allAlbums } from "@/lib/albums";
import { portraitFor } from "@/lib/portraits";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/* ----------------------------------------------------------------
   Cinematic family tree
   ----------------------------------------------------------------
   Layout uses a fixed-size SVG "stage" (1400 x 1100 viewBox) with
   an absolutely-positioned HTML overlay so portraits stay crisp.
   Each node has hand-tuned (x,y) coordinates for editorial control.
   Lines drawn as cubic Bezier paths in the SVG behind the overlay.
   On mobile (<lg) we fall back to a stacked vertical layout.
   ---------------------------------------------------------------- */

type Node = {
  slug: string;
  x: number;          // center x in viewBox
  y: number;          // center y in viewBox
  size: number;       // diameter in px
  tier: "ancestor" | "partner" | "bob" | "wailer" | "child" | "grand";
};

// Bob anchor
const BOB_X = 700;
const BOB_Y = 360;

// Children fanned in an arc across the middle row. 12 acknowledged children.
const CHILD_SLUGS = [
  "sharon-marley",
  "cedella-marley",
  "ziggy-marley",
  "stephen-marley",
  "robbie-marley",
  "rohan-marley",
  "karen-marley",
  "stephanie-marley",
  "julian-marley",
  "kymani-marley",
  "damian-marley",
  "makeda-marley",
];

const GRAND_PARENTS: Record<string, string> = {
  "skip-marley": "cedella-marley",
  "jomersa-marley": "stephen-marley",
  "yohan-marley": "rohan-marley",
};

function buildNodes(): Node[] {
  const nodes: Node[] = [];

  // Ancestors — small pills above Bob
  nodes.push({ slug: "norval-marley",  x: BOB_X - 80, y: 90, size: 56, tier: "ancestor" });
  nodes.push({ slug: "cedella-booker", x: BOB_X + 80, y: 90, size: 56, tier: "ancestor" });

  // Partners — sides of Bob
  nodes.push({ slug: "rita-marley",        x: BOB_X - 320, y: BOB_Y + 10, size: 96, tier: "partner" });
  nodes.push({ slug: "cindy-breakspeare",  x: BOB_X + 320, y: BOB_Y + 10, size: 96, tier: "partner" });

  // Wailers — outer sides, slightly above the children band
  nodes.push({ slug: "peter-tosh",   x: BOB_X - 540, y: BOB_Y - 90, size: 78, tier: "wailer" });
  nodes.push({ slug: "bunny-wailer", x: BOB_X + 540, y: BOB_Y - 90, size: 78, tier: "wailer" });

  // Bob
  nodes.push({ slug: "bob-marley", x: BOB_X, y: BOB_Y, size: 170, tier: "bob" });

  // Children — fan arc across row y ~= 720
  const n = CHILD_SLUGS.length;
  const arcCenterY = 760;
  const arcWidth = 1200;          // total horizontal spread
  const leftX = BOB_X - arcWidth / 2;
  const stepX = arcWidth / (n - 1);
  CHILD_SLUGS.forEach((slug, i) => {
    const t = (i - (n - 1) / 2) / ((n - 1) / 2);   // -1..+1
    // gentle arc — children at the ends sit slightly higher (closer to Bob)
    const yLift = Math.abs(t) * 38;
    const x = leftX + i * stepX;
    const y = arcCenterY - yLift;
    nodes.push({ slug, x, y, size: 96, tier: "child" });
  });

  // Grandchildren — under their respective parent
  Object.entries(GRAND_PARENTS).forEach(([slug, parentSlug]) => {
    const parent = nodes.find((nd) => nd.slug === parentSlug);
    if (!parent) return;
    nodes.push({ slug, x: parent.x, y: parent.y + 170, size: 68, tier: "grand" });
  });

  return nodes;
}

function tierStyle(tier: Node["tier"], selected: boolean) {
  // ring color + glow per tier
  const base = {
    ancestor: { ring: "rgba(216,196,133,0.55)", glow: "rgba(216,196,133,0.30)" },
    partner:  { ring: "rgba(192,56,43,0.65)",   glow: "rgba(192,56,43,0.32)"   },
    bob:      { ring: "rgba(230,184,0,0.85)",   glow: "rgba(230,184,0,0.55)"   },
    wailer:   { ring: "rgba(15,116,56,0.62)",   glow: "rgba(15,116,56,0.30)"   },
    child:    { ring: "rgba(230,184,0,0.55)",   glow: "rgba(230,184,0,0.28)"   },
    grand:    { ring: "rgba(245,211,58,0.55)",  glow: "rgba(245,211,58,0.28)"  },
  }[tier];
  return {
    boxShadow: selected
      ? `0 0 0 3px ${base.ring}, 0 0 36px 6px ${base.glow}, 0 8px 28px rgba(0,0,0,0.45)`
      : `0 0 0 2px ${base.ring}, 0 6px 18px rgba(0,0,0,0.35)`,
  };
}

function yearRange(p: Person): string {
  const b = p.born ? p.born.slice(0, 4) : "?";
  const d = p.died ? `–${p.died.slice(0, 4)}` : "";
  return `${b}${d}`;
}

// Procedural initials for missing portraits
function initialsFromName(name: string) {
  const parts = name
    .replace(/[".]/g, "")
    .split(/\s+/)
    .filter((p) => p.length > 0 && !/^(Jr|Sr|III|II|IV)$/i.test(p));
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function NodePortrait({
  person,
  size,
}: {
  person: Person;
  size: number;
}) {
  const portrait = portraitFor(person.slug);
  return (
    <div
      className="relative overflow-hidden rounded-full bg-bark"
      style={{ width: size, height: size }}
    >
      {/* fallback initial chip — rendered first so <img> stacks on top */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bark_2 to-bark">
        <span
          className="display text-gold/85"
          style={{ fontSize: size * 0.42, letterSpacing: "0.02em" }}
        >
          {initialsFromName(person.name)}
        </span>
      </div>
      {portrait ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={portrait}
          alt={person.name}
          loading="eager"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ) : null}
      {/* subtle inner vignette over photo for warm tone */}
      {portrait ? (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 38%, transparent 55%, rgba(13,26,16,0.45) 100%)",
          }}
        />
      ) : null}
    </div>
  );
}

// Small album orbit beside a musician node
function AlbumOrbit({ person, side }: { person: Person; side: "left" | "right" }) {
  const slugs = (person.albums ?? []).slice(0, 4);
  if (slugs.length === 0) return null;
  return (
    <div
      className={
        "absolute top-1/2 -translate-y-1/2 flex flex-col gap-1.5 " +
        (side === "left" ? "right-full mr-2" : "left-full ml-2")
      }
    >
      {slugs.map((slug, i) => {
        const album = allAlbums.find((a) => a.slug === slug);
        if (!album) return null;
        return (
          <Link
            key={slug}
            href={`/discography/${slug}/`}
            onClick={(e) => e.stopPropagation()}
            className="block w-7 h-7 overflow-hidden border border-gold/40 shadow-md transition-transform hover:scale-125 hover:z-30 relative bg-bark"
            style={{ animationDelay: `${1100 + i * 80}ms` }}
            title={`${album.title} (${album.year})`}
            aria-label={`${album.title} (${album.year})`}
          >
            <CoverThumb slug={album.slug} title={album.title} />
          </Link>
        );
      })}
    </div>
  );
}

function CoverThumb({ slug, title }: { slug: string; title: string }) {
  // Placeholder rendered first so the <img> stacks on top of it. If the image
  // 404s, onError hides it and the placeholder beneath shows through.
  return (
    <>
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-jam_red to-bark_2">
        <span className="mono text-[8px] text-gold/90 font-bold">
          {title.charAt(0).toUpperCase()}
        </span>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE_PATH}/covers/${slug}.jpg`}
        alt={title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    </>
  );
}

/* ---------- Connection lines (SVG layer) ---------- */
function ConnectionLines({
  nodes,
  selectedSlug,
}: {
  nodes: Node[];
  selectedSlug: string | null;
}) {
  const byslug = (s: string) => nodes.find((n) => n.slug === s);
  const bob = byslug("bob-marley");
  if (!bob) return null;

  const lines: { from: Node; to: Node; kind: "child" | "partner" | "ancestor" | "wailer" | "grand" }[] = [];

  // Ancestors → Bob
  ["norval-marley", "cedella-booker"].forEach((s) => {
    const n = byslug(s);
    if (n) lines.push({ from: n, to: bob, kind: "ancestor" });
  });

  // Partners → Bob
  ["rita-marley", "cindy-breakspeare"].forEach((s) => {
    const n = byslug(s);
    if (n) lines.push({ from: n, to: bob, kind: "partner" });
  });

  // Wailers → Bob
  ["peter-tosh", "bunny-wailer"].forEach((s) => {
    const n = byslug(s);
    if (n) lines.push({ from: n, to: bob, kind: "wailer" });
  });

  // Bob → children
  CHILD_SLUGS.forEach((s) => {
    const n = byslug(s);
    if (n) lines.push({ from: bob, to: n, kind: "child" });
  });

  // Parent → grandchild
  Object.entries(GRAND_PARENTS).forEach(([slug, parentSlug]) => {
    const gn = byslug(slug);
    const pn = byslug(parentSlug);
    if (gn && pn) lines.push({ from: pn, to: gn, kind: "grand" });
  });

  return (
    <svg
      viewBox="0 0 1400 1100"
      preserveAspectRatio="xMidYMid meet"
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gradGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e6b800" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#c0382b" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="gradEmber" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c0382b" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#e6b800" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="gradLeaf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f7438" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#1f9446" stopOpacity="0.30" />
        </linearGradient>
        <linearGradient id="gradAncestor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d8c485" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#e6b800" stopOpacity="0.35" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {lines.map((ln, i) => {
        const grad =
          ln.kind === "child" ? "url(#gradGold)" :
          ln.kind === "partner" ? "url(#gradEmber)" :
          ln.kind === "wailer" ? "url(#gradLeaf)" :
          ln.kind === "ancestor" ? "url(#gradAncestor)" :
          "url(#gradGold)";

        const sx = ln.from.x;
        const sy = ln.from.y;
        const tx = ln.to.x;
        const ty = ln.to.y;

        // cubic Bezier — gentle curve, control points pulled vertically
        const dy = ty - sy;
        const c1x = sx;
        const c1y = sy + dy * 0.55;
        const c2x = tx;
        const c2y = ty - dy * 0.55;

        const d = `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${tx} ${ty}`;

        const isSelected =
          selectedSlug != null &&
          (ln.from.slug === selectedSlug || ln.to.slug === selectedSlug);

        const baseOpacity =
          selectedSlug == null ? 0.85 :
          isSelected ? 1 : 0.18;

        const strokeWidth =
          ln.kind === "child" ? 1.6 :
          ln.kind === "grand" ? 1.2 :
          ln.kind === "wailer" ? 1.2 :
          1.4;

        const animationDelay = `${800 + i * 35}ms`;

        return (
          <g key={i} style={{ animationDelay }} className="tree-line-fade">
            {/* soft glow base */}
            <path
              d={d}
              fill="none"
              stroke={grad}
              strokeWidth={strokeWidth + 3}
              opacity={isSelected ? 0.45 : 0.12}
              strokeLinecap="round"
              filter="url(#glow)"
            />
            {/* main line */}
            <path
              d={d}
              fill="none"
              stroke={grad}
              strokeWidth={strokeWidth}
              opacity={baseOpacity}
              strokeLinecap="round"
              strokeDasharray={ln.kind === "child" ? "6 6" : ln.kind === "partner" ? "2 5" : "0"}
              className={
                ln.kind === "child" ? "tree-line-pulse" :
                ln.kind === "grand" ? "tree-line-pulse-slow" : ""
              }
            />
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- Side panel ---------- */
function SidePanel({
  slug,
  onClose,
}: {
  slug: string | null;
  onClose: () => void;
}) {
  const person = slug ? personBySlug(slug) : null;
  if (!person) return null;
  const personAlbums = (person.albums ?? [])
    .map((s) => allAlbums.find((a) => a.slug === s))
    .filter((a): a is NonNullable<typeof a> => !!a);

  return (
    <aside
      className="fixed top-0 right-0 z-50 h-full w-full sm:w-[480px] bg-sand shadow-2xl border-l border-bark/20
                 overflow-y-auto animate-panel-in"
    >
      <div className="tricolor-bar-thin"/>
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="ornament mb-1">{person.tags?.[0]?.replace(/-/g, " ") ?? "marley"}</p>
            <h2 className="display text-3xl sm:text-4xl text-bark leading-none">
              {person.name}
            </h2>
            <p className="mono text-[10px] tracking-widest text-cocoa uppercase mt-2">
              {yearRange(person)}
              {person.birthplace ? ` · ${person.birthplace}` : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="mono text-[10px] tracking-widest text-cocoa uppercase border border-bark/20 px-2 py-1 hover:bg-bark hover:text-sand transition-colors"
          >
            Close
          </button>
        </div>

        <div className="my-4 w-32 h-32 rounded-full overflow-hidden border-2 border-gold/60 bg-bark">
          <NodePortrait person={person} size={128} />
        </div>

        <p className="serif italic text-cocoa mb-3">{person.role}</p>
        <p className="text-bark_2 text-sm leading-relaxed">{person.bio}</p>

        {personAlbums.length > 0 && (
          <>
            <hr className="hr-rule" />
            <p className="ornament mb-2">Records</p>
            <div className="grid grid-cols-3 gap-2">
              {personAlbums.map((a) => (
                <Link
                  key={a.slug}
                  href={`/discography/${a.slug}/`}
                  className="block group"
                >
                  <div className="relative aspect-square overflow-hidden border border-bark/20 bg-bark">
                    <CoverThumb slug={a.slug} title={a.title} />
                  </div>
                  <p className="serif text-[11px] text-bark mt-1 leading-tight group-hover:text-ember transition-colors line-clamp-2">
                    {a.title}
                  </p>
                  <p className="mono text-[9px] tracking-widest text-cocoa">{a.year}</p>
                </Link>
              ))}
            </div>
          </>
        )}

        <hr className="hr-rule" />
        <Link
          href={`/family/${person.slug}/`}
          className="inline-block mono text-[10px] tracking-widest uppercase border border-bark/40 px-3 py-2 hover:bg-bark hover:text-sand transition-colors"
        >
          Full Profile
          <span className="ml-1">{"→"}</span>
        </Link>
      </div>
    </aside>
  );
}

/* ---------- Mobile stacked layout ---------- */
function MobileTree({ onSelect }: { onSelect: (slug: string) => void }) {
  const bob = personBySlug("bob-marley")!;
  const rita = personBySlug("rita-marley")!;
  const cindy = personBySlug("cindy-breakspeare")!;
  const norval = personBySlug("norval-marley")!;
  const cedellaB = personBySlug("cedella-booker")!;
  const peter = personBySlug("peter-tosh")!;
  const bunny = personBySlug("bunny-wailer")!;

  return (
    <div className="lg:hidden px-4 py-6 space-y-8">
      <div>
        <p className="ornament mb-2">Ancestors</p>
        <div className="flex gap-3">
          <MobileChip person={norval} onSelect={onSelect} />
          <MobileChip person={cedellaB} onSelect={onSelect} />
        </div>
      </div>

      <div className="text-center">
        <p className="ornament mb-2">The Father</p>
        <button
          onClick={() => onSelect(bob.slug)}
          className="inline-block"
        >
          <div className="mx-auto w-40 h-40 rounded-full overflow-hidden border-4 border-gold shadow-2xl"
               style={{ boxShadow: "0 0 0 3px rgba(230,184,0,0.5), 0 0 48px rgba(230,184,0,0.4)" }}>
            <NodePortrait person={bob} size={160} />
          </div>
          <h3 className="display text-3xl text-bark mt-3">Bob Marley</h3>
          <p className="mono text-[10px] tracking-widest text-cocoa">{yearRange(bob)}</p>
        </button>
      </div>

      <div>
        <p className="ornament mb-2">Partners</p>
        <div className="flex gap-3">
          <MobileChip person={rita} onSelect={onSelect} />
          <MobileChip person={cindy} onSelect={onSelect} />
        </div>
      </div>

      <div>
        <p className="ornament mb-2">The Wailers</p>
        <div className="flex gap-3">
          <MobileChip person={peter} onSelect={onSelect} />
          <MobileChip person={bunny} onSelect={onSelect} />
        </div>
      </div>

      <div>
        <p className="ornament mb-2">Twelve Children</p>
        <div className="grid grid-cols-2 gap-3">
          {CHILD_SLUGS.map((slug) => {
            const p = personBySlug(slug);
            if (!p) return null;
            return <MobileChip key={slug} person={p} onSelect={onSelect} />;
          })}
        </div>
      </div>

      <div>
        <p className="ornament mb-2">Grandchildren in Music</p>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(GRAND_PARENTS).map(([slug, parentSlug]) => {
            const p = personBySlug(slug);
            const parent = personBySlug(parentSlug);
            if (!p) return null;
            return (
              <div key={slug} className="pl-4 border-l-2 border-gold/40">
                {parent && (
                  <p className="mono text-[9px] tracking-widest text-cocoa uppercase mb-1">
                    son of {parent.name.split(" ")[0]}
                  </p>
                )}
                <MobileChip person={p} onSelect={onSelect} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MobileChip({ person, onSelect }: { person: Person; onSelect: (s: string) => void }) {
  const albumsCount = person.albums?.length ?? 0;
  return (
    <button
      onClick={() => onSelect(person.slug)}
      className="flex items-center gap-3 w-full text-left bg-sand_2/50 border border-bark/15 p-2 hover:bg-sand_2 transition-colors"
    >
      <div className="w-12 h-12 rounded-full overflow-hidden border border-gold/40 flex-shrink-0">
        <NodePortrait person={person} size={48} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="serif text-sm text-bark truncate">{person.name.split(" ").slice(0, 3).join(" ")}</p>
        <p className="mono text-[9px] tracking-widest text-cocoa uppercase">
          {yearRange(person)}{albumsCount > 0 ? ` · ${albumsCount} LPs` : ""}
        </p>
      </div>
    </button>
  );
}

/* ---------- The cinematic stage (lg+) ---------- */
function DesktopTree({
  nodes,
  selectedSlug,
  onSelect,
}: {
  nodes: Node[];
  selectedSlug: string | null;
  onSelect: (s: string) => void;
}) {
  return (
    <div className="hidden lg:block relative w-full" style={{ aspectRatio: "1400 / 1100" }}>
      {/* Layered background — radial vignette + noise */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 38%, #2a3a2a 0%, #1a2418 32%, #0d1a10 70%, #050a06 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(rgba(230,184,0,0.05) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
          opacity: 0.5,
        }}
      />
      {/* Subtle warm halo around Bob */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: `${(BOB_X / 1400) * 100}%`,
          top: `${(BOB_Y / 1100) * 100}%`,
          transform: "translate(-50%, -50%)",
          width: "30%",
          height: "30%",
          background:
            "radial-gradient(circle, rgba(230,184,0,0.18) 0%, rgba(192,56,43,0.08) 40%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* SVG connection layer */}
      <ConnectionLines nodes={nodes} selectedSlug={selectedSlug} />

      {/* Node overlay */}
      <div className="absolute inset-0">
        {nodes.map((node, i) => {
          const person = personBySlug(node.slug);
          if (!person) return null;

          const left = (node.x / 1400) * 100;
          const top = (node.y / 1100) * 100;
          const isSelected = node.slug === selectedSlug;
          const isDimmed = selectedSlug != null && !isSelected;

          // staggered delays — tier by tier
          const delayMap: Record<Node["tier"], number> = {
            bob: 0,
            ancestor: 200,
            partner: 350,
            wailer: 500,
            child: 700,
            grand: 1000,
          };
          const baseDelay = delayMap[node.tier];
          const indexJitter = (i % 6) * 60;
          const animationDelay = `${baseDelay + indexJitter}ms`;

          const orbitSide: "left" | "right" = node.x < BOB_X ? "left" : "right";
          const showOrbit =
            node.tier === "child" || node.tier === "grand" || node.tier === "bob" || node.tier === "wailer";

          return (
            <button
              key={node.slug}
              onClick={() => onSelect(node.slug)}
              className={
                "tree-node absolute flex flex-col items-center transition-all duration-300 " +
                "focus:outline-none group " +
                (isDimmed ? "opacity-40" : "opacity-100")
              }
              style={{
                left: `${left}%`,
                top: `${top}%`,
                transform: "translate(-50%, -50%)",
                animationDelay,
              }}
              aria-label={`${person.name} — open profile`}
            >
              <div className="relative">
                <div
                  className={
                    "rounded-full overflow-hidden transition-transform duration-300 " +
                    (isSelected ? "scale-110" : "group-hover:scale-105")
                  }
                  style={{
                    width: node.size,
                    height: node.size,
                    ...tierStyle(node.tier, isSelected),
                  }}
                >
                  <NodePortrait person={person} size={node.size} />
                </div>

                {/* Album orbit only for musician-ish tiers (skip ancestors + partners with no albums) */}
                {showOrbit && (person.albums?.length ?? 0) > 0 && (
                  <AlbumOrbit person={person} side={orbitSide} />
                )}
              </div>

              <div
                className="mt-2 text-center"
                style={{ width: Math.max(node.size * 1.6, 110) }}
              >
                {node.tier === "bob" ? (
                  <h2 className="display text-gold text-3xl leading-none tracking-tight drop-shadow-lg">
                    Bob Marley
                  </h2>
                ) : (
                  <p
                    className={
                      "display leading-tight " +
                      (node.tier === "ancestor" || node.tier === "grand"
                        ? "text-sand_3 text-xs"
                        : "text-sand text-sm")
                    }
                  >
                    {person.name.split(" ").slice(0, 3).join(" ")}
                  </p>
                )}
                <p
                  className={
                    "mono tracking-widest mt-0.5 " +
                    (node.tier === "bob"
                      ? "text-gold/70 text-[10px]"
                      : "text-sand/60 text-[9px]")
                  }
                >
                  {yearRange(person)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   Page
   ========================================================= */
export default function TreePage() {
  const nodes = useMemo(() => buildNodes(), []);
  const [selected, setSelected] = useState<string | null>(null);

  // count badges
  const counts = useMemo(() => {
    return {
      children: CHILD_SLUGS.length,
      generations: 3,
      records: people
        .filter((p) => p.tags?.includes("marley-family"))
        .reduce((sum, p) => sum + (p.albums?.length ?? 0), 0),
    };
  }, []);

  return (
    <>
      <TopNav />

      {/* Local stylesheet for animations + tree-specific keyframes */}
      <style>{`
        .tree-node {
          animation: nodeIn 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both;
        }
        @keyframes nodeIn {
          0%   { opacity: 0; transform: translate(-50%, calc(-50% + 22px)) scale(0.85); }
          60%  { opacity: 1; }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        .tree-line-fade {
          animation: lineIn 1.2s ease-out both;
        }
        @keyframes lineIn {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        .tree-line-pulse {
          animation: linePulse 4s ease-in-out infinite;
        }
        .tree-line-pulse-slow {
          animation: linePulse 6s ease-in-out infinite;
        }
        @keyframes linePulse {
          0%, 100% { stroke-dashoffset: 0; }
          50%      { stroke-dashoffset: 24; }
        }
        @keyframes panelIn {
          0%   { transform: translateX(20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-panel-in {
          animation: panelIn 0.35s ease-out both;
        }
        /* keep portraits crisp inside circular nodes */
        .tree-node img { image-rendering: -webkit-optimize-contrast; }
      `}</style>

      {/* Section header */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="tricolor-bar" />
        <p className="ornament mb-2">Bloodline & Band</p>
        <h1 className="display text-bark text-4xl sm:text-5xl tracking-tight leading-none">
          The Tree
        </h1>
        <p className="serif italic text-cocoa text-lg sm:text-xl mt-3 max-w-3xl">
          Bob at the center. Twelve children spread below him. Three grandchildren
          already cutting records. Wailers and women drawn at the sides — the people who
          made him, who he made with, and who made the sound after him.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
          <Stat n={counts.children} label="Acknowledged children" />
          <Stat n={counts.generations} label="Generations visible" />
          <Stat n={counts.records} label="Records across the family" />
        </div>
      </section>

      {/* Stage — desktop */}
      <section className="max-w-[1500px] mx-auto px-2 sm:px-4 lg:px-6 mt-6">
        <div className="relative overflow-hidden rounded-md border border-bark/30 shadow-2xl bg-bark">
          <DesktopTree
            nodes={nodes}
            selectedSlug={selected}
            onSelect={(s) => setSelected((cur) => (cur === s ? null : s))}
          />
          {/* Legend strip overlaid bottom of stage on desktop */}
          <div className="hidden lg:flex absolute bottom-0 left-0 right-0 bg-gradient-to-t from-bark to-transparent px-6 py-4 justify-between items-end">
            <LegendChip swatch="bg-gold" label="Bob & line of descent" />
            <LegendChip swatch="bg-ember" label="Partners" />
            <LegendChip swatch="bg-leaf" label="The Wailers" />
            <LegendChip swatch="bg-sand_3" label="Ancestors" />
            <LegendChip swatch="bg-gold_2" label="Grandchildren" />
            <p className="mono text-[10px] tracking-widest text-sand/55 uppercase">
              Click any face to open a record case
            </p>
          </div>
        </div>
      </section>

      {/* Mobile layout */}
      <MobileTree onSelect={(s) => setSelected(s)} />

      <SidePanel slug={selected} onClose={() => setSelected(null)} />

      {/* Editorial caption beneath the tree (desktop) */}
      <section className="hidden lg:block max-w-4xl mx-auto px-6 mt-10 mb-12">
        <hr className="hr-rule" />
        <p className="serif italic text-cocoa text-lg leading-relaxed drop-cap">
          Eleven publicly-acknowledged children by seven women between 1964 and 1981,
          plus Sharon — Rita's daughter, whom Bob raised as his own and never
          distinguished. The musical line runs strongest through Ziggy, Stephen, Damian,
          Julian and Ky-Mani, but every child carries the name and the burden of it. The
          third generation is already arriving: Skip with a Grammy nomination, JoMersa
          producing, Yohan working in Lauryn Hill's shadow. Click any face above to open
          the file.
        </p>
      </section>

      <footer className="border-t border-bark/15 bg-sand_2/40 mt-6">
        <div className="tricolor-bar-thin" />
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 text-center">
          <p className="serif italic text-cocoa text-sm">
            One love. One heart. Let&apos;s get together and feel all right.
          </p>
          <p className="mono text-[10px] tracking-widest text-cocoa uppercase mt-3">
            Tuff Gong · A demo built for Kamal Soliman · 2026
          </p>
        </div>
      </footer>
    </>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <p className="display text-ember text-3xl sm:text-4xl leading-none">{n}</p>
      <p className="mono text-[10px] tracking-widest text-cocoa uppercase mt-1">{label}</p>
    </div>
  );
}

function LegendChip({ swatch, label }: { swatch: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`inline-block w-3 h-3 rounded-full ${swatch}`} />
      <span className="mono text-[10px] tracking-widest text-sand/70 uppercase">
        {label}
      </span>
    </div>
  );
}
