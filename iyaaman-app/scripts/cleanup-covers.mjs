#!/usr/bin/env node
// Final cleanup pass. For any slug in the manifest still marked found:false,
// retry with a direct "artist title" iTunes search and 2s throttling.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const coversDir = path.join(ROOT, "public/covers");

// Per-slug direct search terms, tuned by hand.
const TERMS = {
  "soul-rebels":          ["Bob Marley Soul Rebels", "Wailers Soul Rebels"],
  "soul-revolution":      ["Bob Marley Soul Revolution", "Wailers Soul Revolution"],
  "best-of-wailers":      ["The Wailers Best of the Wailers"],
  "burnin":               ["Bob Marley Burnin", "Wailers Burnin"],
  "natty-dread":          ["Bob Marley Natty Dread"],
  "babylon-by-bus":       ["Bob Marley Babylon by Bus"],
  "children-playing":     ["Melody Makers Play the Game Right"],
  "revelation-pt2":       ["Stephen Marley Revelation Part 2", "Stephen Marley Fruit of Life"],
  "like-father-like-son": ["Ky-Mani Marley Like Father Like Son"],
  "milestone":            ["Ky-Mani Marley Milestone"],
  "lion-in-the-morning":  ["Julian Marley Lion in the Morning"],
  "comfortable":          ["Jo Mersa Marley Comfortable"],
};

async function search(term) {
  const url =
    "https://itunes.apple.com/search?" +
    new URLSearchParams({
      term, entity: "album", limit: "25", media: "music",
    }).toString();
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 BobMarleyDemo/1.0" },
  });
  if (!res.ok) throw new Error(`iTunes ${res.status}`);
  return (await res.json()).results || [];
}

function norm(s) { return (s || "").toLowerCase().replace(/[^a-z0-9]/g, ""); }
function upgradeArtUrl(u) { return u ? u.replace(/\/\d+x\d+bb\./, "/600x600bb.") : null; }
async function downloadImage(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`image ${res.status}`);
  await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
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

// Exact (or near-exact) title strings we expect to see in iTunes
// collection names so we can lock to the right record.
const EXPECT_TITLE = {
  "soul-rebels":          "soul rebel",
  "soul-revolution":      "soul revolution",
  "best-of-wailers":      "best of the wailers",
  "burnin":               "burnin",
  "natty-dread":          "natty dread",
  "babylon-by-bus":       "babylon by bus",
  "children-playing":     "play the game right",
  "revelation-pt2":       "revelation, pt. 2",
  "like-father-like-son": "like father like son",
  "milestone":            "milestone",
  "lion-in-the-morning":  "lion in the morning",
  "comfortable":          "comfortable",
};

async function main() {
  const albumMeta = await loadAlbumMeta();
  const manifestPath = path.join(coversDir, "manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));

  for (const [slug, terms] of Object.entries(TERMS)) {
    if (manifest[slug]?.found) continue;
    const meta = albumMeta.get(slug);
    if (!meta) continue;
    const want = norm(EXPECT_TITLE[slug]);

    let best = null;
    let bestScore = -Infinity;

    for (const term of terms) {
      let results = [];
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          results = await search(term);
          break;
        } catch (e) {
          console.warn(`  ${slug} "${term}" attempt ${attempt + 1}: ${e.message}`);
          await sleep(3000 + attempt * 2000);
        }
      }

      for (const r of results) {
        const cn = norm(r.collectionName);
        if (!cn.includes(want)) continue;
        const ry = r.releaseDate ? Number(r.releaseDate.slice(0, 4)) : 0;
        let score = 0;
        if (cn.startsWith(want)) score += 12;
        else score += 5;
        if (ry && Math.abs(ry - meta.year) <= 1) score += 8;
        else if (ry && Math.abs(ry - meta.year) <= 3) score += 4;
        else if (ry && Math.abs(ry - meta.year) <= 8) score += 1;
        if (/-?\s?(single|ep)\s?$/i.test(r.collectionName)) score -= 6;
        if (score > bestScore) { bestScore = score; best = r; }
      }
      await sleep(2200);
      if (best && bestScore >= 12) break;
    }

    if (best && bestScore >= 5) {
      const coverUrl = upgradeArtUrl(best.artworkUrl100);
      try {
        await downloadImage(coverUrl, path.join(coversDir, `${slug}.jpg`));
        manifest[slug] = {
          found: true,
          cover_url: coverUrl,
          spotify_search: spotifySearchUrl(meta.artistDisplay, meta.title),
          itunes_artist: best.artistName,
          itunes_title: best.collectionName,
          score: bestScore,
        };
        console.log(`  ${slug}: HIT score=${bestScore} (${best.artistName} - ${best.collectionName})`);
      } catch (e) {
        console.warn(`  ${slug}: download failed: ${e.message}`);
      }
    } else {
      console.log(`  ${slug}: still MISS (best score ${bestScore})`);
    }
  }

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  const finalHits = Object.values(manifest).filter((m) => m.found).length;
  const total = Object.keys(manifest).length;
  console.log(`\nManifest now ${finalHits} / ${total} hits.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
