/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#12355B', // Berkeley Blue primary base
          700: '#758BFD', // Cornflower Blue interactive
          500: '#F95738', // Tomato CTA/accent
          300: '#F4D35E', // Naples Yellow highlight
          100: '#03CEA4', // Mint positive
        }
      },
      spacing: {
        0.5: '4px',
        '1': '8px',
      },
      boxShadow: {
        'card-sm': '0 6px 18px rgba(18,53,91,0.08)',
        'card-md': '0 10px 30px rgba(18,53,91,0.10)',
      },
      keyframes: {
        'pulse-cta': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.03)', opacity: '0.95' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'slide-x': {
          '0%': { transform: 'translateX(12px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        }
      },
      animation: {
        'pulse-cta': 'pulse-cta 1.6s cubic-bezier(.2,.9,.2,1) infinite',
        'slide-x-fast': 'slide-x 320ms ease-out both'
      },
      transitionTimingFunction: {
        'easing-standard': 'cubic-bezier(.2,.9,.2,1)',
        'easing-decelerate': 'cubic-bezier(.0,.0,.2,1)',
      },
      transitionDuration: {
        'dur-quick': '150ms',
        'dur-standard': '200ms',
      },
      fontSize: {
        'fluid-sm': ['clamp(14px, 1.2vw, 16px)', { lineHeight: '1.5' }],
        'fluid-md': ['clamp(16px, 1.8vw, 18px)', { lineHeight: '1.5' }],
        'fluid-lg': ['clamp(20px, 2.6vw, 24px)', { lineHeight: '1.4' }],
      },
    },
  },
  plugins: [],
};
