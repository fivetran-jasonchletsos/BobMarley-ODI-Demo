// Geographic places that mattered in Bob Marley's life.
// Curated, accurate, well-known facts only.

export type PlaceKind =
  | "birthplace"
  | "home"
  | "neighborhood"
  | "venue"
  | "hospital"
  | "shrine"
  | "studio";

export type Place = {
  slug: string;
  name: string;
  location: string;
  kind: PlaceKind;
  blurb: string;
  lat?: number;
  lng?: number;
};

export const places: Place[] = [
  {
    slug: "nine-mile",
    name: "Nine Mile",
    location: "Saint Ann Parish, Jamaica",
    kind: "birthplace",
    blurb:
      "The village where Bob was born on February 6, 1945. His childhood hut still stands. His mausoleum and a small chapel hold his remains in the hills above.",
    lat: 18.3603,
    lng: -77.1289,
  },
  {
    slug: "trench-town",
    name: "Trench Town",
    location: "West Kingston, Jamaica",
    kind: "neighborhood",
    blurb:
      "Government yard housing where Bob's mother moved with him in 1957. He met Bunny and Peter here. The cradle of rocksteady and reggae.",
    lat: 17.9714,
    lng: -76.7892,
  },
  {
    slug: "56-hope-road",
    name: "56 Hope Road",
    location: "Saint Andrew, Kingston",
    kind: "home",
    blurb:
      "Bob's home from 1975 onward, gifted by Chris Blackwell. Site of the December 3, 1976 attempt on his life. Now the Bob Marley Museum, run by his children.",
    lat: 18.0103,
    lng: -76.7831,
  },
  {
    slug: "strawberry-hill",
    name: "Strawberry Hill",
    location: "Irish Town, Blue Mountains, Jamaica",
    kind: "home",
    blurb:
      "Chris Blackwell's hilltop retreat. Bob recovered here after the 1976 attempt before flying to London for the Exodus sessions.",
    lat: 18.0758,
    lng: -76.7236,
  },
  {
    slug: "tuff-gong-place",
    name: "Tuff Gong (220 Marcus Garvey Drive)",
    location: "Kingston, Jamaica",
    kind: "studio",
    blurb:
      "Bob's studio and label headquarters from 1975. Still operated by the Marley family, still pressing vinyl, still tracking records.",
    lat: 17.9762,
    lng: -76.8167,
  },
  {
    slug: "cedars-of-lebanon",
    name: "Cedars of Lebanon Hospital",
    location: "Miami, Florida",
    kind: "hospital",
    blurb:
      "The Miami hospital where Bob died on May 11, 1981, of metastatic melanoma. He had flown in from Bavaria after months of treatment with Dr. Josef Issels.",
    lat: 25.7892,
    lng: -80.2347,
  },
  {
    slug: "stanley-theater",
    name: "Stanley Theater",
    location: "Pittsburgh, Pennsylvania",
    kind: "venue",
    blurb:
      "Site of Bob's final concert on September 23, 1980. He collapsed jogging in Central Park two days earlier; the Pittsburgh show would be the last he ever played.",
    lat: 40.4419,
    lng: -79.9967,
  },
  {
    slug: "madison-square-garden",
    name: "Madison Square Garden",
    location: "New York, New York",
    kind: "venue",
    blurb:
      "Bob's two-night stand on September 19-20, 1980, opening for the Commodores. His last shows in New York before the collapse in Central Park.",
    lat: 40.7505,
    lng: -73.9934,
  },
  {
    slug: "rufaro-stadium",
    name: "Rufaro Stadium",
    location: "Harare, Zimbabwe",
    kind: "venue",
    blurb:
      "Where Bob headlined Zimbabwe's independence celebration on April 18, 1980 — at his own expense, by personal invitation of Prime Minister Mugabe. The triumph of the Survival tour.",
    lat: -17.8556,
    lng: 31.0228,
  },
  {
    slug: "mausoleum",
    name: "Bob Marley Mausoleum",
    location: "Nine Mile, Saint Ann, Jamaica",
    kind: "shrine",
    blurb:
      "The marble crypt holding Bob's remains beside his mother's, in a small chapel at his birthplace. A site of pilgrimage every February 6.",
    lat: 18.3603,
    lng: -77.1289,
  },
];

export const placeBySlug = (slug: string): Place | undefined =>
  places.find((p) => p.slug === slug);
