import express from 'express'
import cors from 'cors'
import path from 'node:path'
import dotenv from 'dotenv'
import heroRoutes from './routes/superheroRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { fileURLToPath } from 'url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

dotenv.config()
const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
const uploadsPath = path.join(process.cwd(), 'backend', 'uploads')
app.use('/uploads', express.static(uploadsPath))

app.use(heroRoutes)
app.use((req, res) => res.status(404).json({ message: 'Not found' }))
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
