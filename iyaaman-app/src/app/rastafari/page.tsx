import TopNav from "@/components/TopNav";

export default function RastafariPage() {
  return (
    <>
      <TopNav />

      <div className="tricolor-bar max-w-6xl mx-auto"/>

      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-10 pb-6">
        <p className="ornament mb-3 tricolor-mark">The spiritual frame around the music</p>
        <h1 className="display text-bark text-5xl sm:text-6xl tracking-tight leading-none">
          Rastafari
        </h1>
        <p className="serif text-bark_2 text-lg mt-4 max-w-2xl leading-relaxed">
          A short field guide to the faith that gave Bob his language — Selassie,
          the Twelve Tribes, Nyabinghi, Babylon and Zion, the Ital way.
        </p>
      </section>

      <div className="tricolor-bar-thin max-w-6xl mx-auto"/>

      <section className="px-5 sm:px-8 md:px-12 max-w-3xl mx-auto pb-6">
        <p className="serif text-bark text-base leading-relaxed drop-cap">
          Rastafari emerged in Jamaica in the 1930s after Haile Selassie I was
          crowned Emperor of Ethiopia. To his followers, Selassie was the
          returned messiah named in Revelation, and Ethiopia the promised land
          for Africans scattered through the diaspora. Bob did not invent any of
          this. He inherited it, absorbed it through his wife Rita and the
          elders of Trench Town, and made it the central frame of his songs.
        </p>
      </section>

      <section className="px-5 sm:px-8 md:px-12 max-w-3xl mx-auto pb-10">
        <h2 className="display text-jam_green text-3xl tracking-tight mt-8 mb-3">
          Haile Selassie&apos;s Visit, April 21, 1966
        </h2>
        <p className="serif text-bark_2 text-base leading-relaxed">
          Selassie landed at Palisadoes Airport in a downpour. The skies broke
          open as the plane touched down — Rastas read it as confirmation.
        </p>
        <p className="serif text-bark_2 text-base leading-relaxed mt-3">
          Rita Marley was at the airport. She reported seeing stigmata on
          Selassie&apos;s palm as he waved from the staircase. The day is now
          observed annually as Grounation Day.
        </p>
        <p className="serif text-bark_2 text-base leading-relaxed mt-3">
          Bob was in Delaware that month, working at the Chrysler plant. He
          returned to a Jamaica, and a wife, transformed.
        </p>

        <h2 className="display text-leaf_2 text-3xl tracking-tight mt-10 mb-3">
          Twelve Tribes of Israel
        </h2>
        <p className="serif text-bark_2 text-base leading-relaxed">
          Founded in Kingston in 1968 by Vernon Carrington (Prophet Gad), the
          Twelve Tribes assigns each member a tribe by birth month.
        </p>
        <p className="serif text-bark_2 text-base leading-relaxed mt-3">
          Bob, born February 6, was of the tribe of Joseph. He joined the Twelve
          Tribes around 1972. It became the spiritual community closest to him
          in the Island years.
        </p>
        <p className="serif text-bark_2 text-base leading-relaxed mt-3">
          The Twelve Tribes was the most outward-facing of the Rastafari
          mansions — open to people of any race, central to Bob&apos;s
          international circle.
        </p>

        <h2 className="display text-jam_red text-3xl tracking-tight mt-10 mb-3">
          Nyabinghi
        </h2>
        <p className="serif text-bark_2 text-base leading-relaxed">
          The oldest mansion of Rastafari and the source of the drumming
          tradition that gave reggae its pulse — three drums called bass,
          fundeh, and repeater.
        </p>
        <p className="serif text-bark_2 text-base leading-relaxed mt-3">
          Bob&apos;s percussionist Seeco Patterson came from the Nyabinghi
          tradition and brought it into the records. Listen to the opening of
          &quot;Rastaman Chant&quot; on Burnin&apos;.
        </p>

        <h2 className="display text-jam_black text-3xl tracking-tight mt-10 mb-3">
          Babylon and Zion
        </h2>
        <p className="serif text-bark_2 text-base leading-relaxed">
          The framework that organizes the lyrics. Babylon is the system —
          colonial, capitalist, oppressive, materially seductive.
        </p>
        <p className="serif text-bark_2 text-base leading-relaxed mt-3">
          Zion is the promised place. Sometimes Ethiopia, sometimes a state of
          mind, always the alternative to Babylon&apos;s captivity.
        </p>
        <p className="serif text-bark_2 text-base leading-relaxed mt-3">
          &quot;Exodus, movement of Jah people&quot; is the framework in a
          sentence — leaving Babylon, headed toward Zion.
        </p>

        <h2 className="display text-jam_green text-3xl tracking-tight mt-10 mb-3">
          The Ital Way
        </h2>
        <p className="serif text-bark_2 text-base leading-relaxed">
          Ital, from &quot;vital,&quot; is the Rastafari diet. Plant-based,
          unprocessed, no salt, no pork, no shellfish.
        </p>
        <p className="serif text-bark_2 text-base leading-relaxed mt-3">
          Cooking with natural herbs, drinking from coconut and fresh juice
          rather than alcohol. The body kept clean as a temple for Jah.
        </p>
        <p className="serif text-bark_2 text-base leading-relaxed mt-3">
          Bob ate Ital for most of his adult life. Rita Marley still runs an
          Ital kitchen in Ghana.
        </p>
      </section>

      <div className="tricolor-bar max-w-6xl mx-auto"/>

      <footer className="border-t border-bark/15 bg-sand_2/40 mt-6">
        <div className="tricolor-bar-thin"/>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 text-center">
          <p className="serif italic text-cocoa text-sm">
            One love. One heart. Let&apos;s get together and feel all right.
          </p>
          <p className="mono text-[10px] tracking-widest text-cocoa uppercase mt-3">
            Iyaaman · A demo built for Kamal Soliman · 2026
          </p>
        </div>
      </footer>
    </>
  );
}
