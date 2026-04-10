/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A96E',
          light:   '#E2C98A',
          dark:    '#9A7840',
          pale:    '#F5ECD7',
        },
        charcoal: {
          DEFAULT: '#1A1A1A',
          800:     '#252525',
          600:     '#3A3A3A',
        },
        cream: {
          DEFAULT: '#FDF9F4',
          dark:    '#F4EDE0',
        },
      },
      fontFamily: {
        logo:    ['"Outfit"', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
        body:    ['"Inter"', 'sans-serif'],
        price:   ['"Playfair Display"', 'serif'],
        serif:   ['"Playfair Display"', 'serif'],
      },
      animation: {
        'fade-up':   'fadeUp 0.6s ease forwards',
        'marquee':   'marquee 30s linear infinite',
        'shimmer':   'shimmer 2s ease-in-out infinite',
        'slide-in':  'slideIn 0.4s cubic-bezier(0.25,0.46,0.45,0.94) forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.5' },
        },
        slideIn: {
          '0%':   { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'gold':    '0 8px 32px rgba(201,169,110,0.25)',
        'gold-lg': '0 20px 60px rgba(201,169,110,0.30)',
        'card':    '0 4px 30px rgba(0,0,0,0.08)',
        'card-lg': '0 16px 60px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
