/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shop: {
          primary: '#eec2ce', // Soft pink
          secondary: '#dcdcf5', // Soft purple
          accent: '#ffffff', // Clean white
          dark: '#333333',
          light: '#fdfbfe'
        }
      }
    },
  },
  plugins: [],
}
