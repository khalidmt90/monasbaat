/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        0.5: '4px',
        '1': '8px',
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
