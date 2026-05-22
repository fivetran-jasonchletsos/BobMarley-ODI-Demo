"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import TopNav from "@/components/TopNav";
import { albums, type Album } from "@/lib/albums";

type EraKey = Album["era"];
type GenKey = Album["family_generation"];

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
    case 1:        return "border-jam_red/55 hover:border-jam_red";
    case 2:        return "border-jam_gold/55 hover:border-jam_gold";
    case 3:        return "border-jam_green/55 hover:border-jam_green";
    case "wailer": return "border-jam_black/45 hover:border-jam_black";
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

function truncate(s: string, n = 140): string {
  if (s.length <= n) return s;
  const cut = s.slice(0, n);
  const lastSpace = cut.lastIndexOf(" ");
  return cut.slice(0, lastSpace > 0 ? lastSpace : n).trimEnd() + "...";
}

export default function DiscographyPage() {
  const [eraFilters, setEraFilters] = useState<Set<NonNullable<EraKey>>>(new Set());
  const [genFilters, setGenFilters] = useState<Set<GenKey>>(new Set());
  const [sortDesc, setSortDesc] = useState(true);

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
    out.sort((a, b) => sortDesc ? b.year - a.year : a.year - b.year);
    return out;
  }, [eraFilters, genFilters, sortDesc]);

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

  const hasFilter = eraFilters.size > 0 || genFilters.size > 0;

  return (
    <>
      <TopNav />

      {/* Header */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-10 pb-6">
        <p className="ornament mb-3">Every Marley Record</p>
        <h1 className="display text-bark text-5xl sm:text-6xl tracking-tight leading-none">
          Discography
        </h1>
        <p className="serif text-bark_2 text-lg mt-4 max-w-2xl leading-relaxed">
          From <em>The Wailing Wailers</em> (1965) to <em>Old Soul</em> (2023). Bob,
          the Wailers, his children, and his grandchildren — every record the
          dynasty has made.
        </p>
      </section>

      <div className="tricolor-bar-thin max-w-6xl mx-auto"/>

      {/* Filters */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pb-4">
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
              onClick={() => setSortDesc((s) => !s)}
              className="mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded border border-bark/30 bg-sand_2/40 text-bark hover:border-ember/60 hover:text-ember transition-colors"
            >
              Year: {sortDesc ? "Newest first" : "Oldest first"}
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

      {/* Grid */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pb-14">
        {filtered.length === 0 ? (
          <p className="serif italic text-cocoa text-center py-12">
            No records match those filters.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((a) => (
              <Link
                key={a.slug}
                href={`/discography/${a.slug}/`}
                className={[
                  "block border bg-sand_2/40 hover:bg-sand_2/70 p-4 rounded transition-colors",
                  genBorder(a.family_generation),
                ].join(" ")}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="mono text-[10px] tracking-widest uppercase text-cocoa">
                    {a.year}
                  </p>
                  <span className={`inline-block w-2 h-2 rounded-full ${genDotColor(a.family_generation)}`} />
                </div>
                <h3 className="display text-bark text-2xl tracking-tight mt-1 leading-tight">
                  {a.title}
                </h3>
                <p className="serif italic text-bark_2 text-sm mt-1">
                  {a.artistDisplay}
                </p>
                <p className="text-bark_2 text-sm mt-3 leading-relaxed">
                  {truncate(a.blurb)}
                </p>
                {a.awards && a.awards.length > 0 && (
                  <p className="mono text-[10px] tracking-widest uppercase text-gold mt-3">
                    {a.awards.length} {a.awards.length === 1 ? "Award" : "Awards"}
                  </p>
                )}
              </Link>
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
            Iyaaman · A demo built for Kamal Soliman · 2026
          </p>
        </div>
      </footer>
    </>
  );
}
