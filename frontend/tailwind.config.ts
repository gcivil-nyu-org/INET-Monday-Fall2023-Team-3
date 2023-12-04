/** @type {import('tailwindcss').Config} */
export default {
  important: true,
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      rotate: {
        '20': '20deg',
        '15': '15deg',
      }
    },
    colors: {
      'orange': '#F3AC42',
      'yellow': '#FCF071',
      'blue': '#90D5D9',
      'pink': '#F2ADBE',
      'green': '#9EDF76',
      'beige': '#F9F4EB',
      'olive': '#2B5413',
    },
    fontFamily: {
      sans: ['Archivo Black', 'sans-serif'],
      serif: ['Benne', 'serif'],
    }
  },
  plugins: [],
}


