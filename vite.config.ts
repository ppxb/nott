import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { version as pkgVersion } from './package.json'

const host = process.env.TAURI_DEV_HOST
const platform = process.env.TAURI_ENV_PLATFORM
process.env.VITE_APP_VERSION = pkgVersion

if (process.env.NODE_ENV === 'production') {
	process.env.VITE_APP_BUILD_EPOCH = new Date().getTime().toString()
}

export default defineConfig(async () => ({
	plugins: [react()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	clearScreen: false,
	envPrefix: ['VITE_', 'TAURI_'],
	server: {
		port: 1420,
		strictPort: true,
		host: host || false,
		hmr: host
			? {
					protocol: 'ws',
					host,
					port: 1421,
			  }
			: undefined,
		watch: {
			ignored: ['**/src-tauri/**'],
		},
	},
}))
