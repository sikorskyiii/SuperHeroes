import { Router } from 'express'
import multer from 'multer'
import { fileURLToPath } from 'url'
import path from 'node:path'
import fs from 'node:fs'

import {
  listHeroes, getHero, createHero, updateHero, deleteHero,
  addImageFile, removeImage
} from '../controllers/superheroController.js'

const router = Router()


const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
const SRC_ROOT   = path.resolve(__dirname)         
const UPLOADS_DIR = path.join(SRC_ROOT, '..', 'uploads') 

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOADS_DIR),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname || '')
    const name = `${Date.now()}-${Math.random().toString(36).slice(2,8)}${ext}`
    cb(null, name)
  }
})
const upload = multer({ storage })

router.get('/api/superheroes', listHeroes)
router.get('/api/superheroes/:id', getHero)
router.post('/api/superheroes', createHero)
router.put('/api/superheroes/:id', updateHero)
router.delete('/api/superheroes/:id', deleteHero)

router.post('/api/superheroes/:id/images', upload.single('image'), addImageFile)
router.delete('/api/superheroes/:id/images/:imageId', removeImage)

export default router
