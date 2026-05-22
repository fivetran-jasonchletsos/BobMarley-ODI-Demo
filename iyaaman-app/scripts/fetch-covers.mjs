#!/usr/bin/env node
// Fetch album cover art from iTunes Search API for every album in src/lib/albums.ts.
// Writes high-res JPGs to public/covers/<slug>.jpg and a manifest at
// public/covers/manifest.json mapping slug -> { cover_url, spotify_search, found }.

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

async function loadAlbums() {
  const src = await fs.readFile(
    path.join(ROOT, "src/lib/albums.ts"),
    "utf8",
  );
  // Pluck { slug, title, artistDisplay, year } via a forgiving regex.
  const entries = [];
  const objRegex = /\{\s*slug:\s*"([^"]+)",[\s\S]*?title:\s*"([^"]+)",[\s\S]*?artistDisplay:\s*"([^"]+)",[\s\S]*?year:\s*(\d{4})/g;
  let m;
  while ((m = objRegex.exec(src))) {
    entries.push({
      slug: m[1],
      title: m[2],
      artistDisplay: m[3],
      year: Number(m[4]),
    });
  }
  return entries;
}

function spotifySearchUrl(artist, title) {
  return `https://open.spotify.com/search/${encodeURIComponent(
    `${artist} ${title}`,
  )}`;
}

// Clean billing names so iTunes finds them. iTunes indexes Bob Marley records
// under "Bob Marley & the Wailers" already, but other quirks (Jr. Gong tag,
// Melody Makers prefix) trip the search.
function cleanArtist(name) {
  return name
    .replace(/\s+&\s+The Melody Makers/i, "")
    .replace(/Ziggy Marley & The Melody Makers/i, "Ziggy Marley")
    .replace(/"Jr\. Gong" /i, "")
    .replace(/'Jr\. Gong' /i, "")
    .replace(/Damian .?Jr\. Gong.? Marley/i, "Damian Marley")
    .replace(/Nas & Damian .?Jr\. Gong.? Marley/i, "Nas Damian Marley")
    .replace(/Julian Marley & Antaeus/i, "Julian Marley");
}

function cleanTitle(title) {
  return title
    .replace(/\s*\(Deluxe\)\s*$/i, " Deluxe")
    .replace(/\s*\.{3}.*$/i, "") // strip subtitles after "..."
    .replace(/:\s.+$/i, "");      // strip subtitles after ":"
}

async function search(term) {
  const url =
    "https://itunes.apple.com/search?" +
    new URLSearchParams({
      term,
      entity: "album",
      limit: "5",
      media: "music",
    }).toString();
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 BobMarleyDemo/1.0" },
  });
  if (!res.ok) throw new Error(`iTunes ${res.status}`);
  const json = await res.json();
  return json.results || [];
}

function pickBest(results, wantTitle, wantArtist, wantYear) {
  if (results.length === 0) return null;
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const wantT = norm(wantTitle);
  const wantA = norm(wantArtist);
  // Prefer matches whose collectionName starts with the target title and
  // whose release year is within +/-1 of the target.
  let best = null;
  let bestScore = -Infinity;
  for (const r of results) {
    const cn = norm(r.collectionName || "");
    const an = norm(r.artistName || "");
    const ry = r.releaseDate ? Number(r.releaseDate.slice(0, 4)) : 0;
    let score = 0;
    if (cn.startsWith(wantT)) score += 10;
    else if (cn.includes(wantT)) score += 5;
    if (an.includes(wantA) || wantA.includes(an)) score += 6;
    if (ry && Math.abs(ry - wantYear) <= 1) score += 5;
    else if (ry && Math.abs(ry - wantYear) <= 3) score += 2;
    if (score > bestScore) {
      bestScore = score;
      best = r;
    }
  }
  return best;
}

function upgradeArtUrl(url) {
  if (!url) return null;
  // iTunes returns 100x100; bump to 600x600.
  return url.replace(/\/\d+x\d+bb\./, "/600x600bb.");
}

async function downloadImage(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`image ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buf);
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const albums = await loadAlbums();
  console.log(`Loaded ${albums.length} albums from src/lib/albums.ts`);

  const coversDir = path.join(ROOT, "public/covers");
  await fs.mkdir(coversDir, { recursive: true });

  const manifest = {};
  let hits = 0;
  let misses = 0;

  for (const a of albums) {
    const artistQ = cleanArtist(a.artistDisplay);
    const titleQ = cleanTitle(a.title);
    const term = `${artistQ} ${titleQ}`;
    let coverUrl = null;
    let foundTitle = null;
    let foundArtist = null;
    try {
      const results = await search(term);
      const best = pickBest(results, titleQ, artistQ, a.year);
      if (best) {
        coverUrl = upgradeArtUrl(best.artworkUrl100);
        foundTitle = best.collectionName;
        foundArtist = best.artistName;
      }
    } catch (e) {
      console.warn(`  search failed for ${a.slug}: ${e.message}`);
    }

    if (coverUrl) {
      const dest = path.join(coversDir, `${a.slug}.jpg`);
      try {
        await downloadImage(coverUrl, dest);
        manifest[a.slug] = {
          found: true,
          cover_url: coverUrl,
          spotify_search: spotifySearchUrl(a.artistDisplay, a.title),
          itunes_artist: foundArtist,
          itunes_title: foundTitle,
        };
        hits++;
        console.log(`  ${a.slug}: HIT (${foundArtist} - ${foundTitle})`);
      } catch (e) {
        manifest[a.slug] = {
          found: false,
          spotify_search: spotifySearchUrl(a.artistDisplay, a.title),
          error: `download: ${e.message}`,
        };
        misses++;
        console.warn(`  ${a.slug}: download failed: ${e.message}`);
      }
    } else {
      manifest[a.slug] = {
        found: false,
        spotify_search: spotifySearchUrl(a.artistDisplay, a.title),
      };
      misses++;
      console.log(`  ${a.slug}: MISS`);
    }

    // Be nice to the API.
    await sleep(120);
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
