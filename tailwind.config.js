/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F6F2',
        ink: '#16211F',
        muted: '#66736F',
        line: '#E4E3DC',
        teal: {
          DEFAULT: '#0F6B5B',
          dark: '#0A4E43',
          light: '#E7F0EC',
        },
        clay: {
          DEFAULT: '#C2603A',
          light: '#F7E9E2',
        },
        sand: '#F3EFE7',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '0.9rem',
      },
      boxShadow: {
        card: '0 1px 0 rgba(22,33,31,0.04), 0 18px 40px -28px rgba(22,33,31,0.35)',
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
    },
  },
  plugins: [],
};
