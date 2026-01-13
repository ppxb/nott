import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  plugins: [typography],
  content: [
    './src/**/*.{ts,tsx}',
  ],
} satisfies Config
