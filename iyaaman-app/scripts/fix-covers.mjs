#!/usr/bin/env node
// Targeted re-fetch for albums where the first pass picked the wrong record
// (or rate-limited). We give it more specific search terms.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const coversDir = path.join(ROOT, "public/covers");

const FIXES = [
  // Soul Rebels / Soul Revolution / Best of the Wailers — early Wailers,
  // iTunes doesn't reliably catalog these; force the exact early titles.
  { slug: "soul-rebels", term: "Bob Marley Soul Rebels", wantTitle: "soul rebels" },
  { slug: "soul-revolution", term: "Bob Marley Soul Revolution", wantTitle: "soul revolution" },
  { slug: "best-of-wailers", term: "The Wailers Best of the Wailers", wantTitle: "best of the wailers" },
  // Catch a Fire first pass matched fine — leave it.
  // Melody Makers "Play the Game Right" — actual title not "Children Playing"
  { slug: "children-playing", term: "Melody Makers Play the Game Right", wantTitle: "play the game right" },
  // Like Father Like Son — Ky-Mani's debut
  { slug: "like-father-like-son", term: "Ky-Mani Marley Like Father Like Son", wantTitle: "like father like son" },
  // Lion in the Morning — Julian Marley debut
  { slug: "lion-in-the-morning", term: "Julian Marley A Lion in the Morning", wantTitle: "lion in the morning" },
  // Revelation Pt I & II — need full title
  { slug: "revelation-pt1", term: "Stephen Marley Revelation Part I Root of Life", wantTitle: "revelation" },
  { slug: "revelation-pt2", term: "Stephen Marley Revelation Part II Fruit of Life", wantTitle: "revelation" },
  // Awake — Julian Marley
  { slug: "awake", term: "Julian Marley Awake", wantTitle: "awake" },
  // Higher Place deluxe
  { slug: "higher-place-deluxe", term: "Skip Marley Higher Place", wantTitle: "higher place" },
  // Comfortable — JoMersa
  { slug: "comfortable", term: "JoMersa Marley Comfortable", wantTitle: "comfortable" },
  // Milestone — Ky-Mani
  { slug: "milestone", term: "Ky-Mani Marley Milestone", wantTitle: "milestone" },
];

async function search(term) {
  const url =
    "https://itunes.apple.com/search?" +
    new URLSearchParams({
      term,
      entity: "album",
      limit: "10",
      media: "music",
    }).toString();
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 BobMarleyDemo/1.0" },
  });
  if (!res.ok) throw new Error(`iTunes ${res.status}`);
  const json = await res.json();
  return json.results || [];
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

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const manifestPath = path.join(coversDir, "manifest.json");
  const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));

  // We also need artistDisplay/title for spotify URL — load from albums.ts
  const albumsSrc = await fs.readFile(path.join(ROOT, "src/lib/albums.ts"), "utf8");
  const albumMeta = new Map();
  const objRegex = /\{\s*slug:\s*"([^"]+)",[\s\S]*?title:\s*"([^"]+)",[\s\S]*?artistDisplay:\s*"([^"]+)"/g;
  let m;
  while ((m = objRegex.exec(albumsSrc))) {
    albumMeta.set(m[1], { title: m[2], artistDisplay: m[3] });
  }

  for (const fix of FIXES) {
    const meta = albumMeta.get(fix.slug);
    if (!meta) {
      console.warn(`unknown slug ${fix.slug}`);
      continue;
    }
    let coverUrl = null;
    let foundTitle = null;
    let foundArtist = null;
    try {
      const results = await search(fix.term);
      // Find the one that contains wantTitle in collectionName
      const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
      const want = norm(fix.wantTitle);
      const match = results.find((r) => norm(r.collectionName).includes(want))
        || results[0];
      if (match) {
        coverUrl = upgradeArtUrl(match.artworkUrl100);
        foundTitle = match.collectionName;
        foundArtist = match.artistName;
      }
    } catch (e) {
      console.warn(`  ${fix.slug}: search failed: ${e.message}`);
      await sleep(2000);
      continue;
    }

    if (coverUrl) {
      const dest = path.join(coversDir, `${fix.slug}.jpg`);
      try {
        await downloadImage(coverUrl, dest);
        manifest[fix.slug] = {
          found: true,
          cover_url: coverUrl,
          spotify_search: spotifySearchUrl(meta.artistDisplay, meta.title),
          itunes_artist: foundArtist,
          itunes_title: foundTitle,
        };
        console.log(`  ${fix.slug}: HIT (${foundArtist} - ${foundTitle})`);
      } catch (e) {
        console.warn(`  ${fix.slug}: download failed: ${e.message}`);
      }
    } else {
      console.log(`  ${fix.slug}: still MISS`);
    }
    await sleep(400);
  }

  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log("manifest updated");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
