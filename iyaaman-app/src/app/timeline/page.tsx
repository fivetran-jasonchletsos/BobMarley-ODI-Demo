import TopNav from "@/components/TopNav";
import { timeline, type TimelineEvent, type TimelineKind } from "@/lib/timeline";

const DECADES: { start: number; label: string }[] = [
  { start: 1940, label: "1940s" },
  { start: 1950, label: "1950s" },
  { start: 1960, label: "1960s" },
  { start: 1970, label: "1970s" },
  { start: 1980, label: "1980s" },
];

function kindRule(kind: TimelineKind): string {
  switch (kind) {
    case "birth":     return "border-l-gold";
    case "family":    return "border-l-cocoa";
    case "music":     return "border-l-ember";
    case "event":     return "border-l-bark";
    case "spiritual": return "border-l-leaf";
    case "award":     return "border-l-gold";
    case "travel":    return "border-l-ash";
    case "end":       return "border-l-bark";
  }
}

function kindLabel(kind: TimelineKind): string {
  switch (kind) {
    case "birth":     return "Birth";
    case "family":    return "Family";
    case "music":     return "Music";
    case "event":     return "Event";
    case "spiritual": return "Spiritual";
    case "award":     return "Award";
    case "travel":    return "Travel";
    case "end":       return "End";
  }
}

function formatDate(date: string): string {
  // accept YYYY, YYYY-MM, YYYY-MM-DD
  const parts = date.split("-");
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) {
    const d = new Date(`${date}-01T00:00:00Z`);
    return d.toLocaleString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
  }
  const d = new Date(`${date}T00:00:00Z`);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export default function TimelinePage() {
  const sorted: TimelineEvent[] = [...timeline].sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  return (
    <>
      <TopNav />

      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-10 pb-6">
        <p className="ornament mb-3">1945 to 1981, beat by beat</p>
        <h1 className="display text-bark text-5xl sm:text-6xl tracking-tight leading-none">
          Timeline
        </h1>
        <p className="serif text-bark_2 text-lg mt-4 max-w-2xl leading-relaxed">
          Thirty-six years. The births, the sessions, the attempts, the exiles,
          the returns, the last show.
        </p>
      </section>

      <div className="tricolor-bar-thin max-w-6xl mx-auto"/>

      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pb-14">
        {DECADES.map(({ start, label }) => {
          const decadeEvents = sorted.filter(
            (e) => e.year >= start && e.year < start + 10,
          );
          if (decadeEvents.length === 0) return null;
          return (
            <div key={start} className="mb-12 last:mb-0">
              <div className="flex items-baseline gap-4 mb-6">
                <h2 className="display text-ember text-4xl sm:text-5xl tracking-tight leading-none">
                  {label}
                </h2>
                <span className="mono text-[10px] tracking-widest uppercase text-cocoa">
                  {decadeEvents.length} {decadeEvents.length === 1 ? "entry" : "entries"}
                </span>
              </div>

              <div className="space-y-5">
                {decadeEvents.map((e, i) => (
                  <article
                    key={`${e.date}-${i}`}
                    className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-3 sm:gap-6 items-start"
                  >
                    <div className="sm:text-right pt-1">
                      <p className="mono text-[11px] tracking-widest uppercase text-bark_2">
                        {formatDate(e.date)}
                      </p>
                      <p className="mono text-[9px] tracking-widest uppercase text-cocoa mt-1">
                        {kindLabel(e.kind)}
                      </p>
                    </div>
                    <div
                      className={[
                        "border-l-4 bg-sand_2/40 pl-4 pr-4 py-3 rounded-r",
                        kindRule(e.kind),
                      ].join(" ")}
                    >
                      <h3 className="display text-bark text-xl tracking-tight leading-tight">
                        {e.headline}
                      </h3>
                      <p className="serif text-bark_2 text-sm mt-2 leading-relaxed">
                        {e.body}
                      </p>
                    </div>
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
            Iyaaman · A demo built for Kamal Soliman · 2026
          </p>
        </div>
      </footer>
    </>
  );
}
