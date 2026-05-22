"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import TopNav from "@/components/TopNav";
import AlbumCover from "@/components/AlbumCover";
import { albums, albumsByArtist } from "@/lib/albums";
import { people } from "@/lib/people";

// ---------------------------------------------------------------------------
// Who's on what — clickable person list (left) reveals every album they
// played on (right) plus the related people they collaborated with on those
// albums. Default selection is Bob.
// ---------------------------------------------------------------------------

export default function RelatedPage() {
  // Only show people with at least one credited album.
  const musicians = useMemo(() => {
    return people
      .filter((p) => (p.albums && p.albums.length > 0) || albumsByArtist(p.slug).length > 0)
      .sort((a, b) => {
        const ac = albumsByArtist(a.slug).length;
        const bc = albumsByArtist(b.slug).length;
        if (bc !== ac) return bc - ac;
        return a.name.localeCompare(b.name);
      });
  }, []);

  const [selectedSlug, setSelectedSlug] = useState<string>("bob-marley");

  const selected = useMemo(
    () => people.find((p) => p.slug === selectedSlug) ?? people.find((p) => p.slug === "bob-marley")!,
    [selectedSlug],
  );

  const selectedAlbums = useMemo(() => {
    return albumsByArtist(selected.slug).sort((a, b) => a.year - b.year);
  }, [selected]);

  // Build "related people" — every artistSlug that appears on the selected
  // person's albums, minus the selected person themselves. Carry a count of
  // how many albums they share so we can rank them.
  const relatedPeople = useMemo(() => {
    const counts = new Map<string, number>();
    for (const a of selectedAlbums) {
      for (const slug of a.artistSlugs) {
        if (slug === selected.slug) continue;
        counts.set(slug, (counts.get(slug) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .map(([slug, count]) => {
        const person = people.find((p) => p.slug === slug);
        return person ? { person, count } : null;
      })
      .filter((x): x is { person: typeof people[number]; count: number } => x !== null)
      .sort((a, b) => b.count - a.count || a.person.name.localeCompare(b.person.name));
  }, [selectedAlbums, selected]);

  return (
    <>
      <TopNav />

      {/* Editorial header */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-10 pb-6">
        <p className="ornament mb-3">Who&apos;s on What</p>
        <h1 className="display text-bark text-5xl sm:text-6xl md:text-7xl tracking-tight leading-none">
          Related
        </h1>
        <p className="serif italic text-bark_2 text-lg sm:text-xl mt-5 max-w-3xl leading-relaxed">
          The family at work. Click any musician on the left to see every album
          they appear on, and every other family member or bandmate who played
          on those records.
        </p>
      </section>

      <div className="tricolor-bar-thin max-w-6xl mx-auto" />

      {/* Two-column layout */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-8 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          {/* ---------- Left column: musician list ---------- */}
          <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
            <p className="ornament mb-3">Musicians</p>
            <ul className="space-y-1">
              {musicians.map((p) => {
                const count = albumsByArtist(p.slug).length;
                const active = selected.slug === p.slug;
                return (
                  <li key={p.slug}>
                    <button
                      type="button"
                      onClick={() => setSelectedSlug(p.slug)}
                      aria-pressed={active}
                      className={[
                        "w-full text-left px-3 py-2 rounded border transition-colors flex items-baseline justify-between gap-3",
                        active
                          ? "border-ember bg-ember/10 text-ember"
                          : "border-bark/15 bg-sand_2/30 text-bark_2 hover:border-ember/40 hover:bg-sand_2/60",
                      ].join(" ")}
                    >
                      <span className="serif text-sm leading-tight truncate">
                        {p.name}
                      </span>
                      <span className="mono text-[9px] tracking-widest text-cocoa shrink-0">
                        {count}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* ---------- Right column: detail ---------- */}
          <div>
            {/* Person header */}
            <div className="border-b border-bark/15 pb-5 mb-6">
              <p className="ornament mb-2">{selected.role}</p>
              <h2 className="display text-bark text-4xl sm:text-5xl tracking-tight leading-none">
                {selected.name}
              </h2>
              {selected.bio && (
                <p className="serif text-bark_2 mt-4 leading-relaxed max-w-3xl">
                  {selected.bio}
                </p>
              )}
              <p className="mono text-[10px] tracking-widest uppercase text-cocoa mt-3">
                {selectedAlbums.length} {selectedAlbums.length === 1 ? "album" : "albums"} credited
              </p>
            </div>

            {/* Album grid */}
            {selectedAlbums.length === 0 ? (
              <p className="serif italic text-cocoa text-center py-12">
                No albums credited to this person.
              </p>
            ) : (
              <>
                <p className="ornament mb-4">Albums</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-7">
                  {selectedAlbums.map((a) => (
                    <article key={a.slug} className="group flex flex-col">
                      <Link
                        href={`/discography/${a.slug}/`}
                        className="block border-2 border-bark/20 hover:border-ember/70 overflow-hidden transition-all hover:shadow-lg"
                        aria-label={`Open details for ${a.title}`}
                      >
                        <AlbumCover album={a} size="card" showSpotifyButton />
                      </Link>
                      <div className="mt-2.5">
                        <Link
                          href={`/discography/${a.slug}/`}
                          className="block group-hover:text-ember transition-colors"
                        >
                          <h3 className="serif text-bark text-sm leading-tight">
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
              </>
            )}

            {/* Related people */}
            {relatedPeople.length > 0 && (
              <div className="mt-12 border-t border-bark/15 pt-6">
                <p className="ornament mb-4">Who they played with</p>
                <div className="flex flex-wrap gap-2">
                  {relatedPeople.map(({ person: rp, count }) => (
                    <button
                      key={rp.slug}
                      type="button"
                      onClick={() => setSelectedSlug(rp.slug)}
                      className="group inline-flex items-baseline gap-2 px-3 py-1.5 border border-bark/20 bg-sand_2/40 hover:border-ember hover:bg-ember/10 rounded transition-colors"
                    >
                      <span className="serif text-sm text-bark group-hover:text-ember">
                        {rp.name}
                      </span>
                      <span className="mono text-[9px] tracking-widest uppercase text-cocoa">
                        {count} {count === 1 ? "album" : "albums"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
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
