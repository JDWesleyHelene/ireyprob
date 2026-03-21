/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#060606',
        foreground: '#F0EDE8',
        primary: '#F0EDE8',
        accent: '#D4AF37',
        muted: 'rgba(240, 237, 232, 0.4)',
        'border-subtle': 'rgba(240, 237, 232, 0.08)',
        'card-bg': 'rgba(240, 237, 232, 0.03)',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'Fraunces', 'serif'],
        sans: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.2em',
        widest3: '0.25em',
      },
      animation: {
        'reveal-up': 'revealUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'beam-drop': 'beamDrop 9s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to bottom, rgba(6,6,6,0.55) 0%, rgba(6,6,6,0.2) 40%, rgba(6,6,6,0.85) 85%, #060606 100%)',
      },
    },
  },
  plugins: [],
};