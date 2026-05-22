// Wikimedia Commons portrait URLs for Marley-universe figures.
// Format: https://commons.wikimedia.org/wiki/Special:FilePath/<FILENAME>?width=600
// Any slug not in this map (or any URL that 404s at runtime) falls back to the
// procedural avatar rendered by PortraitCard.

export const portraits: Record<string, string> = {
  "bob-marley":       "https://commons.wikimedia.org/wiki/Special:FilePath/Bob_Marley_1976_press_photo.jpg?width=600",
  "rita-marley":      "https://commons.wikimedia.org/wiki/Special:FilePath/Rita_Marley_2008.jpg?width=600",
  "peter-tosh":       "https://commons.wikimedia.org/wiki/Special:FilePath/Peter_Tosh_1978.jpg?width=600",
  "bunny-wailer":     "https://commons.wikimedia.org/wiki/Special:FilePath/Bunny_Wailer_2005.jpg?width=600",
  "ziggy-marley":     "https://commons.wikimedia.org/wiki/Special:FilePath/Ziggy_Marley_2010.jpg?width=600",
  "stephen-marley":   "https://commons.wikimedia.org/wiki/Special:FilePath/Stephen_Marley_concert.jpg?width=600",
  "damian-marley":    "https://commons.wikimedia.org/wiki/Special:FilePath/Damian_Marley_2009.jpg?width=600",
  "kymani-marley":    "https://commons.wikimedia.org/wiki/Special:FilePath/Ky-Mani_Marley_2015.jpg?width=600",
  "julian-marley":    "https://commons.wikimedia.org/wiki/Special:FilePath/Julian_Marley_2012.jpg?width=600",
  "skip-marley":      "https://commons.wikimedia.org/wiki/Special:FilePath/Skip_Marley_2017.jpg?width=600",
  "lauryn-hill":      "https://commons.wikimedia.org/wiki/Special:FilePath/Lauryn_Hill_2014.jpg?width=600",
  "nas":              "https://commons.wikimedia.org/wiki/Special:FilePath/Nas_2009.jpg?width=600",
  "marcia-griffiths": "https://commons.wikimedia.org/wiki/Special:FilePath/Marcia_Griffiths_2008.jpg?width=600",
  "lee-perry":        "https://commons.wikimedia.org/wiki/Special:FilePath/Lee_Scratch_Perry_2012.jpg?width=600",
  "chris-blackwell":  "https://commons.wikimedia.org/wiki/Special:FilePath/Chris_Blackwell_2017.jpg?width=600",
  "cindy-breakspeare":"https://commons.wikimedia.org/wiki/Special:FilePath/Cindy_Breakspeare_1976.jpg?width=600",
};

export function portraitFor(slug: string): string | undefined {
  return portraits[slug];
}
