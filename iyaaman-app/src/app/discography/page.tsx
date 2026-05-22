"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import TopNav from "@/components/TopNav";
import AlbumCover from "@/components/AlbumCover";
import { albums, type Album } from "@/lib/albums";

type EraKey = Album["era"];
type GenKey = Album["family_generation"];
type SortKey = "year-desc" | "year-asc" | "artist";

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

export default function DiscographyPage() {
  const [eraFilters, setEraFilters] = useState<Set<NonNullable<EraKey>>>(new Set());
  const [genFilters, setGenFilters] = useState<Set<GenKey>>(new Set());
  const [sort, setSort] = useState<SortKey>("year-asc");

  const filtered = useMemo(() => {
    const out = albums.filter((a) => {
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
      // artist
      const ac = a.artistDisplay.replace(/^The\s+/i, "");
      const bc = b.artistDisplay.replace(/^The\s+/i, "");
      const cmp = ac.localeCompare(bc);
      return cmp !== 0 ? cmp : a.year - b.year;
    });
    return out;
  }, [eraFilters, genFilters, sort]);

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

  function clearAll() {
    setEraFilters(new Set());
    setGenFilters(new Set());
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

  const hasFilter = eraFilters.size > 0 || genFilters.size > 0;

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
          grandchildren. The dynasty&apos;s full catalog, with cover art and a
          link to Spotify for every record.
        </p>
      </section>

      <div className="tricolor-bar-thin max-w-6xl mx-auto"/>

      {/* Filters */}
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
                className="mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded border border-bark/30 text-cocoa hover:text-ember hover:border-ember/60 transition-colors"
              >
                Clear filters
              </button>
            )}
            <span className="mono text-[10px] tracking-widest uppercase text-cocoa ml-auto">
              {filtered.length} {filtered.length === 1 ? "album" : "albums"}
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
