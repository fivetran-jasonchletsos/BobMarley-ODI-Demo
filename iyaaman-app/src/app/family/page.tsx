import TopNav from "@/components/TopNav";
import PortraitCard from "@/components/PortraitCard";
import { people, type Person } from "@/lib/people";

function birthYear(p: Person): number {
  if (!p.born) return 9999;
  const m = p.born.match(/^(\d{4})/);
  return m ? parseInt(m[1], 10) : 9999;
}

function Section({
  ornamentLabel,
  title,
  subtitle,
  people: list,
  compact = true,
}: {
  ornamentLabel: string;
  title: string;
  subtitle?: string;
  people: Person[];
  compact?: boolean;
}) {
  if (list.length === 0) return null;
  return (
    <section className="pb-12">
      <p className="ornament mb-3">{ornamentLabel}</p>
      <h2 className="display text-bark text-3xl sm:text-4xl tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="serif italic text-cocoa text-sm sm:text-base mt-2 max-w-2xl">
          {subtitle}
        </p>
      )}
      <div
        className={
          "mt-6 grid gap-4 sm:gap-5 " +
          (compact
            ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
            : "grid-cols-1 lg:grid-cols-2")
        }
      >
        {list.map((p) => (
          <PortraitCard
            key={p.slug}
            person={p}
            size={compact ? "default" : "feature"}
          />
        ))}
      </div>
    </section>
  );
}

export default function FamilyPage() {
  const bob = people.filter((p) => p.tags?.includes("founder"));
  const parents = people.filter((p) => p.tags?.includes("ancestor"));

  // Bob's generation: Rita + Cindy (partners) + original-trio (Peter, Bunny)
  const partners = people.filter((p) => p.tags?.includes("partner"));
  const rita = people.filter((p) => p.slug === "rita-marley"); // tagged i-three
  const originalTrio = people.filter((p) =>
    p.tags?.includes("original-trio"),
  );
  const bobGenSeen = new Set<string>();
  const bobGen = [...rita, ...partners, ...originalTrio]
    .filter((p) => {
      if (bobGenSeen.has(p.slug)) return false;
      bobGenSeen.add(p.slug);
      return true;
    })
    .sort((a, b) => birthYear(a) - birthYear(b));

  const secondGen = people
    .filter((p) => p.tags?.includes("second-generation"))
    .sort((a, b) => birthYear(a) - birthYear(b));

  const thirdGen = people
    .filter((p) => p.tags?.includes("third-generation"))
    .sort((a, b) => birthYear(a) - birthYear(b));

  // Wailers band (excluding original trio — they're in bobGen)
  const wailersBand = people
    .filter(
      (p) =>
        p.tags?.includes("wailer") && !p.tags?.includes("original-trio"),
    )
    .sort((a, b) => birthYear(a) - birthYear(b));

  // I-Threes (Rita is shown in bobGen, so this excludes her)
  const iThrees = people.filter(
    (p) => p.tags?.includes("i-three") && p.slug !== "rita-marley",
  );

  const producers = people.filter((p) => p.tags?.includes("producer"));

  // Extended (not already shown as producer)
  const extended = people.filter(
    (p) =>
      p.tags?.includes("extended-family") && !p.tags?.includes("producer"),
  );

  return (
    <>
      <TopNav />

      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-8 pb-6">
        <p className="ornament mb-3 reveal reveal-1">The Marley Universe</p>
        <h1 className="display headline-tight text-bark text-4xl sm:text-6xl md:text-7xl tracking-tight leading-none reveal reveal-2">
          Family Tree
        </h1>
        <p className="serif italic text-cocoa text-base sm:text-lg mt-4 max-w-3xl leading-relaxed reveal reveal-3">
          Bob at the center. Three generations of music in his blood and the
          circle around him — partners, Wailers, I-Threes, producers, kin by
          blood, kin by sound.
        </p>
      </section>

      <div className="tricolor-bar-thin max-w-6xl mx-auto" />

      <div className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-8">
        {/* Bob — single large featured card */}
        <Section
          ornamentLabel="Center"
          title="Bob"
          subtitle="Robert Nesta Marley. Born Nine Mile, 1945. Died Miami, 1981. Sold 75 million records. Still the gravity well."
          people={bob}
          compact={false}
        />

        <Section
          ornamentLabel="Ancestors"
          title="Bob's Parents"
          subtitle="The Royal Marines quartermaster and the eighteen-year-old farm girl."
          people={parents}
        />

        <Section
          ornamentLabel="First Generation"
          title="Bob's Generation"
          subtitle="Rita, Cindy, Peter, Bunny — the partners and the original trio."
          people={bobGen}
        />

        <Section
          ornamentLabel="The Children"
          title="Second Generation"
          subtitle="Eleven Marleys (and one Sharon, who Bob raised as his own). Eight Grammys between Ziggy and Stephen alone."
          people={secondGen}
        />

        <Section
          ornamentLabel="The Grandchildren"
          title="Third Generation"
          subtitle="Skip, JoMersa, Yohan, Donisha. The dynasty still pressing records."
          people={thirdGen}
        />

        <Section
          ornamentLabel="The Band"
          title="The Wailers Band"
          subtitle="The Barrett brothers, Tyrone, Earl, Junior, Al, Seeco — the players who travelled with Bob through the Island years."
          people={wailersBand}
        />

        <Section
          ornamentLabel="Backing Harmony"
          title="The I-Threes"
          subtitle="Marcia and Judy. The third of the trio, Rita, is shown with Bob's generation."
          people={iThrees}
        />

        <Section
          ornamentLabel="Behind the Glass"
          title="Producers"
          subtitle="Coxsone at Studio One, Scratch at Black Ark, Blackwell at Island. The three rooms that made Bob."
          people={producers}
        />

        <Section
          ornamentLabel="Inner Circle"
          title="Extended Family"
          subtitle="Lauryn, Nas — partners and collaborators woven into the dynasty's later chapters."
          people={extended}
        />
      </div>

      <footer className="border-t border-bark/15 bg-sand_2/40 mt-6">
        <div className="tricolor-bar-thin" />
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
