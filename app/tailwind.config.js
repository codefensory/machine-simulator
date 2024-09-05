/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    amx: ['AMX', 'sans-serif'],
    extend: {
      keyframes: {
        osile: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
      },
      animation: {
        osile: 'osile 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
