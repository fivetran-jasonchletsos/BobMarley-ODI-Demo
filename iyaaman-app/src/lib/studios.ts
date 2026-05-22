// Recording studios where Bob and the Wailers worked.
// Curated, accurate, no apocrypha.

export type Studio = {
  slug: string;
  name: string;
  location: string;
  years: string;
  producer?: string;
  blurb: string;
  albums_recorded?: string[];
};

export const studios: Studio[] = [
  {
    slug: "studio-one",
    name: "Studio One",
    location: "13 Brentford Road, Kingston",
    years: "1963-1966",
    producer: "Clement 'Coxsone' Dodd",
    blurb:
      "The Motown of Jamaica. Coxsone discovered the Wailing Wailers here in 1963 and cut the first three years of singles that built their reputation across the island.",
    albums_recorded: ["wailing-wailers"],
  },
  {
    slug: "wirl-studio",
    name: "WIRL / Federal Records",
    location: "220 Marcus Garvey Drive, Kingston",
    years: "1967-1970",
    producer: "Various",
    blurb:
      "The independent sessions after Bob left Studio One. Where the Wailers cut their own JAD-label sides before falling in with Lee Perry.",
  },
  {
    slug: "black-ark",
    name: "Black Ark",
    location: "Cardiff Crescent, Washington Gardens, Kingston",
    years: "1970-1971",
    producer: "Lee 'Scratch' Perry",
    blurb:
      "Lee Perry's backyard temple. Soul Rebels and Soul Revolution were tracked here — the records where Bob first sounds like himself rather than a soul singer in disguise.",
    albums_recorded: ["soul-rebels", "soul-revolution"],
  },
  {
    slug: "harry-j",
    name: "Harry J Studio",
    location: "10 Roosevelt Avenue, Kingston",
    years: "1972-1973",
    producer: "Harry 'J' Johnson",
    blurb:
      "Where Catch a Fire and Burnin' were principally tracked. Harry J's room is the sound of the Wailers becoming an international band.",
    albums_recorded: ["catch-a-fire", "burnin"],
  },
  {
    slug: "island-studios",
    name: "Island Studios (Basing Street)",
    location: "8-10 Basing Street, Notting Hill, London",
    years: "1972-1973",
    producer: "Chris Blackwell",
    blurb:
      "Where Blackwell overdubbed and remixed Catch a Fire to sit beside rock records — adding Wayne Perkins' lead guitar and the textures that opened reggae to white audiences.",
    albums_recorded: ["catch-a-fire"],
  },
  {
    slug: "tuff-gong",
    name: "Tuff Gong Studios",
    location: "220 Marcus Garvey Drive, Kingston",
    years: "1975-present",
    producer: "Bob Marley / The Marley estate",
    blurb:
      "Bob's own studio, founded as the Wailers' headquarters and label home. Where Rastaman Vibration, Survival, Uprising, and most of the post-Bob family records were tracked.",
    albums_recorded: ["rastaman-vibration", "survival", "uprising", "confrontation"],
  },
  {
    slug: "criteria-studios",
    name: "Criteria Studios",
    location: "1755 NE 149th Street, Miami",
    years: "1976-1980",
    producer: "Various",
    blurb:
      "Where parts of Rastaman Vibration and Uprising were mixed. Bob came here often after settling part-time in Miami at his mother's house.",
    albums_recorded: ["rastaman-vibration", "uprising"],
  },
  {
    slug: "compass-point",
    name: "Compass Point Studios",
    location: "Love Beach, Nassau, Bahamas",
    years: "1977-1980",
    producer: "Chris Blackwell",
    blurb:
      "Blackwell's island studio. Pieces of Kaya and Survival were tracked or finished here — the warm room reggae shared with Talking Heads and Grace Jones.",
    albums_recorded: ["kaya", "survival"],
  },
];

export const studioBySlug = (slug: string): Studio | undefined =>
  studios.find((s) => s.slug === slug);
