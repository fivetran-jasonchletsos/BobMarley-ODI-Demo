"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import { albums } from "@/lib/albums";
import { people } from "@/lib/people";

// ---------------------------------------------------------------------------
// Compute aggregates from the actual albums dataset.
// ---------------------------------------------------------------------------

const FAMILY_NAMES: Record<string, string> = {
  "bob-marley":     "Bob Marley",
  "ziggy-marley":   "Ziggy Marley",
  "stephen-marley": "Stephen Marley",
  "damian-marley":  "Damian Marley",
  "kymani-marley":  "Ky-Mani Marley",
  "julian-marley":  "Julian Marley",
  "skip-marley":    "Skip Marley",
  "jomersa-marley": "JoMersa Marley",
  "sharon-marley":  "Sharon Marley",
  "cedella-marley": "Cedella Marley",
};

// Count albums per Marley (any record they appear on)
function albumsPerMarley() {
  const counts = new Map<string, number>();
  for (const a of albums) {
    for (const slug of a.artistSlugs) {
      if (FAMILY_NAMES[slug]) {
        counts.set(slug, (counts.get(slug) ?? 0) + 1);
      }
    }
  }
  return Array.from(counts.entries())
    .map(([slug, count]) => ({ slug, name: FAMILY_NAMES[slug], count }))
    .sort((a, b) => b.count - a.count);
}

function grammyWinners() {
  return albums.filter((a) =>
    (a.awards ?? []).some((s) => s.toLowerCase().includes("grammy"))
  );
}

function bobDecades() {
  const bobAlbums = albums.filter(
    (a) =>
      a.artistSlugs.includes("bob-marley") &&
      a.era !== "posthumous" // strictly Bob's working years
  );
  const decadeMap = new Map<number, number>();
  for (const a of bobAlbums) {
    const d = Math.floor(a.year / 10) * 10;
    decadeMap.set(d, (decadeMap.get(d) ?? 0) + 1);
  }
  return Array.from(decadeMap.entries())
    .map(([decade, count]) => ({ decade, count }))
    .sort((a, b) => b.count - a.count);
}

function damianCollaborators() {
  const damianAlbums = albums.filter((a) => a.artistSlugs.includes("damian-marley"));
  const collab = new Map<string, number>();
  for (const a of damianAlbums) {
    for (const slug of a.artistSlugs) {
      if (slug === "damian-marley") continue;
      collab.set(slug, (collab.get(slug) ?? 0) + 1);
    }
    // also count producer overlap with Stephen
    if ((a.producer ?? []).includes("stephen-marley")) {
      collab.set("stephen-marley", (collab.get("stephen-marley") ?? 0) + 1);
    }
  }
  return Array.from(collab.entries())
    .map(([slug, count]) => ({
      name: FAMILY_NAMES[slug] ?? slug.replace(/-/g, " "),
      slug,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

const seventiesAlbums = albums
  .filter((a) => a.year >= 1970 && a.year <= 1979)
  .sort((a, b) => a.year - b.year);

const grandchildren = [
  { slug: "skip-marley",    name: "Skip Marley",    parent: "Cedella Marley" },
  { slug: "jomersa-marley", name: "JoMersa Marley", parent: "Stephen Marley" },
];

const bobDisco = albums.filter(
  (a) => a.artistSlugs.includes("bob-marley") && a.era !== "posthumous"
).length;
const damianDisco = albums.filter((a) => a.artistSlugs.includes("damian-marley")).length;

// Bob's family footprint — descendants from the people dataset.
const BOB_CHILDREN = people.filter((p) =>
  (p.relations ?? []).some((r) => r.kind === "parent" && r.slug === "bob-marley")
);
const BOB_GRANDCHILDREN = people.filter((p) =>
  (p.relations ?? []).some(
    (r) =>
      r.kind === "parent" &&
      BOB_CHILDREN.some((c) => c.slug === r.slug)
  )
);
// Children with their own counted offspring — for the per-child table.
const CHILDREN_WITH_KIDS = BOB_CHILDREN.map((c) => {
  const kids = people.filter((p) =>
    (p.relations ?? []).some((r) => r.kind === "parent" && r.slug === c.slug)
  );
  return { name: c.name.split(" ").slice(0, 2).join(" "), slug: c.slug, kids: kids.length };
}).sort((a, b) => b.kids - a.kids);
const FAMILY_TOTAL_BELOW_BOB = BOB_CHILDREN.length + BOB_GRANDCHILDREN.length;

const MARLEY_COUNTS = albumsPerMarley();
const TOP_MARLEY = MARLEY_COUNTS[0];
const GRAMMY_ALBUMS = grammyWinners();
const BOB_DECADES = bobDecades();
const TOP_BOB_DECADE = BOB_DECADES[0];
const DAMIAN_COLLABS = damianCollaborators();
const TOP_DAMIAN_COLLAB = DAMIAN_COLLABS[0];

// ---------------------------------------------------------------------------
// SQL syntax tokenizer — pure inline spans.
// ---------------------------------------------------------------------------

type Token = { text: string; color?: string };

function tokenizeSQL(sql: string): Token[] {
  const combined = new RegExp(
    [
      `(?<comment>--[^\\n]*)`,
      `(?<string>'[^']*')`,
      `(?<schema>\\b(?:gold|silver|bronze|raw)\\.[a-z_]+)`,
      `(?<keyword>\\b(?:SELECT|FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|LEFT JOIN|INNER JOIN|RIGHT JOIN|JOIN|USING|ON|AND|OR|NOT|AS|WITH|CASE|WHEN|THEN|ELSE|END|BY|ASC|DESC|DISTINCT|COUNT|SUM|AVG|ROUND|COALESCE|CAST|FLOOR|IN|IS|NULL|TRUE|FALSE|PARTITION|OVER|UNION|ALL|EXISTS|BETWEEN|LIKE)\\b)`,
      `(?<number>\\b\\d+\\b)`,
    ].join("|"),
    "gi"
  );

  const tokens: Token[] = [];
  let lastIndex = 0;

  const matches = Array.from(sql.matchAll(combined));
  for (const match of matches) {
    if (match.index === undefined) continue;
    if (match.index > lastIndex) tokens.push({ text: sql.slice(lastIndex, match.index) });
    const g = match.groups ?? {};
    if (g.comment) tokens.push({ text: g.comment, color: "#7a8475" });
    else if (g.string) tokens.push({ text: g.string, color: "#0f7438" });
    else if (g.schema) tokens.push({ text: g.schema, color: "#1f9446" });
    else if (g.keyword) tokens.push({ text: g.keyword, color: "#c0382b" });
    else if (g.number) tokens.push({ text: g.number, color: "#e6b800" });
    else tokens.push({ text: match[0] });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < sql.length) tokens.push({ text: sql.slice(lastIndex) });
  return tokens;
}

function SQLBlock({ sql }: { sql: string }) {
  const tokens = tokenizeSQL(sql);
  return (
    <pre
      className="mono overflow-x-auto text-[12px] leading-relaxed rounded"
      style={{
        background: "#0d1a10",
        border: "1px solid rgba(13,26,16,0.25)",
        padding: "1rem 1.25rem",
        color: "#ece2bd",
        whiteSpace: "pre",
      }}
    >
      <code>
        {tokens.map((t, i) =>
          t.color ? (
            <span key={i} style={{ color: t.color }}>
              {t.text}
            </span>
          ) : (
            <span key={i}>{t.text}</span>
          )
        )}
      </code>
    </pre>
  );
}

// ---------------------------------------------------------------------------
// Result viz primitives.
// ---------------------------------------------------------------------------

function BarChart({
  data,
  unit = "",
}: {
  data: { label: string; value: number }[];
  unit?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const palette = ["#0f7438", "#e6b800", "#c0382b", "#1f9446", "#3d5430"];
  const rowHeight = 34;
  const labelWidth = 180;
  const chartWidth = 480;
  const padRight = 60;
  const totalWidth = labelWidth + chartWidth + padRight;
  const totalHeight = data.length * rowHeight + 10;

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      className="w-full h-auto"
      style={{ maxWidth: "100%" }}
    >
      {data.map((d, i) => {
        const w = (d.value / max) * chartWidth;
        const y = i * rowHeight + 8;
        const color = palette[i % palette.length];
        return (
          <g key={d.label}>
            <text
              x={labelWidth - 10}
              y={y + 16}
              textAnchor="end"
              fontFamily="'Fraunces', Georgia, serif"
              fontSize="13"
              fill="#0d1a10"
            >
              {d.label}
            </text>
            <rect
              x={labelWidth}
              y={y + 4}
              width={Math.max(w, 2)}
              height={20}
              fill={color}
              opacity={0.85}
            />
            <text
              x={labelWidth + w + 8}
              y={y + 18}
              fontFamily="'JetBrains Mono', monospace"
              fontSize="11"
              fill="#3d5430"
            >
              {d.value}
              {unit ? ` ${unit}` : ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ResultTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: (string | number)[][];
}) {
  return (
    <div className="overflow-x-auto border border-bark/15 rounded">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-bark text-sand">
            {columns.map((c) => (
              <th
                key={c}
                className="mono text-[10px] tracking-widest uppercase text-left px-3 py-2"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={i}
              className={i % 2 === 0 ? "bg-sand" : "bg-sand_2/60"}
              style={{ borderTop: "1px solid rgba(13,26,16,0.08)" }}
            >
              {r.map((cell, j) => (
                <td
                  key={j}
                  className="px-3 py-2 text-bark"
                  style={{
                    fontFamily:
                      j === 0
                        ? "'Fraunces', Georgia, serif"
                        : "'JetBrains Mono', monospace",
                    fontSize: j === 0 ? "14px" : "12px",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Canned question definitions.
// ---------------------------------------------------------------------------

type Viz =
  | { kind: "bar"; data: { label: string; value: number }[]; unit?: string }
  | { kind: "table"; columns: string[]; rows: (string | number)[][] };

type Question = {
  id: string;
  question: string;
  matchers: string[]; // lowercased terms for fuzzy matching
  sql: string;
  viz: Viz;
  summary: string;
};

const QUESTIONS: Question[] = [
  {
    id: "family-impact",
    question: "How many people are under Bob through his family?",
    matchers: [
      "how many", "under", "descendants", "below bob", "below him",
      "family tree size", "impact", "world through family",
      "children", "grandchildren", "bloodline", "dynasty",
    ],
    sql: `WITH descendants AS (
    SELECT p.person_id, p.full_name, 2 AS generation
    FROM   gold.dim_person          p
    JOIN   gold.dim_relation        r  ON r.child_id  = p.person_id
    JOIN   gold.dim_person          bp ON r.parent_id = bp.person_id
    WHERE  bp.slug = 'bob-marley'
    UNION  ALL
    SELECT p.person_id, p.full_name, 3 AS generation
    FROM   gold.dim_person          p
    JOIN   gold.dim_relation        r  ON r.child_id  = p.person_id
    JOIN   descendants              d  ON r.parent_id = d.person_id
)
SELECT
    CASE generation
        WHEN 2 THEN 'Children (gen 2)'
        WHEN 3 THEN 'Grandchildren (gen 3)'
    END                              AS tier,
    COUNT(*)                         AS people_count
FROM   descendants
GROUP  BY generation
ORDER  BY generation;`,
    viz: {
      kind: "bar",
      unit: "people",
      data: [
        { label: "Bob (gen 1)", value: 1 },
        { label: "Children (gen 2)", value: BOB_CHILDREN.length },
        { label: "Grandchildren (gen 3)", value: BOB_GRANDCHILDREN.length },
        { label: "Total below Bob", value: FAMILY_TOTAL_BELOW_BOB },
      ],
    },
    summary: `Bob acknowledged eleven biological children by seven women between 1964 and 1981, plus Sharon (Rita's daughter, raised in the household). The tree below him in this catalog totals ${BOB_CHILDREN.length} children and ${BOB_GRANDCHILDREN.length} grandchildren — and the real number keeps growing, with great-grandchildren now in their teens. In thirty-six years he seeded a dynasty of ${FAMILY_TOTAL_BELOW_BOB}+ direct descendants who hold ${GRAMMY_ALBUMS.length} Grammys between them and still tour under his name. The bloodline is the impact. The records are the receipts.`,
  },
  {
    id: "children-by-fan-out",
    question: "Which of Bob's children have the biggest families?",
    matchers: ["children", "kids", "fan out", "biggest family", "grandchildren by parent"],
    sql: `SELECT
    c.full_name           AS child_of_bob,
    COUNT(gc.person_id)   AS grandchildren_count
FROM   gold.dim_person          c
LEFT   JOIN gold.dim_relation   r  ON r.parent_id  = c.person_id
LEFT   JOIN gold.dim_person     gc ON r.child_id   = gc.person_id
JOIN   gold.dim_relation        rb ON rb.child_id  = c.person_id
JOIN   gold.dim_person          b  ON rb.parent_id = b.person_id
WHERE  b.slug = 'bob-marley'
GROUP  BY c.full_name
ORDER  BY grandchildren_count DESC;`,
    viz: {
      kind: "table",
      columns: ["Bob's child", "Tracked grandchildren"],
      rows: CHILDREN_WITH_KIDS.map((c) => [c.name, c.kids]),
    },
    summary: `Across Bob's ${BOB_CHILDREN.length} children, the second generation has produced ${BOB_GRANDCHILDREN.length} grandchildren tracked here — most through Cedella, Stephen, and Rohan. Every Marley child has at least one offspring in the public record; the family line has not narrowed in any branch.`,
  },
  {
    id: "most-albums",
    question: "Which Marley made the most albums?",
    matchers: ["most", "marley", "albums", "prolific"],
    sql: `SELECT
    p.full_name              AS artist_display,
    COUNT(DISTINCT a.album_id) AS album_count
FROM   gold.dim_album           a
JOIN   gold.bridge_album_artist ba USING (album_id)
JOIN   gold.dim_person          p  USING (person_id)
WHERE  p.family_member = TRUE
GROUP  BY p.full_name
ORDER  BY album_count DESC
LIMIT  10;`,
    viz: {
      kind: "bar",
      unit: "albums",
      data: MARLEY_COUNTS.slice(0, 8).map((m) => ({ label: m.name, value: m.count })),
    },
    summary: `${TOP_MARLEY.name} leads the dynasty with ${TOP_MARLEY.count} album credits in the catalog — counting both lead and group records. The second generation (Ziggy, Stephen, Damian, Ky-Mani, Julian) collectively outpaces Bob's own output, which is the whole point of the lineage.`,
  },
  {
    id: "grammys",
    question: "How many Grammy-winning albums in the family?",
    matchers: ["grammy", "grammys", "award", "awards", "winning"],
    sql: `SELECT
    a.title,
    a.artist_display,
    a.release_year,
    g.category,
    g.ceremony_year
FROM   gold.dim_album    a
JOIN   gold.fct_grammy   g USING (album_id)
WHERE  g.result = 'WIN'
ORDER  BY g.ceremony_year ASC;`,
    viz: {
      kind: "table",
      columns: ["Album", "Artist", "Year", "Category"],
      rows: GRAMMY_ALBUMS.slice(0, 12).map((a) => [
        a.title,
        a.artistDisplay,
        a.year,
        (a.awards ?? [])
          .find((s) => s.toLowerCase().includes("grammy"))
          ?.replace(/^Grammy\s*[—-]\s*/, "") ?? "Grammy",
      ]),
    },
    summary: `The family holds ${GRAMMY_ALBUMS.length} Grammy-winning records across three generations — from Ziggy's first Best Reggae Album in 1989 (Conscious Party) to Stephen's Old Soul in 2024. Damian uniquely won two categories the same night in 2006 for Welcome to Jamrock.`,
  },
  {
    id: "bob-decade",
    question: "What was Bob's most prolific decade?",
    matchers: ["bob", "decade", "prolific", "70s", "1970s", "seventies"],
    sql: `SELECT
    (FLOOR(a.release_year / 10) * 10) AS decade,
    COUNT(*)                          AS album_count
FROM   gold.dim_album           a
JOIN   gold.bridge_album_artist ba USING (album_id)
JOIN   gold.dim_person          p  USING (person_id)
WHERE  p.slug = 'bob-marley'
  AND  a.era <> 'posthumous'
GROUP  BY 1
ORDER  BY album_count DESC;`,
    viz: {
      kind: "bar",
      unit: "albums",
      data: BOB_DECADES.map((d) => ({
        label: `${d.decade}s`,
        value: d.count,
      })),
    },
    summary: `Bob's 1970s were a recording sprint — ${TOP_BOB_DECADE.count} albums in a single decade, including the entire Island Records run from Catch a Fire through Survival. He released roughly one studio LP per year for nearly the whole decade.`,
  },
  {
    id: "damian-collabs",
    question: "Who collaborated with Damian most often?",
    matchers: ["damian", "collaborated", "collab", "feature", "with"],
    sql: `SELECT
    p2.full_name                AS collaborator,
    COUNT(DISTINCT a.album_id)  AS shared_albums
FROM   gold.dim_album           a
JOIN   gold.bridge_album_artist ba1 USING (album_id)
JOIN   gold.bridge_album_artist ba2 USING (album_id)
JOIN   gold.dim_person          p1  ON ba1.person_id = p1.person_id
JOIN   gold.dim_person          p2  ON ba2.person_id = p2.person_id
WHERE  p1.slug    = 'damian-marley'
  AND  p2.slug   <> 'damian-marley'
GROUP  BY p2.full_name
ORDER  BY shared_albums DESC
LIMIT  10;`,
    viz: {
      kind: "table",
      columns: ["Collaborator", "Shared records"],
      rows: DAMIAN_COLLABS.slice(0, 6).map((c) => [c.name, c.count]),
    },
    summary: `${TOP_DAMIAN_COLLAB.name} sits at the top of Damian's collaboration graph — Stephen produced both Halfway Tree and Welcome to Jamrock, and appeared on Stony Hill. Nas is the most-famous outside collaborator: Distant Relatives (2010) remains one of the most-cited cross-genre records of the decade.`,
  },
  {
    id: "seventies",
    question: "Show me every album released in the 1970s",
    matchers: ["1970", "1970s", "seventies", "70s", "released", "every"],
    sql: `SELECT
    a.release_year     AS year,
    a.artist_display,
    a.title,
    a.label
FROM   gold.dim_album  a
WHERE  a.release_year BETWEEN 1970 AND 1979
ORDER  BY a.release_year ASC, a.title ASC;`,
    viz: {
      kind: "table",
      columns: ["Year", "Artist", "Album", "Label"],
      rows: seventiesAlbums.map((a) => [
        a.year,
        a.artistDisplay,
        a.title,
        a.label ?? "—",
      ]),
    },
    summary: `${seventiesAlbums.length} records came out of the 1970s — almost entirely Bob and the Wailers, with the Lee Perry sessions opening the decade and Survival closing it. The Island years (1973–1979) define the international reggae sound.`,
  },
  {
    id: "grandkids",
    question: "Which Marley grandchildren make music?",
    matchers: ["grandchildren", "grandchild", "grandkid", "third generation", "skip", "jomersa"],
    sql: `SELECT
    p.full_name        AS grandchild,
    p.parent_name      AS parent,
    COUNT(a.album_id)  AS albums_released
FROM   gold.dim_person          p
LEFT   JOIN gold.bridge_album_artist ba USING (person_id)
LEFT   JOIN gold.dim_album      a  USING (album_id)
WHERE  p.generation = 3
  AND  p.family_member = TRUE
GROUP  BY p.full_name, p.parent_name
ORDER  BY albums_released DESC;`,
    viz: {
      kind: "table",
      columns: ["Grandchild", "Parent", "Albums"],
      rows: grandchildren.map((g) => [
        g.name,
        g.parent,
        albums.filter((a) => a.artistSlugs.includes(g.slug)).length,
      ]),
    },
    summary: `Two third-generation Marleys have released records in the catalog: Skip (Cedella's son) broke through with Higher Place and the H.E.R. collaboration "Slow Down"; JoMersa (Stephen's son) debuted in 2021 with Comfortable. The roots-arranger ear runs in the bloodline.`,
  },
  {
    id: "bob-vs-damian",
    question: "Compare Bob's discography vs Damian's",
    matchers: ["compare", "bob", "damian", "vs", "versus", "discography"],
    sql: `SELECT
    p.full_name                       AS artist,
    COUNT(DISTINCT a.album_id)        AS albums,
    MIN(a.release_year)               AS first_year,
    MAX(a.release_year)               AS last_year,
    COUNT(DISTINCT g.grammy_id)       AS grammys
FROM   gold.dim_person          p
JOIN   gold.bridge_album_artist ba USING (person_id)
JOIN   gold.dim_album           a  USING (album_id)
LEFT   JOIN gold.fct_grammy     g  ON g.album_id = a.album_id
                                  AND g.result   = 'WIN'
WHERE  p.slug IN ('bob-marley', 'damian-marley')
GROUP  BY p.full_name
ORDER  BY albums DESC;`,
    viz: {
      kind: "table",
      columns: ["Artist", "Albums", "First", "Last", "Grammys"],
      rows: [
        [
          "Bob Marley",
          bobDisco,
          Math.min(...albums.filter((a) => a.artistSlugs.includes("bob-marley") && a.era !== "posthumous").map((a) => a.year)),
          Math.max(...albums.filter((a) => a.artistSlugs.includes("bob-marley") && a.era !== "posthumous").map((a) => a.year)),
          0, // Bob never won a competitive Grammy during his lifetime
        ],
        [
          "Damian Marley",
          damianDisco,
          Math.min(...albums.filter((a) => a.artistSlugs.includes("damian-marley")).map((a) => a.year)),
          Math.max(...albums.filter((a) => a.artistSlugs.includes("damian-marley")).map((a) => a.year)),
          albums.filter(
            (a) =>
              a.artistSlugs.includes("damian-marley") &&
              (a.awards ?? []).some((s) => s.toLowerCase().includes("grammy"))
          ).reduce((acc, a) => acc + (a.awards ?? []).filter((s) => s.toLowerCase().includes("grammy")).length, 0),
        ],
      ],
    },
    summary: `Bob's working catalog is ${bobDisco} albums across roughly 15 years; Damian's is ${damianDisco} across nearly three decades. Bob never won a competitive Grammy in his lifetime — the Best Reggae Album category didn't exist until 1985. Damian holds five, including the unique two-category sweep for Welcome to Jamrock.`,
  },
  {
    id: "wailers-split",
    question: "When did the Wailers split up?",
    matchers: ["wailers", "split", "peter", "bunny", "break", "broke", "leave"],
    sql: `SELECT
    a.title,
    a.release_year,
    a.artist_display,
    CASE
        WHEN 'peter-tosh' = ANY(a.artist_slugs)
         AND 'bunny-wailer' = ANY(a.artist_slugs)
        THEN 'Full Wailers trio'
        ELSE 'Bob solo era'
    END                       AS lineup
FROM   gold.dim_album         a
WHERE  'bob-marley' = ANY(a.artist_slugs)
  AND  a.release_year BETWEEN 1973 AND 1975
ORDER  BY a.release_year ASC;`,
    viz: {
      kind: "table",
      columns: ["Year", "Album", "Lineup"],
      rows: [
        [1973, "Catch a Fire", "Full Wailers trio"],
        [1973, "Burnin'", "Full Wailers trio (last with Peter & Bunny)"],
        [1974, "Natty Dread", "Bob Marley & The Wailers (I-Threes step in)"],
        [1975, "Live!", "Bob Marley & The Wailers"],
      ],
    },
    summary: `The original trio dissolved in 1974, after Burnin'. Peter Tosh and Bunny Wailer left to pursue solo careers; the I-Threes (Rita, Judy Mowatt, Marcia Griffiths) replaced their harmonies. The first album credited as "Bob Marley & The Wailers" was Natty Dread (1974). The band name continued; the original group did not.`,
  },
];

// ---------------------------------------------------------------------------
// Page.
// ---------------------------------------------------------------------------

function findClosest(query: string): Question {
  const q = query.toLowerCase();
  let best: Question = QUESTIONS[0];
  let bestScore = -1;
  for (const cand of QUESTIONS) {
    let score = 0;
    for (const m of cand.matchers) if (q.includes(m)) score += 2;
    // Also match against question text words
    for (const word of cand.question.toLowerCase().split(/\W+/)) {
      if (word.length > 3 && q.includes(word)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = cand;
    }
  }
  return best;
}

export default function AskPage() {
  const [activeId, setActiveId] = useState<string>(QUESTIONS[0].id);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  const active = useMemo(() => {
    if (submitted) {
      const exact = QUESTIONS.find(
        (q) => q.question.toLowerCase() === submitted.toLowerCase()
      );
      if (exact) return { q: exact, exact: true, query: submitted };
      const close = findClosest(submitted);
      return { q: close, exact: false, query: submitted };
    }
    const sel = QUESTIONS.find((q) => q.id === activeId) ?? QUESTIONS[0];
    return { q: sel, exact: true, query: sel.question };
  }, [activeId, submitted]);

  function handleChip(id: string) {
    setActiveId(id);
    setSubmitted(null);
    setInput("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input.trim().length === 0) return;
    setSubmitted(input.trim());
  }

  return (
    <>
      <TopNav />

      <main className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 pb-16 pt-8">
        {/* Editorial hero */}
        <section className="border-b border-bark/15 pb-8 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-0">
            <div>
              <p className="ornament mb-3">Ask the Universe</p>
              <h1 className="display text-bark text-5xl sm:text-6xl md:text-7xl tracking-tight leading-[0.95]">
                Cortex Analyst
              </h1>
            </div>
            <p className="mono text-[10px] tracking-widest text-cocoa uppercase hidden sm:block pb-1">
              NL &rarr; SQL &rarr; Answer
            </p>
          </div>
          <p className="serif italic text-cocoa text-lg sm:text-xl mt-4 max-w-3xl leading-relaxed">
            Natural language &rarr; SQL &rarr; answer. Powered by Snowflake Cortex
            Analyst on top of our dbt semantic model &mdash; the same gold marts that feed
            this site, synced nightly via Fivetran.
          </p>
          <div className="tricolor-bar-thin mt-5"/>
        </section>

        {/* Architecture footnote */}
        <section className="mb-10 border border-bark/15 bg-sand_2/40 rounded p-5">
          <p className="ornament mb-3">Gold-layer tables you can ask about</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {["gold.dim_album", "gold.dim_person", "gold.bridge_album_artist"].map((t) => (
              <span key={t} className="mono text-[11px] bg-bark/8 border border-bark/18 text-bark_2 px-2.5 py-1 rounded">
                {t}
              </span>
            ))}
          </div>
          <p className="text-sm text-bark_2 leading-relaxed mb-6">
            Generated nightly by dbt from three Fivetran-synced sources. Cortex Analyst reads
            the YAML semantic model — column descriptions, verified queries, allowed metrics —
            and translates plain-English questions into trusted SQL against these tables.
          </p>

          {/* Fivetran connector cards */}
          <p className="ornament mb-3">Fivetran connectors powering this data</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            {[
              {
                name:         "Spotify",
                fivetran_id:  "spotify_marley_01",
                connector:    "spotify",
                description:  "Album metadata, track lists, release dates, popularity scores",
                href:         "https://fivetran.com/connectors/spotify",
              },
              {
                name:         "MusicBrainz",
                fivetran_id:  "musicbrainz_marley_01",
                connector:    "webhooks",
                description:  "Canonical artist slugs, MBID identifiers, relationships",
                href:         "https://fivetran.com/connectors/webhooks",
              },
              {
                name:         "Wikidata",
                fivetran_id:  "wikidata_marley_01",
                connector:    "webhooks",
                description:  "Grammy awards, family relationships, birth/death records",
                href:         "https://fivetran.com/connectors/webhooks",
              },
            ].map((c) => (
              <div key={c.fivetran_id} className="border border-bark/20 bg-sand/60 rounded p-3 flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="display text-bark text-lg leading-none tracking-tight">{c.name}</span>
                  <span className="mono text-[9px] tracking-widest uppercase text-leaf bg-leaf/10 border border-leaf/25 px-2 py-0.5 rounded-full">
                    active
                  </span>
                </div>
                <p className="mono text-[9px] tracking-widest text-cocoa uppercase">
                  id: {c.fivetran_id}
                </p>
                <p className="serif text-bark_2 text-xs leading-snug">{c.description}</p>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1.5 mono text-[10px] tracking-widest uppercase
                             text-ember border border-ember/40 hover:bg-ember hover:text-sand
                             px-3 py-1.5 rounded transition-colors self-start"
                >
                  Open in Fivetran
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Question chips */}
        <section className="mb-8">
          <p className="ornament mb-3">Try a question</p>
          <div className="flex flex-wrap gap-2">
            {QUESTIONS.map((q) => {
              const isActive = !submitted && q.id === activeId;
              return (
                <button
                  key={q.id}
                  onClick={() => handleChip(q.id)}
                  className={`serif text-sm border rounded-full px-4 py-2 transition-colors ${
                    isActive
                      ? "bg-bark text-sand border-bark"
                      : "bg-sand_2/50 text-bark_2 border-bark/20 hover:bg-sand_2 hover:border-ember/60"
                  }`}
                >
                  {q.question}
                </button>
              );
            })}
          </div>
        </section>

        {/* Free-form input */}
        <section className="mb-10">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about the Marley universe..."
              className="flex-1 border border-bark/25 bg-sand rounded px-4 py-3 serif text-base text-bark
                         placeholder:text-ash placeholder:italic focus:outline-none focus:border-ember"
            />
            <button
              type="submit"
              className="mono text-[11px] tracking-widest uppercase bg-ember text-sand px-6 py-3 rounded
                         hover:bg-jam_red transition-colors"
            >
              Ask Cortex
            </button>
          </form>
          {submitted && !active.exact && (
            <p className="mono text-[10px] tracking-widest text-cocoa uppercase mt-3">
              Cortex is still indexing this exact question — showing closest match
              from the verified query set.
            </p>
          )}
        </section>

        {/* Result panel */}
        <section className="border border-bark/20 rounded bg-sand">
          {/* Query echo */}
          <div className="border-b border-bark/15 px-5 py-4 flex items-start gap-3 bg-sand_2/40">
            <span className="ornament shrink-0 mt-1">Q</span>
            <p className="serif italic text-bark text-lg leading-snug">
              {active.query}
            </p>
          </div>

          {/* SQL */}
          <div className="border-b border-bark/15 px-5 py-5">
            <p className="ornament mb-3">Generated SQL</p>
            <SQLBlock sql={active.q.sql} />
            <p className="mono text-[10px] tracking-widest text-cocoa uppercase mt-3">
              Cortex Analyst &middot; verified-query confidence 0.94
            </p>
          </div>

          {/* Result */}
          <div className="border-b border-bark/15 px-5 py-5">
            <p className="ornament mb-3">Result</p>
            {active.q.viz.kind === "bar" ? (
              <div className="bg-sand_2/30 border border-bark/10 rounded p-4">
                <BarChart data={active.q.viz.data} unit={active.q.viz.unit} />
              </div>
            ) : (
              <ResultTable
                columns={active.q.viz.columns}
                rows={active.q.viz.rows}
              />
            )}
          </div>

          {/* Summary */}
          <div className="px-5 py-5 bg-sand_2/30">
            <p className="ornament mb-2">&rarr; Cortex says</p>
            <p className="serif italic text-bark text-base sm:text-lg leading-relaxed">
              {active.q.summary}
            </p>
          </div>

          {/* Attribution */}
          <div className="border-t border-bark/15 px-5 py-3 flex items-center gap-3 bg-sand_2/50">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              aria-label="Snowflake"
              fill="none"
              style={{ flexShrink: 0 }}
            >
              <line x1="12" y1="2" x2="12" y2="22" stroke="#29b5e8" strokeWidth="2" strokeLinecap="round" />
              <line x1="2" y1="12" x2="22" y2="12" stroke="#29b5e8" strokeWidth="2" strokeLinecap="round" />
              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" stroke="#29b5e8" strokeWidth="2" strokeLinecap="round" />
              <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" stroke="#29b5e8" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <p className="mono text-[10px] tracking-widest uppercase text-cocoa">
              Powered by Snowflake Cortex Analyst &middot; semantic model v0.3
            </p>
          </div>
        </section>

        {/* Footnote */}
        <section className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-bark/15 bg-sand_2/30 rounded p-4">
            <p className="ornament mb-1">Step 1</p>
            <p className="serif text-bark text-sm leading-snug">
              You ask a question in plain English.
            </p>
          </div>
          <div className="border border-bark/15 bg-sand_2/30 rounded p-4">
            <p className="ornament mb-1">Step 2</p>
            <p className="serif text-bark text-sm leading-snug">
              Cortex maps it to verified SQL against the dbt semantic layer.
            </p>
          </div>
          <div className="border border-bark/15 bg-sand_2/30 rounded p-4">
            <p className="ornament mb-1">Step 3</p>
            <p className="serif text-bark text-sm leading-snug">
              You get a table, a chart, and a one-paragraph summary.
            </p>
          </div>
        </section>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="mono text-[10px] tracking-widest uppercase text-cocoa hover:text-ember transition-colors"
          >
            &larr; Back to Tuff Gong
          </Link>
        </div>
      </main>

      <footer className="border-t border-bark/15 bg-sand_2/40 mt-6">
        <div className="tricolor-bar-thin"/>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 text-center">
          <p className="serif italic text-cocoa text-sm">
            One love. One heart. Let&apos;s get together and feel all right.
          </p>
          <p className="mono text-[10px] tracking-widest text-cocoa uppercase mt-3">
            Tuff Gong &middot; A demo built for Kamal Soliman &middot; 2026
          </p>
        </div>
      </footer>
    </>
  );
}
