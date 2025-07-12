/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './src/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        animation: {
            fadeIn: 'fadeIn 0.2s ease-out forwards',
          },
          keyframes: {
            fadeIn: {
              from: { opacity: 0, transform: 'scale(0.95)' },
              to: { opacity: 1, transform: 'scale(1)' },
            },
          },
      },
    },
    plugins: [],
  }