// Color Palette Constants
const COLORS = {
  // Dark Theme
  MIDNIGHT_BLUE: "#001427", // MB
  DEEP_NAVY: "#1A1F3A", // DN
  SLATE_BLUE: "#2D3561", // SB
  ELECTRIC_CYAN: "#7BDFF2", // EC
  PURPLE_HAZE: "#6A66A3", // PH
  LAVENDER_MIST: "#C3ACCE", // LM
  WARM_SAND: "#EAD2AC", // WS
  HOT_PINK: "#FF006E", // HP
  NEON_MAGENTA: "#FF1B8D", // NM
  BRIGHT_BLUE: "#3A86FF", // BB
  ELECTRIC_GREEN: "#06FFA5", // EG
  CYBER_YELLOW: "#FFBE0B", // CY

  // Light Theme
  LIGHT_GRAY: "#EBE9E9", // LG
  PURE_WHITE: "#FFFFFF", // PW
  SILVER_GRAY: "#BBBBBF", // SG
  ALMOST_BLACK: "#020100", // AB
  OCEAN_BLUE: "#0E79B2", // OB
  DEEP_PURPLE: "#592E83", // DP

  // Effects
  CYAN_GLOW: "#00F5FF", // CG

  // Professional Portfolio Theme (Darker/Terminal Aesthetic)
  PRINCIPAL: "#505050", // Medium gray accent with good contrast
  DARK_900: "#0a0a0a", // Deeper dark background
  DARK_800: "#121212", // Secondary dark
  DARK_700: "#1a1a1a", // Dark surface
  DARK_500: "#404040", // Medium gray
  GRAY_400: "#707070", // Light gray text
  GRAY_300: "#505050", // Border
  GRAY_200: "#383838", // Dark border
  GRAY_100: "#2a2a2a", // Dark background
  GRAY_50: "#1f1f1f", // Darker background
  GRAY_25: "#181818", // Darkest background
  ORANGE_400: "#ff0844", // Accent red/pink
  STATUS_SUCCESS: "#06ffa5",
  STATUS_WARNING: "#ffbe0b",
  STATUS_ERROR: "#ff006e",
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cyberpunk/Neoretro color palette - Dark Theme
        neon: {
          cyan: COLORS.ELECTRIC_CYAN,
          purple: COLORS.PURPLE_HAZE,
          lavender: COLORS.LAVENDER_MIST,
          beige: COLORS.WARM_SAND,
          pink: COLORS.HOT_PINK,
          magenta: COLORS.NEON_MAGENTA,
          blue: COLORS.BRIGHT_BLUE,
          green: COLORS.ELECTRIC_GREEN,
          yellow: COLORS.CYBER_YELLOW,
        },
        dark: {
          bg: COLORS.MIDNIGHT_BLUE,
          surface: COLORS.DEEP_NAVY,
          border: COLORS.SLATE_BLUE,
        },
        // Light Theme colors
        light: {
          bg: COLORS.LIGHT_GRAY,
          surface: COLORS.PURE_WHITE,
          border: COLORS.SILVER_GRAY,
          text: COLORS.ALMOST_BLACK,
          'text-secondary': COLORS.ALMOST_BLACK,
          primary: COLORS.OCEAN_BLUE,
          secondary: COLORS.DEEP_PURPLE,
          accent: COLORS.OCEAN_BLUE,
        },
        // Professional Portfolio Theme
        principal: COLORS.PRINCIPAL,
        portfolio: {
          dark: {
        // Professional Portfolio fonts
        'space-mono': ['"Space Mono"', 'monospace'],
        'vast-shadow': ['"Vast Shadow"', 'cursive'],
        'lufga': ['"Lufga"', 'sans-serif'],
        'urbanist': ['"Urbanist"', 'sans-serif'],
        'inter': ['"Inter"', 'sans-serif'],
        'montserrat': ['"Montserrat"', 'sans-serif'],
        'roboto': ['"Roboto"', 'sans-serif'],
            900: COLORS.DARK_900,
            800: COLORS.DARK_800,
            700: COLORS.DARK_700,
            500: COLORS.DARK_500,
          },
          gray: {
            400: COLORS.GRAY_400,
            300: COLORS.GRAY_300,
            200: COLORS.GRAY_200,
            100: COLORS.GRAY_100,
            50: COLORS.GRAY_50,
            25: COLORS.GRAY_25,
          },
          orange: COLORS.ORANGE_400,
          white: COLORS.PURE_WHITE,
        },
      },
      fontFamily: {
        mono: ['"Fira Code"', '"Courier New"', 'monospace'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 8s linear infinite',
        'flicker': 'flicker 3s linear infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': {
            boxShadow: `0 0 5px ${COLORS.CYAN_GLOW}, 0 0 10px ${COLORS.CYAN_GLOW}, 0 0 15px ${COLORS.CYAN_GLOW}`,
          },
          '100%': {
            boxShadow: `0 0 10px ${COLORS.CYAN_GLOW}, 0 0 20px ${COLORS.CYAN_GLOW}, 0 0 30px ${COLORS.CYAN_GLOW}`,
          },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '41.99%': { opacity: '1' },
          '42%': { opacity: '0' },
          '43%': { opacity: '0' },
          '43.01%': { opacity: '1' },
          '47.99%': { opacity: '1' },
          '48%': { opacity: '0' },
          '49%': { opacity: '0' },
          '49.01%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        'neon': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
        'neon-sm': '0 0 5px currentColor, 0 0 10px currentColor',
      },
    },
  },
  plugins: [],
}
