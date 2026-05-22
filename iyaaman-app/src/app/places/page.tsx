import TopNav from "@/components/TopNav";
import { places, type Place, type PlaceKind } from "@/lib/places";

const KIND_ORDER: { key: PlaceKind; label: string }[] = [
  { key: "birthplace",   label: "Birthplace" },
  { key: "neighborhood", label: "Neighborhood" },
  { key: "home",         label: "Homes & Retreats" },
  { key: "studio",       label: "Studio" },
  { key: "venue",        label: "Venues" },
  { key: "hospital",     label: "Hospital" },
  { key: "shrine",       label: "Shrine" },
];

function dotColor(kind: PlaceKind): string {
  switch (kind) {
    case "birthplace":   return "bg-gold";
    case "neighborhood": return "bg-cocoa";
    case "home":         return "bg-ember";
    case "studio":       return "bg-leaf";
    case "venue":        return "bg-bark";
    case "hospital":     return "bg-ash";
    case "shrine":       return "bg-gold";
  }
}

export default function PlacesPage() {
  return (
    <>
      <TopNav />

      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-10 pb-6">
        <p className="ornament mb-3">The geography of a life</p>
        <h1 className="display text-bark text-5xl sm:text-6xl tracking-tight leading-none">
          Places
        </h1>
        <p className="serif text-bark_2 text-lg mt-4 max-w-2xl leading-relaxed">
          Nine Mile to Trench Town to Hope Road to Miami. The villages,
          neighborhoods, homes, and rooms where the story actually happened.
        </p>
      </section>

      <div className="tricolor-bar-thin max-w-6xl mx-auto"/>

      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pb-14">
        {KIND_ORDER.map(({ key, label }) => {
          const group: Place[] = places.filter((p) => p.kind === key);
          if (group.length === 0) return null;
          return (
            <div key={key} className="mb-10 last:mb-0">
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-block w-2 h-2 rounded-full ${dotColor(key)}`} />
                <p className="ornament">{label}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.map((p) => (
                  <article
                    key={p.slug}
                    className="block border border-bark/15 bg-sand_2/40 p-4 rounded"
                  >
                    <h3 className="display text-bark text-2xl tracking-tight leading-tight">
                      {p.name}
                    </h3>
                    <p className="mono text-[10px] tracking-widest uppercase text-bark_2 mt-2">
                      {p.location}
                    </p>
                    <p className="text-bark_2 text-sm mt-3 leading-relaxed">
                      {p.blurb}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
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
