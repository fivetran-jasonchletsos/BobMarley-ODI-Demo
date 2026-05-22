import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import TopNav from "@/components/TopNav";
import { people, personBySlug, type RelationKind, type Person } from "@/lib/people";
import { albumsByArtist } from "@/lib/albums";
import { portraitFor } from "@/lib/portraits";

export function generateStaticParams() {
  return people.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const p = personBySlug(params.slug);
  if (!p) return { title: "Not found · Tuff Gong" };
  return {
    title: `${p.name} · Tuff Gong`,
    description: p.bio.slice(0, 160),
  };
}

const RELATION_LABELS: Record<RelationKind, string> = {
  parent: "Parents",
  partner: "Partners",
  child: "Children",
  sibling: "Siblings",
  grandchild: "Grandparents",
  bandmate: "Bandmates",
  producer: "Producers",
  mentor: "Mentors",
  collaborator: "Collaborators",
};

const RELATION_ORDER: RelationKind[] = [
  "parent",
  "partner",
  "child",
  "sibling",
  "grandchild",
  "bandmate",
  "producer",
  "mentor",
  "collaborator",
];

// ---- Procedural avatar (server-rendered SVG, identical algorithm to PortraitCard)

function djb2(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

const PALETTES: [string, string][] = [
  ["#0d1a10", "#e6b800"],
  ["#0f7438", "#f4ecd6"],
  ["#c0382b", "#e6b800"],
  ["#1f2e22", "#1f9446"],
  ["#3d5430", "#f5d33a"],
  ["#0d1a10", "#c0382b"],
  ["#1f2e22", "#e6b800"],
  ["#0f7438", "#e6b800"],
];

const SHAPES = ["diagonal", "quadrant", "stripe", "offset", "thirds"] as const;

function initialsFromName(name: string): string {
  const parts = name
    .replace(/[".]/g, "")
    .split(/\s+/)
    .filter((p) => p.length > 0 && !/^(Jr|Sr|III|II|IV)$/i.test(p));
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function ProceduralAvatar({ name }: { name: string }) {
  const seed = djb2(name);
  const [bg, fg] = PALETTES[seed % PALETTES.length];
  const shape = SHAPES[(seed >> 4) % SHAPES.length];

  const blockA =
    shape === "diagonal" ? `M0,0 L100,0 L100,${40 + ((seed >> 12) % 30)} L0,${60 + ((seed >> 16) % 20)} Z`
    : shape === "quadrant" ? `M0,0 L55,0 L55,55 L0,55 Z`
    : shape === "stripe" ? `M0,0 L100,0 L100,42 L0,42 Z`
    : shape === "offset" ? `M22,0 L100,0 L100,68 L22,68 Z`
    : `M0,0 L100,0 L100,33 L0,33 Z`;

  const blockB =
    shape === "diagonal" ? `M0,82 L78,52 L100,52 L100,100 L0,100 Z`
    : shape === "quadrant" ? `M58,58 L100,58 L100,100 L58,100 Z`
    : shape === "stripe" ? `M0,62 L100,62 L100,100 L0,100 Z`
    : shape === "offset" ? `M0,74 L82,74 L82,100 L0,100 Z`
    : `M0,72 L100,72 L100,100 L0,100 Z`;

  const initials = initialsFromName(name);

  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full block"
    >
      <rect width="100" height="100" fill={bg} />
      <path d={blockA} fill={fg} opacity="0.88" />
      <path d={blockB} fill={fg} opacity="0.55" />
      <text
        x="50"
        y="56"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Anton', 'Bebas Neue', sans-serif"
        fontSize="42"
        fontWeight="400"
        fill={bg}
        opacity="0.78"
        letterSpacing="0.04em"
      >
        {initials}
      </text>
    </svg>
  );
}

function PortraitHero({ person }: { person: Person }) {
  const url = portraitFor(person.slug);
  return (
    <div className="relative w-full max-w-[420px] aspect-[4/5] overflow-hidden border-2 border-bark/20 bg-bark rounded shadow-lg">
      <div className="absolute inset-0">
        <ProceduralAvatar name={person.name} />
      </div>
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={person.name}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}

function spotifyArtistUrl(name: string): string {
  return `https://open.spotify.com/search/${encodeURIComponent(name)}`;
}

export default function PersonPage({ params }: { params: { slug: string } }) {
  const p = personBySlug(params.slug);
  if (!p) return notFound();

  const albums = albumsByArtist(p.slug).sort((a, b) => a.year - b.year);
  const isMusician = albums.length > 0;

  const grouped = new Map<
    RelationKind,
    { slug: string; note?: string }[]
  >();
  for (const r of p.relations) {
    const list = grouped.get(r.kind) ?? [];
    list.push({ slug: r.slug, note: r.note });
    grouped.set(r.kind, list);
  }

  const bioParas = p.bio.split(/\n\n+/);

  return (
    <>
      <TopNav />

      <article className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-8 pb-12">
        {/* Breadcrumb */}
        <nav className="mono text-[10px] tracking-widest text-cocoa uppercase mb-6">
          <Link href="/" className="hover:text-ember transition-colors">
            Home
          </Link>
          <span className="mx-2 opacity-50">/</span>
          <Link href="/family/" className="hover:text-ember transition-colors">
            Family
          </Link>
          <span className="mx-2 opacity-50">/</span>
          <span className="text-bark">{p.name}</span>
        </nav>

        {/* Header: portrait + identity, side by side on desktop */}
        <header className="grid grid-cols-1 md:grid-cols-[auto,1fr] gap-8 md:gap-10 items-start">
          <PortraitHero person={p} />

          <div className="min-w-0">
            <h1 className="display text-bark text-4xl sm:text-5xl md:text-6xl tracking-tight leading-none">
              {p.name}
            </h1>

            {p.aka && p.aka.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {p.aka.map((a) => (
                  <span
                    key={a}
                    className="mono text-[10px] tracking-widest uppercase border border-bark/20 bg-sand_2/60 text-bark_2 px-2 py-1 rounded"
                  >
                    {a}
                  </span>
                ))}
              </div>
            )}

            <div className="mono text-[11px] tracking-widest text-cocoa uppercase mt-5 flex flex-wrap gap-x-5 gap-y-1">
              {p.born && (
                <span>
                  <span className="text-bark_2/70">Born</span>{" "}
                  <span className="text-bark">{p.born}</span>
                </span>
              )}
              {p.died && (
                <span>
                  <span className="text-bark_2/70">Died</span>{" "}
                  <span className="text-bark">{p.died}</span>
                </span>
              )}
              {p.birthplace && (
                <span>
                  <span className="text-bark_2/70">Place</span>{" "}
                  <span className="text-bark">{p.birthplace}</span>
                </span>
              )}
            </div>

            <p className="serif italic text-cocoa text-lg mt-4">{p.role}</p>

            {isMusician && (
              <div className="mt-5">
                <a
                  href={spotifyArtistUrl(p.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-leaf hover:bg-leaf_2 text-sand mono text-[11px] tracking-widest uppercase px-4 py-2 rounded transition-colors"
                >
                  Listen on Spotify <span aria-hidden>→</span>
                </a>
              </div>
            )}
          </div>
        </header>

        <hr className="hr-rule" />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,18rem] gap-10">
          {/* Main column */}
          <div>
            <div className="serif text-bark text-base sm:text-lg leading-relaxed max-w-prose">
              {bioParas.map((para, i) => (
                <p key={i} className={i === 0 ? "drop-cap" : "mt-4"}>
                  {para}
                </p>
              ))}
            </div>

            {albums.length > 0 && (
              <section className="mt-12">
                <p className="ornament mb-3">Records</p>
                <h2 className="display text-bark text-3xl tracking-tight mb-6">
                  Discography
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {albums.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/discography/${a.slug}/`}
                      className="block border border-bark/15 bg-sand_2/40 p-3 hover:border-ember/60 hover:bg-sand_2/70 transition-colors rounded"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="display text-ember text-2xl leading-none">
                          {a.year}
                        </span>
                        <div className="min-w-0">
                          <p className="serif text-bark font-bold text-base leading-tight">
                            {a.title}
                          </p>
                          <p className="mono text-[10px] tracking-widest text-cocoa uppercase mt-1 truncate">
                            {a.artistDisplay}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {p.relations.length > 0 && (
              <section className="mt-12">
                <p className="ornament mb-3">Connections</p>
                <h2 className="display text-bark text-3xl tracking-tight mb-6">
                  Relations
                </h2>
                <div className="space-y-6">
                  {RELATION_ORDER.map((kind) => {
                    const items = grouped.get(kind);
                    if (!items || items.length === 0) return null;
                    return (
                      <div key={kind}>
                        <p className="mono text-[10px] tracking-widest text-cocoa uppercase mb-2">
                          {RELATION_LABELS[kind]}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {items.map((r) => {
                            const target = personBySlug(r.slug);
                            if (!target) return null;
                            return (
                              <Link
                                key={r.slug + (r.note ?? "")}
                                href={`/family/${target.slug}/`}
                                className="block border border-bark/15 bg-sand_2/30 px-3 py-2 hover:border-ember/60 hover:bg-sand_2/60 transition-colors rounded"
                              >
                                <p className="serif text-bark font-bold text-sm leading-tight">
                                  {target.name}
                                </p>
                                <p className="serif italic text-cocoa text-xs mt-0.5">
                                  {target.role}
                                </p>
                                {r.note && (
                                  <p className="mono text-[10px] tracking-widest text-bark_2/70 uppercase mt-1">
                                    {r.note}
                                  </p>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:pt-2">
            {p.tags && p.tags.length > 0 && (
              <div className="border border-bark/15 bg-sand_2/40 p-4 rounded">
                <p className="ornament mb-3">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="mono text-[10px] tracking-widest uppercase text-bark_2 border border-bark/20 px-2 py-1 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 border border-bark/15 bg-sand_2/40 p-4 rounded">
              <p className="ornament mb-3">Quick stats</p>
              <dl className="space-y-2 mono text-[11px] tracking-widest uppercase">
                <div className="flex justify-between">
                  <dt className="text-cocoa">Albums</dt>
                  <dd className="text-ember">{albums.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-cocoa">Connections</dt>
                  <dd className="text-ember">{p.relations.length}</dd>
                </div>
              </dl>
            </div>

            {isMusician && (
              <div className="mt-4 border border-bark/15 bg-sand_2/40 p-4 rounded">
                <p className="ornament mb-3">Listen</p>
                <a
                  href={spotifyArtistUrl(p.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mono text-[11px] tracking-widest uppercase text-leaf hover:text-leaf_2 transition-colors"
                >
                  Spotify artist search →
                </a>
              </div>
            )}
          </aside>
        </div>
      </article>

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
