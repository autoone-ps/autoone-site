import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // `npm run dev` serves the front end only. To test the /api routes locally run `npm run build && npx wrangler pages dev dist` (see README).
    port: 5173,
  },
})
