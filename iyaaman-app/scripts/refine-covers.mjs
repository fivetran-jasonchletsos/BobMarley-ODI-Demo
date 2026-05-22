#!/usr/bin/env node
// Final-pass cover resolution.
// Strategy: search iTunes by artist only, get many albums, then string-match
// the target title against the returned collection names. Year is the
// tiebreaker. If nothing reasonable matches, mark as not found so the UI
// falls back to the procedural cover.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const coversDir = path.join(ROOT, "public/covers");

// For each album we list one or more candidate "artist" queries to send to
// iTunes. The first that returns a confident match wins.
const ALBUM_RULES = {
  // Bob / Wailers — main catalog under "Bob Marley"
  "wailing-wailers":      { artists: ["Bob Marley The Wailers", "The Wailers"], wantTitle: "wailing wailers" },
  "soul-rebels":          { artists: ["Bob Marley The Wailers Lee Perry", "The Wailers"], wantTitle: "soul rebels" },
  "soul-revolution":      { artists: ["Bob Marley The Wailers Lee Perry", "The Wailers"], wantTitle: "soul revolution" },
  "best-of-wailers":      { artists: ["The Wailers Leslie Kong", "Bob Marley The Wailers"], wantTitle: "best of the wailers" },
  "catch-a-fire":         { artists: ["Bob Marley"], wantTitle: "catch a fire" },
  "burnin":               { artists: ["Bob Marley"], wantTitle: "burnin" },
  "natty-dread":          { artists: ["Bob Marley"], wantTitle: "natty dread" },
  "live":                 { artists: ["Bob Marley"], wantTitle: "live" },
  "rastaman-vibration":   { artists: ["Bob Marley"], wantTitle: "rastaman vibration" },
  "exodus":               { artists: ["Bob Marley"], wantTitle: "exodus" },
  "kaya":                 { artists: ["Bob Marley"], wantTitle: "kaya" },
  "babylon-by-bus":       { artists: ["Bob Marley"], wantTitle: "babylon by bus" },
  "survival":             { artists: ["Bob Marley"], wantTitle: "survival" },
  "uprising":             { artists: ["Bob Marley"], wantTitle: "uprising" },
  "confrontation":        { artists: ["Bob Marley"], wantTitle: "confrontation" },
  "legend":               { artists: ["Bob Marley"], wantTitle: "legend" },

  // Melody Makers
  "children-playing":     { artists: ["Ziggy Marley Melody Makers"], wantTitle: "play the game right" },
  "hey-world":            { artists: ["Ziggy Marley Melody Makers"], wantTitle: "hey world" },
  "time-has-come":        { artists: ["Ziggy Marley Melody Makers"], wantTitle: "time has come" },
  "conscious-party":      { artists: ["Ziggy Marley Melody Makers"], wantTitle: "conscious party" },
  "one-bright-day":       { artists: ["Ziggy Marley Melody Makers"], wantTitle: "one bright day" },
  "jahmekya":             { artists: ["Ziggy Marley Melody Makers"], wantTitle: "jahmekya" },
  "joy-and-blues":        { artists: ["Ziggy Marley Melody Makers"], wantTitle: "joy and blues" },
  "free-like-we-want-2-b":{ artists: ["Ziggy Marley Melody Makers"], wantTitle: "free like we want" },

  // Ziggy solo
  "love-is-my-religion":  { artists: ["Ziggy Marley"], wantTitle: "love is my religion" },
  "family-time":          { artists: ["Ziggy Marley"], wantTitle: "family time" },
  "wild-and-free":        { artists: ["Ziggy Marley"], wantTitle: "wild and free" },
  "fly-rasta":            { artists: ["Ziggy Marley"], wantTitle: "fly rasta" },
  "ziggy-marley-album":   { artists: ["Ziggy Marley"], wantTitle: "ziggy marley" },
  "rebellion-rises":      { artists: ["Ziggy Marley"], wantTitle: "rebellion rises" },
  "more-family-time":     { artists: ["Ziggy Marley"], wantTitle: "more family time" },

  // Stephen
  "mind-control":         { artists: ["Stephen Marley"], wantTitle: "mind control" },
  "revelation-pt1":       { artists: ["Stephen Marley"], wantTitle: "revelation, pt. 1" },
  "revelation-pt2":       { artists: ["Stephen Marley"], wantTitle: "revelation, pt. 2" },
  "old-soul":             { artists: ["Stephen Marley"], wantTitle: "old soul" },

  // Damian
  "mr-marley":            { artists: ["Damian Marley"], wantTitle: "mr. marley" },
  "halfway-tree":         { artists: ["Damian Marley"], wantTitle: "halfway tree" },
  "welcome-to-jamrock":   { artists: ["Damian Marley"], wantTitle: "welcome to jamrock" },
  "distant-relatives":    { artists: ["Nas Damian Marley", "Damian Marley"], wantTitle: "distant relatives" },
  "stony-hill":           { artists: ["Damian Marley"], wantTitle: "stony hill" },

  // Ky-Mani
  "like-father-like-son": { artists: ["Ky-Mani Marley"], wantTitle: "like father like son" },
  "journey":              { artists: ["Ky-Mani Marley"], wantTitle: "the journey" },
  "milestone":            { artists: ["Ky-Mani Marley"], wantTitle: "milestone" },
  "radio":                { artists: ["Ky-Mani Marley"], wantTitle: "radio" },
  "maestro":              { artists: ["Ky-Mani Marley"], wantTitle: "maestro" },

  // Julian
  "lion-in-the-morning":  { artists: ["Julian Marley"], wantTitle: "lion in the morning" },
  "place-of-mind":        { artists: ["Julian Marley"], wantTitle: "a time" },
  "awake":                { artists: ["Julian Marley"], wantTitle: "awake" },
  "colors-of-royal":      { artists: ["Julian Marley Antaeus", "Julian Marley"], wantTitle: "colors of royal" },

  // Third gen
  "higher-place":         { artists: ["Skip Marley"], wantTitle: "higher place" },
  "higher-place-deluxe":  { artists: ["Skip Marley"], wantTitle: "higher place" },
  "comfortable":          { artists: ["Jo Mersa Marley", "JoMersa Marley"], wantTitle: "comfortable" },
};

async function search(term) {
  const url =
    "https://itunes.apple.com/search?" +
    new URLSearchParams({
      term,
      entity: "album",
      limit: "50",
      media: "music",
    }).toString();
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 BobMarleyDemo/1.0" },
  });
  if (!res.ok) throw new Error(`iTunes ${res.status}`);
  const json = await res.json();
  return json.results || [];
}

function norm(s) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function upgradeArtUrl(url) {
  if (!url) return null;
  return url.replace(/\/\d+x\d+bb\./, "/600x600bb.");
}

async function downloadImage(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`image ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buf);
}

function spotifySearchUrl(artist, title) {
  return `https://open.spotify.com/search/${encodeURIComponent(`${artist} ${title}`)}`;
}

async function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function loadAlbumMeta() {
  const albumsSrc = await fs.readFile(path.join(ROOT, "src/lib/albums.ts"), "utf8");
  const meta = new Map();
  const re = /\{\s*slug:\s*"([^"]+)",[\s\S]*?title:\s*"([^"]+)",[\s\S]*?artistDisplay:\s*"([^"]+)",[\s\S]*?year:\s*(\d{4})/g;
  let m;
  while ((m = re.exec(albumsSrc))) {
    meta.set(m[1], { title: m[2], artistDisplay: m[3], year: Number(m[4]) });
  }
  return meta;
}

async function main() {
  const albumMeta = await loadAlbumMeta();
  // Load existing manifest so we don't redo HITs.
  const manifestPath = path.join(coversDir, "manifest.json");
  let manifest = {};
  try {
    manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
  } catch {}
  let hits = 0;
  let misses = 0;

  for (const [slug, rule] of Object.entries(ALBUM_RULES)) {
    if (manifest[slug]?.found) { hits++; continue; }
    const meta = albumMeta.get(slug);
    if (!meta) continue;

    const want = norm(rule.wantTitle);
    let best = null;
    let bestScore = -Infinity;

    for (const artist of rule.artists) {
      let results;
      try {
        results = await search(artist);
      } catch (e) {
        if (String(e.message).includes("429") || String(e.message).includes("403")) {
          console.warn(`  ${slug}: rate-limited on "${artist}", waiting 5s`);
          await sleep(5000);
          try { results = await search(artist); } catch { continue; }
        } else {
          continue;
        }
      }

      for (const r of results) {
        const cn = norm(r.collectionName);
        if (!cn.includes(want)) continue;
        const ry = r.releaseDate ? Number(r.releaseDate.slice(0, 4)) : 0;
        let score = 0;
        if (cn === want) score += 20;
        else if (cn.startsWith(want)) score += 12;
        else score += 5;
        if (ry && Math.abs(ry - meta.year) <= 1) score += 8;
        else if (ry && Math.abs(ry - meta.year) <= 3) score += 4;
        else if (ry && Math.abs(ry - meta.year) <= 6) score += 1;
        // Penalize "Single" / "EP" entries
        if (/-?\s?(single|ep)\s?$/i.test(r.collectionName)) score -= 6;
        // Penalize compilations that don't match year
        if (/best of|legend|essentials|greatest hits|remix/i.test(r.collectionName)
            && !/legend|best of the wailers/.test(want)) score -= 4;
        if (score > bestScore) {
          bestScore = score;
          best = r;
        }
      }
      await sleep(900);
      if (best && bestScore >= 15) break; // good enough
    }

    if (best && bestScore >= 6) {
      const coverUrl = upgradeArtUrl(best.artworkUrl100);
      const dest = path.join(coversDir, `${slug}.jpg`);
      try {
        await downloadImage(coverUrl, dest);
        manifest[slug] = {
          found: true,
          cover_url: coverUrl,
          spotify_search: spotifySearchUrl(meta.artistDisplay, meta.title),
          itunes_artist: best.artistName,
          itunes_title: best.collectionName,
          score: bestScore,
        };
        hits++;
        console.log(`  ${slug}: HIT score=${bestScore} (${best.artistName} - ${best.collectionName})`);
      } catch (e) {
        manifest[slug] = {
          found: false,
          spotify_search: spotifySearchUrl(meta.artistDisplay, meta.title),
        };
        misses++;
        console.warn(`  ${slug}: download failed`);
      }
    } else {
      // Delete any stale local file from earlier passes
      try { await fs.unlink(path.join(coversDir, `${slug}.jpg`)); } catch {}
      manifest[slug] = {
        found: false,
        spotify_search: spotifySearchUrl(meta.artistDisplay, meta.title),
      };
      misses++;
      console.log(`  ${slug}: MISS (best score ${bestScore})`);
    }
  }

  await fs.writeFile(
    path.join(coversDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );
  console.log(`\nDone. ${hits} hits, ${misses} misses.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
