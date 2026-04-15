/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        primary: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
        },
        sidebar: 'var(--sidebar)',
        border: 'var(--border)',
      }
    },
  },
  plugins: [],
}
