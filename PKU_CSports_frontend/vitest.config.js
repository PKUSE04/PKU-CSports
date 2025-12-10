import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.')
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.uvue']
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup/global.js'
  }
})

