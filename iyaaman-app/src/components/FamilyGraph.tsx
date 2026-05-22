"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { people, type Person } from "@/lib/people";
import { albums, albumsByArtist } from "@/lib/albums";

// Visual family tree: SVG node graph with three layers (parents, Bob's generation,
// children, grandchildren) and a satellite ring of albums per family musician.
// Click any node to focus it — connected lines highlight, sidebar shows detail.

type NodeKind = "person-bob" | "person-parent" | "person-child"
              | "person-grandchild" | "person-partner" | "person-wailer"
              | "person-tour" | "band"
              | "album";

type GraphNode = {
  id: string;
  kind: NodeKind;
  label: string;
  sublabel?: string;
  x: number;
  y: number;
  r: number;
  album_year?: number;
  artist_slug?: string;
};

type GraphEdge = {
  from: string;
  to: string;
  kind: "parent-of" | "married-to" | "made-album" | "in-band" | "tour-family";
};

const COL_LEFT = 80;
const COL_CENTER = 480;
const COL_RIGHT = 880;

function build() {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Layer 0 — parents (top)
  nodes.push({ id: "norval-marley",  kind: "person-parent", label: "Norval Marley",  sublabel: "father",  x: COL_CENTER - 100, y: 60, r: 22 });
  nodes.push({ id: "cedella-booker", kind: "person-parent", label: "Cedella Booker", sublabel: "mother",  x: COL_CENTER + 100, y: 60, r: 22 });
  edges.push({ from: "norval-marley",  to: "bob-marley", kind: "parent-of" });
  edges.push({ from: "cedella-booker", to: "bob-marley", kind: "parent-of" });

  // Layer 1 — Bob + Rita + Cindy at center
  nodes.push({ id: "bob-marley", kind: "person-bob", label: "BOB MARLEY", sublabel: "1945 — 1981",
               x: COL_CENTER, y: 240, r: 48 });
  nodes.push({ id: "rita-marley", kind: "person-partner", label: "Rita Marley", sublabel: "wife · I-Three",
               x: COL_LEFT, y: 260, r: 28 });
  nodes.push({ id: "cindy-breakspeare", kind: "person-partner", label: "Cindy Breakspeare", sublabel: "Damian's mother",
               x: COL_RIGHT, y: 260, r: 24 });
  edges.push({ from: "bob-marley", to: "rita-marley", kind: "married-to" });
  edges.push({ from: "bob-marley", to: "cindy-breakspeare", kind: "married-to" });

  // Wailers ring — top-left and top-right of Bob
  nodes.push({ id: "peter-tosh",   kind: "person-wailer", label: "Peter Tosh",   sublabel: "1944 — 1987",
               x: COL_LEFT - 20,  y: 130, r: 22 });
  nodes.push({ id: "bunny-wailer", kind: "person-wailer", label: "Bunny Wailer", sublabel: "1947 — 2021",
               x: COL_RIGHT + 20, y: 130, r: 22 });
  edges.push({ from: "bob-marley", to: "peter-tosh",   kind: "in-band" });
  edges.push({ from: "bob-marley", to: "bunny-wailer", kind: "in-band" });

  // Layer 2 — Children (second generation). Spread across.
  const children = [
    { id: "sharon-marley",    label: "Sharon",    born: 1964 },
    { id: "cedella-marley",   label: "Cedella",   born: 1967 },
    { id: "ziggy-marley",     label: "Ziggy",     born: 1968 },
    { id: "stephen-marley",   label: "Stephen",   born: 1972 },
    { id: "robbie-marley",    label: "Robbie",    born: 1972 },
    { id: "rohan-marley",     label: "Rohan",     born: 1972 },
    { id: "karen-marley",     label: "Karen",     born: 1973 },
    { id: "stephanie-marley", label: "Stephanie", born: 1974 },
    { id: "julian-marley",    label: "Julian",    born: 1975 },
    { id: "kymani-marley",    label: "Ky-Mani",   born: 1976 },
    { id: "damian-marley",    label: "Damian",    born: 1978 },
    { id: "makeda-marley",    label: "Makeda",    born: 1981 },
  ];
  const childY = 480;
  const childSpread = 960;
  let damianX = 0;
  let damianY = childY;
  children.forEach((c, i) => {
    const x = 40 + (i / (children.length - 1)) * childSpread;
    nodes.push({
      id: c.id, kind: "person-child",
      label: c.label, sublabel: `b. ${c.born}`,
      x, y: childY, r: 20,
    });
    edges.push({ from: "bob-marley", to: c.id, kind: "parent-of" });
    if (c.id === "damian-marley") {
      damianX = x;
      damianY = childY;
    }
  });

  // Extended circle — Kamal Soliman (tour manager · best friend of the site author)
  // and his band Lance Herbstrong. Embedded inline; not in people.ts on purpose.
  const kamalX = damianX + 90;
  const kamalY = damianY + 70;
  nodes.push({
    id: "kamal-soliman", kind: "person-tour",
    label: "Kamal", sublabel: "tour family",
    x: kamalX, y: kamalY, r: 18,
  });
  edges.push({ from: "damian-marley", to: "kamal-soliman", kind: "tour-family" });

  const lanceX = kamalX + 75;
  const lanceY = kamalY + 30;
  nodes.push({
    id: "lance-herbstrong", kind: "band",
    label: "Lance Herbstrong", sublabel: "band",
    x: lanceX, y: lanceY, r: 11,
  });
  edges.push({ from: "kamal-soliman", to: "lance-herbstrong", kind: "in-band" });

  // Grandchildren (third gen) — only the music-active ones
  nodes.push({ id: "skip-marley",     kind: "person-grandchild", label: "Skip",      sublabel: "b. 1996", x: 220, y: 720, r: 16 });
  nodes.push({ id: "jomersa-marley",  kind: "person-grandchild", label: "JoMersa",   sublabel: "b. 1991", x: 520, y: 720, r: 16 });
  nodes.push({ id: "yohan-marley",    kind: "person-grandchild", label: "Yohan",     sublabel: "b. 2002", x: 760, y: 720, r: 16 });
  edges.push({ from: "cedella-marley", to: "skip-marley",     kind: "parent-of" });
  edges.push({ from: "stephen-marley", to: "jomersa-marley",  kind: "parent-of" });
  edges.push({ from: "rohan-marley",   to: "yohan-marley",    kind: "parent-of" });

  // Albums — placed as small satellites around each musician.
  // For Bob we lay them in an arc above; for children a small cluster nearby.
  const musicians = ["bob-marley","ziggy-marley","stephen-marley","damian-marley",
                     "kymani-marley","julian-marley","skip-marley","jomersa-marley",
                     "sharon-marley","cedella-marley"];
  musicians.forEach((slug) => {
    const parent = nodes.find((n) => n.id === slug);
    if (!parent) return;
    const list = albumsByArtist(slug);
    list.forEach((a, i) => {
      // Offset cluster — fan out around parent in a small arc.
      const isBob = slug === "bob-marley";
      const radius = isBob ? 130 : 56;
      const arcStart = isBob ? -Math.PI * 0.95 : -Math.PI * 0.5;
      const arcSpan = isBob ? Math.PI * 0.9 : Math.PI * 1.6;
      const t = list.length > 1 ? i / (list.length - 1) : 0.5;
      const angle = arcStart + arcSpan * t;
      const ax = parent.x + Math.cos(angle) * radius;
      const ay = parent.y + Math.sin(angle) * radius;
      const id = `album:${a.slug}`;
      if (nodes.find((n) => n.id === id)) return;
      nodes.push({
        id, kind: "album",
        label: a.title, sublabel: `${a.year}`,
        x: ax, y: ay, r: 6,
        album_year: a.year, artist_slug: slug,
      });
      edges.push({ from: slug, to: id, kind: "made-album" });
    });
  });

  return { nodes, edges };
}

const STYLE: Record<NodeKind, { fill: string; stroke: string; text: string }> = {
  "person-bob":         { fill: "#c44a2a", stroke: "#3a2614", text: "#f3eadb" },
  "person-parent":      { fill: "#ebe0c9", stroke: "#5a3d20", text: "#3a2614" },
  "person-partner":     { fill: "#d8c8a4", stroke: "#5a3d20", text: "#3a2614" },
  "person-wailer":      { fill: "#0f7438", stroke: "#3a2614", text: "#f3eadb" },
  "person-child":       { fill: "#e6b800", stroke: "#3a2614", text: "#3a2614" },
  "person-grandchild":  { fill: "#9a8f7e", stroke: "#3a2614", text: "#f3eadb" },
  "person-tour":        { fill: "#3a2614", stroke: "#c44a2a", text: "#f3eadb" },
  "band":               { fill: "#5a3d20", stroke: "#c69c3e", text: "#f3eadb" },
  "album":              { fill: "#3a2614", stroke: "#c69c3e", text: "#f3eadb" },
};

export default function FamilyGraph() {
  const { nodes, edges } = useMemo(() => build(), []);
  const [focus, setFocus] = useState<string | null>("bob-marley");

  const focusNode = nodes.find((n) => n.id === focus);
  const connectedIds = useMemo(() => {
    if (!focus) return new Set<string>();
    const set = new Set<string>([focus]);
    edges.forEach((e) => {
      if (e.from === focus) set.add(e.to);
      if (e.to === focus) set.add(e.from);
    });
    return set;
  }, [focus, edges]);

  const isFocused = (id: string) => connectedIds.has(id);

  // Compute sidebar content
  const sidebar = (() => {
    if (!focus) return null;
    if (focus === "kamal-soliman") {
      return (
        <>
          <p className="ornament">The Extended Circle</p>
          <h3 className="display text-bark text-2xl mt-1">Kamal Soliman</h3>
          <p className="serif italic text-cocoa text-sm mt-2">
            Tour manager · Damian Marley · band: Lance Herbstrong
          </p>
          <p className="text-bark_2 text-sm mt-3 leading-relaxed">
            Best friend of the site author for over thirty years. Performer in
            his own right with the Austin-based reggae outfit Lance Herbstrong.
            The reason this site exists.
          </p>
          <Link href="/kamal/" className="link-inline mono text-[10px] tracking-widest uppercase mt-3 inline-block">
            Open his dedication →
          </Link>
        </>
      );
    }
    if (focus === "lance-herbstrong") {
      return (
        <>
          <p className="ornament">The Band</p>
          <h3 className="display text-bark text-2xl mt-1">Lance Herbstrong</h3>
          <p className="serif italic text-cocoa text-sm mt-2">
            Austin-based reggae · electronic · party band
          </p>
          <p className="text-bark_2 text-sm mt-3 leading-relaxed">
            Kamal&apos;s band. Festival regulars; have played Austin City Limits,
            Bonnaroo, and Telluride Bluegrass on past lineups.
          </p>
        </>
      );
    }
    if (focus.startsWith("album:")) {
      const slug = focus.slice("album:".length);
      const a = albums.find((x) => x.slug === slug);
      if (!a) return null;
      return (
        <>
          <p className="ornament">Album · {a.year}</p>
          <h3 className="display text-bark text-2xl mt-1">{a.title}</h3>
          <p className="serif italic text-cocoa mt-1 text-sm">{a.artistDisplay}</p>
          <p className="text-bark_2 text-sm mt-3 leading-relaxed">{a.blurb}</p>
          {a.highlights && a.highlights.length > 0 && (
            <ul className="mt-3 text-xs text-cocoa space-y-1">
              {a.highlights.map((h) => <li key={h}>· {h}</li>)}
            </ul>
          )}
          {a.awards && a.awards.length > 0 && (
            <p className="mt-3 mono text-[10px] tracking-widest text-gold uppercase">
              {a.awards.join(" · ")}
            </p>
          )}
          <Link href={`/discography/${a.slug}`} className="link-inline mono text-[10px] tracking-widest uppercase mt-3 inline-block">
            Open album →
          </Link>
        </>
      );
    }
    const p = people.find((x) => x.slug === focus);
    if (!p) return null;
    const myAlbums = albumsByArtist(p.slug);
    return (
      <>
        <p className="ornament">Person</p>
        <h3 className="display text-bark text-2xl mt-1">{p.name}</h3>
        {p.aka && p.aka.length > 0 && (
          <p className="serif italic text-cocoa text-sm mt-1">a.k.a. {p.aka.join(" · ")}</p>
        )}
        <p className="mono text-[10px] tracking-widest text-cocoa mt-1">
          {p.born}{p.died ? ` — ${p.died}` : ""}
        </p>
        <p className="serif italic text-cocoa text-sm mt-2">{p.role}</p>
        <p className="text-bark_2 text-sm mt-3 leading-relaxed">{p.bio}</p>
        {myAlbums.length > 0 && (
          <div className="mt-4">
            <p className="ornament">Discography ({myAlbums.length})</p>
            <ul className="mt-2 text-xs text-cocoa space-y-1">
              {myAlbums.slice(0, 12).map((a) => (
                <li key={a.slug}>
                  <button onClick={() => setFocus(`album:${a.slug}`)}
                          className="text-left hover:text-ember">
                    {a.year} · {a.title}
                  </button>
                </li>
              ))}
              {myAlbums.length > 12 && (
                <li className="text-ash">… and {myAlbums.length - 12} more</li>
              )}
            </ul>
          </div>
        )}
        <Link href={`/family/${p.slug}`} className="link-inline mono text-[10px] tracking-widest uppercase mt-4 inline-block">
          Open profile →
        </Link>
      </>
    );
  })();

  return (
    <section className="px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="display text-bark text-3xl tracking-tight">
          The Marley Family Tree
        </h2>
        <p className="mono text-[10px] tracking-widest text-cocoa uppercase hidden sm:block">
          Click any node · drag-pan disabled
        </p>
      </div>
      <p className="serif italic text-cocoa text-sm mb-4 max-w-2xl">
        Bob at the center. His parents above, his wives to either side, the Wailers
        flanking the top, twelve children across the middle, grandchildren below.
        Every Marley who made music has their albums orbiting them — click any record
        to read its story. And in the extended circle, the road family that lives
        alongside the bloodline.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        {/* Graph SVG — mobile gets horizontal scroll so the 1000-wide layout doesn't crush */}
        <div className="border border-bark/20 bg-sand_2/40 overflow-x-auto md:overflow-hidden rounded">
          <svg viewBox="0 0 1000 800" role="img"
               className="w-[760px] sm:w-full h-auto"
               aria-label="Bob Marley family tree with linked albums">
            {/* Edges */}
            {edges.map((e, i) => {
              const a = nodes.find((n) => n.id === e.from);
              const b = nodes.find((n) => n.id === e.to);
              if (!a || !b) return null;
              const focused = focus
                ? (e.from === focus || e.to === focus)
                : false;
              const opacity = focus ? (focused ? 0.85 : 0.10) : 0.35;
              const stroke = e.kind === "married-to"
                ? "#c44a2a"
                : e.kind === "made-album"
                ? "#c69c3e"
                : e.kind === "in-band"
                ? "#0f7438"
                : e.kind === "tour-family"
                ? "#c44a2a"
                : "#5a3d20";
              const w = e.kind === "made-album"
                ? 0.8
                : e.kind === "tour-family"
                ? 1.6
                : 1.4;
              const dash = e.kind === "married-to"
                ? "4 3"
                : e.kind === "tour-family"
                ? "5 3"
                : undefined;
              return (
                <line key={i}
                      x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                      stroke={stroke} strokeWidth={w}
                      strokeOpacity={opacity}
                      strokeDasharray={dash}/>
              );
            })}
            {/* Nodes */}
            {nodes.map((n) => {
              const s = STYLE[n.kind];
              const focused = focus ? isFocused(n.id) : true;
              const o = focus ? (focused ? 1.0 : 0.20) : 1.0;
              const cur = focus === n.id;
              return (
                <g key={n.id}
                   transform={`translate(${n.x},${n.y})`}
                   style={{ cursor: "pointer" }}
                   onClick={() => setFocus(n.id)}
                   opacity={o}>
                  {cur && (
                    <circle r={n.r + 4} fill="none" stroke={s.stroke} strokeWidth={1.2} strokeDasharray="2 2"/>
                  )}
                  <circle r={n.r} fill={s.fill} stroke={s.stroke} strokeWidth={1.4}/>
                  {n.kind !== "album" && (
                    <text textAnchor="middle" y={n.r + 14}
                          fontFamily="Anton, sans-serif" fontSize={n.kind === "person-bob" ? 13 : 10}
                          fill="#3a2614" letterSpacing="0.04em">
                      {n.label.toUpperCase()}
                    </text>
                  )}
                  {n.kind !== "album" && n.sublabel && (
                    <text textAnchor="middle" y={n.r + 26}
                          fontFamily="DM Mono, monospace" fontSize={8}
                          fill="#7a5530" letterSpacing="0.08em">
                      {n.sublabel}
                    </text>
                  )}
                  {n.kind === "album" && cur && (
                    <text textAnchor="middle" y={-n.r - 4}
                          fontFamily="DM Mono, monospace" fontSize={8}
                          fill="#3a2614">
                      {n.album_year}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Sidebar detail */}
        <aside className="border border-bark/20 bg-sand_2/40 p-4 sm:p-5 rounded min-h-[300px]">
          {sidebar || (
            <p className="serif italic text-cocoa text-sm">
              Click any node to focus.
            </p>
          )}
        </aside>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 mono text-[10px] tracking-widest text-cocoa uppercase">
        <span><span className="inline-block w-3 h-3 rounded-full mr-1 align-middle" style={{background:"#c44a2a"}}/>Bob</span>
        <span><span className="inline-block w-3 h-3 rounded-full mr-1 align-middle" style={{background:"#ebe0c9", border:"1px solid #5a3d20"}}/>Parents</span>
        <span><span className="inline-block w-3 h-3 rounded-full mr-1 align-middle" style={{background:"#d8c8a4"}}/>Partners</span>
        <span><span className="inline-block w-3 h-3 rounded-full mr-1 align-middle" style={{background:"#0f7438"}}/>Wailers</span>
        <span><span className="inline-block w-3 h-3 rounded-full mr-1 align-middle" style={{background:"#e6b800"}}/>Children</span>
        <span><span className="inline-block w-3 h-3 rounded-full mr-1 align-middle" style={{background:"#9a8f7e"}}/>Grandchildren</span>
        <span><span className="inline-block w-3 h-3 rounded-full mr-1 align-middle" style={{background:"#3a2614", border:"1px solid #c69c3e"}}/>Albums</span>
        <span><span className="inline-block w-3 h-3 rounded-full mr-1 align-middle" style={{background:"#3a2614", border:"1px solid #c44a2a"}}/>Tour family</span>
        <span><span className="inline-block w-3 h-3 rounded-full mr-1 align-middle" style={{background:"#5a3d20", border:"1px solid #c69c3e"}}/>Band</span>
      </div>
    </section>
  );
}
