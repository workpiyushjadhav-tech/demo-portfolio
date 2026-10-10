/* Tailwind is compiled once (no runtime CDN). Colours map to the CSS tokens
   in css/case-study.css, so the accessibility modes keep working. */
const c = n => `rgb(var(--c-${n}) / <alpha-value>)`;
module.exports = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./site/case-studies/*.html'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        background: c('paper'), foreground: c('ink'), card: c('card'),
        primary: c('ink'), secondary: c('soft'), 'muted-foreground': c('soft'),
        muted: c('dim'), border: c('line'), accent: c('accent'),
        green: { 600: '#0F6B3F' }, amber: { 600: '#8A5200' },
        red: { 100: '#FBE3DF', 600: '#B3261E', 700: '#8F1B14' },
        blue: { 100: '#E3ECFA', 700: '#1F4E99' },
      },
      borderColor: { DEFAULT: c('line') },
      fontFamily: { sans: ['var(--font-body)'] },
    },
  },
};
