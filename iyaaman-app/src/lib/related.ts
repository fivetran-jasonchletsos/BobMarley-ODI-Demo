// Related-albums similarity engine.
//
// Computes a top-K nearest-neighbor list for each album using tag-vector overlap.
// Mirrors what a Cortex EMBED_TEXT_768 pipeline would produce in production —
// the math runs locally so the static site ships the constellation without a
// runtime API call.

import { albums, albumBySlug, type Album } from "./albums";
import { allTagged, GENRE_LABEL, LINEAGE_LABEL, tagsFor, type AlbumTags } from "./album-tags";

export type RelatedNeighbor = {
  slug: string;
  album: Album;
  score: number;          // 0..1
  why: string;            // human-readable reason
  sharedGenres: string[]; // codes
  sharedLineage: string[];
};

// ---------------------------------------------------------------------------
// Weights
// ---------------------------------------------------------------------------
const W_GENRE   = 1.0;
const W_LINEAGE = 1.4;    // shared production lineage is the strongest signal
const W_ERA     = 0.5;
const W_SAME_ARTIST = 0.6; // slight bonus for same primary artist
const K_SAME_ARTIST_MAX = 2;
const K = 8;

// ---------------------------------------------------------------------------
// Jaccard over two string arrays
// ---------------------------------------------------------------------------
function jaccard(a: string[], b: string[]): { score: number; shared: string[] } {
  if (a.length === 0 || b.length === 0) return { score: 0, shared: [] };
  const setA = new Set(a);
  const shared = b.filter((x) => setA.has(x));
  const union = new Set([...a, ...b]).size;
  return { score: shared.length / union, shared };
}

function eraScore(a: AlbumTags, b: AlbumTags): number {
  const gap = Math.abs(a.decade - b.decade) / 10;
  if (gap === 0) return 1;
  if (gap >= 6) return 0;
  return 1 - gap / 6;
}

function pairScore(
  a: { album: Album; tags: AlbumTags },
  b: { album: Album; tags: AlbumTags }
) {
  const g = jaccard(a.tags.genres, b.tags.genres);
  const l = jaccard(a.tags.lineage, b.tags.lineage);
  const era = eraScore(a.tags, b.tags);

  // "Same primary artist" — checks first artistSlug only
  const sameArtist = a.album.artistSlugs[0] === b.album.artistSlugs[0] ? 1 : 0;

  const raw =
    W_GENRE * g.score +
    W_LINEAGE * l.score +
    W_ERA * era +
    W_SAME_ARTIST * sameArtist;

  const norm = raw / (W_GENRE + W_LINEAGE + W_ERA + W_SAME_ARTIST);

  return {
    score: norm,
    sharedGenres: g.shared,
    sharedLineage: l.shared,
    sameArtist: sameArtist === 1,
  };
}

// ---------------------------------------------------------------------------
// "Why related" copy
// ---------------------------------------------------------------------------
function whyCopy(
  _a: Album,
  _b: Album,
  s: { sharedGenres: string[]; sharedLineage: string[]; sameArtist: boolean },
  tagsA: AlbumTags,
  tagsB: AlbumTags
): string {
  if (s.sameArtist) return "Same artist";

  if (s.sharedLineage.length > 0) {
    const lin = LINEAGE_LABEL[s.sharedLineage[0]] ?? s.sharedLineage[0];
    return `${lin} lineage`;
  }

  const priority = tagsA.genres.filter((g) => s.sharedGenres.includes(g));
  if (priority.length >= 2) {
    const g1 = GENRE_LABEL[priority[0]] ?? priority[0];
    const g2 = GENRE_LABEL[priority[1]] ?? priority[1];
    return `Both ${g1} + ${g2}`;
  }
  if (priority.length === 1) {
    const g1 = GENRE_LABEL[priority[0]] ?? priority[0];
    return `Both rooted in ${g1}`;
  }

  if (tagsA.decade === tagsB.decade) {
    return `${tagsA.decade}s contemporaries`;
  }
  if (Math.abs(tagsA.decade - tagsB.decade) === 10) {
    return `Adjacent eras (${tagsA.decade}s / ${tagsB.decade}s)`;
  }
  return "Adjacent sensibility";
}

// ---------------------------------------------------------------------------
// Top-K neighbor cache
// ---------------------------------------------------------------------------
let _cache: Map<string, RelatedNeighbor[]> | null = null;

function build(): Map<string, RelatedNeighbor[]> {
  const tagged = allTagged();
  const result = new Map<string, RelatedNeighbor[]>();

  for (let i = 0; i < tagged.length; i++) {
    const a = tagged[i];
    if (a.tags.genres.length === 0) {
      result.set(a.album.slug, []);
      continue;
    }

    const scored: (RelatedNeighbor & { _sameArtist: boolean })[] = [];

    for (let j = 0; j < tagged.length; j++) {
      if (i === j) continue;
      const b = tagged[j];
      if (b.tags.genres.length === 0) continue;
      const s = pairScore(a, b);
      if (s.score <= 0) continue;
      scored.push({
        slug: b.album.slug,
        album: b.album,
        score: s.score,
        why: whyCopy(a.album, b.album, s, a.tags, b.tags),
        sharedGenres: s.sharedGenres,
        sharedLineage: s.sharedLineage,
        _sameArtist: s.sameArtist,
      });
    }

    scored.sort((x, y) => y.score - x.score);

    const final: RelatedNeighbor[] = [];
    let sameCount = 0;
    for (const n of scored) {
      if (n._sameArtist && sameCount >= K_SAME_ARTIST_MAX) continue;
      if (n._sameArtist) sameCount++;
      final.push({
        slug: n.slug,
        album: n.album,
        score: n.score,
        why: n.why,
        sharedGenres: n.sharedGenres,
        sharedLineage: n.sharedLineage,
      });
      if (final.length === K) break;
    }

    result.set(a.album.slug, final);
  }

  return result;
}

export function relatedFor(slug: string): RelatedNeighbor[] {
  if (!_cache) _cache = build();
  return _cache.get(slug) ?? [];
}

export function albumWithRelated(slug: string): {
  album: Album;
  slug: string;
  tags: AlbumTags;
  neighbors: RelatedNeighbor[];
} | null {
  const album = albumBySlug(slug);
  if (!album) return null;
  return {
    album,
    slug,
    tags: tagsFor(album),
    neighbors: relatedFor(slug),
  };
}
