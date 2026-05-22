"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import TopNav from "@/components/TopNav";
import AlbumCover from "@/components/AlbumCover";
import { albums } from "@/lib/albums";

// ---------------------------------------------------------------------------
// "Which Marley record matches you" — three questions, weighted score per
// candidate album, top match wins. Hand-tuned weights, not ML. The point is
// to give a confident, evocative answer — not a probability distribution.
// ---------------------------------------------------------------------------

type Answer = {
  key: string;
  label: string;
  sub: string;            // sub-line in the answer card
  scores: Record<string, number>; // album slug → points
};

type Quiz = {
  id: string;
  prompt: string;
  intro: string;
  answers: Answer[];      // exactly 4
};

// Candidate albums in the matching pool. Hand-picked — these are the records
// that feel like they have a "personality" you can match to.
const POOL = [
  "catch-a-fire", "burnin", "natty-dread", "rastaman-vibration",
  "exodus", "kaya", "survival", "uprising", "legend",
  "welcome-to-jamrock", "distant-relatives", "stony-hill",
  "conscious-party", "halfway-tree", "mr-marley",
];

const QUIZ: Quiz[] = [
  {
    id: "q1",
    prompt: "What do you bring to the road?",
    intro: "Pick the one that fits this week. Not your whole life — just the week you're in.",
    answers: [
      {
        key: "fire",
        label: "Fire and a flag",
        sub: "Something to fight for. Loud, urgent, eyes open.",
        scores: {
          "burnin": 3, "survival": 3, "uprising": 2,
          "rastaman-vibration": 2, "natty-dread": 2, "stony-hill": 1,
        },
      },
      {
        key: "love",
        label: "Open windows and an open heart",
        sub: "Sunshine. Someone to drive toward.",
        scores: {
          "kaya": 3, "exodus": 3, "legend": 2,
          "rastaman-vibration": 1, "halfway-tree": 1,
        },
      },
      {
        key: "think",
        label: "A long pause to think",
        sub: "Looking back, looking forward. Quiet first.",
        scores: {
          "uprising": 3, "exodus": 2, "natty-dread": 2,
          "survival": 1, "kaya": 1, "mr-marley": 1,
        },
      },
      {
        key: "energy",
        label: "A speaker that won't quit",
        sub: "Crossover energy. Hip-hop in the rear-view.",
        scores: {
          "welcome-to-jamrock": 3, "distant-relatives": 3,
          "stony-hill": 2, "halfway-tree": 2, "conscious-party": 1,
        },
      },
    ],
  },
  {
    id: "q2",
    prompt: "Which Marley calls you in?",
    intro: "First voice you hear when you press play.",
    answers: [
      {
        key: "bob",
        label: "Bob — the source",
        sub: "Center of gravity. Where it all comes from.",
        scores: {
          "catch-a-fire": 3, "exodus": 3, "natty-dread": 3,
          "burnin": 2, "rastaman-vibration": 2, "uprising": 2,
          "kaya": 2, "survival": 2, "legend": 2,
        },
      },
      {
        key: "damian",
        label: "Damian — the inheritor",
        sub: "Jr. Gong. The hip-hop chassis under the reggae body.",
        scores: {
          "welcome-to-jamrock": 4, "distant-relatives": 4,
          "stony-hill": 3, "halfway-tree": 3, "mr-marley": 2,
        },
      },
      {
        key: "second-gen",
        label: "Stephen or Ziggy — the producers' kids",
        sub: "Roots arranger ear. The bloodline kept the engineering.",
        scores: {
          "conscious-party": 4, "stony-hill": 2,
          "welcome-to-jamrock": 2, "halfway-tree": 2,
        },
      },
      {
        key: "all",
        label: "Open to whoever shows up",
        sub: "Whichever record the room calls for.",
        scores: {
          "legend": 3, "exodus": 2, "kaya": 1, "uprising": 1,
          "welcome-to-jamrock": 1, "conscious-party": 1,
        },
      },
    ],
  },
  {
    id: "q3",
    prompt: "What's the weather where you're listening?",
    intro: "Honestly. Outside your window, inside your head.",
    answers: [
      {
        key: "kingston",
        label: "Kingston midday sun",
        sub: "Hot, bright, no clouds, everything turned up.",
        scores: {
          "catch-a-fire": 3, "rastaman-vibration": 3,
          "exodus": 2, "halfway-tree": 2,
          "natty-dread": 1, "legend": 1,
        },
      },
      {
        key: "autumn",
        label: "Stockholm autumn 1977",
        sub: "Cooling off. Reflective. Inside a long jacket.",
        scores: {
          "kaya": 3, "exodus": 3, "survival": 2,
          "uprising": 2, "mr-marley": 1,
        },
      },
      {
        key: "festival",
        label: "American festival, sunset set",
        sub: "Twenty thousand people, beer in plastic cups.",
        scores: {
          "welcome-to-jamrock": 3, "conscious-party": 3,
          "distant-relatives": 2, "legend": 2, "stony-hill": 1,
        },
      },
      {
        key: "night",
        label: "Night drive, fog, brake lights",
        sub: "Long highway. The voice is the only company.",
        scores: {
          "distant-relatives": 3, "uprising": 3,
          "stony-hill": 2, "survival": 2, "burnin": 1,
        },
      },
    ],
  },
];

// Hand-written "why this album" explanation, keyed by album slug.
const WHY: Record<string, string> = {
  "catch-a-fire":
    "The first Wailers record to leave Jamaica. You wanted the source plus the brightness — that's this one.",
  "burnin":
    "The last record by the actual Wailers. You said fire and a flag, and this is the album that has both, plus Peter and Bunny still in the room.",
  "natty-dread":
    "The pivot record. Bob solo with the I-Threes for the first time. You picked introspection plus the source; this is the album he made when he became himself.",
  "rastaman-vibration":
    "First Bob record to break the US Top 10. You wanted Kingston sunshine plus something a little angry. This is exactly that.",
  "exodus":
    "Time called this the album of the century. You won't get a more universal Bob record than this — and your answers lined up on it from every direction.",
  "kaya":
    "The soft one critics underestimated in 1978. You picked love and an autumn jacket — this is the album that was made for that exact configuration.",
  "survival":
    "Forty African flags on the cover. You picked fire and reflection — this is the protest record Bob made the year before Zimbabwe.",
  "uprising":
    "The last record Bob finished. Redemption Song closes it acoustic, alone. You picked thinking and night driving — those are the conditions this album was made for.",
  "legend":
    "The compilation that ate the catalog. You picked open-to-whoever and bright weather — this is the most-played reggae record in human history for exactly that reason.",
  "welcome-to-jamrock":
    "Two Grammys in one night, two categories. You picked Damian and the speaker that won't quit — there is no album more for you in this catalog than this one.",
  "distant-relatives":
    "Damian and Nas, three years in the making. You picked crossover energy and a long drive — this is the hip-hop-reggae border album for exactly that mood.",
  "stony-hill":
    "Damian's twelve-year follow-up to Welcome to Jamrock. You picked Jr. Gong plus something a little moodier — this is what he made when he came back.",
  "conscious-party":
    "Ziggy's first Grammy, 1989, produced by Talking Heads' rhythm section. You picked second-generation and festival energy — this is the album that proved the dynasty.",
  "halfway-tree":
    "Damian's breakthrough. You picked the inheritor and the speaker — start here if Welcome to Jamrock feels too obvious.",
  "mr-marley":
    "Damian's debut at fourteen. You picked Damian and something reflective — this is the album that started the whole arc.",
};

function score(answers: (Answer | null)[]) {
  const totals = new Map<string, number>();
  for (const a of answers) {
    if (!a) continue;
    for (const [slug, pts] of Object.entries(a.scores)) {
      totals.set(slug, (totals.get(slug) ?? 0) + pts);
    }
  }
  const sorted = Array.from(totals.entries())
    .filter(([slug]) => POOL.includes(slug))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  return sorted;
}

export default function MatchPage() {
  const [step, setStep] = useState(0);                       // 0..3 (3 = done)
  const [picks, setPicks] = useState<(Answer | null)[]>([null, null, null]);

  const ranked = useMemo(() => score(picks), [picks]);

  const handlePick = (q: number, ans: Answer) => {
    const next = picks.slice();
    next[q] = ans;
    setPicks(next);
    setStep((s) => Math.min(s + 1, 3));
  };

  const reset = () => {
    setStep(0);
    setPicks([null, null, null]);
  };

  const topSlug = ranked[0]?.[0];
  const topAlbum = albums.find((a) => a.slug === topSlug);
  const runners = ranked.slice(1, 4)
    .map(([slug, pts]) => ({ album: albums.find((a) => a.slug === slug), pts }))
    .filter((x): x is { album: NonNullable<typeof topAlbum>; pts: number } => Boolean(x.album));

  return (
    <>
      <TopNav />

      {/* ============================== HEADER ============================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-5xl mx-auto pt-10 pb-6">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="ornament mb-3">Side C · The Matcher</p>
            <h1 className="display headline-tight text-bark leading-[0.88] tracking-tight
                           text-[48px] sm:text-[80px] md:text-[112px]">
              WHICH RECORD<br/>FITS YOU
            </h1>
          </div>
          <div className="mono text-[10px] tracking-widest text-cocoa uppercase sm:text-right mt-4 sm:mt-12 leading-relaxed">
            Three questions<br/>
            Fifteen candidates<br/>
            <span className="text-jam_green">No wrong answers</span>
          </div>
        </div>
        <p className="serif italic text-bark_2 text-base sm:text-lg mt-6 max-w-3xl leading-relaxed">
          Answer three honest questions about where your head is right now.
          The matcher picks the Marley record that fits — Bob, Damian, Stephen,
          Ziggy, the whole family in the pool.
        </p>
      </section>

      <div className="tricolor-bar-thin max-w-5xl mx-auto" />

      {/* ============================== PROGRESS ============================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-5xl mx-auto pt-6">
        <div className="flex items-center gap-3">
          {[0, 1, 2].map((i) => {
            const done = picks[i] != null;
            const active = step === i;
            return (
              <div key={i} className="flex items-center gap-3 flex-1">
                <div className={`h-[3px] flex-1 rounded transition-colors ${
                  done ? "bg-jam_green" : active ? "bg-jam_gold" : "bg-bark/15"
                }`} />
              </div>
            );
          })}
          <span className="mono text-[10px] tracking-widest text-cocoa uppercase shrink-0">
            {step < 3 ? `Q ${step + 1} / 3` : "Result"}
          </span>
        </div>
      </section>

      {/* ============================== QUIZ / RESULT ============================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-5xl mx-auto pt-10 pb-14">
        {step < 3 ? (
          <QuizCard
            quiz={QUIZ[step]}
            index={step}
            onPick={(a) => handlePick(step, a)}
          />
        ) : (
          <Result
            topAlbum={topAlbum}
            why={topSlug ? WHY[topSlug] : ""}
            picks={picks}
            runners={runners}
            onReset={reset}
          />
        )}
      </section>

      {/* ============================== FOOTER ============================== */}
      <footer className="border-t border-bark/15 bg-sand_2/40 mt-6">
        <div className="tricolor-bar-thin" />
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 text-center">
          <p className="serif italic text-cocoa text-sm">
            Reggae picks reggae. Sometimes reggae picks you back.
          </p>
          <p className="mono text-[10px] tracking-widest text-cocoa uppercase mt-3">
            Tuff Gong · A demo built for Kamal Soliman · 2026
          </p>
        </div>
      </footer>
    </>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function QuizCard({
  quiz,
  index,
  onPick,
}: {
  quiz: Quiz;
  index: number;
  onPick: (a: Answer) => void;
}) {
  return (
    <div key={quiz.id} className="reveal-fade">
      <p className="mono text-[10px] tracking-[0.32em] uppercase text-jam_green mb-2">
        Question {String(index + 1).padStart(2, "0")}
      </p>
      <h2 className="display text-bark text-[34px] sm:text-[52px] md:text-[64px] leading-[0.95] tracking-tight">
        {quiz.prompt}
      </h2>
      <p className="serif italic text-cocoa text-base sm:text-lg mt-4 max-w-2xl leading-relaxed">
        {quiz.intro}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        {quiz.answers.map((a, i) => (
          <button
            key={a.key}
            type="button"
            onClick={() => onPick(a)}
            className="group relative text-left border-2 border-bark/20 bg-sand_2/50 hover:border-ember/70
                       hover:bg-sand_2/80 rounded p-5 sm:p-6 lift overflow-hidden"
          >
            <span aria-hidden="true"
                  className="display text-jam_green/12 group-hover:text-ember/20 transition-colors
                             absolute -right-1 -top-2 leading-none select-none
                             text-[72px] sm:text-[88px]">
              {String.fromCharCode(65 + i)}
            </span>
            <div className="relative">
              <p className="mono text-[9px] tracking-[0.32em] uppercase text-jam_green">
                Option {String.fromCharCode(65 + i)}
              </p>
              <h3 className="display text-bark text-[22px] sm:text-[26px] leading-[1] tracking-tight mt-2">
                {a.label}
              </h3>
              <p className="serif text-bark_2 text-[13.5px] mt-2 leading-relaxed">
                {a.sub}
              </p>
              <p className="mono text-[9px] tracking-widest text-cocoa uppercase mt-4 opacity-60
                            group-hover:opacity-100 group-hover:text-ember transition">
                Pick this →
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Result({
  topAlbum,
  why,
  picks,
  runners,
  onReset,
}: {
  topAlbum: ReturnType<typeof albums.find>;
  why: string;
  picks: (Answer | null)[];
  runners: { album: NonNullable<ReturnType<typeof albums.find>>; pts: number }[];
  onReset: () => void;
}) {
  if (!topAlbum) {
    return (
      <div className="reveal-fade text-center py-12">
        <p className="serif italic text-cocoa">No match found. That shouldn&apos;t happen — try again.</p>
        <button onClick={onReset} className="mono text-[10px] tracking-widest uppercase
                                              border border-ember text-ember px-4 py-2 rounded mt-6
                                              hover:bg-ember hover:text-sand transition-colors">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="reveal-fade">
      <p className="ornament mb-2">Your record</p>
      <h2 className="display text-bark text-[40px] sm:text-[64px] md:text-[80px] leading-[0.95] tracking-tight">
        {topAlbum.title}
      </h2>
      <p className="mono text-[11px] tracking-widest text-jam_green uppercase mt-2">
        {topAlbum.artistDisplay} · {topAlbum.year}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 sm:gap-10 mt-8 items-start">
        <div>
          <Link
            href={`/discography/${topAlbum.slug}/`}
            className="block border-2 border-jam_gold/70 hover:border-ember overflow-hidden transition-colors"
            aria-label={`Open ${topAlbum.title} in discography`}
          >
            <AlbumCover album={topAlbum} size="detail" showSpotifyButton showYearBadge={false} />
          </Link>
        </div>
        <div>
          <p className="serif text-bark text-[17px] sm:text-[18px] leading-[1.78]">
            {why}
          </p>
          <p className="serif italic text-cocoa text-base mt-4 leading-relaxed">
            {topAlbum.blurb}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/discography/${topAlbum.slug}/`}
              className="mono text-[10px] tracking-widest uppercase border border-ember text-ember
                         hover:bg-ember hover:text-sand transition-colors px-4 py-2.5 rounded lift"
            >
              Open the full record →
            </Link>
            <button
              type="button"
              onClick={onReset}
              className="mono text-[10px] tracking-widest uppercase border border-bark/30 text-bark_2
                         hover:border-ember hover:text-ember transition-colors px-4 py-2.5 rounded"
            >
              Take the quiz again
            </button>
          </div>
        </div>
      </div>

      {/* Your answers */}
      <div className="mt-12 border-t border-bark/15 pt-6">
        <p className="ornament mb-4">Your answers</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {QUIZ.map((q, i) => (
            <div key={q.id} className="border border-bark/15 bg-sand_2/40 rounded p-4">
              <p className="mono text-[9px] tracking-widest uppercase text-jam_green">
                Q {String(i + 1).padStart(2, "0")}
              </p>
              <p className="serif italic text-cocoa text-sm mt-1">{q.prompt}</p>
              <p className="serif text-bark text-base mt-2 leading-snug">
                {picks[i]?.label ?? "—"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Runner-ups */}
      {runners.length > 0 && (
        <div className="mt-10 border-t border-bark/15 pt-6">
          <p className="ornament mb-4">Also close — Side B picks</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {runners.map(({ album: a }) => (
              <Link
                key={a.slug}
                href={`/discography/${a.slug}/`}
                className="group block border-2 border-bark/20 hover:border-ember/70 overflow-hidden transition-all lift"
              >
                <AlbumCover album={a} size="card" showSpotifyButton={false} />
                <div className="p-3">
                  <p className="mono text-[9px] tracking-widest uppercase text-jam_green">
                    {a.year}
                  </p>
                  <p className="serif text-bark text-sm leading-tight mt-1 group-hover:text-ember transition-colors">
                    {a.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
