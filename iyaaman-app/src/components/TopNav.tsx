import Link from "next/link";

const NAV = [
  { href: "/",              label: "Home" },
  { href: "/kamal",         label: "For Kamal" },
  { href: "/tree",          label: "The Tree" },
  { href: "/family",        label: "Family" },
  { href: "/damian-marley", label: "Damian" },
  { href: "/discography",   label: "Discography" },
  { href: "/related",       label: "Related" },
  { href: "/ask",           label: "Ask" },
  { href: "/wailers",       label: "Wailers" },
  { href: "/studios",       label: "Studios" },
  { href: "/timeline",      label: "Timeline" },
  { href: "/rastafari",     label: "Rastafari" },
];

export default function TopNav() {
  return (
    <header className="sticky top-[2px] z-40 border-b border-bark/15 bg-sand/85 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3
                      flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
        <Link href="/" className="flex items-baseline gap-2 group shrink-0">
          <span className="display text-ember text-2xl tracking-tight">TUFF GONG</span>
          <span className="mono text-[10px] tracking-widest text-cocoa uppercase
                           hidden sm:inline">
            Bob Marley · The Complete Universe
          </span>
        </Link>
        {/* Mobile: horizontal-scroll, single row. Desktop: wrap normally. */}
        <nav className="flex md:flex-wrap gap-x-4 gap-y-1 mono text-[10px] tracking-widest text-bark_2 uppercase
                        overflow-x-auto md:overflow-visible -mx-1 px-1
                        whitespace-nowrap md:whitespace-normal
                        [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href}
                  className="hover:text-ember transition-colors shrink-0">
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="tricolor-bar-thin"/>
    </header>
  );
}
