import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { createPanemSyncMiddleware } from './server/panemSyncMiddleware.js'

function panemSyncPlugin() {
  const middleware = createPanemSyncMiddleware()
  return {
    name: 'panem-sync-server',
    configureServer(server) {
      server.middlewares.use(middleware)
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = parseInt(env.VITE_PORT || '3000', 10)

  return {
    plugins: [react(), panemSyncPlugin()],
    server: {
      host: true,
      port: port,
      watch: {
        usePolling: true,
      }
    }
  }
})
