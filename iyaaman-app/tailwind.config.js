/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    screens: {
      xs: "400px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        // Jamaica + reggae palette — black / green / gold / red — tuned editorial
        // rather than costume-shop. Deeper, dustier versions of the flag triad.
        sand:     "#f4ecd6",   // warm cream paper (yellow undertone, leans gold)
        sand_2:   "#ece2bd",   // card surface (gold-tinged sand)
        sand_3:   "#d8c485",   // border / warm gold mid
        bark:     "#0d1a10",   // primary ink — deep Jamaica black (with green hint)
        bark_2:   "#1f2e22",   // secondary ink
        cocoa:    "#3d5430",   // muted body text — pulled toward forest green
        ember:    "#c0382b",   // Jamaica/Rastafarian red — deeper, less clay
        leaf:     "#0f7438",   // Jamaica flag green — deep, saturated, not neon
        leaf_2:   "#1f9446",   // brighter green for accents
        gold:     "#e6b800",   // Jamaica gold — closer to flag yellow
        gold_2:   "#f5d33a",   // brighter gold for highlights
        ash:      "#7a8475",   // tertiary text (greenish-gray)
        // Tricolor convenience names
        jam_green: "#0f7438",
        jam_gold:  "#e6b800",
        jam_red:   "#c0382b",
        jam_black: "#0d1a10",
      },
      fontFamily: {
        // Body: Fraunces — variable serif with personality, our distinctive default.
        serif:  ["'Fraunces', 'Hoefler Text', Georgia, serif"],
        // Display: Anton — heavy condensed sans, masthead duty.
        display: ["'Anton', 'Bebas Neue', 'Oswald', sans-serif"],
        // "sans" alias now ALSO points at Fraunces — kill Inter site-wide.
        sans:   ["'Fraunces', 'Hoefler Text', Georgia, serif"],
        // Mono: DM Mono — distinctive geometric mono, replaces JetBrains.
        mono:   ["'DM Mono', 'IBM Plex Mono', ui-monospace, monospace"],
      },
      letterSpacing: {
        widest: "0.32em",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) both",
        fadeIn: "fadeIn 0.9s ease-out both",
      },
    },
  },
  plugins: [],
};
