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
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        slate: {
          850: '#1e293b', // Custom darker slate if needed
          900: '#0f172a',
          950: '#020617',
        },
        primary: {
          DEFAULT: '#06b6d4', // Cyan-500
          hover: '#0891b2', // Cyan-600
          glow: 'rgba(6, 182, 212, 0.5)',
        },
        secondary: {
          DEFAULT: '#8b5cf6', // Violet-500
          hover: '#7c3aed', // Violet-600
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
