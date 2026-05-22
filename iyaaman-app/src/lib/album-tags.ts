// Album tag dictionary — drives the "related albums" constellation.
//
// Each album becomes a feature vector over:
//   (1) Genre tags: reggae family (roots, ska, rocksteady, dub), plus
//       neighbouring styles (hip-hop, R&B, pop, conscious, dancehall, nyahbinghi)
//   (2) Lineage tags: production lineage (Lee Perry / Black Ark, Studio One /
//       Coxsone, Chris Blackwell / Island, Tuff Gong / Stephen Marley-produced,
//       Jr. Gong family, cross-genre collab)
//   (3) Decade
//
// Weighted Jaccard similarity over these tags produces the neighbor lists.
// In a production pipeline this layer would be a Snowflake Cortex EMBED_TEXT_768
// materialization; here it runs in TypeScript at build time for the static site.

import { albums, type Album } from "./albums";

export type AlbumTags = {
  genres: string[];   // genre codes
  lineage: string[];  // production / scene codes
  decade: number;     // floor(year/10)*10
};

// ---------------------------------------------------------------------------
// Genre code dictionary
// ---------------------------------------------------------------------------
export const GENRE_LABEL: Record<string, string> = {
  rg: "reggae",
  rr: "roots reggae",
  du: "dub",
  sk: "ska",
  rs: "rocksteady",
  co_reg: "conscious reggae",
  dh: "dancehall",
  ny: "nyahbinghi",
  rg_pop: "reggae pop",
  hh: "hip-hop",
  rb: "R&B",
  sl: "soul",
  pop: "pop",
  af: "afrobeat",
  cr2: "conscious rap",
  exp: "experimental",
  ak: "acoustic",
};

// ---------------------------------------------------------------------------
// Lineage code dictionary
// ---------------------------------------------------------------------------
export const LINEAGE_LABEL: Record<string, string> = {
  L_STUDIO_ONE: "Studio One / Coxsone",
  L_BLACK_ARK: "Black Ark / Lee Perry",
  L_ISLAND: "Island / Chris Blackwell",
  L_TUFF_GONG: "Tuff Gong",
  L_JR_GONG: "Jr. Gong family",
  L_MELODY_MAKERS: "Melody Makers",
  L_COLLAB: "cross-genre collab",
  L_ACOUSTIC: "acoustic / stripped",
};

// ---------------------------------------------------------------------------
// Per-artist defaults
// ---------------------------------------------------------------------------
const ARTIST_TAGS: Record<string, { g: string[]; l?: string[] }> = {
  // Bob / Wailers — early Studio One / Lee Perry / Island eras handled via overrides
  "bob-marley": { g: ["rg", "rr", "co_reg"], l: ["L_ISLAND"] },

  // Melody Makers
  "melody-makers": { g: ["rg", "rr", "rg_pop"], l: ["L_MELODY_MAKERS"] },
  "ziggy-marley": { g: ["rg", "rr", "rg_pop"], l: ["L_MELODY_MAKERS"] },
  "sharon-marley": { g: ["rg", "rg_pop"], l: ["L_MELODY_MAKERS"] },
  "cedella-marley": { g: ["rg", "rg_pop"], l: ["L_MELODY_MAKERS"] },
  "stephen-marley": { g: ["rg", "rr", "co_reg", "hh"], l: ["L_TUFF_GONG"] },
  "damian-marley": { g: ["rg", "dh", "hh", "cr2"], l: ["L_JR_GONG"] },
  "kymani-marley": { g: ["rg", "rg_pop", "rb"], l: ["L_JR_GONG"] },
  "julian-marley": { g: ["rg", "rr", "co_reg"], l: ["L_TUFF_GONG"] },
  "skip-marley": { g: ["rg", "rg_pop", "pop", "rb"], l: ["L_TUFF_GONG"] },
  "jomersa-marley": { g: ["rg", "rg_pop", "pop"], l: ["L_TUFF_GONG"] },
  "antaeus": { g: ["rg", "rr"], l: ["L_TUFF_GONG"] },
  "nas": { g: ["hh", "cr2", "rb"], l: ["L_COLLAB"] },
  "peter-tosh": { g: ["rg", "rr", "co_reg"], l: ["L_BLACK_ARK"] },
  "bunny-wailer": { g: ["rg", "rr", "ny"], l: ["L_BLACK_ARK"] },
};

// ---------------------------------------------------------------------------
// Per-album overrides — keyed by album slug
// ---------------------------------------------------------------------------
const ALBUM_OVERRIDES: Record<string, { g?: string[]; l?: string[] }> = {
  // Studio One era — ska / early rocksteady
  "wailing-wailers": { g: ["sk", "rs", "rg"], l: ["L_STUDIO_ONE"] },

  // Lee Perry productions — deep roots / dub
  "soul-rebels":    { g: ["rg", "rr", "du", "co_reg"], l: ["L_BLACK_ARK"] },
  "soul-revolution": { g: ["rg", "rr", "du", "co_reg"], l: ["L_BLACK_ARK"] },

  // Beverley's / Leslie Kong
  "best-of-wailers": { g: ["sk", "rs", "rg"], l: ["L_STUDIO_ONE"] },

  // Island / Chris Blackwell — roots crossover
  "catch-a-fire":       { g: ["rg", "rr", "co_reg"], l: ["L_ISLAND"] },
  "burnin":             { g: ["rg", "rr", "co_reg"], l: ["L_ISLAND"] },
  "natty-dread":        { g: ["rg", "rr", "co_reg"], l: ["L_ISLAND", "L_TUFF_GONG"] },
  "live":               { g: ["rg", "rr", "co_reg"], l: ["L_ISLAND", "L_TUFF_GONG"] },
  "rastaman-vibration": { g: ["rg", "rr", "co_reg"], l: ["L_ISLAND", "L_TUFF_GONG"] },
  "exodus":             { g: ["rg", "rr", "co_reg"], l: ["L_ISLAND", "L_TUFF_GONG"] },
  "kaya":               { g: ["rg", "rg_pop", "co_reg"], l: ["L_ISLAND", "L_TUFF_GONG"] },
  "babylon-by-bus":     { g: ["rg", "rr", "co_reg"], l: ["L_ISLAND", "L_TUFF_GONG"] },
  "survival":           { g: ["rg", "rr", "co_reg", "af"], l: ["L_ISLAND", "L_TUFF_GONG"] },
  "uprising":           { g: ["rg", "rr", "co_reg", "ak"], l: ["L_ISLAND", "L_TUFF_GONG"] },
  "confrontation":      { g: ["rg", "rr", "co_reg"], l: ["L_TUFF_GONG"] },
  "legend":             { g: ["rg", "rr", "rg_pop"], l: ["L_ISLAND", "L_TUFF_GONG"] },

  // Melody Makers
  "children-playing":   { g: ["rg", "rg_pop"], l: ["L_MELODY_MAKERS"] },
  "hey-world":          { g: ["rg", "rg_pop"], l: ["L_MELODY_MAKERS"] },
  "time-has-come":      { g: ["rg", "rg_pop"], l: ["L_MELODY_MAKERS"] },
  "conscious-party":    { g: ["rg", "rg_pop", "co_reg"], l: ["L_MELODY_MAKERS"] },
  "one-bright-day":     { g: ["rg", "rg_pop", "co_reg"], l: ["L_MELODY_MAKERS"] },
  "jahmekya":           { g: ["rg", "hh", "rb"], l: ["L_MELODY_MAKERS"] },
  "joy-and-blues":      { g: ["rg", "rr", "ak"], l: ["L_MELODY_MAKERS"] },
  "free-like-we-want-2-b": { g: ["rg", "rg_pop"], l: ["L_MELODY_MAKERS"] },

  // Ziggy solo
  "love-is-my-religion": { g: ["rg", "rr", "co_reg"], l: ["L_MELODY_MAKERS"] },
  "family-time":         { g: ["rg", "rg_pop", "pop"], l: ["L_MELODY_MAKERS"] },
  "wild-and-free":       { g: ["rg", "rg_pop", "rb"], l: ["L_MELODY_MAKERS"] },
  "fly-rasta":           { g: ["rg", "rr", "co_reg"], l: ["L_MELODY_MAKERS"] },
  "ziggy-marley-album":  { g: ["rg", "rr", "co_reg"], l: ["L_MELODY_MAKERS"] },
  "rebellion-rises":     { g: ["rg", "rg_pop", "co_reg"], l: ["L_MELODY_MAKERS"] },
  "more-family-time":    { g: ["rg", "rg_pop", "pop"], l: ["L_MELODY_MAKERS"] },

  // Stephen solo
  "mind-control":    { g: ["rg", "rr", "co_reg", "hh"], l: ["L_TUFF_GONG"] },
  "revelation-pt1":  { g: ["rg", "rr", "co_reg"], l: ["L_TUFF_GONG"] },
  "revelation-pt2":  { g: ["rg", "hh", "rb", "cr2", "exp"], l: ["L_TUFF_GONG", "L_COLLAB"] },
  "old-soul":        { g: ["rg", "rr", "ak", "co_reg"], l: ["L_TUFF_GONG", "L_ACOUSTIC"] },

  // Damian
  "mr-marley":          { g: ["rg", "dh", "hh"], l: ["L_JR_GONG"] },
  "halfway-tree":       { g: ["rg", "dh", "hh", "co_reg"], l: ["L_JR_GONG"] },
  "welcome-to-jamrock": { g: ["rg", "dh", "hh", "cr2"], l: ["L_JR_GONG"] },
  "distant-relatives":  { g: ["hh", "cr2", "rg", "af"], l: ["L_JR_GONG", "L_COLLAB"] },
  "stony-hill":         { g: ["rg", "dh", "hh", "co_reg"], l: ["L_JR_GONG"] },

  // Ky-Mani
  "like-father-like-son": { g: ["rg", "rr", "rg_pop"], l: ["L_JR_GONG"] },
  "journey":              { g: ["rg", "rg_pop", "rb"], l: ["L_JR_GONG"] },
  "milestone":            { g: ["rg", "rg_pop", "pop"], l: ["L_JR_GONG"] },
  "radio":                { g: ["rg", "rg_pop", "rb"], l: ["L_JR_GONG"] },
  "maestro":              { g: ["rg", "rg_pop", "rb", "pop"], l: ["L_JR_GONG"] },

  // Julian
  "lion-in-the-morning": { g: ["rg", "rr", "co_reg"], l: ["L_TUFF_GONG"] },
  "place-of-mind":       { g: ["rg", "rr", "co_reg"], l: ["L_TUFF_GONG"] },
  "awake":               { g: ["rg", "rr", "co_reg"], l: ["L_TUFF_GONG"] },
  "colors-of-royal":     { g: ["rg", "rr", "co_reg"], l: ["L_TUFF_GONG"] },

  // Third gen
  "higher-place":         { g: ["rg", "rg_pop", "pop", "rb"], l: ["L_TUFF_GONG"] },
  "higher-place-deluxe":  { g: ["rg", "rg_pop", "pop", "rb"], l: ["L_TUFF_GONG"] },
  "comfortable":          { g: ["rg", "rg_pop", "pop"], l: ["L_TUFF_GONG"] },
};

// ---------------------------------------------------------------------------
// Public tagger
// ---------------------------------------------------------------------------
export function tagsFor(album: Album): AlbumTags {
  const override = ALBUM_OVERRIDES[album.slug];

  if (override) {
    return {
      genres: override.g ?? [],
      lineage: override.l ?? [],
      decade: Math.floor(album.year / 10) * 10,
    };
  }

  // Fall back to primary artistSlug defaults
  const primarySlug = album.artistSlugs[0] ?? "";
  const base = ARTIST_TAGS[primarySlug] ?? { g: ["rg"], l: [] };

  return {
    genres: base.g,
    lineage: base.l ?? [],
    decade: Math.floor(album.year / 10) * 10,
  };
}

// ---------------------------------------------------------------------------
// Convenience: precompute all tags
// ---------------------------------------------------------------------------
let _cache: { tags: AlbumTags; album: Album }[] | null = null;
export function allTagged(): { tags: AlbumTags; album: Album }[] {
  if (_cache) return _cache;
  _cache = albums.map((album) => ({ album, tags: tagsFor(album) }));
  return _cache;
}
