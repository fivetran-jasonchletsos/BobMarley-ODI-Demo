import Link from "next/link";
import TopNav from "@/components/TopNav";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata = {
  title: "For Kamal · Tuff Gong",
  description:
    "Tuff Gong is dedicated to Kamal Soliman — performer, tour manager to Damian Marley, " +
    "and a best friend of more than thirty years.",
};

export default function KamalPage() {
  return (
    <>
      <TopNav/>

      {/* ====================== HERO ====================== */}
      <section className="relative pt-10 pb-8 sm:pt-14 px-5 sm:px-8 md:px-12 max-w-5xl mx-auto">
        <p className="ornament mb-4 tricolor-mark">Dedicated to a best friend</p>
        <h1 className="display text-ember leading-[0.92] tracking-tight
                       text-[64px] sm:text-[100px] md:text-[140px]">
          KAMAL<br/>SOLIMAN
        </h1>
        <p className="serif italic text-cocoa text-lg sm:text-xl mt-5 max-w-2xl leading-relaxed">
          Performer. Tour manager to Damian &ldquo;Jr. Gong&rdquo; Marley.
          A best friend of more than thirty years.
        </p>

        <div className="mt-7 flex flex-wrap gap-x-7 gap-y-2 text-bark mono text-[11px] tracking-widest">
          <span><b className="text-ember text-base mono">30+</b>&nbsp;&nbsp;YEARS OF FRIENDSHIP</span>
          <span><b className="text-ember text-base mono">∞</b>&nbsp;&nbsp;NIGHTS ON THE ROAD</span>
          <span><b className="text-ember text-base mono">1</b>&nbsp;&nbsp;LEGACY HE LIVES INSIDE OF</span>
        </div>
      </section>

      <div className="tricolor-bar-thin max-w-5xl mx-auto"/>

      {/* ====================== FEATURE PHOTO 1 ====================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-5xl mx-auto">
        <figure className="my-8">
          <div className="relative aspect-[4/5] sm:aspect-[16/10] overflow-hidden border border-bark/20 bg-bark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${BASE}/kamal/kamal-stage-tambourine.jpg`}
                 alt="Kamal Soliman on stage, arm raised, tambourine in hand"
                 className="w-full h-full object-cover"/>
          </div>
          <figcaption className="mono text-[10.5px] tracking-widest text-cocoa uppercase mt-3 text-center">
            On stage · purple lights · tambourine in the air
          </figcaption>
        </figure>
      </section>

      {/* ====================== OPENING BODY ====================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-2xl mx-auto">
        <p className="serif text-bark text-[17px] sm:text-[19px] leading-[1.78] drop-cap">
          For Kamal — who has walked this road beside me for more than thirty years.
          Through every chapter of the life we have been writing,
          you have shown up, stayed up, called back, picked up.
          The right people end up in the right rooms,
          and the rooms are louder for it.
        </p>

        <p className="serif text-bark_2 text-[17px] leading-[1.78] mt-5">
          You ended up touring with the son of the man whose music gave half of
          the planet a heartbeat. Of course you did. You also picked up the mic
          and built a sound of your own with{" "}
          <span className="mark-leaf">Lance Herbstrong</span> —
          played the stages, worked the crowd, became part of the music
          rather than just near it.
        </p>

        <p className="serif text-bark_2 text-[17px] leading-[1.78] mt-5">
          This site — Tuff Gong — is everything I could gather of the universe
          you stand inside of every night.
          His music. His blood. His band. His road. The line that connects
          Nine Mile to the next soundcheck. Hold it gently. It&apos;s yours.
        </p>
      </section>

      {/* ====================== EPIGRAPH — BOB ====================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-3xl mx-auto mt-14">
        <hr className="hr-rule"/>
        <figure className="mt-8">
          <blockquote className="serif text-bark text-2xl sm:text-4xl leading-[1.18] italic text-center
                                 relative px-6 sm:px-12 py-2">
            <span className="display text-gold/40 text-[110px] absolute -left-1 -top-12 leading-none select-none">“</span>
            In this great future,<br/>
            you can&apos;t forget your past.
            <span className="display text-gold/40 text-[110px] absolute -right-1 -bottom-16 leading-none select-none">”</span>
          </blockquote>
          <figcaption className="mt-7 mono text-[11px] tracking-widest text-cocoa uppercase text-center">
            — Bob Marley
            <span className="text-ash"> · No Woman, No Cry · 1974</span>
          </figcaption>
        </figure>
      </section>

      {/* ====================== TWO-PHOTO SPREAD ====================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <figure>
            <div className="relative aspect-[3/2] overflow-hidden border border-jam_gold/40 bg-jam_black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BASE}/kamal/kamal-acl-crowd.jpg`}
                   alt="Kamal at Austin City Limits, festival crowd behind him"
                   className="w-full h-full object-cover"/>
            </div>
            <figcaption className="mono text-[10.5px] tracking-widest text-cocoa uppercase mt-3">
              Austin City Limits · the crowd behind you
            </figcaption>
          </figure>
          <figure>
            <div className="relative aspect-[3/2] overflow-hidden border border-jam_gold/40 bg-jam_black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BASE}/kamal/kamal-lance-herbstrong.jpg`}
                   alt="Kamal on stage with Lance Herbstrong, pink stage lights"
                   className="w-full h-full object-cover"/>
            </div>
            <figcaption className="mono text-[10.5px] tracking-widest text-cocoa uppercase mt-3">
              Lance Herbstrong · pink wash · the kit set up
            </figcaption>
          </figure>
        </div>

        {/* Full-width band shot */}
        <figure className="mt-6">
          <div className="relative aspect-[16/9] overflow-hidden border border-jam_gold/40 bg-jam_black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${BASE}/kamal/kamal-lance-band-wide.jpg`}
                 alt="Lance Herbstrong full band shot — Kamal stage left, the rainbow banner up front"
                 className="w-full h-full object-cover"/>
          </div>
          <figcaption className="mono text-[10.5px] tracking-widest text-cocoa uppercase mt-3 text-center">
            The whole band · Lance Herbstrong on the night
          </figcaption>
        </figure>

        {/* Three-up performer strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <figure>
            <div className="relative aspect-[3/4] overflow-hidden border border-jam_green/40 bg-jam_black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BASE}/kamal/kamal-sticks-pink.jpg`}
                   alt="Kamal with drumsticks under pink stage lights"
                   className="w-full h-full object-cover"/>
            </div>
            <figcaption className="mono text-[10px] tracking-widest text-cocoa uppercase mt-2">
              Sticks in hand · the cymbal · the wash
            </figcaption>
          </figure>
          <figure>
            <div className="relative aspect-[3/4] overflow-hidden border border-jam_red/40 bg-jam_black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BASE}/kamal/kamal-guitarist-stage.jpg`}
                   alt="Lance Herbstrong guitarist front, Kamal on the kit behind"
                   className="w-full h-full object-cover"/>
            </div>
            <figcaption className="mono text-[10px] tracking-widest text-cocoa uppercase mt-2">
              The guitarist out front · you holding the back
            </figcaption>
          </figure>
          <figure>
            <div className="relative aspect-[3/4] overflow-hidden border border-jam_gold/40 bg-jam_black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BASE}/kamal/kamal-decks-profile.jpg`}
                   alt="Kamal in profile at the decks, side-stage"
                   className="w-full h-full object-cover"/>
            </div>
            <figcaption className="mono text-[10px] tracking-widest text-cocoa uppercase mt-2">
              Profile · at the desk · in the work
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ====================== MIDDLE BODY — THE ROAD ====================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-2xl mx-auto mt-16">
        <p className="ornament mb-2">The Road</p>
        <h2 className="display text-bark text-3xl sm:text-4xl tracking-tight">
          The Road You Walk
        </h2>
        <p className="serif text-bark_2 text-[17px] leading-[1.78] mt-5">
          The road is its own country. Bus call at four, lobby call at five,
          load-in by six, sound check by seven, doors at eight. Cities
          stitched together by the same set of rituals. The crew becomes a family;
          the family becomes the city; the city changes every night.
        </p>
        <p className="serif text-bark_2 text-[17px] leading-[1.78] mt-5">
          You have lived that life on both sides of the curtain.
          Behind the desk with{" "}
          <Link href="/damian-marley/" className="link-inline">
            Damian &ldquo;Jr.&nbsp;Gong&rdquo; Marley
          </Link>
          {" "}— the youngest son of a father whose every song still travels —
          and out in front of your own audience with Lance Herbstrong,
          where the work is the same and the rush is yours.
        </p>
        <p className="serif text-bark_2 text-[17px] leading-[1.78] mt-5">
          Few people get to live in music. Fewer get to live in it from
          both directions. You do.
        </p>
      </section>

      {/* ====================== PHOTO STRIP — THREE WIDE ====================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <figure>
            <div className="relative aspect-[3/4] overflow-hidden border border-bark/20 bg-bark">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BASE}/kamal/kamal-decks-night.jpg`}
                   alt="Kamal at the decks, outdoors at night"
                   className="w-full h-full object-cover"/>
            </div>
            <figcaption className="mono text-[10px] tracking-widest text-cocoa uppercase mt-2">
              At the decks · outdoors · night
            </figcaption>
          </figure>
          <figure>
            <div className="relative aspect-[3/4] overflow-hidden border border-bark/20 bg-bark">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BASE}/kamal/kamal-mic-closeup.jpg`}
                   alt="Kamal on the mic, closeup, blue cap"
                   className="w-full h-full object-cover"/>
            </div>
            <figcaption className="mono text-[10px] tracking-widest text-cocoa uppercase mt-2">
              On the mic · running the show
            </figcaption>
          </figure>
          <figure>
            <div className="relative aspect-[3/4] overflow-hidden border border-bark/20 bg-bark">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BASE}/kamal/kamal-friends-night.jpg`}
                   alt="Kamal with friends at night"
                   className="w-full h-full object-cover object-top"/>
            </div>
            <figcaption className="mono text-[10px] tracking-widest text-cocoa uppercase mt-2">
              The crew · the night · the bond
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ====================== BROTHERHOOD SPREAD ====================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto mt-20">
        <div className="text-center mb-7">
          <p className="ornament mb-1">Brotherhood</p>
          <h2 className="display text-bark text-3xl sm:text-4xl tracking-tight">
            Two on stage
          </h2>
          <p className="serif italic text-cocoa text-sm mt-2 max-w-xl mx-auto">
            The kind of friend you find inside the music. The other one who knows
            every cue, every transition, every reason the night exists.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <figure>
            <div className="relative aspect-[3/2] overflow-hidden border border-bark/20 bg-bark">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BASE}/kamal/kamal-bandmate-night.jpg`}
                   alt="Kamal with bandmate, stage right, into the night"
                   className="w-full h-full object-cover"/>
            </div>
            <figcaption className="mono text-[10.5px] tracking-widest text-cocoa uppercase mt-3">
              Side by side · the lights · the work
            </figcaption>
          </figure>
          <figure>
            <div className="relative aspect-[3/2] overflow-hidden border border-bark/20 bg-bark">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${BASE}/kamal/kamal-bandmate-flagcap.jpg`}
                   alt="Kamal close, flag-color cap, crowd behind"
                   className="w-full h-full object-cover"/>
            </div>
            <figcaption className="mono text-[10.5px] tracking-widest text-cocoa uppercase mt-3">
              Front of house · the crowd in the trees · holding the night
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ====================== EPIGRAPH — DAMIAN ====================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-3xl mx-auto mt-20">
        <hr className="hr-rule"/>
        <figure className="mt-8 border-l-2 border-leaf pl-6 sm:pl-8">
          <blockquote className="serif text-bark text-xl sm:text-2xl leading-snug italic">
            &ldquo;We come a long way from where we begin.<br/>
            A long way to go from where we reach.&rdquo;
          </blockquote>
          <figcaption className="mt-3 mono text-[10.5px] tracking-widest text-cocoa uppercase">
            — Damian &ldquo;Jr.&nbsp;Gong&rdquo; Marley
            <span className="text-ash"> · in the spirit of the road</span>
          </figcaption>
        </figure>
      </section>

      {/* ====================== CLOSING ====================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-2xl mx-auto mt-16">
        <p className="ornament mb-2">For Kamal · From Jason</p>
        <h2 className="display text-bark text-3xl sm:text-4xl tracking-tight">
          Thirty Years
        </h2>
        <p className="serif text-bark_2 text-[17px] leading-[1.78] mt-5">
          Thirty years is a long time to know someone.
          Long enough to have been wrong about a hundred things together,
          and right about the ones that mattered. Long enough to have shown up
          for each other when there was no audience. Long enough to know the
          difference between a friend who is around and a friend who is family.
        </p>
        <p className="serif text-bark_2 text-[17px] leading-[1.78] mt-5">
          One love. One heart. Let&apos;s get together and feel all right.
        </p>
        <p className="mono text-[11px] tracking-widest text-ember uppercase mt-8">
          ·  Tuff Gong is yours, brother  ·
        </p>
      </section>

      {/* ====================== EXPLORE LINKS ====================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-5xl mx-auto mt-16 mb-12">
        <hr className="hr-rule mb-7"/>
        <p className="ornament mb-3">Continue</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/damian-marley/"
                className="block border border-bark/15 bg-sand_2/40 p-4 hover:border-ember/60 hover:bg-sand_2/70 transition-colors rounded">
            <p className="ornament">The Tour</p>
            <h3 className="serif text-bark text-lg font-bold mt-1">Damian &ldquo;Jr. Gong&rdquo; Marley</h3>
            <p className="text-bark_2 text-sm mt-2">Bob&apos;s youngest son. The man you tour with. A page built for him.</p>
          </Link>
          <Link href="/family/"
                className="block border border-bark/15 bg-sand_2/40 p-4 hover:border-ember/60 hover:bg-sand_2/70 transition-colors rounded">
            <p className="ornament">The Family</p>
            <h3 className="serif text-bark text-lg font-bold mt-1">The Marley Family Tree</h3>
            <p className="text-bark_2 text-sm mt-2">Bob, Rita, Cindy, twelve children, grandchildren — and every album linked.</p>
          </Link>
          <Link href="/discography/"
                className="block border border-bark/15 bg-sand_2/40 p-4 hover:border-ember/60 hover:bg-sand_2/70 transition-colors rounded">
            <p className="ornament">The Music</p>
            <h3 className="serif text-bark text-lg font-bold mt-1">The Discography</h3>
            <p className="text-bark_2 text-sm mt-2">Every record, sorted by year, decade, family member.</p>
          </Link>
        </div>
      </section>

      <footer className="border-t border-bark/15 bg-sand_2/40 mt-6">
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
