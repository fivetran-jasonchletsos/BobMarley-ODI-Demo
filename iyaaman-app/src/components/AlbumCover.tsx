"use client";

import coversManifest from "@/../public/covers/manifest.json";
import type { Album } from "@/lib/albums";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type ManifestEntry = {
  found?: boolean;
  cover_url?: string;
  spotify_search?: string;
};

function getManifest(slug: string): ManifestEntry | undefined {
  return (coversManifest as Record<string, ManifestEntry>)[slug];
}

export function spotifySearchUrl(artist: string, title: string): string {
  return `https://open.spotify.com/search/${encodeURIComponent(`${artist} ${title}`)}`;
}

// Deterministic hash so procedural covers are stable across renders.
function djb2(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

// Tuff Gong palette pairs — base, accent. Pulled from tailwind.config.js so
// procedural fallbacks always feel like part of the same site.
const PALETTES: [string, string][] = [
  ["#0d1a10", "#e6b800"],   // jam_black + jam_gold
  ["#0d1a10", "#c0382b"],   // jam_black + jam_red
  ["#0d1a10", "#0f7438"],   // jam_black + jam_green
  ["#1f2e22", "#e6b800"],   // bark_2 + jam_gold
  ["#0f7438", "#e6b800"],   // jam_green + jam_gold
  ["#c0382b", "#f4ecd6"],   // jam_red + sand
  ["#3d5430", "#f5d33a"],   // cocoa + gold_2
  ["#0f7438", "#f4ecd6"],   // jam_green + sand
];

const SHAPES = ["diagonal", "quadrant", "stripe", "offset", "thirds"] as const;

function coverProps(artist: string, title: string) {
  const seed = djb2(artist + "///" + title);
  const palette = PALETTES[seed % PALETTES.length];
  const shape = SHAPES[(seed >> 4) % SHAPES.length];
  return { bg: palette[0], fg: palette[1], shape, seed };
}

function ProceduralCover({ artist, title }: { artist: string; title: string }) {
  const { bg, fg, shape, seed } = coverProps(artist, title);
  const artistInitial = artist.replace(/^(The|A|An)\s+/i, "").charAt(0).toUpperCase();
  const titleWords = title.split(/\s+/).slice(0, 4).join(" ");

  const blockA =
    shape === "diagonal" ? `M0,0 L100,0 L100,${40 + ((seed >> 12) % 30)} L0,${60 + ((seed >> 16) % 20)} Z`
    : shape === "quadrant" ? `M0,0 L55,0 L55,55 L0,55 Z`
    : shape === "stripe" ? `M0,0 L100,0 L100,45 L0,45 Z`
    : shape === "offset" ? `M20,0 L100,0 L100,70 L20,70 Z`
    : `M0,0 L100,0 L100,35 L0,35 Z`;

  const blockB =
    shape === "diagonal" ? `M0,85 L80,50 L100,50 L100,100 L0,100 Z`
    : shape === "quadrant" ? `M60,60 L100,60 L100,100 L60,100 Z`
    : shape === "stripe" ? `M0,60 L100,60 L100,100 L0,100 Z`
    : shape === "offset" ? `M0,75 L85,75 L85,100 L0,100 Z`
    : `M0,70 L100,70 L100,100 L0,100 Z`;

  const grainDots = Array.from({ length: 22 }, (_, i) => {
    const gx = ((seed * (i + 7) * 1999) >>> 0) % 100;
    const gy = ((seed * (i + 3) * 3001) >>> 0) % 100;
    return { gx, gy };
  });

  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
      style={{ display: "block" }}
    >
      <rect width="100" height="100" fill={bg} />
      <path d={blockA} fill={fg} opacity="0.85" />
      <path d={blockB} fill={fg} opacity="0.55" />
      {grainDots.map(({ gx, gy }, i) => (
        <circle key={i} cx={gx} cy={gy} r="0.6" fill={fg} opacity="0.2" />
      ))}
      <text
        x="50"
        y="58"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="Anton, 'Bebas Neue', sans-serif"
        fontSize="46"
        fontWeight="bold"
        fill={bg}
        opacity="0.4"
        letterSpacing="-1"
      >
        {artistInitial}
      </text>
      <text
        x="5"
        y="93"
        fontFamily="'JetBrains Mono', ui-monospace, monospace"
        fontSize="4.8"
        fill={bg}
        opacity="0.75"
        fontWeight="500"
      >
        {titleWords.length > 24 ? titleWords.slice(0, 24) + "…" : titleWords}
      </text>
    </svg>
  );
}

export type CoverSize = "card" | "detail";

type AlbumCoverProps = {
  album: Pick<Album, "slug" | "title" | "artistDisplay" | "year">;
  size?: CoverSize;
  showSpotifyButton?: boolean;
  showYearBadge?: boolean;
  className?: string;
};

/**
 * Reusable album cover. Shows the real iTunes cover if we have one in the
 * manifest, otherwise falls back to a deterministic procedural cover drawn
 * with the Tuff Gong palette.
 */
export default function AlbumCover({
  album,
  size = "card",
  showSpotifyButton = false,
  showYearBadge = true,
  className = "",
}: AlbumCoverProps) {
  const entry = getManifest(album.slug);
  const hasReal = entry?.found === true;
  const coverSrc = `${BASE_PATH}/covers/${album.slug}.jpg`;
  const spotify = entry?.spotify_search
    ?? spotifySearchUrl(album.artistDisplay, album.title);

  return (
    <div className={`relative w-full ${className}`}>
      <div className="aspect-square overflow-hidden border border-bark/20 bg-bark shadow-md">
        {hasReal ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverSrc}
            alt={`${album.title} by ${album.artistDisplay}`}
            className="h-full w-full object-cover"
            loading={size === "detail" ? "eager" : "lazy"}
          />
        ) : (
          <ProceduralCover artist={album.artistDisplay} title={album.title} />
        )}
      </div>

      {showYearBadge && (
        <span
          className="absolute right-2 top-2 mono text-[9px] uppercase tracking-[0.22em] bg-bark/90 text-gold border border-gold/30 px-1.5 py-0.5 shadow-sm"
          aria-hidden="true"
        >
          {album.year}
        </span>
      )}

      {showSpotifyButton && (
        <a
          href={spotify}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Listen to ${album.title} on Spotify`}
          className="absolute left-2 bottom-2 inline-flex items-center gap-1 mono text-[9px] uppercase tracking-[0.22em] bg-jam_green text-sand border border-sand/30 px-2 py-0.5 hover:bg-leaf_2 transition-colors shadow-sm"
        >
          Spotify <span aria-hidden>{"→"}</span>
        </a>
      )}
    </div>
  );
}
