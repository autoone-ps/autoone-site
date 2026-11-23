// Builds the whole site into ONE self-contained HTML file (images inlined). Used for quick previews only.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { outDir: 'dist-preview', assetsInlineLimit: 100_000_000 },
})
