import Link from "next/link";

const NAV = [
  { href: "/",              label: "Home" },
  { href: "/kamal",         label: "For Kamal" },
  { href: "/family",        label: "Family Tree" },
  { href: "/damian-marley", label: "Damian" },
  { href: "/discography",   label: "Discography" },
  { href: "/wailers",       label: "The Wailers" },
  { href: "/studios",       label: "Studios" },
  { href: "/places",        label: "Places" },
  { href: "/timeline",      label: "Timeline" },
  { href: "/rastafari",     label: "Rastafari" },
];

export default function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-bark/15 bg-sand/85 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-baseline gap-2 group">
          <span className="display text-ember text-2xl tracking-tight">IYAAMAN</span>
          <span className="mono text-[10px] tracking-widest text-cocoa uppercase
                           hidden sm:inline">
            Bob Marley · The Complete Universe
          </span>
        </Link>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 mono text-[10px] tracking-widest text-bark_2 uppercase">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}
                  className="hover:text-ember transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="tricolor-bar-thin"/>
    </header>
  );
}
