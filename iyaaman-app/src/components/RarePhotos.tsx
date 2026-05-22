import { rarePhotos } from "@/lib/rare-photos";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Server-rendered rare-photo strip. Lives at the very top of the homepage,
// above the dedication hero, because the Bob + Damian frames are the rarest
// and most personal pieces in the archive and deserve the first read.
//
// Image files don't exist yet — they live under public/marley/. We render
// the caption + source_hint overlaid on a dark plate so the slot looks
// intentional even with no picture loaded. When the user drops a file in
// with the matching filename, it covers the plate; the caption stays.

export default function RarePhotos() {
  const [lead, ...rest] = rarePhotos;

  return (
    <section className="bg-sand">
      <div className="tricolor-bar" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-10 sm:py-14">
        {/* Section head */}
        <p className="ornament mb-3">rare photographs</p>
        <h2 className="display text-jam_black leading-[0.95] tracking-tight
                       text-4xl sm:text-5xl md:text-6xl">
          From the family archive
        </h2>
        <p className="serif italic text-cocoa text-base sm:text-lg mt-3 max-w-2xl leading-relaxed">
          What we have, in pictures. Bob with his youngest son first.
        </p>

        <div className="tricolor-bar-thin mt-8 mb-8" />

        {/* ---------------- LEAD PHOTO: Bob + baby Damian ---------------- */}
        <figure className="mb-12">
          <div className="relative aspect-[3/2] w-full overflow-hidden bg-jam_black border border-jam_gold/40">
            {/* Background plate text — visible only if image fails to load.
                Because this is a server component we can't rely on onError,
                so we render the placeholder text BEHIND the image; the
                <img> simply covers it when it loads. */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <p className="mono text-[10px] tracking-widest text-jam_gold uppercase">
                Lead photograph · drop file: <span className="text-gold_2">{lead.filename}</span>
              </p>
              <p className="display text-sand text-3xl sm:text-5xl mt-4 leading-tight">
                {lead.caption}
              </p>
              {lead.source_hint && (
                <p className="mono text-[10px] tracking-widest text-jam_gold/70 uppercase mt-4">
                  ↳ {lead.source_hint}
                </p>
              )}
            </div>

            {lead.url && (
              <img
                src={lead.url}
                alt={lead.caption}
                className="relative w-full h-full object-cover"
              />
            )}

            {/* Always-visible caption strip across the bottom */}
            <figcaption className="absolute inset-x-0 bottom-0 bg-jam_black/85 px-5 py-3 border-t border-jam_gold/40">
              <p className="mono text-[10px] tracking-widest text-jam_gold uppercase">
                {lead.year ?? "Undated"} · {(lead.tags ?? []).join(" · ")}
              </p>
              <p className="serif text-sand text-base sm:text-lg leading-tight mt-1">
                {lead.caption}
              </p>
            </figcaption>
          </div>

          <p className="serif text-bark_2 text-sm sm:text-base mt-4 leading-relaxed max-w-3xl">
            {lead.context}
          </p>
          {lead.source_hint && (
            <p className="mono text-[10px] tracking-widest text-ash mt-2 uppercase">
              ↳ {lead.source_hint}
            </p>
          )}
        </figure>

        {/* ---------------- STRIP: remaining photos ---------------- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 sm:gap-6">
          {rest.map((photo) => (
            <figure key={photo.filename}>
              <div className="relative aspect-[3/4] overflow-hidden bg-jam_black border border-jam_gold/40">
                {/* Placeholder layer — visible behind the <img>. */}
                <div className="absolute inset-0 flex flex-col justify-center px-3 text-center">
                  <p className="mono text-[8px] tracking-widest text-jam_gold/80 uppercase">
                    {photo.filename}
                  </p>
                  <p className="serif text-sand text-[13px] mt-3 leading-tight">
                    {photo.caption}
                  </p>
                  {photo.source_hint && (
                    <p className="mono text-[8px] tracking-widest text-jam_gold/50 uppercase mt-3 leading-snug">
                      ↳ {photo.source_hint}
                    </p>
                  )}
                </div>

                {photo.url && (
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="relative w-full h-full object-cover"
                  />
                )}

                {/* Caption overlay, always present */}
                <figcaption className="absolute inset-x-0 bottom-0 bg-jam_black/85 px-3 py-2 border-t border-jam_gold/30">
                  <p className="mono text-[9px] tracking-widest text-jam_gold uppercase truncate">
                    {photo.year ?? "Undated"}
                  </p>
                  <p className="serif text-sand text-[13px] leading-tight">
                    {photo.caption}
                  </p>
                </figcaption>
              </div>

              <p className="text-xs text-cocoa mt-2 leading-snug">{photo.context}</p>
              {photo.source_hint && (
                <p className="mono text-[10px] tracking-widest text-ash mt-1 uppercase">
                  ↳ {photo.source_hint}
                </p>
              )}
            </figure>
          ))}
        </div>

        {/* Drop-in instructions */}
        <p className="mono text-[10px] tracking-widest text-ash uppercase mt-10 text-center">
          Drop photos into <span className="text-cocoa">/public/marley/</span> using the filenames above. Captions appear regardless.
        </p>
      </div>

      <div className="tricolor-bar" />
    </section>
  );
}
