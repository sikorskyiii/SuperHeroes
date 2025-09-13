import express from 'express'
import cors from 'cors'
import heroRoutes from '../../src/routes/superheroRoutes.js'
import { errorHandler } from '../../src/middleware/errorHandler.js'
import { UPLOADS_DIR } from '../../src/lib/paths.js'

export default function createApp() {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use('/uploads', express.static(UPLOADS_DIR))
  app.use(heroRoutes)
  app.use((_, res) => res.status(404).json({ message: 'Not found' }))
  app.use(errorHandler)
  return app
}
