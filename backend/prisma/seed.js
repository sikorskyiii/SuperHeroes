import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.image.deleteMany()
  await prisma.superhero.deleteMany()

  const seedHeroes = [
    {
      nickname: 'Superman',
      real_name: 'Clark Kent',
      origin_description: 'Born as Kal-El on Krypton...',
      superpowers: ['flight','heat vision','invulnerability','strength'],
      catch_phrase: 'Look, up in the sky!',
      images: { create: [{ url: '/uploads/seed-superman.jpg' }] }
    },
    {
      nickname: 'Batman',
      real_name: 'Bruce Wayne',
      origin_description: 'After witnessing the murder of his parents...',
      superpowers: ['genius intellect','martial arts','gadgets'],
      catch_phrase: 'I am Batman.',
      images: { create: [{ url: '/uploads/seed-batman.jpg' }] }
    }
  ]

  for (const h of seedHeroes) {
    await prisma.superhero.create({
      data: { ...h, superpowers: h.superpowers }
    })
  }
}

main().finally(() => prisma.$disconnect())
