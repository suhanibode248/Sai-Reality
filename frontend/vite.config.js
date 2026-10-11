import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Plugin: map /property-details/ID/name/ and /project-details/ID/name/
// to the matching static HTML file in public/
function detailPageRouter() {
  return {
    name: 'detail-page-router',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url || ''
        // Match /property-details/ID/... or /project-details/ID/...
        const match = url.match(/^\/(property|project)-details\/(\d+)(?:\/[^?]*)?(?:\?.*)?$/)
        if (!match) return next()

        const type = match[1]   // "property" or "project"
        const id   = match[2]   // numeric ID

        const publicDir = path.resolve(__dirname, 'public')
        const prefix    = `${type}_details_${id}_`

        try {
          const files = fs.readdirSync(publicDir)
          const file  = files.find(f => f.startsWith(prefix) && f.endsWith('.html'))
          if (!file) return next()

          const html = fs.readFileSync(path.join(publicDir, file), 'utf-8')
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end(html)
        } catch (e) {
          next()
        }
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), detailPageRouter()],
  server: {
    port: 5173,
  },
})
