import path from 'node:path'
import fs from 'node:fs/promises'
import { prisma } from '../lib/prisma.js'
import { fileURLToPath } from 'url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

export async function listHeroes(req, res) {
  const page = Math.max(1, Number(req.query.page || 1))
  const limit = Math.max(1, Math.min(50, Number(req.query.limit || 5)))
  const total = await prisma.superhero.count()
  const itemsRaw = await prisma.superhero.findMany({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: { id: 'desc' },
    include: { images: { take: 1, orderBy: { createdAt: 'desc' } } }
  })
  const totalPages = Math.max(1, Math.ceil(total / limit))
  res.json({ items: itemsRaw, page, pageSize: limit, total, totalPages })
}

export async function getHero(req, res) {
  const id = Number(req.params.id)
  const hero = await prisma.superhero.findUnique({
    where: { id },
    include: { images: { orderBy: { createdAt: 'desc' } } }
  })
  if (!hero) return res.status(404).json({ message: 'Not found' })
  res.json(hero)
}

export async function createHero(req, res) {
  const { nickname, real_name, origin_description, superpowers = [], catch_phrase } = req.body
  const hero = await prisma.superhero.create({
    data: {
      nickname,
      real_name,
      origin_description,
      superpowers: Array.isArray(superpowers) ? superpowers : [],
      catch_phrase
    }
  })
  res.status(201).json(hero)
}

export async function updateHero(req, res) {
  const id = Number(req.params.id)
  const { nickname, real_name, origin_description, superpowers, catch_phrase } = req.body
  const hero = await prisma.superhero.update({
    where: { id },
    data: {
      nickname,
      real_name,
      origin_description,
      ...(superpowers !== undefined ? { superpowers } : {}),
      catch_phrase
    }
  })
  res.json(hero)
}

export async function deleteHero(req, res) {
  const id = Number(req.params.id)
  await prisma.image.deleteMany({ where: { heroId: id } })
  await prisma.superhero.delete({ where: { id } })
  res.status(204).end()
}
export async function addImageFile(req, res) {
  const id = Number(req.params.id)
  if (!req.file) return res.status(400).json({ message: 'No file' })
  const url = `/uploads/${req.file.filename}`
  const image = await prisma.image.create({
    data: { url, heroId: id }
  })
  res.status(201).json(image)
}

export async function removeImage(req, res) {
  const id = Number(req.params.id)
  const imageId = Number(req.params.imageId)
  const img = await prisma.image.findUnique({ where: { id: imageId } })
  if (!img || img.heroId !== id) return res.status(404).json({ message: 'Not found' })
  try {
    if (img.url.startsWith('/uploads/')) {
      const filePath = path.join(process.cwd(), 'backend', img.url)
      await fs.unlink(filePath).catch(() => {})
    }
  } catch (_) {}

  await prisma.image.delete({ where: { id: imageId } })
  res.status(204).end()
}
