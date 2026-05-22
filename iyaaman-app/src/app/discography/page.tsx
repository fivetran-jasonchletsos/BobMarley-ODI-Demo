"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import TopNav from "@/components/TopNav";
import AlbumCover from "@/components/AlbumCover";
import { albums, type Album } from "@/lib/albums";

type EraKey = Album["era"];
type GenKey = Album["family_generation"];
type SortKey = "year-desc" | "year-asc" | "artist";

// Stat tile filter keys. Each one is a predicate against an Album.
type StatKey =
  | "bob"
  | "damian"
  | "stephen"
  | "ziggy"
  | "julian"
  | "kymani"
  | "grammy"
  | "1970s"
  | "1980s"
  | "1990s"
  | "2000s"
  | "2010s"
  | "2020s"
  | "collab"
  | "third-gen";

const ERAS: { key: NonNullable<EraKey>; label: string }[] = [
  { key: "wailers",      label: "Wailers" },
  { key: "island",       label: "Island" },
  { key: "posthumous",   label: "Posthumous" },
  { key: "second-gen",   label: "Second Gen" },
  { key: "third-gen",    label: "Third Gen" },
  { key: "collab",       label: "Collab" },
];

const GENS: { key: GenKey; label: string }[] = [
  { key: 1,        label: "Gen 1" },
  { key: 2,        label: "Gen 2" },
  { key: 3,        label: "Gen 3" },
  { key: "wailer", label: "Wailer-Era" },
];

function genBorder(gen: GenKey): string {
  switch (gen) {
    case 1:        return "border-jam_red/60 hover:border-jam_red";
    case 2:        return "border-jam_gold/60 hover:border-jam_gold";
    case 3:        return "border-jam_green/60 hover:border-jam_green";
    case "wailer": return "border-jam_black/60 hover:border-jam_black";
  }
}

function genDotColor(gen: GenKey): string {
  switch (gen) {
    case 1:        return "bg-jam_red";
    case 2:        return "bg-jam_gold";
    case 3:        return "bg-jam_green";
    case "wailer": return "bg-jam_black";
  }
}

// Stat predicate definitions — single source of truth for both count + filter.
const STAT_PREDICATES: Record<StatKey, (a: Album) => boolean> = {
  bob:        (a) => a.artistSlugs.includes("bob-marley"),
  damian:     (a) => a.artistSlugs.includes("damian-marley"),
  stephen:    (a) => a.artistSlugs.includes("stephen-marley"),
  ziggy:      (a) => a.artistSlugs.includes("ziggy-marley"),
  julian:     (a) => a.artistSlugs.includes("julian-marley"),
  kymani:     (a) => a.artistSlugs.includes("kymani-marley"),
  grammy:     (a) => (a.awards ?? []).some((s) => s.toLowerCase().includes("grammy")),
  "1970s":    (a) => a.year >= 1970 && a.year <= 1979,
  "1980s":    (a) => a.year >= 1980 && a.year <= 1989,
  "1990s":    (a) => a.year >= 1990 && a.year <= 1999,
  "2000s":    (a) => a.year >= 2000 && a.year <= 2009,
  "2010s":    (a) => a.year >= 2010 && a.year <= 2019,
  "2020s":    (a) => a.year >= 2020 && a.year <= 2029,
  collab:     (a) => a.era === "collab",
  "third-gen":(a) => a.family_generation === 3,
};

type StatTile = {
  key: StatKey;
  count: number;
  label: string;
  color: "red" | "gold" | "green";
};

// Tailwind needs static class names — full strings per state/color combo.
const COLOR_CLASSES: Record<StatTile["color"], { active: string; idle: string }> = {
  red: {
    active: "text-jam_red bg-jam_red/10 border-jam_red ring-1 ring-jam_red",
    idle:   "text-jam_red border-bark/15 bg-sand_2/30 hover:border-jam_red hover:bg-jam_red/10",
  },
  gold: {
    active: "text-ember bg-gold/20 border-gold ring-1 ring-gold",
    idle:   "text-bark border-bark/15 bg-sand_2/30 hover:border-gold hover:bg-gold/15",
  },
  green: {
    active: "text-jam_green bg-jam_green/10 border-jam_green ring-1 ring-jam_green",
    idle:   "text-jam_green border-bark/15 bg-sand_2/30 hover:border-jam_green hover:bg-jam_green/10",
  },
};

function colorClasses(color: StatTile["color"], active: boolean) {
  return active ? COLOR_CLASSES[color].active : COLOR_CLASSES[color].idle;
}

export default function DiscographyPage() {
  const [eraFilters, setEraFilters] = useState<Set<NonNullable<EraKey>>>(new Set());
  const [genFilters, setGenFilters] = useState<Set<GenKey>>(new Set());
  const [statFilter, setStatFilter] = useState<StatKey | null>(null);
  const [sort, setSort] = useState<SortKey>("year-asc");

  // ----------------------------------------------------------------------
  // Stats tiles — built once from the full albums list.
  // ----------------------------------------------------------------------
  const tiles: StatTile[] = useMemo(() => {
    const make = (key: StatKey, label: string, color: StatTile["color"]): StatTile => ({
      key,
      count: albums.filter(STAT_PREDICATES[key]).length,
      label,
      color,
    });
    return [
      make("bob",        "Bob records",        "red"),
      make("ziggy",      "with Ziggy",         "gold"),
      make("stephen",    "with Stephen",       "green"),
      make("damian",     "with Damian",        "red"),
      make("julian",     "with Julian",        "gold"),
      make("kymani",     "with Ky-Mani",       "green"),
      make("grammy",     "Grammy winners",     "gold"),
      make("collab",     "Collaborations",     "red"),
      make("third-gen",  "Third-gen records",  "green"),
      make("1970s",      "1970s",              "red"),
      make("1980s",      "1980s",              "gold"),
      make("1990s",      "1990s",              "green"),
      make("2000s",      "2000s",              "red"),
      make("2010s",      "2010s",              "gold"),
      make("2020s",      "2020s",              "green"),
    ];
  }, []);

  // ----------------------------------------------------------------------
  // Generation breakdown — for the donut/bar chart.
  // ----------------------------------------------------------------------
  const genBreakdown = useMemo(() => {
    const items: { key: GenKey; label: string; count: number; color: string }[] = [
      { key: 1,        label: "Bob's records",           count: 0, color: "#c0382b" },
      { key: 2,        label: "Children's records",      count: 0, color: "#e6b800" },
      { key: 3,        label: "Grandchildren's records", count: 0, color: "#0f7438" },
      { key: "wailer", label: "Wailer-era",              count: 0, color: "#0d1a10" },
    ];
    for (const a of albums) {
      const it = items.find((i) => i.key === a.family_generation);
      if (it) it.count += 1;
    }
    return items;
  }, []);

  const genTotal = genBreakdown.reduce((s, x) => s + x.count, 0);

  // ----------------------------------------------------------------------
  // Filter composition: stat AND era AND generation.
  // ----------------------------------------------------------------------
  const filtered = useMemo(() => {
    const out = albums.filter((a) => {
      if (statFilter && !STAT_PREDICATES[statFilter](a)) return false;
      if (eraFilters.size > 0) {
        if (!a.era || !eraFilters.has(a.era)) return false;
      }
      if (genFilters.size > 0) {
        if (!genFilters.has(a.family_generation)) return false;
      }
      return true;
    });
    out.sort((a, b) => {
      if (sort === "year-asc") return a.year - b.year;
      if (sort === "year-desc") return b.year - a.year;
      const ac = a.artistDisplay.replace(/^The\s+/i, "");
      const bc = b.artistDisplay.replace(/^The\s+/i, "");
      const cmp = ac.localeCompare(bc);
      return cmp !== 0 ? cmp : a.year - b.year;
    });
    return out;
  }, [eraFilters, genFilters, statFilter, sort]);

  function toggleEra(k: NonNullable<EraKey>) {
    setEraFilters((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  }

  function toggleGen(k: GenKey) {
    setGenFilters((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  }

  function toggleStat(k: StatKey) {
    setStatFilter((s) => (s === k ? null : k));
  }

  function clearAll() {
    setEraFilters(new Set());
    setGenFilters(new Set());
    setStatFilter(null);
  }

  function cycleSort() {
    setSort((s) =>
      s === "year-asc" ? "year-desc"
      : s === "year-desc" ? "artist"
      : "year-asc",
    );
  }

  const sortLabel =
    sort === "year-asc"  ? "Year: Oldest first"
    : sort === "year-desc" ? "Year: Newest first"
    : "By artist";

  const hasFilter = eraFilters.size > 0 || genFilters.size > 0 || statFilter !== null;

  // ----------------------------------------------------------------------
  // Donut math (for the generation breakdown).
  // ----------------------------------------------------------------------
  const donutData = useMemo(() => {
    const R = 60;
    const C = 2 * Math.PI * R;
    let offset = 0;
    return genBreakdown.map((seg) => {
      const frac = genTotal > 0 ? seg.count / genTotal : 0;
      const dash = frac * C;
      const slice = { ...seg, frac, dash, gap: C - dash, offset };
      offset += dash;
      return slice;
    });
  }, [genBreakdown, genTotal]);

  return (
    <>
      <TopNav />

      {/* Editorial header */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-10 pb-6">
        <p className="ornament mb-3">Every Marley Record</p>
        <h1 className="display text-bark text-5xl sm:text-6xl md:text-7xl tracking-tight leading-none">
          Discography
        </h1>
        <p className="serif italic text-bark_2 text-lg sm:text-xl mt-5 max-w-3xl leading-relaxed">
          From <em>The Wailing Wailers</em> (1965) to the next generation.
          Sixteen Bob records, twenty-three from his children, three from his
          grandchildren. Click any tile to filter the catalog below.
        </p>
      </section>

      <div className="tricolor-bar-thin max-w-6xl mx-auto"/>

      {/* ============================================================ */}
      {/* Analytics tiles — clickable                                    */}
      {/* ============================================================ */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-8 pb-2">
        <div className="flex items-baseline justify-between mb-4">
          <p className="ornament">By the Numbers</p>
          <p className="mono text-[10px] tracking-widest uppercase text-cocoa">
            Click any tile to filter
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {tiles.map((t) => {
            const active = statFilter === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => toggleStat(t.key)}
                aria-pressed={active}
                className={[
                  "text-left border-2 px-4 py-4 rounded transition-all",
                  colorClasses(t.color, active),
                ].join(" ")}
              >
                <p className="display text-4xl leading-none">{t.count}</p>
                <p className="mono text-[9px] tracking-widest uppercase mt-2 opacity-80">
                  {t.label}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ============================================================ */}
      {/* Generation breakdown — donut + legend                          */}
      {/* ============================================================ */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-10 pb-6">
        <p className="ornament mb-4">By Generation</p>
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Donut SVG */}
          <svg
            viewBox="0 0 160 160"
            className="w-44 h-44 shrink-0 -rotate-90"
            aria-label="Generation breakdown donut chart"
          >
            <circle
              cx="80" cy="80" r="60"
              fill="none"
              stroke="rgba(13,26,16,0.08)"
              strokeWidth="20"
            />
            {donutData.map((seg) => (
              <circle
                key={String(seg.key)}
                cx="80" cy="80" r="60"
                fill="none"
                stroke={seg.color}
                strokeWidth="20"
                strokeDasharray={`${seg.dash} ${seg.gap}`}
                strokeDashoffset={-seg.offset}
                className="cursor-pointer transition-opacity hover:opacity-80"
                onClick={() => {
                  setGenFilters((prev) => {
                    const next = new Set(prev);
                    if (next.has(seg.key)) next.delete(seg.key);
                    else next.add(seg.key);
                    return next;
                  });
                }}
              />
            ))}
          </svg>

          {/* Bar chart + legend */}
          <div className="flex-1 w-full space-y-2">
            {genBreakdown.map((seg) => {
              const pct = genTotal > 0 ? (seg.count / genTotal) * 100 : 0;
              const active = genFilters.has(seg.key);
              return (
                <button
                  key={String(seg.key)}
                  type="button"
                  onClick={() => toggleGen(seg.key)}
                  aria-pressed={active}
                  className={[
                    "w-full flex items-center gap-3 px-3 py-2 rounded transition-colors text-left",
                    active ? "bg-sand_2/80" : "hover:bg-sand_2/40",
                  ].join(" ")}
                >
                  <span
                    className="inline-block w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: seg.color }}
                  />
                  <span className="mono text-[10px] tracking-widest uppercase text-bark_2 w-40 shrink-0">
                    {seg.label}
                  </span>
                  <span className="relative flex-1 h-3 bg-sand_3/40 rounded-sm overflow-hidden">
                    <span
                      className="absolute inset-y-0 left-0"
                      style={{ width: `${pct}%`, backgroundColor: seg.color, opacity: 0.85 }}
                    />
                  </span>
                  <span className="serif text-bark font-bold w-10 text-right">{seg.count}</span>
                  <span className="mono text-[10px] text-cocoa w-12 text-right">
                    {Math.round(pct)}%
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <hr className="hr-rule max-w-6xl mx-auto" />

      {/* ============================================================ */}
      {/* Era / generation chip filters + sort                           */}
      {/* ============================================================ */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pb-4 pt-6">
        <div className="flex flex-col gap-4">
          <div>
            <p className="ornament mb-2">Filter by Era</p>
            <div className="flex flex-wrap gap-2">
              {ERAS.map((e) => {
                const active = eraFilters.has(e.key);
                return (
                  <button
                    key={e.key}
                    type="button"
                    onClick={() => toggleEra(e.key)}
                    aria-pressed={active}
                    className={[
                      "mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded border transition-colors",
                      active
                        ? "bg-ember text-sand border-ember"
                        : "bg-sand_2/40 text-bark_2 border-bark/20 hover:border-ember/60 hover:text-ember",
                    ].join(" ")}
                  >
                    {e.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="ornament mb-2">Filter by Generation</p>
            <div className="flex flex-wrap gap-2">
              {GENS.map((g) => {
                const active = genFilters.has(g.key);
                return (
                  <button
                    key={String(g.key)}
                    type="button"
                    onClick={() => toggleGen(g.key)}
                    aria-pressed={active}
                    className={[
                      "mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded border transition-colors flex items-center gap-2",
                      active
                        ? "bg-bark text-sand border-bark"
                        : "bg-sand_2/40 text-bark_2 border-bark/20 hover:border-bark/60 hover:text-bark",
                    ].join(" ")}
                  >
                    <span className={`inline-block w-2 h-2 rounded-full ${genDotColor(g.key)}`} />
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={cycleSort}
              className="mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded border border-bark/30 bg-sand_2/40 text-bark hover:border-ember/60 hover:text-ember transition-colors"
            >
              Sort: {sortLabel}
            </button>
            {hasFilter && (
              <button
                type="button"
                onClick={clearAll}
                className="mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded border border-ember/60 text-ember hover:bg-ember hover:text-sand transition-colors"
              >
                Clear all filters
              </button>
            )}
            <span className="mono text-[10px] tracking-widest uppercase text-cocoa ml-auto">
              {filtered.length} of {albums.length} {filtered.length === 1 ? "album" : "albums"}
            </span>
          </div>
        </div>
      </section>

      <hr className="hr-rule max-w-6xl mx-auto" />

      {/* Visual grid */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pb-14 pt-6">
        {filtered.length === 0 ? (
          <p className="serif italic text-cocoa text-center py-12">
            No records match those filters.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-8">
            {filtered.map((a) => (
              <article key={a.slug} className="group flex flex-col">
                <Link
                  href={`/discography/${a.slug}/`}
                  className={[
                    "block border-2 overflow-hidden transition-all",
                    genBorder(a.family_generation),
                    "hover:shadow-lg",
                  ].join(" ")}
                  aria-label={`Open details for ${a.title}`}
                >
                  <AlbumCover album={a} size="card" showSpotifyButton />
                </Link>

                <div className="mt-3">
                  <Link
                    href={`/discography/${a.slug}/`}
                    className="block group-hover:text-ember transition-colors"
                  >
                    <h3 className="serif text-bark text-base leading-tight">
                      {a.title}
                    </h3>
                  </Link>
                  <p className="mono text-[9px] tracking-widest uppercase text-cocoa mt-1 truncate">
                    {a.artistDisplay}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-bark/15 bg-sand_2/40 mt-6">
        <div className="tricolor-bar-thin"/>
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
