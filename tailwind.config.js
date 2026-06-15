/** @type {import('tailwindcss').Config} */
// 整书阅读 · 「书卷靛蓝」设计语言
// 直接照搬教师端 Calm Premium token（靛蓝/暖琥珀/冷墨/阴影/动效），
// 额外加 serif（思源宋体）做标题，营造书卷气。改 token 请同步教师端权威实现。
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF2FF', 100: '#DBE3FF', 200: '#BBCBFF', 300: '#93A9FF', 400: '#6585FB',
          500: '#3B66F5', 600: '#2E51DB', 700: '#2641B0', 800: '#21388C', 900: '#1E316F',
        },
        accent: {
          50: '#FFF4E5', 100: '#FFE7C2', 200: '#FFD79A', 300: '#FFC074', 400: '#FFAE54',
          500: '#FF9D42', 600: '#F2851E', 700: '#CC6A12',
        },
        success: { 50: '#E7F8F1', 100: '#C6EFDF', 500: '#12B886', 600: '#0E9E73', 700: '#0B7E5C' },
        warning: { 50: '#FFF4DE', 100: '#FCE6B6', 500: '#F5A524', 600: '#D98612' },
        danger: { 50: '#FDEBE7', 100: '#FBD2C9', 500: '#F2553D', 600: '#D63E29', 700: '#B22F1E' },
        subject: { math: '#3B66F5', chinese: '#F2553D', english: '#7A5BFF', science: '#12B886', moral: '#FF9D42', music: '#15B8C4' },
        ink: {
          950: '#0C0E14', 900: '#11131A', 800: '#1C2030', 700: '#353B4D', 600: '#4A5163',
          500: '#6B7384', 400: '#949BAC', 300: '#BBC1CF', 200: '#D8DCE6', 150: '#E6E9F0', 100: '#EFF1F6', 50: '#F5F7FB',
        },
        canvas: '#F4F6FB',
        surface: { DEFAULT: '#FFFFFF', soft: '#FAFBFE', sunken: '#EEF1F7' },
        paper: '#FBFAF6', // 阅读正文专用暖白纸感底
        hair: 'rgba(20,28,56,0.08)',
      },
      fontFamily: {
        sans: ['Inter', '"PingFang SC"', '"Microsoft YaHei"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Noto Serif SC"', '"Songti SC"', '"SimSun"', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      fontSize: {
        micro: ['12px', { lineHeight: '16px' }],
        caption: ['13px', { lineHeight: '18px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['15px', { lineHeight: '22px' }],
        title: ['16px', { lineHeight: '22px', letterSpacing: '-0.003em' }],
        h3: ['18px', { lineHeight: '24px', letterSpacing: '-0.006em' }],
        h2: ['22px', { lineHeight: '28px', letterSpacing: '-0.01em' }],
        h1: ['26px', { lineHeight: '32px', letterSpacing: '-0.014em' }],
        display: ['34px', { lineHeight: '40px', letterSpacing: '-0.02em' }],
        'display-lg': ['44px', { lineHeight: '48px', letterSpacing: '-0.022em' }],
        'display-xl': ['56px', { lineHeight: '60px', letterSpacing: '-0.024em' }],
      },
      borderRadius: {
        none: '0', sm: '8px', DEFAULT: '12px', md: '12px', lg: '16px', xl: '20px', '2xl': '28px', '3xl': '36px', full: '9999px',
      },
      boxShadow: {
        e1: '0 1px 2px rgba(20,28,56,0.04), 0 4px 12px rgba(20,28,56,0.05)',
        e2: '0 2px 4px rgba(20,28,56,0.05), 0 10px 24px rgba(20,28,56,0.08)',
        e3: '0 4px 10px rgba(20,28,56,0.06), 0 18px 40px rgba(20,28,56,0.12)',
        e4: '0 8px 18px rgba(20,28,56,0.10), 0 36px 70px rgba(20,28,56,0.20)',
        glow: '0 4px 14px rgba(59,102,245,0.32), 0 1px 3px rgba(59,102,245,0.24)',
        'glow-accent': '0 4px 14px rgba(255,157,66,0.34), 0 1px 3px rgba(255,157,66,0.22)',
        'inner-hi': 'inset 0 1px 0 rgba(255,255,255,0.6)',
        card: '0 1px 2px rgba(20,28,56,0.04), 0 4px 12px rgba(20,28,56,0.05)',
        soft: '0 2px 4px rgba(20,28,56,0.05), 0 10px 24px rgba(20,28,56,0.08)',
      },
      backgroundImage: {
        'brand-grad': 'linear-gradient(135deg, #4C7DFF 0%, #3B66F5 48%, #5B5BF0 100%)',
        'brand-grad-soft': 'linear-gradient(135deg, #EEF2FF 0%, #E6ECFF 100%)',
        'accent-grad': 'linear-gradient(135deg, #FFB45A 0%, #FF9D42 100%)',
        'hero-sheen': 'radial-gradient(120% 140% at 100% 0%, rgba(255,255,255,0.35) 0%, transparent 45%)',
        'page-glow': 'radial-gradient(80% 60% at 50% -10%, rgba(59,102,245,0.06) 0%, transparent 60%)',
      },
      letterSpacing: { tightish: '-0.01em', widecaps: '0.12em' },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
        spring: 'cubic-bezier(0.34, 1.4, 0.5, 1)',
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      transitionDuration: { 80: '80ms', 140: '140ms', 220: '220ms', 320: '320ms', 460: '460ms' },
      keyframes: {
        'fade-up': { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'scale-in': { from: { opacity: '0', transform: 'scale(0.96)' }, to: { opacity: '1', transform: 'scale(1)' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
      },
      animation: {
        'fade-up': 'fade-up 0.46s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.32s ease both',
        'scale-in': 'scale-in 0.22s cubic-bezier(0.34,1.4,0.5,1) both',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
