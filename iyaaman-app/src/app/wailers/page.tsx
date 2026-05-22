import Link from "next/link";
import TopNav from "@/components/TopNav";
import { people, type Person } from "@/lib/people";

function shortBio(bio: string): string {
  if (bio.length <= 180) return bio;
  return bio.slice(0, 180).replace(/\s+\S*$/, "") + "…";
}

function PersonCard({ p }: { p: Person }) {
  const yearRange =
    p.born || p.died
      ? `${p.born ? p.born.slice(0, 4) : "?"}${p.died ? `–${p.died.slice(0, 4)}` : ""}`
      : null;
  return (
    <Link
      href={`/family/${p.slug}/`}
      className="block border border-bark/15 bg-sand_2/40 p-4 hover:border-ember/60 hover:bg-sand_2/70 transition-colors rounded"
    >
      <h3 className="serif text-bark text-xl font-bold leading-tight">
        {p.name}
      </h3>
      {p.aka && p.aka.length > 0 && (
        <p className="mono text-[10px] tracking-widest text-cocoa uppercase mt-1">
          aka {p.aka.join(" · ")}
        </p>
      )}
      <p className="serif italic text-cocoa text-sm mt-2 leading-snug">
        {p.role}
      </p>
      {yearRange && (
        <p className="mono text-[10px] tracking-widest text-cocoa uppercase mt-2">
          {yearRange}
        </p>
      )}
      <p className="text-bark_2 text-sm mt-2 leading-relaxed">
        {shortBio(p.bio)}
      </p>
    </Link>
  );
}

function Section({
  ornamentLabel,
  title,
  intro,
  people: list,
}: {
  ornamentLabel: string;
  title: string;
  intro: string;
  people: Person[];
}) {
  if (list.length === 0) return null;
  return (
    <section className="pb-12">
      <p className="ornament mb-3">{ornamentLabel}</p>
      <h2 className="display text-bark text-3xl tracking-tight mb-3">
        {title}
      </h2>
      <p className="serif text-cocoa text-base max-w-3xl mb-6 leading-relaxed">
        {intro}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((p) => (
          <PersonCard key={p.slug} p={p} />
        ))}
      </div>
    </section>
  );
}

export default function WailersPage() {
  const originalTrio = people.filter((p) =>
    p.tags?.includes("original-trio"),
  );

  // Bob himself is a "wailer" only by virtue of being the founder — include
  // the original trio (Bob, Peter, Bunny) plus the band that came after.
  const wailersBand = people.filter(
    (p) =>
      p.tags?.includes("wailer") && !p.tags?.includes("original-trio"),
  );

  const iThrees = people.filter((p) => p.tags?.includes("i-three"));

  const producers = people.filter((p) => p.tags?.includes("producer"));

  // Original trio should include Bob — he's tagged "founder" not "original-trio"
  // but the trio is the three founding Wailers. Pull Bob in explicitly.
  const bob = people.find((p) => p.slug === "bob-marley");
  const trioWithBob = bob
    ? [bob, ...originalTrio.filter((p) => p.slug !== "bob-marley")]
    : originalTrio;

  return (
    <>
      <TopNav />

      <section className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-8 pb-6">
        <p className="ornament mb-3">Bob&apos;s Band</p>
        <h1 className="display text-bark text-5xl sm:text-6xl tracking-tight leading-none">
          The Wailers
        </h1>
        <p className="serif text-cocoa text-base mt-5 max-w-3xl leading-relaxed">
          The Wailers began in 1963 as a vocal trio in a Trench Town yard —
          Bob, Peter Tosh, Bunny Wailer. Through Studio One, Lee Perry&apos;s
          Black Ark, and finally Island Records, that trio built the sound
          that made reggae a global language. Peter and Bunny walked away in
          1974. What remained — the Barrett brothers&apos; rhythm section, the
          keyboards, the I-Threes&apos; harmonies — became the band that
          travelled the world with Bob until his death.
        </p>
      </section>

      <div className="tricolor-bar-thin max-w-6xl mx-auto"/>

      <div className="px-5 sm:px-8 md:px-12 max-w-6xl mx-auto pt-6">
        <Section
          ornamentLabel="The Founders"
          title="The Original Trio (1963–74)"
          intro="Three voices that met in a Kingston yard and built a sound out of doo-wop, ska, rocksteady, and the Rastafarian psalms drifting up from the camps. Together for eleven years; together on every record from The Wailing Wailers (1965) to Burnin&apos; (1973)."
          people={trioWithBob}
        />

        <Section
          ornamentLabel="Post-1974"
          title="The Wailers Band"
          intro="When Peter and Bunny left, Bob built the touring band that took reggae to the stadiums. Aston and Carlton Barrett anchored the rhythm; Tyrone Downie and Earl Lindo on keys; Al Anderson and Junior Marvin trading lead guitar; Seeco Patterson on percussion as the elder of the room."
          people={wailersBand}
        />

        <Section
          ornamentLabel="Backup Vocals"
          title="The I-Threes"
          intro="Three Jamaican women who took over harmony duties from Peter and Bunny in 1974 — Rita Marley, Marcia Griffiths, and Judy Mowatt. All three were established solo artists in their own right. They sang on every Bob Marley & The Wailers record from Natty Dread (1974) onward."
          people={iThrees}
        />

        <Section
          ornamentLabel="The Producers"
          title="The Producers"
          intro="The three men who built the rooms where the records were made — Coxsone Dodd at Studio One, Lee &apos;Scratch&apos; Perry at Black Ark, and Chris Blackwell at Island Records. Three radically different studios, three radically different sounds, one continuous arc."
          people={producers}
        />
      </div>

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
