import Link from "next/link";
import TopNav from "@/components/TopNav";
import AlbumCover from "@/components/AlbumCover";
import { timeline, type TimelineEvent, type TimelineKind } from "@/lib/timeline";
import { albums, type Album } from "@/lib/albums";

// ─── decade buckets ──────────────────────────────────────────────────────────

const DECADES: { start: number; label: string; sub: string }[] = [
  { start: 1940, label: "1940s", sub: "Roots — Nine Mile" },
  { start: 1950, label: "1950s", sub: "Kingston, Trench Town" },
  { start: 1960, label: "1960s", sub: "Studio One, the trio" },
  { start: 1970, label: "1970s", sub: "Island, exile, peace" },
  { start: 1980, label: "1980s", sub: "Africa, last songs" },
];

// ─── interleaved event type ──────────────────────────────────────────────────
//
// We blend `TimelineEvent` records with Bob's album releases (auto-pulled from
// `albums.ts`). Album rows carry the album payload so we can render a small
// cover thumbnail next to the year.

type AlbumRow = {
  kind: "album";
  date: string;          // YYYY (we only know year for albums)
  year: number;
  headline: string;
  body: string;
  album: Album;
};

type EventRow = TimelineEvent & { kind: TimelineKind };

type Row = EventRow | AlbumRow;

function isAlbumRow(r: Row): r is AlbumRow {
  return (r as AlbumRow).kind === "album";
}

// ─── visual mapping per kind ─────────────────────────────────────────────────

function ruleClass(kind: TimelineKind | "album"): string {
  switch (kind) {
    case "birth":     return "border-l-jam_red border-l-[6px]";
    case "end":       return "border-l-jam_red border-l-[6px]";
    case "music":     return "border-l-jam_green border-l-4";
    case "album":     return "border-l-jam_green border-l-4";
    case "award":     return "border-l-jam_gold border-l-4";
    case "family":    return "border-l-ember border-l-4";
    case "spiritual": return "border-l-leaf border-l-4";
    case "event":     return "border-l-bark border-l-4";
    case "travel":    return "border-l-bark border-l-4";
  }
}

function kindLabel(kind: TimelineKind | "album"): string {
  switch (kind) {
    case "birth":     return "Birth";
    case "end":       return "Death";
    case "music":     return "Music";
    case "album":     return "Album";
    case "award":     return "Award";
    case "family":    return "Family";
    case "spiritual": return "Spiritual";
    case "event":     return "Event";
    case "travel":    return "Travel";
  }
}

function badgeTone(kind: TimelineKind | "album"): string {
  switch (kind) {
    case "birth":
    case "end":       return "bg-jam_red/15 text-ember border-jam_red/30";
    case "music":
    case "album":     return "bg-jam_green/15 text-leaf border-jam_green/30";
    case "award":     return "bg-jam_gold/20 text-bark border-jam_gold/40";
    case "family":    return "bg-ember/10 text-ember border-ember/25";
    case "spiritual": return "bg-leaf/10 text-leaf border-leaf/30";
    case "event":     return "bg-bark/10 text-bark border-bark/20";
    case "travel":    return "bg-bark/5 text-cocoa border-bark/15";
  }
}

// ─── build interleaved rows ──────────────────────────────────────────────────

function buildRows(): Row[] {
  const events: EventRow[] = timeline.map((e) => ({ ...e }));

  // Auto-pull every album where Bob is one of the artists, released in his
  // lifetime (1945-1981) — Confrontation and Legend are posthumous so we
  // include them too if you want; tightened here to <= 1981 to match a "life"
  // timeline. Posthumous releases live on /discography.
  const bobAlbums: AlbumRow[] = albums
    .filter((a) => a.artistSlugs.includes("bob-marley") && a.year <= 1981)
    .map((a) => ({
      kind: "album" as const,
      date: String(a.year),
      year: a.year,
      headline: a.title,
      body: shortenAlbumBlurb(a),
      album: a,
    }));

  // Merge by date; events with full dates (YYYY-MM-DD) sort within a year
  // ahead of album-year rows ("YYYY") because the string comparator places
  // longer dated strings before bare years lexically only by chance — we use
  // a custom compare to guarantee ordering.
  const all: Row[] = [...events, ...bobAlbums];
  all.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    // within same year — events with month/day come first if earlier; albums
    // get a synthetic mid-year position so they appear amid the events.
    const ad = a.date.length >= 7 ? a.date : `${a.date}-06-15`;
    const bd = b.date.length >= 7 ? b.date : `${b.date}-06-15`;
    return ad.localeCompare(bd);
  });
  return all;
}

function shortenAlbumBlurb(a: Album): string {
  // Pull a short, single-sentence summary out of the album's longer blurb.
  // We grab the first sentence, cap at ~90 chars, and drop trailing scraps.
  const first = a.blurb.split(/(?<=[.!?])\s+/)[0] ?? a.blurb;
  if (first.length <= 95) return first;
  return first.slice(0, 92).replace(/[,;:\s]+\S*$/, "") + "…";
}

// ─── date formatting ─────────────────────────────────────────────────────────

function formatYearChip(date: string, year: number): string {
  // The big year is always the year; small text under it can show month/day.
  return String(year);
}

function formatSubDate(date: string): string | null {
  const parts = date.split("-");
  if (parts.length === 1) return null;
  if (parts.length === 2) {
    const d = new Date(`${date}-01T00:00:00Z`);
    return d.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  }
  const d = new Date(`${date}T00:00:00Z`);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

// ─── components ──────────────────────────────────────────────────────────────

function DecadeMarker({
  label,
  sub,
  count,
}: {
  label: string;
  sub: string;
  count: number;
}) {
  return (
    <div className="pt-8 pb-4">
      <div className="tricolor-bar mb-4" />
      <div className="flex items-baseline gap-5 flex-wrap">
        <h2 className="display text-bark text-6xl sm:text-7xl md:text-8xl leading-none tracking-tight">
          {label}
        </h2>
        <div className="flex flex-col gap-1">
          <span className="mono text-[10px] tracking-[0.3em] uppercase text-ember">
            {count} {count === 1 ? "moment" : "moments"}
          </span>
          <span className="mono text-[10px] tracking-[0.22em] uppercase text-cocoa/70">
            {sub}
          </span>
        </div>
      </div>
    </div>
  );
}

function EventCard({ row }: { row: Row }) {
  const kind = isAlbumRow(row) ? "album" : row.kind;
  const subDate = formatSubDate(row.date);

  return (
    <article
      className="grid grid-cols-[64px_1fr] sm:grid-cols-[120px_1fr] gap-3 sm:gap-5 items-stretch"
    >
      {/* Year column */}
      <div className="flex flex-col items-start sm:items-end pt-2">
        <p className="mono text-jam_gold text-2xl sm:text-3xl font-bold tracking-tight leading-none">
          {formatYearChip(row.date, row.year)}
        </p>
        {subDate && (
          <p className="mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-cocoa/70 mt-1.5">
            {subDate}
          </p>
        )}
      </div>

      {/* Card */}
      <div
        className={[
          "bg-sand_2/50 rounded-r pl-4 pr-4 py-3 sm:py-4",
          "hover:bg-sand_2/80 transition-colors",
          ruleClass(kind),
        ].join(" ")}
      >
        <div className="flex items-start gap-3">
          {/* Album thumbnail if this is an album row */}
          {isAlbumRow(row) && (
            <Link
              href={`/discography/${row.album.slug}/`}
              className="hidden sm:block shrink-0 w-16 h-16 overflow-hidden border border-bark/20"
              aria-label={`Open ${row.album.title}`}
            >
              <AlbumCover
                album={{
                  slug: row.album.slug,
                  title: row.album.title,
                  artistDisplay: row.album.artistDisplay,
                  year: row.album.year,
                }}
                showYearBadge={false}
              />
            </Link>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <h3 className="display text-bark text-xl sm:text-2xl tracking-tight leading-tight">
                {row.headline}
              </h3>
              <span
                className={[
                  "shrink-0 mono text-[9px] tracking-[0.2em] uppercase border px-1.5 py-0.5 rounded-sm",
                  badgeTone(kind),
                ].join(" ")}
              >
                {kindLabel(kind)}
              </span>
            </div>
            <p className="serif italic text-bark_2 text-sm sm:text-[15px] mt-1.5 leading-snug">
              {row.body}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function TimelinePage() {
  const rows = buildRows();

  // Pre-bucket by decade so we can render decade markers as section heads.
  const byDecade = DECADES.map(({ start, label, sub }) => ({
    start,
    label,
    sub,
    rows: rows.filter((r) => r.year >= start && r.year < start + 10),
  })).filter((d) => d.rows.length > 0);

  const totalMoments = rows.length;
  const totalAlbums = rows.filter(isAlbumRow).length;
  const totalEvents = totalMoments - totalAlbums;

  return (
    <>
      <TopNav />

      {/* Hero */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-10 pb-6">
        <p className="ornament mb-3">A life, year by year</p>
        <h1 className="display text-bark text-5xl sm:text-7xl md:text-8xl tracking-tight leading-[0.95]">
          Bob&apos;s Life
          <span className="block text-ember">Year by Year</span>
        </h1>
        <p className="serif text-bark_2 text-base sm:text-lg mt-5 max-w-2xl leading-relaxed">
          Thirty-six years. {totalEvents} life moments and {totalAlbums} albums,
          laid out decade by decade. Scroll.
        </p>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
          {(
            [
              ["birth", "Birth / Death"],
              ["music", "Music"],
              ["album", "Album"],
              ["award", "Award"],
              ["family", "Family"],
              ["spiritual", "Spiritual"],
              ["event", "Event"],
              ["travel", "Travel"],
            ] as [TimelineKind | "album", string][]
          ).map(([k, label]) => (
            <span
              key={k}
              className={[
                "mono text-[9px] tracking-[0.2em] uppercase border px-1.5 py-0.5 rounded-sm",
                badgeTone(k),
              ].join(" ")}
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      <div className="tricolor-bar-thin max-w-6xl mx-auto" />

      {/* Decade buckets */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pb-14">
        {byDecade.map((d) => (
          <div key={d.start} className="mb-10 last:mb-0">
            <DecadeMarker label={d.label} sub={d.sub} count={d.rows.length} />
            <div className="space-y-3 sm:space-y-4 mt-3">
              {d.rows.map((r, i) => (
                <EventCard key={`${r.date}-${i}`} row={r} />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Footer */}
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
