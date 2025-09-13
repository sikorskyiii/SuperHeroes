import { Router } from 'express'
import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'

import {
  listHeroes, getHero, createHero, updateHero, deleteHero,
  addImageFile, removeImage
} from '../controllers/superheroController.js'

const router = Router()
const uploadsDir = path.join(process.cwd(), 'backend', 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadsDir),
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
