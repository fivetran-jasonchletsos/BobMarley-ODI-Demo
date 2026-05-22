// Rare / historic photos of Bob Marley and his family.
// Bob+Damian slots come FIRST. External Wikimedia URLs render at runtime.

export type RarePhoto = {
  filename: string;        // local fallback in /public/marley/
  url?: string;            // external URL (Wikimedia, etc.). Takes precedence.
  caption: string;
  context: string;
  year?: number;
  source_hint?: string;
  credit?: string;
  tags?: string[];
};

const WC = (file: string, width = 1100) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;

export const rarePhotos: RarePhoto[] = [
  {
    filename: "bob-damian-baby-1979.jpg",
    caption: "Bob with infant Damian",
    context: "Damian was born July 21, 1978. He was just under three when Bob passed. Photos of the two of them together are exceptionally rare.",
    year: 1979,
    source_hint: "Marley family archive — ask Kamal",
    credit: "© Marley family",
    tags: ["bob-damian", "rare", "family"],
  },
  {
    filename: "damian-at-nine-mile-grave.jpg",
    caption: "Damian at Nine Mile",
    context: "Damian visiting his father's mausoleum at Nine Mile, Saint Ann Parish — a pilgrimage every Marley child has made.",
    source_hint: "Marley family archive",
    credit: "© Marley family",
    tags: ["bob-damian", "family"],
  },
  {
    filename: "bob-cindy-damian-1979.jpg",
    caption: "Bob, Cindy, Damian",
    context: "Bob with Cindy Breakspeare (Miss World 1976) and infant Damian. Cindy and Bob were partners 1974–78.",
    year: 1979,
    source_hint: "Cindy Breakspeare's personal photos",
    credit: "© Breakspeare family",
    tags: ["bob-damian", "rare", "family"],
  },
  {
    filename: "bob-1976-press.jpg",
    url: WC("Bob_Marley_1976_press_photo.jpg"),
    caption: "Bob, 1976 press photo",
    context: "Island Records publicity shot for the Rastaman Vibration tour. The year of the Smile Jamaica concert.",
    year: 1976,
    credit: "Island Records · public domain via Wikimedia",
    tags: ["wikimedia", "press"],
  },
  {
    filename: "bob-1977-press.jpg",
    url: WC("Bob_Marley_1977_press_photo.jpg"),
    caption: "Bob, 1977 press photo",
    context: "Press portrait from the Exodus era — the album Time would later call Album of the Century.",
    year: 1977,
    credit: "Island Records · public domain via Wikimedia",
    tags: ["wikimedia", "press"],
  },
  {
    filename: "bob-performing-1976.jpg",
    url: WC("Bob_Marley_performing_in_1976.jpg"),
    caption: "On stage, 1976",
    context: "Live during the Rastaman Vibration tour — Bob's first US Top 10 record.",
    year: 1976,
    credit: "Public domain via Wikimedia",
    tags: ["wikimedia", "live"],
  },
  {
    filename: "bob-neville-garrick-1976.jpg",
    url: WC("Bob_Marley_by_Neville_Garrick_1976.jpg"),
    caption: "Portrait by Neville Garrick",
    context: "Neville Garrick was Bob's art director — designed every Wailers cover from Rastaman Vibration through Uprising.",
    year: 1976,
    credit: "Neville Garrick · via Wikimedia",
    tags: ["wikimedia", "portrait", "iconic"],
  },
  {
    filename: "bob-i-threes.jpg",
    url: WC("Bob_Marley_I_Threes.jpg"),
    caption: "With the I-Threes",
    context: "Rita Marley, Marcia Griffiths, and Judy Mowatt — the I-Threes, the harmonies that replaced Peter and Bunny from 1974.",
    credit: "Public domain via Wikimedia",
    tags: ["wikimedia", "wailers", "family"],
  },
  {
    filename: "bob-1980.jpg",
    url: WC("Bob_Marley_in_1980.jpg"),
    caption: "Bob in 1980",
    context: "The last full year. April: Zimbabwe Independence. September: collapse in Central Park. The Uprising tour underway.",
    year: 1980,
    credit: "Public domain via Wikimedia",
    tags: ["wikimedia", "late"],
  },
  {
    filename: "bob-grona-lund-1977.jpg",
    url: WC("Bob_Marley_Grona_Lund_1977.jpg"),
    caption: "Gröna Lund · Stockholm",
    context: "Bob on the Exodus tour, Stockholm 1977. Gröna Lund — the same venue Bowie and Springsteen had played.",
    year: 1977,
    credit: "Public domain via Wikimedia",
    tags: ["wikimedia", "live"],
  },
  {
    filename: "bob-mausoleum-nine-mile.jpg",
    url: WC("Bob_Marley's_Mausoleum.JPG"),
    caption: "The Mausoleum at Nine Mile",
    context: "Bob is buried at his birthplace in Saint Ann Parish, Jamaica. The chapel houses his casket. A working pilgrimage site.",
    credit: "CC-BY-SA via Wikimedia",
    tags: ["wikimedia", "shrine"],
  },
  {
    filename: "bob-walk-of-fame.jpg",
    url: WC("Hollywood_Walk_of_Fame_stars_-_Bob_Marley.jpg"),
    caption: "Hollywood Walk of Fame",
    context: "Bob's star, awarded 2001 — twenty years after his passing.",
    year: 2001,
    credit: "Public domain via Wikimedia",
    tags: ["wikimedia", "legacy"],
  },
];
