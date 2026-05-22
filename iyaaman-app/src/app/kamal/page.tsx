import Link from "next/link";
import TopNav from "@/components/TopNav";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata = {
  title: "For Kamal · Tuff Gong",
  description: "For Kamal Soliman — best friend of thirty years.",
};

// Image + caption blocks
function Img({ src, alt, caption, aspect = "aspect-[3/2]" }:
  { src: string; alt: string; caption?: string; aspect?: string }) {
  return (
    <figure>
      <div className={`relative ${aspect} overflow-hidden border border-jam_gold/40 bg-jam_black rounded`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${BASE}/kamal/${src}`} alt={alt}
             className="w-full h-full object-cover"/>
      </div>
      {caption && (
        <figcaption className="mono text-[10px] tracking-widest text-cocoa uppercase mt-2 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function Quote({ text, source, color = "ember" }:
  { text: string; source: string; color?: "ember" | "leaf" | "gold" }) {
  const borderClass = color === "leaf" ? "border-jam_green"
                    : color === "gold" ? "border-jam_gold" : "border-jam_red";
  return (
    <figure className={`my-12 max-w-2xl mx-auto border-l-4 ${borderClass} pl-6 sm:pl-8`}>
      <blockquote className="serif text-bark text-xl sm:text-2xl leading-snug italic">
        &ldquo;{text}&rdquo;
      </blockquote>
      <figcaption className="mt-3 mono text-[10px] tracking-widest text-cocoa uppercase">
        — Bob Marley<span className="text-ash"> · {source}</span>
      </figcaption>
    </figure>
  );
}

export default function KamalPage() {
  return (
    <>
      <TopNav/>

      {/* ===== HERO ===== */}
      <section className="pt-10 pb-4 px-5 sm:px-8 md:px-12 max-w-5xl mx-auto">
        <p className="ornament mb-3 tricolor-mark reveal reveal-1">For my best friend</p>
        <h1 className="display headline-tight text-jam_red leading-[0.92] tracking-tight
                       text-[48px] xs:text-[64px] sm:text-[100px] md:text-[140px]
                       reveal reveal-2">
          KAMAL<br/>SOLIMAN
        </h1>
        <p className="serif italic text-cocoa text-base sm:text-lg mt-4 reveal reveal-3">
          Thirty years. One road. Built for you, brother.
        </p>
      </section>

      <div className="tricolor-bar-thin max-w-5xl mx-auto"/>

      {/* ===== FAMILY PHOTO — Stella, Johnny Lee, Kingston ===== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-5xl mx-auto mt-6">
        <Img src="kamal-family-oasis-wembley.jpg"
             alt="Kamal with Stella, Johnny Lee, and Kingston"
             caption="Stella · Johnny Lee · Kingston · Oasis · Wembley"
             aspect="aspect-[4/3] sm:aspect-[16/10]"/>
        <p className="serif italic text-cocoa text-center mt-4 text-sm">
          The whole reason any of this matters.
        </p>
      </section>

      {/* ===== QUOTE 1 — FRIENDSHIP ===== */}
      <Quote
        text="The greatness of a man is not in how much wealth he acquires, but in his integrity and his ability to affect those around him positively."
        source="on friendship"
        color="ember"/>

      {/* ===== 2-PHOTO SPREAD — performing ===== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Img src="kamal-stage-tambourine.jpg" alt="On stage, tambourine raised"
               caption="On stage · arm in the air"/>
          <Img src="kamal-lance-band-wide.jpg" alt="Lance Herbstrong band"
               caption="Lance Herbstrong · the band"/>
        </div>
      </section>

      {/* ===== QUOTE 2 — LIFE ===== */}
      <Quote
        text="Open your eyes, look within. Are you satisfied with the life you're living?"
        source="Exodus · 1977"
        color="leaf"/>

      {/* ===== 3-PHOTO STRIP ===== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Img src="kamal-acl-crowd.jpg" alt="Austin City Limits"
               caption="ACL · the crowd" aspect="aspect-[3/4]"/>
          <Img src="kamal-mic-closeup.jpg" alt="On the mic"
               caption="On the mic" aspect="aspect-[3/4]"/>
          <Img src="kamal-philly-couch.jpg" alt="Philly Fillmore backstage"
               caption="Philly · backstage" aspect="aspect-[3/4]"/>
        </div>
      </section>

      {/* ===== QUOTE 3 — CHILDREN ===== */}
      <Quote
        text="Money can't buy life."
        source="last words to his son Ziggy"
        color="gold"/>

      {/* ===== DAMIAN ON STAGE — the work ===== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto">
        <Img src="damian-stage-flag-crowd.jpg" alt="Damian Marley on stage with crowd and rasta flag"
             caption="Damian · the flag · the crowd"
             aspect="aspect-[16/9]"/>
        <p className="serif italic text-cocoa text-center mt-4 text-sm">
          The road you carry every night.
        </p>
      </section>

      {/* ===== QUOTE 4 — WOMEN / LOVE ===== */}
      <Quote
        text="Could you be loved? Then be loved."
        source="Could You Be Loved · 1980"
        color="ember"/>

      {/* ===== TWO MORE STAGE SHOTS ===== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Img src="kamal-look-up-green-stage.jpg" alt="Kamal looking up from side stage, green wash"
               caption="Side stage · green wash"/>
          <Img src="damian-stage-blue-lights.jpg" alt="Damian on stage, full venue, blue lights"
               caption="Full house · blue lights"/>
        </div>
      </section>

      {/* ===== QUOTE 5 — UNIVERSAL / FRIENDSHIP CLOSER ===== */}
      <Quote
        text="In this great future, you can't forget your past."
        source="No Woman, No Cry · 1974"
        color="leaf"/>

      {/* ===== CLOSING ===== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-2xl mx-auto text-center mt-10">
        <p className="ornament mb-2 tricolor-mark">Thirty years</p>
        <p className="serif italic text-bark text-xl leading-snug">
          One love. One heart.<br/>
          This is yours, brother.
        </p>
        <p className="mono text-[11px] tracking-widest text-ember uppercase mt-6">
          ·  everything else is up in the nav  ·
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-bark/15 bg-sand_2/40 mt-14">
        <div className="tricolor-bar-thin"/>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 text-center">
          <p className="serif italic text-cocoa text-sm">
            One love. One heart. Let&apos;s get together and feel all right.
          </p>
          <p className="mono text-[10px] tracking-widest text-cocoa uppercase mt-3">
            Tuff Gong · A demo built for Kamal Soliman · 2026
          </p>
        </div>
      </footer>
    </>
  );
}
