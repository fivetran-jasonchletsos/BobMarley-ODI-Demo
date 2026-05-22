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

      {/* Hub grid */}
      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pb-10">
        <p className="ornament mb-3">Eight Doors</p>
        <h2 className="display text-bark text-3xl tracking-tight mb-6">
          Where you can go
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HUB.map((h) => (
            <Link key={h.href} href={h.href}
                  className="block border border-bark/15 bg-sand_2/40 p-4 hover:border-ember/60 hover:bg-sand_2/70 rounded lift">
              <p className="ornament">{h.title.split(" ")[0]}</p>
              <h3 className="serif text-bark text-xl font-bold mt-1">{h.title}</h3>
              <p className="text-bark_2 text-sm mt-2 leading-relaxed">{h.blurb}</p>
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
