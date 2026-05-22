import Link from "next/link";
import { dedication } from "@/lib/dedication";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function Hero() {
  return (
    <section className="relative pt-12 pb-10 sm:pt-16 sm:pb-14 px-5 sm:px-8 md:px-12 max-w-5xl mx-auto">
      {/* Ornament */}
      <p className="ornament mb-5 reveal reveal-1">
        Tuff Gong · The Complete Universe
      </p>

      {/* Display title — heavyweight masthead */}
      <h1 className="display headline-tight text-bark leading-[0.92] tracking-tight
                     text-[44px] xs:text-[52px] sm:text-[88px] md:text-[120px]
                     reveal reveal-2">
        BOB<br/>MARLEY
      </h1>

      <p className="serif italic text-cocoa text-base sm:text-xl mt-4 max-w-2xl leading-relaxed
                    reveal reveal-3">
        His music. His family. His band. His studios. His road.
        His blood. And everyone he made along the way.
      </p>

      {/* Pill stats */}
      <div className="mt-8 flex flex-wrap gap-x-5 sm:gap-x-7 gap-y-2 text-bark mono text-[10px] sm:text-[11px] tracking-widest
                      reveal reveal-4">
        <span><b className="text-jam_green text-[15px] sm:text-base mono">36</b>&nbsp;&nbsp;YEARS</span>
        <span><b className="text-jam_gold text-[15px] sm:text-base mono">75M+</b>&nbsp;&nbsp;RECORDS SOLD</span>
        <span><b className="text-jam_red text-[15px] sm:text-base mono">14</b>&nbsp;&nbsp;PUBLIC CHILDREN</span>
        <span><b className="text-jam_green text-[15px] sm:text-base mono">19</b>&nbsp;&nbsp;GRAMMYS IN THE FAMILY</span>
      </div>

      <div className="tricolor-bar-thin mt-10 mb-10 reveal reveal-5"/>

      {/* ============================ DEDICATION ============================ */}
      <div className="mx-auto max-w-3xl">

        {/* Top ornament line — long horizontal flourish */}
        <div className="flex items-center justify-center gap-3 mb-2 reveal reveal-5">
          <span className="block h-px w-12 bg-gold/50"/>
          <p className="ornament">Dedicated to a best friend</p>
          <span className="block h-px w-12 bg-gold/50"/>
        </div>

        {/* The name — center stage, heavy, ember */}
        <h2 className="display headline-tight text-jam_red text-center
                       text-[36px] xs:text-[44px] sm:text-[64px] md:text-[80px]
                       leading-[0.95] tracking-tight mt-2
                       reveal reveal-6">
          KAMAL<br className="sm:hidden"/>
          <span className="sm:ml-4">SOLIMAN</span>
        </h2>

        <p className="serif italic text-cocoa text-sm sm:text-base text-center mt-3
                      reveal reveal-6">
          {dedication.relationship}
        </p>

        {/* Body — letterpress feel, narrow column, generous leading */}
        <p className="serif text-bark_2 mt-7 leading-[1.78] text-[15px] sm:text-[16.5px] text-center
                      max-w-2xl mx-auto
                      reveal reveal-7">
          {dedication.body}
        </p>

        {/* Primary Bob quote — set as a true epigraph */}
        <figure className="mt-10 max-w-2xl mx-auto reveal reveal-7">
          <blockquote className="serif text-bark text-xl sm:text-3xl leading-snug italic text-center
                                 relative px-6 sm:px-10">
            <span className="display text-gold/50 text-6xl sm:text-7xl absolute -left-2 -top-4 leading-none select-none">&ldquo;</span>
            {dedication.quote.text}
            <span className="display text-gold/50 text-6xl sm:text-7xl absolute -right-2 -bottom-10 leading-none select-none">&rdquo;</span>
          </blockquote>
          <figcaption className="mt-6 mono text-[10.5px] tracking-widest text-cocoa uppercase text-center">
            &mdash; {dedication.quote.author}
            <span className="text-ash"> · {dedication.quote.source}</span>
          </figcaption>
        </figure>

        {/* Secondary Damian quote — quieter, set off to the side */}
        <figure className="mt-12 max-w-xl mx-auto border-l-2 border-leaf pl-5 sm:pl-6 reveal reveal-8">
          <blockquote className="serif text-bark_2 text-base sm:text-lg leading-snug italic">
            &ldquo;{dedication.secondary_quote.text}&rdquo;
          </blockquote>
          <figcaption className="mt-2 mono text-[10px] tracking-widest text-cocoa uppercase">
            &mdash; {dedication.secondary_quote.author}
            <span className="text-ash"> · {dedication.secondary_quote.source}</span>
          </figcaption>
        </figure>

        {/* CTA to the full dedication page */}
        <div className="text-center mt-10 reveal reveal-8">
          <Link href="/kamal/"
                className="inline-block border border-ember/40 bg-ember/10 hover:bg-ember/20 text-ember
                           mono text-[11px] tracking-widest uppercase px-5 py-2.5 rounded
                           lift">
            Read the full dedication →
          </Link>
        </div>

        <p className="mono text-[10px] tracking-widest text-ash uppercase text-center mt-6 reveal reveal-8">
          ·  with love, from your oldest road  ·
        </p>

        {/* For Stella, Johnny Lee, and Kingston — the back-seat crew */}
        <div className="mt-10 text-center reveal reveal-8">
          <div className="inline-block border-t border-b border-jam_green/40 py-3 px-6 sm:px-10">
            <p className="ornament mb-1 text-jam_green">For the back-seat crew</p>
            <p className="serif italic text-bark_2 text-sm sm:text-base leading-snug max-w-md">
              For Stella, Johnny Lee, and Kingston on the school pickup ride —
              Bob has songs for you too.
            </p>
            <p className="mono text-[9.5px] tracking-widest text-cocoa uppercase mt-2">
              Three Little Birds · Don&apos;t worry about a thing
            </p>
          </div>
        </div>
      </div>

      <hr className="hr-rule mt-12 mb-2"/>
    </section>
  );
}
