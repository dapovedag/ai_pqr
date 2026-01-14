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
        // Paleta principal: #00a8c6, #40c0cb, #f9f2e7, #aee239, #8fbe00
        brand: {
          primary: '#00a8c6',
          secondary: '#40c0cb',
          background: '#f9f2e7',
          'accent-light': '#aee239',
          'accent-dark': '#8fbe00',
          blue: '#00a8c6',
          'green-dark': '#8fbe00',
          'green-light': '#aee239',
          dark: '#00626e',
        },
        pqrs: {
          peticion: '#00a8c6',
          queja: '#8fbe00',
          reclamo: '#40c0cb',
          sugerencia: '#aee239',
        },
        status: {
          pending: '#40c0cb',
          progress: '#00a8c6',
          resolved: '#aee239',
          closed: '#8fbe00',
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
