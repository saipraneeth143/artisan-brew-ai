/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        espresso: {
          50: '#fbf8f5',
          100: '#f5efe8',
          200: '#eadccf',
          300: '#dbc2ad',
          400: '#c69f82',
          500: '#b58260',
          600: '#a46b4c',
          700: '#89553e',
          800: '#714736',
          900: '#2b1b14',
          950: '#180e0a',
        },
        crema: {
          DEFAULT: '#f8f4ee',
          warm: '#f1e8dc',
          gold: '#d49b54',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
