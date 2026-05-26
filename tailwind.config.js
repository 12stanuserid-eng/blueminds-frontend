/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#2563EB', dark: '#1d4ed8', light: '#3b82f6' },
        surface: {
          50:'#f8fafc', 100:'#f1f5f9', 200:'#e2e8f0', 300:'#cbd5e1',
          400:'#94a3b8', 500:'#64748b', 600:'#475569',
          700:'#334155', 800:'#1e293b', 900:'#0f172a', 950:'#020617'
        },
        accent: { blue:'#2563EB', green:'#10b981', red:'#ef4444', yellow:'#f59e0b', purple:'#8b5cf6' }
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'], mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'] },
      animation: { 'fade-in': 'fadeIn 0.2s ease-out', 'slide-up': 'slideUp 0.3s ease-out', 'pulse-slow': 'pulse 3s infinite' },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { transform: 'translateY(8px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } }
      }
    }
  },
  plugins: []
};
