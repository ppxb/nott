import antfu from '@antfu/eslint-config'

export default antfu({
  formatters: true,
  pnpm: true,
  react: true,

  rules: {
    'node/prefer-global/process': 'off',
  },

  ignores: [
    'src-tauri/**',
    'dist/**',
  ],
})
