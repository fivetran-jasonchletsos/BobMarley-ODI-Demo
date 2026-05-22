import Link from "next/link";
import TopNav from "@/components/TopNav";

export const metadata = {
  title: "Damian \"Jr. Gong\" Marley · Tuff Gong",
  description:
    "A dedicated page for Damian \"Jr. Gong\" Marley — Bob's youngest acknowledged son. " +
    "Born to a Miss World, raised in Kingston, builder of a sound that hung reggae on hip-hop's chassis.",
};

export default function DamianMarleyPage() {
  return (
    <>
      <TopNav/>

      {/* ====================== HERO ====================== */}
      <section className="relative pt-10 pb-8 sm:pt-14 px-5 sm:px-8 md:px-12 max-w-5xl mx-auto">
        <p className="ornament mb-4 tricolor-mark reveal reveal-1">The youngest son</p>
        <h1 className="display headline-tight text-ember leading-[0.92] tracking-tight
                       text-[52px] xs:text-[64px] sm:text-[96px] md:text-[120px]
                       reveal reveal-2">
          DAMIAN
        </h1>
        <p className="display text-bark mt-2 tracking-tight
                      text-[22px] xs:text-[28px] sm:text-[44px] md:text-[56px] leading-none
                      reveal reveal-3">
          &ldquo;JR. GONG&rdquo; MARLEY
        </p>
        <p className="serif italic text-cocoa text-base sm:text-xl mt-6 max-w-2xl leading-relaxed
                      reveal reveal-4">
          Bob&apos;s youngest acknowledged son. Born to a Miss World, raised in Kingston,
          made the album the family always knew he could.
          The one who hung the sound on hip-hop&apos;s chassis.
        </p>

        <div className="mt-7 flex flex-wrap gap-x-5 sm:gap-x-7 gap-y-2 text-bark mono text-[10px] sm:text-[11px] tracking-widest
                        reveal reveal-5">
          <span><b className="text-ember text-base mono">5&times;</b>&nbsp;&nbsp;GRAMMY WINNER</span>
          <span><b className="text-ember text-base mono">5</b>&nbsp;&nbsp;STUDIO LPS</span>
          <span><b className="text-ember text-base mono">21·07·1978</b>&nbsp;&nbsp;BORN</span>
          <span><b className="text-ember text-base mono">SHR</b>&nbsp;&nbsp;STONY HILL RECORDS</span>
        </div>
      </section>

      <div className="tricolor-bar-thin max-w-5xl mx-auto"/>

      {/* ====================== THE BIRTH ====================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-2xl mx-auto mt-12">
        <p className="ornament mb-2">1978</p>
        <h2 className="display text-bark text-3xl sm:text-4xl tracking-tight">
          Born into the legend
        </h2>
        <p className="serif text-bark text-[17px] sm:text-[19px] leading-[1.78] drop-cap mt-5">
          July 21, 1978. Damian Robert Nesta Marley arrives in Kingston, the son
          of <span className="mark-gold">Cindy Breakspeare</span> — Miss World 1976 — and Bob,
          who was thirty-three and at the height of his powers. Kaya had just
          come out of the London sessions. Babylon by Bus was on the way.
        </p>
        <p className="serif text-bark_2 text-[17px] leading-[1.78] mt-5">
          He is the youngest of Bob&apos;s eleven publicly-acknowledged children,
          born into a family that already moved like a small country.
          A father whose face was on dorm-room walls in every time zone.
          A mother who held a global crown.
        </p>
        <p className="serif text-bark_2 text-[17px] leading-[1.78] mt-5">
          He was three years old when Bob passed. What he inherited
          was not memory; it was the room the man had left behind,
          and the brothers and sisters already standing in it.
        </p>
      </section>

      {/* ====================== EPIGRAPH — DAMIAN LYRIC ====================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-3xl mx-auto mt-16">
        <hr className="hr-rule"/>
        <figure className="mt-8">
          <blockquote className="serif text-bark text-2xl sm:text-4xl leading-[1.18] italic text-center
                                 relative px-6 sm:px-12 py-2">
            <span className="display text-gold/40 text-[110px] absolute -left-1 -top-12 leading-none select-none">&ldquo;</span>
            Out of road, into road —<br/>
            we run a long mile.
            <span className="display text-gold/40 text-[110px] absolute -right-1 -bottom-16 leading-none select-none">&rdquo;</span>
          </blockquote>
          <figcaption className="mt-7 mono text-[11px] tracking-widest text-cocoa uppercase text-center">
            &mdash; Damian &ldquo;Jr.&nbsp;Gong&rdquo; Marley
            <span className="text-ash"> · in the spirit of Welcome to Jamrock · 2005</span>
          </figcaption>
        </figure>
      </section>

      {/* ====================== THE SOUND ====================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-2xl mx-auto mt-16">
        <p className="ornament mb-2">The Sound</p>
        <h2 className="display text-bark text-3xl sm:text-4xl tracking-tight">
          Reggae on hip-hop&apos;s chassis
        </h2>
        <p className="serif text-bark_2 text-[17px] leading-[1.78] mt-5">
          His voice arrived first as a deejay&apos;s — rapid-fire patois
          riding the beat like a horn line, the toasting tradition of
          Yellowman and Eek-A-Mouse pulled into a new century.
          He is one of the few who can hold his own at any tempo, in any room.
        </p>
        <p className="serif text-bark_2 text-[17px] leading-[1.78] mt-5">
          Behind the desk for most of it: his older brother{" "}
          <Link href="/family/stephen-marley/" className="link-inline">Stephen</Link>,
          the family&apos;s sharpest arranger.
          Stephen produced Mr. Marley, Halfway Tree, Welcome to Jamrock.
          The two of them later co-founded{" "}
          <span className="mark-leaf">Stony Hill Records</span> in Miami.
        </p>
        <p className="serif text-bark_2 text-[17px] leading-[1.78] mt-5">
          Outside the family he has worked with{" "}
          <Link href="/family/nas/" className="link-inline">Nas</Link>,
          JAY-Z, Skrillex, Bobby Brown, Major Lazer, Mick Jagger, and his
          nephew Skip. The credits don&apos;t look like any other reggae artist&apos;s
          — and yet every record still sounds like a Marley record.
        </p>
        <p className="serif text-bark_2 text-[17px] leading-[1.78] mt-5">
          The signature is the chassis: hip-hop drums, dub bass, horns
          that arrive like brass on a Stax cut, vocals that move between
          singing and toasting inside the same bar. It is reggae that
          can sit on any festival lineup in the world.
        </p>
      </section>

      {/* ====================== FIVE RECORDS ====================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-5xl mx-auto mt-20">
        <div className="text-center mb-9">
          <p className="ornament mb-1">The Catalog</p>
          <h2 className="display text-bark text-3xl sm:text-4xl tracking-tight">
            Five records, five doors
          </h2>
        </div>

        <div className="space-y-5">
          <AlbumBlock
            year="1996"
            slug="mr-marley"
            title="Mr. Marley"
            blurb={
              <>
                Debut at seventeen. The voice has not yet settled,
                but the rapid-fire toasting style that becomes his signature
                is already there. Stephen producing — a partnership
                already taking its shape inside the booth.
              </>
            }
          />
          <AlbumBlock
            year="2001"
            slug="halfway-tree"
            title="Halfway Tree"
            blurb={
              <>
                Named for the Kingston crossroads where uptown meets downtown.
                Stephen producing again, the arrangements wider,
                the writing sharper.
                His first Grammy — Best Reggae Album.
              </>
            }
            awards="GRAMMY · BEST REGGAE ALBUM (2002)"
          />
          <AlbumBlock
            year="2005"
            slug="welcome-to-jamrock"
            title="Welcome to Jamrock"
            blurb={
              <>
                The album that broke the second-generation ceiling.
                Title track sampled Ini Kamoze&apos;s &ldquo;World a Music&rdquo;
                and shocked open the door. Won two Grammys in one night —
                Best Reggae Album and Best Urban/Alternative Performance.
                Sold past a million in the US.
              </>
            }
            awards="2 GRAMMYS · ONLY REGGAE ARTIST TO WIN TWO GENRE CATEGORIES SAME NIGHT"
          />
          <AlbumBlock
            year="2010"
            slug="distant-relatives"
            title="Distant Relatives"
            blurb={
              <>
                The collaboration with{" "}
                <Link href="/family/nas/" className="link-inline">Nas</Link>.
                A track-by-track meditation on African diaspora — Mulatu
                Astatke samples, K&apos;naan and Stephen Marley features.
                Universally counted among the great cross-genre records
                of the century&apos;s second decade.
              </>
            }
            awards="WITH NAS · UNIVERSAL ACCLAIM"
          />
          <AlbumBlock
            year="2017"
            slug="stony-hill"
            title="Stony Hill"
            blurb={
              <>
                Twelve years after Jamrock. Major Lazer and Stephen feature.
                A double album in feel — political side, personal side —
                made on his own label, in his own time.
                Best Reggae Album at the Grammys the following winter.
              </>
            }
            awards="GRAMMY · BEST REGGAE ALBUM (2018)"
          />
        </div>
      </section>

      {/* ====================== NO PRESS PHOTOS NOTE ====================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-5xl mx-auto mt-16">
        <div className="border border-bark/20 bg-sand_2/70 px-6 sm:px-10 py-8 max-w-xl mx-auto text-center">
          <p className="ornament mb-3">A note</p>
          <p className="serif italic text-bark text-[15px] sm:text-[17px] leading-[1.7]">
            No studio publicity photos appear in this site by design.
            Every image on Tuff Gong is from a friend&apos;s iPhone,
            not a press kit.
            For what Damian looks like on stage — you already know.
          </p>
        </div>
      </section>

      {/* ====================== THE ROAD ====================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-2xl mx-auto mt-16">
        <p className="ornament mb-2">The Road</p>
        <h2 className="display text-bark text-3xl sm:text-4xl tracking-tight">
          Bus call · soundcheck · doors at eight
        </h2>
        <p className="serif text-bark_2 text-[17px] leading-[1.78] mt-5">
          The tour is the continuation. Bob travelled the music
          out of Kingston and into the planet&apos;s bloodstream;
          the sons travel it onward, festival to festival,
          continent to continent, year after year.
          Damian has not stopped touring since Halfway Tree.
        </p>
        <p className="serif text-bark_2 text-[17px] leading-[1.78] mt-5">
          The crew becomes a family. The family becomes the city.
          The city changes every night, and the work is the same:
          bus call at four, lobby call at five, load-in by six,
          sound check by seven, doors at eight.
        </p>
        <p className="serif text-bark_2 text-[17px] leading-[1.78] mt-5">
          A road that long, you start to know the people on it better
          than your own neighbors. The voice on the radio in the van.
          The hand on the desk at front-of-house. The one who knows
          the cues before the cues happen.
        </p>

        <div className="mt-9 border-l-2 border-ember pl-5 sm:pl-6">
          <p className="serif text-bark text-[16px] sm:text-[17px] leading-[1.7]">
            This is the world your tour manager{" "}
            <span className="mark-ember">Kamal Soliman</span> lives inside of every night.
          </p>
          <p className="mt-3">
            <Link href="/kamal/" className="link-inline mono text-[12px] tracking-widest uppercase">
              Read his dedication &rarr;
            </Link>
          </p>
        </div>
      </section>

      {/* ====================== EPIGRAPH — BOB ====================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-3xl mx-auto mt-20">
        <hr className="hr-rule"/>
        <figure className="mt-8">
          <blockquote className="serif text-bark text-2xl sm:text-4xl leading-[1.18] italic text-center
                                 relative px-6 sm:px-12 py-2">
            <span className="display text-gold/40 text-[110px] absolute -left-1 -top-12 leading-none select-none">&ldquo;</span>
            If you know your history,<br/>
            then you would know where you&apos;re coming from.
            <span className="display text-gold/40 text-[110px] absolute -right-1 -bottom-16 leading-none select-none">&rdquo;</span>
          </blockquote>
          <figcaption className="mt-7 mono text-[11px] tracking-widest text-cocoa uppercase text-center">
            &mdash; Bob Marley
            <span className="text-ash"> · Buffalo Soldier · 1980</span>
          </figcaption>
        </figure>
      </section>

      {/* ====================== THE FAMILY HAND-OFF ====================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-2xl mx-auto mt-20">
        <p className="ornament mb-2">The Family</p>
        <h2 className="display text-bark text-3xl sm:text-4xl tracking-tight">
          Three brothers, one ear
        </h2>
        <p className="serif text-bark_2 text-[17px] leading-[1.78] mt-5">
          <Link href="/family/stephen-marley/" className="link-inline">Stephen</Link>{" "}
          produced him into the canon — Halfway Tree, Welcome to Jamrock,
          Stony Hill all bear that signature. Eight Grammys of his own
          and the family&apos;s most musically gifted ear; the one who
          hears arrangements other Marleys cannot.
        </p>
        <p className="serif text-bark_2 text-[17px] leading-[1.78] mt-5">
          Skip Marley — his nephew, Cedella&apos;s son — has opened for him on tour
          and crossed into pop charts with &ldquo;Slow Down&rdquo; featuring H.E.R.
          The third generation runs alongside the second, not after it.
        </p>
        <p className="serif text-bark_2 text-[17px] leading-[1.78] mt-5">
          Ziggy is the eldest, eight Grammys himself, the public face
          of the dynasty since 1985. Cedella runs Tuff Gong International
          in Kingston; Damian runs Stony Hill Records in Miami.
          Two labels, one family, one ear shared between them.
        </p>
      </section>

      {/* ====================== FAMILY LINK GRID ====================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto mt-16">
        <p className="ornament mb-3">The People Around Him</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <FamilyCard
            href="/family/bob-marley/"
            ornament="Father"
            name="Bob Marley"
            role="The man whose room he was born into"
          />
          <FamilyCard
            href="/family/cindy-breakspeare/"
            ornament="Mother"
            name="Cindy Breakspeare"
            role="Miss World 1976 · jazz singer"
          />
          <FamilyCard
            href="/family/stephen-marley/"
            ornament="Brother"
            name="Stephen Marley"
            role="Producer of his first three records"
          />
          <FamilyCard
            href="/family/nas/"
            ornament="Collaborator"
            name="Nas"
            role="Co-author of Distant Relatives (2010)"
          />
        </div>
      </section>

      {/* ====================== DISCOGRAPHY GRID ====================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto mt-16">
        <p className="ornament mb-3">The Discography</p>
        <h2 className="display text-bark text-2xl sm:text-3xl tracking-tight mb-6">
          Five studio LPs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DiscoCard
            year="1996"
            slug="mr-marley"
            title="Mr. Marley"
            blurb="Debut at seventeen. The toasting style already there."
          />
          <DiscoCard
            year="2001"
            slug="halfway-tree"
            title="Halfway Tree"
            blurb="The Kingston crossroads. First Grammy."
            awards="GRAMMY · BEST REGGAE ALBUM"
          />
          <DiscoCard
            year="2005"
            slug="welcome-to-jamrock"
            title="Welcome to Jamrock"
            blurb="Double Grammy. The Ini Kamoze sample. The career."
            awards="2 GRAMMYS"
          />
          <DiscoCard
            year="2010"
            slug="distant-relatives"
            title="Distant Relatives"
            blurb="With Nas. African diaspora, track by track."
            awards="WITH NAS"
          />
          <DiscoCard
            year="2017"
            slug="stony-hill"
            title="Stony Hill"
            blurb="Twelve-year follow-up. Best Reggae Album."
            awards="GRAMMY · BEST REGGAE ALBUM"
          />
        </div>
      </section>

      {/* ====================== CLOSING ====================== */}
      <section className="px-5 sm:px-8 md:px-12 max-w-2xl mx-auto mt-20 text-center">
        <p className="ornament mb-3">For the youngest son, from the road of his oldest brother</p>
        <p className="serif italic text-bark text-[17px] sm:text-[19px] leading-[1.78]">
          This page is part of Tuff Gong — a gift for Kamal Soliman,
          who has been on the road with you, and on the road of life
          with the man who built this site, for over thirty years.
          Thank you for the music, brother.
          And thank you, on his behalf, for keeping his friend close.
        </p>
        <p className="mono text-[11px] tracking-widest text-ember uppercase mt-8">
          ·&nbsp;&nbsp;with love&nbsp;&nbsp;·
        </p>
      </section>

      {/* ====================== FOOTER ====================== */}
      <footer className="border-t border-bark/15 bg-sand_2/40 mt-16">
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

/* ============================================================
   SUB-COMPONENTS
   ============================================================ */

function AlbumBlock({
  year, slug, title, blurb, awards,
}: {
  year: string;
  slug: string;
  title: string;
  blurb: React.ReactNode;
  awards?: string;
}) {
  return (
    <article className="border border-bark/15 bg-sand_2/40 rounded p-5 sm:p-7 hover:border-ember/50 lift">
      <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-4 sm:gap-7">
        <div>
          <p className="mono text-ember text-2xl sm:text-3xl leading-none">{year}</p>
          <p className="mono text-[10px] tracking-widest text-cocoa uppercase mt-2">Studio LP</p>
        </div>
        <div>
          <h3 className="display text-bark text-2xl sm:text-3xl tracking-tight leading-none">
            {title}
          </h3>
          <p className="serif text-bark_2 text-[16px] leading-[1.72] mt-3">
            {blurb}
          </p>
          {awards && (
            <p className="mono text-[10.5px] tracking-widest text-gold uppercase mt-4">
              {awards}
            </p>
          )}
          <p className="mt-4">
            <Link href={`/discography/${slug}/`} className="link-inline mono text-[11px] tracking-widest uppercase">
              &rarr; Open album
            </Link>
          </p>
        </div>
      </div>
    </article>
  );
}

function FamilyCard({
  href, ornament, name, role,
}: {
  href: string;
  ornament: string;
  name: string;
  role: string;
}) {
  return (
    <Link
      href={href}
      className="block border border-bark/15 bg-sand_2/40 p-4 hover:border-ember/60 hover:bg-sand_2/70 rounded lift"
    >
      <p className="ornament">{ornament}</p>
      <h3 className="serif text-bark text-lg font-bold mt-1">{name}</h3>
      <p className="text-bark_2 text-sm mt-2 leading-relaxed">{role}</p>
    </Link>
  );
}

function DiscoCard({
  year, slug, title, blurb, awards,
}: {
  year: string;
  slug: string;
  title: string;
  blurb: string;
  awards?: string;
}) {
  return (
    <Link
      href={`/discography/${slug}/`}
      className="block border border-bark/15 bg-sand_2/40 p-4 hover:border-ember/60 hover:bg-sand_2/70 rounded lift"
    >
      <p className="mono text-ember text-sm">{year}</p>
      <h3 className="display text-bark text-xl tracking-tight mt-1">{title}</h3>
      <p className="text-bark_2 text-sm mt-2 leading-relaxed">{blurb}</p>
      {awards && (
        <p className="mono text-[10px] tracking-widest text-gold uppercase mt-3">{awards}</p>
      )}
    </Link>
  );
}
