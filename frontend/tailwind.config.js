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
        brand: {
          blue: '#31bdeb',
          'green-dark': '#1ab273',
          'green-light': '#8dc853',
          dark: '#0d0e20',
        },
        pqrs: {
          peticion: '#31bdeb',
          queja: '#e57373',
          reclamo: '#f0c88d',
          sugerencia: '#8dc853',
        },
        status: {
          pending: '#f0c88d',
          progress: '#31bdeb',
          resolved: '#1ab273',
          closed: '#6b6880',
        },
      },
      fontFamily: {
        sans: ['Geist', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
