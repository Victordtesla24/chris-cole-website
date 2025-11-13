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
        black: '#000000',
        white: '#FFFFFF',
        gray: {
          100: '#CCCCCC',
          200: '#AAAAAA',
          250: '#999999',
          300: '#888888',
          400: '#666666',
          500: '#333333',
        },
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        mono: ['Courier New', 'Courier', 'monospace'],
      },
      fontSize: {
        'hero': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'section': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      spacing: {
        'section': '120px',
        'section-mobile': '80px',
      },
      animation: {
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'drift': 'drift 120s linear infinite',
        'rotate-saturn': 'rotateSaturn 10s linear infinite',
        'orbit-moon': 'orbitMoon 12s linear infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        drift: {
          '0%': { transform: 'translate(-100%, -100%)' },
          '100%': { transform: 'translate(200vw, 200vh)' },
        },
        rotateSaturn: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        orbitMoon: {
          from: { transform: 'translate(-50%, -50%) translateY(-70px) rotate(0deg)' },
          to: { transform: 'translate(-50%, -50%) translateY(-70px) rotate(360deg)' },
        },
      },
      cursor: {
        none: 'none',
      },
    },
  },
  plugins: [],
}

