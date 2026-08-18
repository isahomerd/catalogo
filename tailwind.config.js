/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark_walnut: {
          DEFAULT: '#582f0e',
          100: '#120903', 200: '#231306', 300: '#351c08', 400: '#47260b',
          500: '#582f0e', 600: '#9f5519', 700: '#de7c2b', 800: '#e9a772', 900: '#f4d3b8',
        },
        saddle_brown: {
          DEFAULT: '#7f4f24',
          100: '#191107', 200: '#331f0e', 300: '#4c2f16', 400: '#663f1d',
          500: '#7f4f24', 600: '#b57033', 700: '#d1935d', 800: '#e0b793', 900: '#f0dbc9',
        },
        toffee_brown: {
          DEFAULT: '#936639',
          100: '#1d140b', 200: '#3b2917', 300: '#583d22', 400: '#76522e',
          500: '#936639', 600: '#ba854f', 700: '#cca37b', 800: '#ddc2a7', 900: '#eee0d3',
        },
        camel: {
          DEFAULT: '#a68a64',
          100: '#221c13', 200: '#433727', 300: '#65533a', 400: '#876f4d',
          500: '#a68a64', 600: '#b8a183', 700: '#c9b9a2', 800: '#dbd0c1', 900: '#ede8e0',
        },
        khaki_beige: {
          DEFAULT: '#b6ad90',
          100: '#27241a', 200: '#4f4934', 300: '#766d4d', 400: '#9d9068',
          500: '#b6ad90', 600: '#c5bea6', 700: '#d3cebc', 800: '#e2ded3', 900: '#f0efe9',
        },
        dry_sage: {
          DEFAULT: '#a4ac86',
          100: '#222419', 200: '#444932', 300: '#666d4a', 400: '#889263',
          500: '#a4ac86', 600: '#b6bd9e', 700: '#c8cdb6', 800: '#dbdece', 900: '#edeee7',
        },
        dusty_olive: {
          DEFAULT: '#656d4a',
          100: '#14160f', 200: '#282c1e', 300: '#3d422d', 400: '#51573b',
          500: '#656d4a', 600: '#899465', 700: '#a7b08a', 800: '#c4cab1', 900: '#e2e5d8',
        },
        ebony: {
          DEFAULT: '#414833',
          100: '#0d0e0a', 200: '#1a1d14', 300: '#272b1e', 400: '#343929',
          500: '#414833', 600: '#6a7553', 700: '#919e77', 800: '#b6bfa4', 900: '#dadfd2',
        },
        charcoal_brown: {
          DEFAULT: '#333d29',
          100: '#0a0c08', 200: '#141810', 300: '#1f2518', 400: '#293121',
          500: '#333d29', 600: '#5c6e49', 700: '#859d6c', 800: '#adbe9d', 900: '#d6dece',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.35s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideInRight: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};
