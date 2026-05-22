export type RarePhoto = {
  filename: string;        // drop file into public/marley/ with this exact name
  caption: string;         // short editorial caption (<60 chars)
  context: string;         // 1-2 sentences of historical context (<250 chars)
  year?: number;
  source_hint?: string;    // where to look for the image
  tags?: string[];
};

// Curated rare/historic photographs.
// The first three entries are deliberately Bob + Damian moments —
// Damian was only three years old when Bob passed, so these are
// the rarest and most personal images in the entire archive.
export const rarePhotos: RarePhoto[] = [
  // ---- Bob + Damian: the rarest and most precious ----
  {
    filename: "bob-damian-baby-1979.jpg",
    caption: "Bob with infant Damian",
    context:
      "Damian was born July 21, 1978. Only a handful of intimate father-son photos survive — he was just under three when Bob passed in May 1981.",
    year: 1979,
    source_hint: "Marley family album / Cindy Breakspeare collection",
    tags: ["bob-damian", "rare", "family"],
  },
  {
    filename: "damian-at-nine-mile-grave.jpg",
    caption: "Damian at Nine Mile, visiting his father",
    context:
      "Damian visiting the mausoleum at Nine Mile, St. Ann, where Bob is laid to rest. He has spoken often about returning to feel his father's presence.",
    source_hint: "Marley family / Tuff Gong archive",
    tags: ["bob-damian", "nine-mile", "family"],
  },
  {
    filename: "bob-cindy-damian-1979.jpg",
    caption: "Bob, Cindy Breakspeare and baby Damian",
    context:
      "A rare frame of Bob with Cindy Breakspeare, Miss World 1976, and their son Damian. Cindy and Bob's relationship was openly discussed in the Jamaican press.",
    year: 1979,
    source_hint: "Cindy Breakspeare personal archive",
    tags: ["bob-damian", "cindy", "rare", "family"],
  },

  // ---- Bob with the other Marley children ----
  {
    filename: "bob-ziggy-shoulders-1976.jpg",
    caption: "Bob with Ziggy on his shoulders",
    context:
      "An iconic father-son frame from the mid-70s at 56 Hope Road. Ziggy, born David Nesta in 1968, would go on to inherit the band leader role.",
    year: 1976,
    source_hint: "Adrian Boot / Esther Anderson archive",
    tags: ["bob-ziggy", "family", "hope-road"],
  },
  {
    filename: "bob-stephen-ziggy-1979.jpg",
    caption: "Bob with Stephen and Ziggy",
    context:
      "Bob backstage with his two oldest sons by Rita. Stephen, then about seven, and Ziggy, ten — both already learning the songs that would become their inheritance.",
    year: 1979,
    source_hint: "Neville Garrick / Tuff Gong photo files",
    tags: ["family", "stephen", "ziggy"],
  },
  {
    filename: "bob-rita-children-1979.jpg",
    caption: "Bob, Rita and the Marley children",
    context:
      "A full family portrait from the Survival-era period, 1979. Rita, Cedella, Ziggy, Stephen and the younger ones, gathered at Hope Road.",
    year: 1979,
    source_hint: "Rita Marley Foundation archive",
    tags: ["family", "rita", "portrait"],
  },

  // ---- Iconic Bob moments ----
  {
    filename: "one-love-peace-concert-1978.jpg",
    caption: "One Love Peace Concert — joining Manley and Seaga",
    context:
      "April 22, 1978. Bob pulled rival prime ministers Michael Manley and Edward Seaga onstage at the National Stadium, joining their hands above his head.",
    year: 1978,
    source_hint: "Adrian Boot / Kate Simon — One Love Peace Concert",
    tags: ["live", "iconic", "jamaica", "peace"],
  },
  {
    filename: "bob-soccer-hope-road.jpg",
    caption: "Bob playing football at 56 Hope Road",
    context:
      "Bob was a fierce footballer — he kept the yard at Hope Road active with daily matches. The toe injury that ignored him in 1977 came from this game.",
    year: 1976,
    source_hint: "Neville Garrick photo files",
    tags: ["hope-road", "football", "daily-life"],
  },
  {
    filename: "bob-lee-perry-black-ark.jpg",
    caption: "Bob with Lee 'Scratch' Perry at Black Ark",
    context:
      "Recording in Lee Perry's mythical Black Ark studio in Washington Gardens. The sessions in 1970-71 produced Soul Rebels and Soul Revolution.",
    year: 1971,
    source_hint: "Lee Perry archive / David Burnett",
    tags: ["studio", "wailers", "black-ark", "lee-perry"],
  },
  {
    filename: "bob-lyceum-london-1975.jpg",
    caption: "Backstage at the Lyceum, London",
    context:
      "July 1975. The Lyceum shows produced the Live! album and the definitive No Woman, No Cry. The moment Bob broke through to the global rock audience.",
    year: 1975,
    source_hint: "Adrian Boot — Lyceum sessions",
    tags: ["live", "london", "lyceum", "wailers"],
  },
  {
    filename: "bob-zimbabwe-1980.jpg",
    caption: "Zimbabwe Independence concert",
    context:
      "April 18, 1980. Bob performed at Rufaro Stadium for Zimbabwe's independence. He paid his own way and shipped the PA from England. His last major show abroad.",
    year: 1980,
    source_hint: "Neville Garrick / Zimbabwe Independence archive",
    tags: ["live", "zimbabwe", "iconic", "africa"],
  },
  {
    filename: "wailers-1973-original.jpg",
    caption: "The original Wailers, 1973",
    context:
      "Bob, Peter Tosh, Bunny Wailer, with Aston and Carlton Barrett behind. The Catch a Fire / Burnin' lineup — the last year all three founding Wailers were on the same record.",
    year: 1973,
    source_hint: "Esther Anderson / Island Records archive",
    tags: ["wailers", "peter", "bunny", "barrett", "rare"],
  },
];
