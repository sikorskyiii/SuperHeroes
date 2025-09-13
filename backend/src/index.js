import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import heroRoutes from './routes/superheroRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { UPLOADS_DIR } from './lib/paths.js'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.use('/uploads', express.static(UPLOADS_DIR))

app.use(heroRoutes)
app.use((_, res) => res.status(404).json({ message: 'Not found' }))
app.use(errorHandler)

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`))
