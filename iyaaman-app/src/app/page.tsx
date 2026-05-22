import Link from "next/link";
import TopNav from "@/components/TopNav";
import RarePhotos from "@/components/RarePhotos";
import Hero from "@/components/Hero";
import FamilyGraph from "@/components/FamilyGraph";
import { albums } from "@/lib/albums";
import { people } from "@/lib/people";

const HUB = [
  { href: "/family",      title: "Family Tree",   blurb: "Bob, Rita, Cindy, twelve children, grandchildren — and every album they made, linked by blood." },
  { href: "/discography", title: "Discography",   blurb: "Every Marley record from The Wailing Wailers (1965) to Old Soul (2023). Sorted by year, decade, family member." },
  { href: "/wailers",     title: "The Wailers",   blurb: "Peter, Bunny, the Barrett brothers, Tyrone Downie, Junior Marvin, Seeco — the band that travelled with him." },
  { href: "/studios",     title: "Studios",       blurb: "Studio One, Black Ark, Tuff Gong, Harry J, Compass Point. Where the records were actually made." },
  { href: "/places",      title: "Places",        blurb: "Nine Mile, Trench Town, 56 Hope Road, Strawberry Hill. The geography of a life." },
  { href: "/timeline",    title: "Timeline",      blurb: "1945 to 1981, beat by beat. Births, sessions, attempts, exiles, returns, the last show." },
  { href: "/rastafari",   title: "Rastafari",     blurb: "Haile Selassie, the Twelve Tribes, Nyabinghi, Babylon vs Zion — the spiritual frame around the music." },
  { href: "/legacy",      title: "Legacy",        blurb: "Damian, Ziggy, Stephen, Ky-Mani, Julian, Skip, JoMersa — the dynasty still making records." },
];

export default function Home() {
  return (
    <>
      <TopNav/>
      <RarePhotos/>
      <Hero/>

      {/* Hub grid — styled as a record back-cover tracklist */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pb-10">
        <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <p className="ornament mb-2">Side A · Tracklist</p>
            <h2 className="display headline-tight text-bark leading-[0.88] tracking-tight
                           text-[44px] sm:text-[72px] md:text-[96px]">
              WHERE YOU<br/>CAN GO
            </h2>
          </div>
          <p className="mono text-[10px] tracking-widest text-cocoa uppercase hidden sm:block whitespace-nowrap pb-2">
            08 cuts · 33⅓ RPM
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HUB.map((h, i) => (
            <Link
              key={h.href}
              href={h.href}
              className="group relative block border border-bark/18 bg-sand_2/50 p-5 pl-5
                         hover:border-ember/70 hover:bg-sand_2/80 rounded lift overflow-hidden"
            >
              {/* Track number — ghost numeral, top-right watermark */}
              <span aria-hidden="true"
                    className="display text-jam_green/12 group-hover:text-ember/20 transition-colors
                               absolute -right-1 -top-2 leading-none select-none
                               text-[88px] sm:text-[104px]">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Left-edge tricolor tick */}
              <span aria-hidden="true"
                    className="absolute left-0 inset-y-0 w-[3px] rounded-l"
                    style={{
                      background: i % 3 === 0 ? "#0f7438" : i % 3 === 1 ? "#e6b800" : "#c0382b",
                      opacity: 0.55,
                    }}/>
              {/* Hover: full-width ember tick at top */}
              <span aria-hidden="true"
                    className="absolute top-0 left-0 right-0 h-[2px] bg-ember scale-x-0 group-hover:scale-x-100
                               transition-transform duration-300 origin-left"/>

              <div className="relative pl-2">
                <p className="mono text-[9px] tracking-[0.32em] uppercase text-jam_green">
                  Track {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="display text-bark text-[22px] sm:text-[26px] leading-[0.95] tracking-tight mt-1.5">
                  {h.title}
                </h3>
                <p className="serif text-bark_2 text-[13px] mt-2.5 leading-relaxed line-clamp-3">
                  {h.blurb}
                </p>
                <p className="mono text-[9px] tracking-widest text-cocoa uppercase mt-4 opacity-50
                              group-hover:opacity-100 group-hover:text-ember transition">
                  Enter →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="tricolor-bar-thin max-w-6xl mx-auto"/>

      {/* Family graph */}
      <FamilyGraph/>

      <hr className="hr-rule max-w-6xl mx-auto mt-12"/>

      {/* Quick counts */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pb-14">
        <p className="ornament mb-3">By the numbers</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <Stat n={people.filter(p => p.tags?.includes("marley-family")).length} label="Family members" />
          <Stat n={albums.length} label="Albums in catalog" />
          <Stat n={people.filter(p => p.tags?.includes("wailer")).length} label="Wailers (band members)" />
          <Stat n={albums.filter(a => (a.awards || []).some(s => s.toLowerCase().includes("grammy"))).length} label="Grammy-winning records" />
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

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <p className="display text-ember text-4xl sm:text-5xl leading-none">{n}</p>
      <p className="mono text-[10px] tracking-widest text-cocoa uppercase mt-2">{label}</p>
    </div>
  );
}
