import Link from "next/link";
import TopNav from "@/components/TopNav";
import { people, type Person } from "@/lib/people";
import { albumsByArtist } from "@/lib/albums";

function birthYear(p: Person): number {
  if (!p.born) return 9999;
  const m = p.born.match(/^(\d{4})/);
  return m ? parseInt(m[1], 10) : 9999;
}

function shortBio(bio: string): string {
  // 2-line truncation — clamp to a reasonable character count
  if (bio.length <= 180) return bio;
  return bio.slice(0, 180).replace(/\s+\S*$/, "") + "…";
}

function PersonCard({ p }: { p: Person }) {
  const albumCount = albumsByArtist(p.slug).length;
  const yearRange =
    p.born || p.died
      ? `${p.born ? p.born.slice(0, 4) : "?"}${p.died ? `–${p.died.slice(0, 4)}` : ""}`
      : null;

  return (
    <Link
      href={`/family/${p.slug}/`}
      className="block border border-bark/15 bg-sand_2/40 p-4 hover:border-ember/60 hover:bg-sand_2/70 transition-colors rounded"
    >
      <h3 className="serif text-bark text-xl font-bold leading-tight">
        {p.name}
      </h3>
      {p.aka && p.aka.length > 0 && (
        <p className="mono text-[10px] tracking-widest text-cocoa uppercase mt-1">
          aka {p.aka.join(" · ")}
        </p>
      )}
      <div className="mono text-[10px] tracking-widest text-cocoa uppercase mt-2 flex flex-wrap gap-x-3">
        {yearRange && <span>{yearRange}</span>}
        {albumCount > 0 && (
          <span className="text-ember">
            {albumCount} {albumCount === 1 ? "album" : "albums"}
          </span>
        )}
      </div>
      <p className="serif italic text-cocoa text-sm mt-2 leading-snug">
        {p.role}
      </p>
      <p className="text-bark_2 text-sm mt-2 leading-relaxed">
        {shortBio(p.bio)}
      </p>
    </Link>
  );
}

function Section({
  ornamentLabel,
  title,
  people: list,
}: {
  ornamentLabel: string;
  title: string;
  people: Person[];
}) {
  if (list.length === 0) return null;
  return (
    <section className="pb-10">
      <p className="ornament mb-3">{ornamentLabel}</p>
      <h2 className="display text-bark text-3xl tracking-tight mb-6">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((p) => (
          <PersonCard key={p.slug} p={p} />
        ))}
      </div>
    </section>
  );
}

export default function FamilyPage() {
  const bob = people.filter((p) => p.tags?.includes("founder"));
  const parents = people.filter((p) => p.tags?.includes("ancestor"));

  const partners = people.filter((p) => p.tags?.includes("partner"));
  const originalTrio = people.filter((p) => p.tags?.includes("original-trio"));
  const bobGen = [...partners, ...originalTrio].filter(
    (p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i,
  );

  const secondGen = people
    .filter((p) => p.tags?.includes("second-generation"))
    .sort((a, b) => birthYear(a) - birthYear(b));

  const thirdGen = people
    .filter((p) => p.tags?.includes("third-generation"))
    .sort((a, b) => birthYear(a) - birthYear(b));

  const extended = people.filter((p) => p.tags?.includes("extended-family"));

  return (
    <>
      <TopNav />

      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-8 pb-6">
        <p className="ornament mb-3">Three Generations</p>
        <h1 className="display text-bark text-5xl sm:text-6xl tracking-tight leading-none">
          The Marley Family
        </h1>
        <p className="serif text-cocoa text-base mt-4 max-w-3xl leading-relaxed">
          Bob, Rita, Cindy, twelve children, the grandchildren still making
          records, the Wailers who walked beside him, and the producers who
          built the rooms. Every person in the universe, linked by blood,
          marriage, or the studio.
        </p>
      </section>

      <div className="tricolor-bar-thin max-w-6xl mx-auto"/>

      <div className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-6">
        <Section ornamentLabel="Center" title="Bob" people={bob} />
        <Section
          ornamentLabel="Ancestors"
          title="Bob's Parents"
          people={parents}
        />
        <Section
          ornamentLabel="First Generation"
          title="Bob's Generation"
          people={bobGen}
        />
        <Section
          ornamentLabel="The Children"
          title="Second Generation"
          people={secondGen}
        />
        <Section
          ornamentLabel="The Grandchildren"
          title="Third Generation"
          people={thirdGen}
        />
        <Section
          ornamentLabel="Inner Circle"
          title="Extended Family"
          people={extended}
        />
      </div>

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
