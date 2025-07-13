/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './src/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        ringColor: {
            indigo: {
              300: '#a5b4fc',
            },
          },
        animation: {
            'fade-in': 'fadeIn 0.3s ease-in',
          },
          keyframes: {
            fadeIn: {
              '0%': { opacity: '0', transform: 'translateY(10px)' },
              '100%': { opacity: '1', transform: 'translateY(0)' },
            },
          },
      },
    },
    plugins: [],
  }