/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        slate: {
          850: '#1e293b', // Custom darker slate if needed
          900: '#0f172a',
          950: '#020617',
        },
        primary: {
          DEFAULT: '#0f766e', // Teal-700
          hover: '#115e59', // Teal-800
          glow: 'rgba(15, 118, 110, 0.45)',
        },
        secondary: {
          DEFAULT: '#f97316', // Orange-500
          hover: '#ea580c', // Orange-600
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
