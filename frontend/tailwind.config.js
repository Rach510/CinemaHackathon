/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Design system tokens — see src/theme/ThemeContext.tsx for the
        // light/dark semantic mapping built on top of these raw values.
        neutral: '#EEEBDD', // Light Neutral
        crimson: '#810000', // Crimson Accent
        maroon: '#630000', // Deep Maroon
        charcoal: '#1B1717', // Dark Charcoal
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 8px 30px -12px rgba(27, 23, 23, 0.35)',
        'card-dark': '0 8px 30px -12px rgba(0, 0, 0, 0.6)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-500px 0' },
          '100%': { backgroundPosition: '500px 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.2s infinite linear',
      },
    },
  },
  plugins: [],
};
