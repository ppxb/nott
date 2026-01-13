import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  pnpm: true,
  react: true,

  ignores: [
    'src-tauri/**',
  ],
})
