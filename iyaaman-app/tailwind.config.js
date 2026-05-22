/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
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
        serif:  ["'Fraunces', Georgia, serif"],
        display: ["'Anton', 'Bebas Neue', sans-serif"],
        sans:   ["'Inter', system-ui, sans-serif"],
        mono:   ["'JetBrains Mono', ui-monospace, monospace"],
      },
      letterSpacing: {
        widest: "0.32em",
      },
    },
  },
  plugins: [],
};
