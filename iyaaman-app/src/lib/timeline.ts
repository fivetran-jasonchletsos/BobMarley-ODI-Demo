// Life timeline — Feb 6 1945 to May 11 1981.
// Facts only. Each body kept short.

export type TimelineKind =
  | "birth"
  | "family"
  | "music"
  | "event"
  | "spiritual"
  | "award"
  | "travel"
  | "end";

export type TimelineEvent = {
  date: string;       // e.g. "1945-02-06" or "1963"
  year: number;
  headline: string;
  body: string;
  kind: TimelineKind;
};

export const timeline: TimelineEvent[] = [
  {
    date: "1945-02-06",
    year: 1945,
    headline: "Born in Nine Mile",
    body: "Robert Nesta Marley is born to Cedella Malcolm, eighteen, and Norval Marley, fifty, in a hut in the hills of Saint Ann.",
    kind: "birth",
  },
  {
    date: "1955",
    year: 1955,
    headline: "Norval Marley dies",
    body: "Bob's father dies of a heart attack. Bob is ten. He had met him fewer than a dozen times.",
    kind: "family",
  },
  {
    date: "1957",
    year: 1957,
    headline: "Move to Trench Town",
    body: "Cedella moves with Bob to government yard housing in West Kingston. He will meet Bunny Wailer and Peter Tosh within a few years.",
    kind: "travel",
  },
  {
    date: "1962",
    year: 1962,
    headline: "First single — 'Judge Not'",
    body: "Bob cuts his first record for Leslie Kong on the Beverley's label. It sells poorly. He returns to welding to make a living.",
    kind: "music",
  },
  {
    date: "1963",
    year: 1963,
    headline: "The Wailing Wailers form",
    body: "Bob, Bunny, Peter, plus Junior Braithwaite, Beverley Kelso and Cherry Smith sign with Coxsone Dodd at Studio One.",
    kind: "music",
  },
  {
    date: "1964",
    year: 1964,
    headline: "'Simmer Down' tops Jamaican charts",
    body: "Their first hit. Number one across Jamaica for two months. The Wailers are local stars.",
    kind: "music",
  },
  {
    date: "1966-02-10",
    year: 1966,
    headline: "Marries Rita Anderson",
    body: "Bob marries Rita the day before sailing to Delaware to work with his mother. She is twenty, he is twenty-one.",
    kind: "family",
  },
  {
    date: "1966-04-21",
    year: 1966,
    headline: "Haile Selassie visits Jamaica",
    body: "Rita witnesses Selassie's arrival at Palisadoes Airport and reports seeing stigmata on his palm. The Marley household turns toward Rastafari.",
    kind: "spiritual",
  },
  {
    date: "1966",
    year: 1966,
    headline: "Bob in Delaware",
    body: "Works at the Chrysler plant in Newark and as a hotel night porter. Returns to Jamaica eight months later with money to fund his own label.",
    kind: "travel",
  },
  {
    date: "1967",
    year: 1967,
    headline: "Wail'N Soul'M founded",
    body: "Bob and Rita launch their own label out of their Trench Town home. The first declaration of independence from Jamaican producers.",
    kind: "music",
  },
  {
    date: "1970",
    year: 1970,
    headline: "Sessions with Lee Perry begin",
    body: "The Wailers fall in with Lee 'Scratch' Perry at Black Ark. Soul Rebels and Soul Revolution follow within eighteen months.",
    kind: "music",
  },
  {
    date: "1972",
    year: 1972,
    headline: "Signs with Island Records",
    body: "Chris Blackwell advances four thousand pounds to make a full album. The Wailers fly to London and Kingston to track Catch a Fire.",
    kind: "music",
  },
  {
    date: "1973-04",
    year: 1973,
    headline: "Catch a Fire released",
    body: "First Wailers album on Island. The record that begins reggae's crossover into rock audiences.",
    kind: "music",
  },
  {
    date: "1973-10",
    year: 1973,
    headline: "Burnin' released",
    body: "Includes 'Get Up, Stand Up' and 'I Shot the Sheriff'. Eric Clapton's cover of the latter will hit number one the following year.",
    kind: "music",
  },
  {
    date: "1974",
    year: 1974,
    headline: "Peter and Bunny depart",
    body: "Tosh and Wailer leave the band over money, touring conditions, and direction. Bob keeps the name; the I-Threes join on backing vocals.",
    kind: "music",
  },
  {
    date: "1975-10",
    year: 1975,
    headline: "Natty Dread released",
    body: "First album credited to Bob Marley and the Wailers. Includes 'No Woman, No Cry' and 'Lively Up Yourself'.",
    kind: "music",
  },
  {
    date: "1975-07",
    year: 1975,
    headline: "Lyceum, London — Live!",
    body: "The two-night July run at the Lyceum yields the Live! album. 'No Woman, No Cry' becomes the version the world knows.",
    kind: "event",
  },
  {
    date: "1976-12-03",
    year: 1976,
    headline: "Assassination attempt",
    body: "Gunmen storm 56 Hope Road two nights before the Smile Jamaica concert. Bob, Rita, and manager Don Taylor are shot. All survive. Bob plays the concert two days later.",
    kind: "event",
  },
  {
    date: "1977-06",
    year: 1977,
    headline: "Exodus released",
    body: "Tracked at Island Studios in London after the attempt. Time magazine later names it Album of the Century.",
    kind: "music",
  },
  {
    date: "1977-07",
    year: 1977,
    headline: "Toe injury, melanoma diagnosed",
    body: "Bob injures his toe playing football in Paris. A biopsy reveals acral lentiginous melanoma. He refuses amputation on religious grounds.",
    kind: "event",
  },
  {
    date: "1978-04-22",
    year: 1978,
    headline: "One Love Peace Concert",
    body: "Bob joins the hands of Prime Minister Michael Manley and opposition leader Edward Seaga on stage at National Stadium, Kingston.",
    kind: "event",
  },
  {
    date: "1978-06",
    year: 1978,
    headline: "Receives UN Peace Medal of the Third World",
    body: "Awarded at the United Nations in New York for his contribution to African liberation.",
    kind: "award",
  },
  {
    date: "1979-10",
    year: 1979,
    headline: "Survival released",
    body: "The most overtly Pan-African of his records. Cover artwork: forty-eight African flags.",
    kind: "music",
  },
  {
    date: "1980-04-18",
    year: 1980,
    headline: "Zimbabwe Independence concert",
    body: "Bob headlines Rufaro Stadium at Robert Mugabe's personal invitation. Pays for the band's flights and equipment himself.",
    kind: "event",
  },
  {
    date: "1980-06",
    year: 1980,
    headline: "Uprising released",
    body: "Includes 'Redemption Song' and 'Could You Be Loved'. The last studio record released in his lifetime.",
    kind: "music",
  },
  {
    date: "1980-09-21",
    year: 1980,
    headline: "Collapse in Central Park",
    body: "Bob collapses jogging in New York. Tests reveal the melanoma has spread to his brain, lungs, and liver.",
    kind: "event",
  },
  {
    date: "1980-09-23",
    year: 1980,
    headline: "Last concert — Pittsburgh",
    body: "Bob plays the Stanley Theater in Pittsburgh against doctors' advice. It will be his last show.",
    kind: "event",
  },
  {
    date: "1980-11",
    year: 1980,
    headline: "Bavaria — Issels clinic",
    body: "Bob travels to Bad Wiessee, Germany for unconventional cancer treatment with Dr. Josef Issels. Stays nearly six months.",
    kind: "travel",
  },
  {
    date: "1981-04",
    year: 1981,
    headline: "Baptized into the Ethiopian Orthodox Church",
    body: "Receives baptism as Berhane Selassie ('Light of the Trinity') in Kingston, by Archbishop Yesehaq.",
    kind: "spiritual",
  },
  {
    date: "1981-05-11",
    year: 1981,
    headline: "Passes in Miami",
    body: "Bob dies at Cedars of Lebanon Hospital in Miami. He is thirty-six. His last words to son Ziggy: 'Money can't buy life.'",
    kind: "end",
  },
];

export const timelineByDecade = (decade: number): TimelineEvent[] =>
  timeline.filter((e) => e.year >= decade && e.year < decade + 10);
