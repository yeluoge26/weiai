import express from 'express'
import cors from 'cors'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import { appRouter } from './routers/index.js'
import { createContext } from './trpc.js'
import { initDatabase } from './db/schema.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function main() {
  // Initialize database
  await initDatabase()

  const app = express()

  // CORS
  app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true
  }))

  // Parse JSON
  app.use(express.json())

  // Static files
  app.use('/static', express.static(path.join(__dirname, '../public')))

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() })
  })

  // tRPC API
  app.use('/api/trpc', createExpressMiddleware({
    router: appRouter,
    createContext: ({ req }) => createContext({ req })
  }))

  // Start server
  const PORT = process.env.PORT || 3000

  app.listen(PORT, () => {
    console.log(`
  🚀 WeLove Server is running!

  API:      http://localhost:${PORT}/api/trpc
  Health:   http://localhost:${PORT}/health

  Admin login: admin / admin123
  Test user:   13800138000 (any 6-digit code)
    `)
  })
}

main().catch(console.error)

export { appRouter, type AppRouter } from './routers/index.js'
