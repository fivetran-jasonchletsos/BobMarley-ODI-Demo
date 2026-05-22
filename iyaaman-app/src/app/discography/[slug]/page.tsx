import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TopNav from "@/components/TopNav";
import AlbumCover, { spotifySearchUrl } from "@/components/AlbumCover";
import { albums, albumBySlug, albumsByArtist, type Album } from "@/lib/albums";
import { personBySlug, type Person } from "@/lib/people";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return albums.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const a = albumBySlug(params.slug);
  if (!a) return { title: "Album not found · Tuff Gong" };
  return {
    title: `${a.title} (${a.year}) · ${a.artistDisplay} · Tuff Gong`,
    description: a.blurb,
  };
}

function genAccent(gen: Album["family_generation"]): string {
  switch (gen) {
    case 1:        return "text-ember";
    case 2:        return "text-gold";
    case 3:        return "text-leaf";
    case "wailer": return "text-bark";
  }
}

function genLabel(gen: Album["family_generation"]): string {
  switch (gen) {
    case 1:        return "Generation 1";
    case 2:        return "Generation 2";
    case 3:        return "Generation 3";
    case "wailer": return "Wailer-Era";
  }
}

function formatLifespan(p: Person): string | null {
  if (!p.born && !p.died) return null;
  const b = p.born ? p.born.slice(0, 4) : "?";
  const d = p.died ? p.died.slice(0, 4) : "";
  return d ? `${b}–${d}` : `b. ${b}`;
}

export default function AlbumPage({ params }: { params: Params }) {
  const album = albumBySlug(params.slug);
  if (!album) notFound();

  const artists = album.artistSlugs
    .map((s) => personBySlug(s))
    .filter((p): p is Person => Boolean(p));

  const primaryArtistSlug = album.artistSlugs[0];
  const otherAlbums = primaryArtistSlug
    ? albumsByArtist(primaryArtistSlug)
        .filter((a) => a.slug !== album.slug)
        .sort((a, b) => b.year - a.year)
        .slice(0, 6)
    : [];

  return (
    <>
      <TopNav />

      {/* Breadcrumb */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-6">
        <nav className="mono text-[10px] tracking-widest uppercase text-cocoa">
          <Link href="/" className="hover:text-ember transition-colors">Home</Link>
          <span className="mx-2 text-bark/40">/</span>
          <Link href="/discography/" className="hover:text-ember transition-colors">Discography</Link>
          <span className="mx-2 text-bark/40">/</span>
          <span className="text-bark">{album.title}</span>
        </nav>
      </section>

      {/* Title block */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-8 pb-6">
        <p className={`ornament mb-3 ${genAccent(album.family_generation)}`}>
          {genLabel(album.family_generation)}
          {album.era ? ` · ${album.era.replace("-", " ")}` : ""}
        </p>
        <h1 className="display text-bark text-6xl sm:text-7xl md:text-8xl tracking-tight leading-[0.92]">
          {album.title}
        </h1>
        <p className="serif text-2xl text-bark_2 mt-4 italic">
          {album.artistDisplay}
        </p>

        {/* Meta row */}
        <div className="mono text-[10px] tracking-widest uppercase text-cocoa mt-6 flex flex-wrap gap-x-6 gap-y-2">
          <span>
            <span className="text-bark/50">Year</span>{" "}
            <span className="text-bark ml-1">{album.year}</span>
          </span>
          {album.label && (
            <span>
              <span className="text-bark/50">Label</span>{" "}
              <span className="text-bark ml-1">{album.label}</span>
            </span>
          )}
          {album.studio && (
            <span>
              <span className="text-bark/50">Studio</span>{" "}
              <span className="text-bark ml-1">{album.studio}</span>
            </span>
          )}
          {album.producer && album.producer.length > 0 && (
            <span>
              <span className="text-bark/50">Producer</span>{" "}
              <span className="text-bark ml-1">{album.producer.join(", ")}</span>
            </span>
          )}
        </div>
      </section>

      <hr className="hr-rule max-w-6xl mx-auto" />

      {/* Editorial blurb */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto py-6">
        <div className="max-w-3xl">
          <p className="serif italic text-bark text-xl leading-relaxed drop-cap">
            {album.blurb}
          </p>
        </div>
      </section>

      {/* Highlights */}
      {album.highlights && album.highlights.length > 0 && (
        <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pb-8">
          <p className="ornament mb-3">Highlights</p>
          <h2 className="display text-bark text-3xl tracking-tight mb-4">
            Key tracks
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
            {album.highlights.map((h) => (
              <li key={h} className="serif text-bark text-lg flex items-baseline gap-2">
                <span className="mono text-[10px] text-ember/70">◆</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Awards */}
      {album.awards && album.awards.length > 0 && (
        <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pb-8">
          <p className="ornament mb-3">Awards</p>
          <h2 className="display text-bark text-3xl tracking-tight mb-4">
            Recognition
          </h2>
          <ul className="flex flex-wrap gap-3">
            {album.awards.map((a) => (
              <li key={a}>
                <span className="serif text-bark text-base mark-gold">{a}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <hr className="hr-rule max-w-6xl mx-auto" />

      {/* Artists */}
      {artists.length > 0 && (
        <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto py-8">
          <p className="ornament mb-3">Credits</p>
          <h2 className="display text-bark text-3xl tracking-tight mb-5">
            {artists.length === 1 ? "Artist" : "Artists"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {artists.map((p) => {
              const span = formatLifespan(p);
              return (
                <Link
                  key={p.slug}
                  href={`/family/${p.slug}/`}
                  className="block border border-bark/15 bg-sand_2/40 p-4 hover:border-ember/60 hover:bg-sand_2/70 transition-colors rounded"
                >
                  <p className="mono text-[10px] tracking-widest uppercase text-cocoa">
                    {span ?? "—"}
                  </p>
                  <h3 className="serif text-bark text-xl font-bold mt-1 leading-tight">
                    {p.name}
                  </h3>
                  <p className="text-bark_2 text-sm mt-2 leading-relaxed">
                    {p.role}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Other albums by primary artist */}
      {otherAlbums.length > 0 && (
        <>
          <hr className="hr-rule max-w-6xl mx-auto" />
          <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto py-8">
            <p className="ornament mb-3">More from this artist</p>
            <h2 className="display text-bark text-3xl tracking-tight mb-5">
              Other albums by{" "}
              {personBySlug(primaryArtistSlug)?.name ?? album.artistDisplay}
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              {otherAlbums.map((a) => (
                <li key={a.slug} className="flex items-baseline gap-3 border-b border-bark/10 py-2">
                  <span className="mono text-[10px] tracking-widest text-cocoa w-12 shrink-0">
                    {a.year}
                  </span>
                  <Link
                    href={`/discography/${a.slug}/`}
                    className="serif text-bark text-lg link-inline border-b-0 hover:text-ember"
                  >
                    {a.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <footer className="border-t border-bark/15 bg-sand_2/40 mt-6">
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
