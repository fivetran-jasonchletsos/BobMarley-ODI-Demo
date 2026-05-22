// Wikimedia Commons portrait URLs for Marley-universe figures.
// Format: https://commons.wikimedia.org/wiki/Special:FilePath/<FILENAME>?width=600
// Any slug not in this map (or any URL that 404s at runtime) falls back to the
// procedural avatar rendered by PortraitCard.

export const portraits: Record<string, string> = {
  "bob-marley":       "https://commons.wikimedia.org/wiki/Special:FilePath/Bob_Marley_1976_press_photo.jpg?width=600",
  "rita-marley":      "https://commons.wikimedia.org/wiki/Special:FilePath/Rita-Marley.jpg?width=600",
  "peter-tosh":       "https://commons.wikimedia.org/wiki/Special:FilePath/BushDoctor1978.jpg?width=600",
  "bunny-wailer":     "https://commons.wikimedia.org/wiki/Special:FilePath/Bunny-Wailer-Smile-Jamaica-2008_(headshot).jpg?width=600",
  "ziggy-marley":     "https://commons.wikimedia.org/wiki/Special:FilePath/Ziggy_Marley_Austin_(cropped).jpg?width=600",
  "stephen-marley":   "https://commons.wikimedia.org/wiki/Special:FilePath/Stephen_Marley_(Vancouver_2007).jpg?width=600",
  "damian-marley":    "https://commons.wikimedia.org/wiki/Special:FilePath/Damian_marley.JPG?width=600",
  "kymani-marley":    "https://commons.wikimedia.org/wiki/Special:FilePath/Ky-mani_Marley.JPG?width=600",
  "julian-marley":    "https://commons.wikimedia.org/wiki/Special:FilePath/JulianMarley4_(cropped).jpg?width=600",
  "skip-marley":      "https://commons.wikimedia.org/wiki/Special:FilePath/Skip_Marley_on_Sidewalks_Entertainment.jpg?width=600",
  "lauryn-hill":      "https://commons.wikimedia.org/wiki/Special:FilePath/LaurynHill2014.jpg?width=600",
  "nas":              "https://commons.wikimedia.org/wiki/Special:FilePath/Nas_July_2014_(cropped).jpg?width=600",
  "marcia-griffiths": "https://commons.wikimedia.org/wiki/Special:FilePath/Ruhr_Reggae_Summer_Muelheim_2016_Marcia_Griffiths_01.jpg?width=600",
  "lee-perry":        "https://commons.wikimedia.org/wiki/Special:FilePath/Lee_Scratch_Perry_2016_(9_von_13).jpg?width=600",
  "chris-blackwell":  "https://commons.wikimedia.org/wiki/Special:FilePath/Chris_Blackwell.jpg?width=600",
  "cindy-breakspeare":"https://commons.wikimedia.org/wiki/Special:FilePath/Miss_World_1976_Top_2.jpg?width=600",
};

export function portraitFor(slug: string): string | undefined {
  return portraits[slug];
}
