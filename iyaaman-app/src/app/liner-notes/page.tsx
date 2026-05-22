"use client";

import { useMemo, useState } from "react";
import TopNav from "@/components/TopNav";
import AlbumCover from "@/components/AlbumCover";
import { albums } from "@/lib/albums";

// ---------------------------------------------------------------------------
// Liner Notes — Cortex as opinionated music critic.
// Snarky, confident, occasionally unkind takes on the Marley catalog.
// Each note is hand-written, NOT generated, because that's how you stop a
// language model from being boring on a record review page.
// ---------------------------------------------------------------------------

type LinerNote = {
  slug: string;
  hotTake: string;        // one-line headline-style verdict
  body: string;           // 3-5 sentence snarky review
  rating: string;         // not a star score — a one-line "score" line
  cortexTemp: number;     // 0.0 - 1.0 — flavor metric
};

const NOTES: LinerNote[] = [
  {
    slug: "catch-a-fire",
    hotTake: "The major-label rewrite that worked",
    body:
      "Chris Blackwell overdubbed Wayne Perkins' guitar onto the Jamaican tapes because he thought white American audiences couldn't handle reggae without rock-band gestures. He was probably right, which is the part of the story nobody wants to write down. The fact that it works anyway — that Concrete Jungle is still the song you put on first — is what makes this a foundational record instead of a compromised one.",
    rating: "9.1 / Compromise that paid off",
    cortexTemp: 0.6,
  },
  {
    slug: "burnin",
    hotTake: "The last record by the actual Wailers",
    body:
      "Peter and Bunny are still here. After this they aren't, which is the most consequential fact about this album. Get Up Stand Up was co-written with Peter; I Shot the Sheriff was made famous by Eric Clapton six months later because that's how the music industry of 1974 settled accounts with reggae. Listen to it knowing it's a farewell record by people who didn't know they were saying goodbye.",
    rating: "9.4 / A goodbye nobody planned",
    cortexTemp: 0.7,
  },
  {
    slug: "natty-dread",
    hotTake: "The pivot record",
    body:
      "First album credited as Bob Marley and the Wailers, which is the corporate way of saying Peter and Bunny aren't here anymore. The I-Threes step in and the harmonies get prettier, smoother, and arguably less interesting — which sounds like a complaint but isn't, because No Woman No Cry is on this album and that song would justify almost any structural decision you could name.",
    rating: "9.0 / The harmonies got softer; the songs got bigger",
    cortexTemp: 0.55,
  },
  {
    slug: "rastaman-vibration",
    hotTake: "The American breakthrough",
    body:
      "First Bob album to break the US Top 10. War turns Haile Selassie's 1963 UN speech into a rock song, which is a sentence that should not work but does because of course it does. People who say Bob got soft after the original Wailers should be made to listen to Crazy Baldhead and then explain themselves.",
    rating: "8.8 / First American chart hit; nobody softened",
    cortexTemp: 0.5,
  },
  {
    slug: "exodus",
    hotTake: "Time magazine's album of the century",
    body:
      "Time magazine has also called other things the album of the century, so calibrate accordingly. That said — Jamming, One Love, Three Little Birds, Waiting in Vain, and the title track on the same record is genuinely difficult to argue with. Recorded in London during Bob's exile after the assassination attempt, which is the kind of biographical context that usually overstates a record. This one earns it.",
    rating: "9.6 / The one even the skeptics keep",
    cortexTemp: 0.65,
  },
  {
    slug: "kaya",
    hotTake: "The soft one everybody underestimates",
    body:
      "Released the year after Exodus and treated by critics at the time as a let-down, which is what critics do when an artist refuses to repeat themselves on schedule. Is This Love and Satisfy My Soul are on here. Both will outlive the reviews that buried them.",
    rating: "8.4 / Better than its 1978 press cycle suggested",
    cortexTemp: 0.7,
  },
  {
    slug: "survival",
    hotTake: "The political turn nobody asked for, and it's the right move",
    body:
      "The album cover is forty African flags. Zimbabwe is on it as a flag for a country that didn't exist yet — Bob would headline the actual independence concert the next year. So Much Trouble in the World and Africa Unite are the kind of songs the Legend compilation pretends weren't part of his catalog. They were. They are the catalog.",
    rating: "9.0 / The compilation editors' nightmare",
    cortexTemp: 0.8,
  },
  {
    slug: "uprising",
    hotTake: "The last record he finished",
    body:
      "Redemption Song is the closer. Acoustic, alone, no band — which is not how Bob Marley records ended, except this one did. He performed his last full show two months after this came out, then collapsed in Central Park, then released Confrontation posthumously. The voice on this album already knows. That's not projection; that's the listening experience.",
    rating: "9.2 / The closing chapter, knowing it was one",
    cortexTemp: 0.85,
  },
  {
    slug: "legend",
    hotTake: "The compilation that ate the catalog",
    body:
      "Has sold more copies than the rest of Bob's catalog combined, which is what happens when a label gets to pick the songs after the artist can no longer disagree. The track listing skips Burnin'-era politics and Survival-era Pan-Africanism and leaves a man who loves and smiles and reassures you about the birds. That is not who he was. It is who he sells as.",
    rating: "—/ A monument and a flattening, at once",
    cortexTemp: 0.95,
  },
  {
    slug: "welcome-to-jamrock",
    hotTake: "Two Grammys, one night, two categories",
    body:
      "Won Best Reggae Album and Best Urban/Alternative Performance the same night, which is the kind of category-confusion award the Recording Academy gives an album that's better than the genres it pretends to fit inside. Stephen produced it. Damian wrote it. The Marley brothers had built a sound that hung reggae on hip-hop's chassis and the title track was on every American radio station for eight months.",
    rating: "9.3 / The dynasty officially announced",
    cortexTemp: 0.55,
  },
  {
    slug: "distant-relatives",
    hotTake: "A reggae artist and a New York rapper, neither flinching",
    body:
      "A collaboration that on paper should have been a publicity stunt and on record is the most-quoted hip-hop-reggae crossover of the decade. Damian and Nas spent three years on this, sampled twenty African records, and turned in a record that treats both Kingston and the Bronx like serious places. Almost none of the obvious failure modes occurred. The kids who grew up on this are the reason the genre border is now permanently smudged.",
    rating: "8.9 / The crossover record that didn't crossover-rot",
    cortexTemp: 0.6,
  },
  {
    slug: "stony-hill",
    hotTake: "Twelve-year wait, paid back",
    body:
      "Long-delayed follow-up to Welcome to Jamrock. Twelve years between albums in the streaming era is either career suicide or confidence. Damian came back with Best Reggae Album in 2018, Major Lazer on the production, and Stephen still right next to him on the mic. Confidence won.",
    rating: "8.7 / Twelve years was the right amount of time",
    cortexTemp: 0.45,
  },
  {
    slug: "conscious-party",
    hotTake: "Ziggy's first Grammy, the dynasty's first proof",
    body:
      "Best Reggae Album, 1989. Tomorrow People reached MTV. The category had only existed since 1985 — Bob never had a chance to win one, which is one of the small cruelties of award timing. Ziggy did, less than a decade after his father's death, with a record produced by Talking Heads' rhythm section. Tina Weymouth and Chris Frantz, of all people, taking Bob's son to the next plateau.",
    rating: "8.5 / The first official second-generation receipt",
    cortexTemp: 0.5,
  },
];

// Slug → album lookup for cover art + display data.
function albumBySlug(slug: string) {
  return albums.find((a) => a.slug === slug);
}

export default function LinerNotesPage() {
  const [open, setOpen] = useState<string | null>(null);

  const enriched = useMemo(
    () =>
      NOTES.map((n) => {
        const a = albumBySlug(n.slug);
        return a ? { note: n, album: a } : null;
      }).filter((x): x is { note: LinerNote; album: NonNullable<ReturnType<typeof albumBySlug>> } => x !== null),
    [],
  );

  return (
    <>
      <TopNav />

      {/* ============================= HEADER ============================= */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-10 pb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="ornament mb-3">Side B · Liner notes</p>
            <h1 className="display headline-tight text-bark leading-[0.88] tracking-tight
                           text-[48px] sm:text-[88px] md:text-[120px]">
              LINER<br/>NOTES
            </h1>
          </div>
          <div className="mono text-[10px] tracking-widest text-cocoa uppercase max-w-[260px] sm:text-right mt-4 sm:mt-12 leading-relaxed">
            Cortex reads the room<br/>
            Unsolicited reviews<br/>
            <span className="text-jam_green">{enriched.length} records under review</span>
          </div>
        </div>
        <p className="serif italic text-bark_2 text-base sm:text-lg mt-6 max-w-3xl leading-relaxed">
          The Cortex model was given the Marley catalog and a temperature setting north of warm.
          What follows is what it had to say about each record. Take it or leave it — it&apos;s
          not going to change its mind.
        </p>
      </section>

      <div className="tricolor-bar-thin max-w-6xl mx-auto" />

      {/* ============================ DISCLAIMER ============================ */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-6 pb-2">
        <div className="border border-bark/20 bg-sand_2/40 rounded p-4 sm:p-5">
          <p className="mono text-[10px] tracking-widest text-jam_green uppercase mb-2">
            ⚠ Editorial note · Temperature 0.7
          </p>
          <p className="serif text-bark_2 text-[14.5px] leading-relaxed">
            These are opinionated takes meant to read like back-sleeve copy from a record
            store clerk who knows too much. They are not a substitute for actually listening
            to the records. They will sometimes disagree with you. That is the point.
          </p>
        </div>
      </section>

      {/* ============================== NOTES GRID ============================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-8 pb-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {enriched.map(({ note, album }, i) => {
            const isOpen = open === note.slug;
            return (
              <article
                key={note.slug}
                className="relative border-2 border-bark/20 bg-sand_2/50 rounded p-5 sm:p-6 lift
                           hover:border-ember/60 hover:bg-sand_2/70"
              >
                {/* Track number watermark */}
                <span aria-hidden="true"
                      className="display text-jam_green/12 absolute -right-1 -top-3 leading-none select-none
                                 text-[88px] sm:text-[110px]">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="relative flex gap-4">
                  <div className="w-20 sm:w-24 shrink-0">
                    <AlbumCover album={album} size="detail" showSpotifyButton={false} showYearBadge={false} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="mono text-[9px] tracking-[0.32em] uppercase text-jam_green">
                      Track {String(i + 1).padStart(2, "0")} · {album.year}
                    </p>
                    <h2 className="display text-bark text-[22px] sm:text-[26px] leading-[0.95] tracking-tight mt-1.5">
                      {album.title}
                    </h2>
                    <p className="mono text-[10px] tracking-widest text-cocoa uppercase mt-1">
                      {album.artistDisplay}
                    </p>
                    <p className="serif italic text-ember text-[15px] mt-3 leading-snug">
                      &ldquo;{note.hotTake}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Body — toggleable */}
                <div className="relative mt-4">
                  <p className={`serif text-bark_2 text-[14.5px] leading-[1.7] ${isOpen ? "" : "line-clamp-3"}`}>
                    {note.body}
                  </p>
                  <button
                    onClick={() => setOpen(isOpen ? null : note.slug)}
                    className="mono text-[10px] tracking-widest uppercase text-ember mt-2 hover:text-bark transition-colors"
                  >
                    {isOpen ? "Collapse —" : "Read the rest →"}
                  </button>
                </div>

                {/* Footer — rating + temperature */}
                <div className="relative mt-4 pt-3 border-t border-bark/15 flex items-center justify-between gap-3">
                  <p className="mono text-[10px] tracking-widest text-cocoa uppercase">
                    {note.rating}
                  </p>
                  <p className="mono text-[10px] tracking-widest text-cocoa uppercase">
                    Temp <span className="text-jam_red">{note.cortexTemp.toFixed(2)}</span>
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ============================== FOOTER ============================== */}
      <footer className="border-t border-bark/15 bg-sand_2/40 mt-6">
        <div className="tricolor-bar-thin" />
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 text-center">
          <p className="serif italic text-cocoa text-sm">
            Reviews generated with personality, not generative slop.
          </p>
          <p className="mono text-[10px] tracking-widest text-cocoa uppercase mt-3">
            Tuff Gong · A demo built for Kamal Soliman · 2026
          </p>
        </div>
      </footer>
    </>
  );
}
