import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'node:path'
import heroRoutes from './routes/superheroRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const BACKEND_ROOT = path.resolve(__dirname, '..')      // backend/src -> backend
const UPLOADS_DIR  = path.join(BACKEND_ROOT, 'uploads')  // backend/uploads

app.use('/uploads', express.static(UPLOADS_DIR))


app.use(heroRoutes)
app.use((req, res) => res.status(404).json({ message: 'Not found' }))
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
