import TopNav from "@/components/TopNav";
import { studios, type Studio } from "@/lib/studios";

function startYear(years: string): number {
  const m = years.match(/(\d{4})/);
  return m ? parseInt(m[1], 10) : 9999;
}

function eraBorder(slug: string): string {
  if (slug === "studio-one" || slug === "harry-j" || slug === "wirl-studio") {
    return "border-gold/55 hover:border-gold";
  }
  if (slug === "black-ark") {
    return "border-leaf/55 hover:border-leaf";
  }
  return "border-ember/45 hover:border-ember";
}

function eraDot(slug: string): string {
  if (slug === "studio-one" || slug === "harry-j" || slug === "wirl-studio") return "bg-gold";
  if (slug === "black-ark") return "bg-leaf";
  return "bg-ember";
}

export default function StudiosPage() {
  const ordered: Studio[] = [...studios].sort(
    (a, b) => startYear(a.years) - startYear(b.years),
  );

  return (
    <>
      <TopNav />

      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-10 pb-6">
        <p className="ornament mb-3">Where the records were made</p>
        <h1 className="display text-bark text-5xl sm:text-6xl tracking-tight leading-none">
          Studios
        </h1>
        <p className="serif text-bark_2 text-lg mt-4 max-w-2xl leading-relaxed">
          Studio One, Black Ark, Harry J, Island, Tuff Gong, Criteria, Compass
          Point. The rooms where the songs were tracked, in the order Bob walked
          into them.
        </p>
      </section>

      <div className="tricolor-bar-thin max-w-6xl mx-auto"/>

      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ordered.map((s) => (
            <article
              key={s.slug}
              className={[
                "block border bg-sand_2/40 p-4 rounded transition-colors",
                eraBorder(s.slug),
              ].join(" ")}
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="mono text-[10px] tracking-widest uppercase text-cocoa">
                  {s.years}
                </p>
                <span className={`inline-block w-2 h-2 rounded-full ${eraDot(s.slug)}`} />
              </div>
              <h3 className="display text-bark text-2xl tracking-tight mt-1 leading-tight">
                {s.name}
              </h3>
              <p className="mono text-[10px] tracking-widest uppercase text-bark_2 mt-2">
                {s.location}
              </p>
              {s.producer && (
                <p className="serif italic text-cocoa text-sm mt-2">
                  Producer: {s.producer}
                </p>
              )}
              <p className="text-bark_2 text-sm mt-3 leading-relaxed">
                {s.blurb}
              </p>
              {s.albums_recorded && s.albums_recorded.length > 0 && (
                <p className="mono text-[10px] tracking-widest uppercase text-gold mt-3">
                  {s.albums_recorded.length}{" "}
                  {s.albums_recorded.length === 1 ? "album" : "albums"} tracked
                </p>
              )}
            </article>
          ))}
        </div>
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
