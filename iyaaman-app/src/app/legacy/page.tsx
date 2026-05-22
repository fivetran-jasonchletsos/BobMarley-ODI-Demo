import Link from "next/link";
import TopNav from "@/components/TopNav";
import { people, type Person } from "@/lib/people";
import { albums } from "@/lib/albums";

function albumCountFor(person: Person): number {
  if (!person.albums) return 0;
  const known = new Set(albums.map((a) => a.slug));
  const matched = person.albums.filter((slug) => known.has(slug)).length;
  return matched || person.albums.length;
}

function breakthroughLine(slug: string, fallback: string): string {
  switch (slug) {
    case "ziggy-marley":
      return "Conscious Party (1988) broke through. Eight Grammys with the Melody Makers and solo.";
    case "stephen-marley":
      return "Eight Grammys. Producer of Damian and Ky-Mani.";
    case "damian-marley":
      return "Welcome to Jamrock (2005) won two Grammys. Distant Relatives with Nas (2010).";
    case "julian-marley":
      return "Colors of Royal won Best Reggae Album at the 2024 Grammys.";
    case "kymani-marley":
      return "Maestro (2015). Best Reggae Album Grammy nomination.";
    case "sharon-marley":
      return "Three Grammys with the Melody Makers. Runs the Bob Marley Museum.";
    case "cedella-marley":
      return "Melody Makers Grammys. CEO of Tuff Gong International.";
    case "skip-marley":
      return "'Slow Down' featuring H.E.R. earned a 2019 Grammy nomination.";
    case "jomersa-marley":
      return "Comfortable (2021) debut — the producer's instinct intact.";
    case "yohan-marley":
      return "Solo singles since 2020. Lauryn Hill and Rohan Marley's son.";
    case "donisha-marley":
      return "Director of RasTa: A Soul's Journey (2011).";
    default:
      return fallback;
  }
}

export default function LegacyPage() {
  const secondGen: Person[] = people.filter((p) =>
    p.tags?.includes("second-generation"),
  );
  const thirdGen: Person[] = people.filter((p) =>
    p.tags?.includes("third-generation"),
  );

  return (
    <>
      <TopNav />

      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-10 pb-6">
        <p className="ornament mb-3">The dynasty still making records</p>
        <h1 className="display text-bark text-5xl sm:text-6xl tracking-tight leading-none">
          Legacy
        </h1>
        <p className="serif text-bark_2 text-lg mt-4 max-w-2xl leading-relaxed">
          Bob fathered eleven publicly-acknowledged children. Seven of them — and
          now their children — have made music. Eight Grammys for Ziggy, eight
          for Stephen, five for Damian, one for Julian, three with the Melody
          Makers. The work has not stopped.
        </p>
      </section>

      <div className="tricolor-bar-thin max-w-6xl mx-auto"/>

      <Generation
        ornament="The first inheritors"
        title="Second Generation — Bob's children"
        people={secondGen}
        accent="border-jam_gold/55 hover:border-jam_gold"
        dot="bg-jam_gold"
      />

      <hr className="hr-rule max-w-6xl mx-auto" />

      <Generation
        ornament="The dynasty extends"
        title="Third Generation — the grandchildren"
        people={thirdGen}
        accent="border-jam_green/55 hover:border-jam_green"
        dot="bg-jam_green"
      />

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

function Generation({
  ornament,
  title,
  people: list,
  accent,
  dot,
}: {
  ornament: string;
  title: string;
  people: Person[];
  accent: string;
  dot: string;
}) {
  return (
    <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pb-10 pt-2">
      <p className="ornament mb-3">{ornament}</p>
      <h2 className="display text-bark text-3xl tracking-tight mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((p) => {
          const count = albumCountFor(p);
          const hasAlbums = count > 0;
          return (
            <article
              key={p.slug}
              className={[
                "block border bg-sand_2/40 p-4 rounded transition-colors",
                accent,
              ].join(" ")}
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="mono text-[10px] tracking-widest uppercase text-cocoa">
                  {p.born?.slice(0, 4) ?? ""}
                </p>
                <span className={`inline-block w-2 h-2 rounded-full ${dot}`} />
              </div>
              <h3 className="display text-bark text-2xl tracking-tight mt-1 leading-tight">
                {p.aka?.[0] ?? p.name}
              </h3>
              <p className="serif italic text-bark_2 text-sm mt-1">{p.role}</p>
              <p className="text-bark_2 text-sm mt-3 leading-relaxed">
                {breakthroughLine(p.slug, p.bio)}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3 pt-3 border-t border-bark/10">
                <Link
                  href={`/family/${p.slug}/`}
                  className="mono text-[10px] tracking-widest uppercase text-ember hover:opacity-70"
                >
                  Family profile
                </Link>
                {hasAlbums && (
                  <Link
                    href={`/discography/?artist=${p.slug}`}
                    className="mono text-[10px] tracking-widest uppercase text-gold hover:opacity-70"
                  >
                    {count} {count === 1 ? "album" : "albums"}
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
