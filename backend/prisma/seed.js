import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.image.deleteMany()
  await prisma.superhero.deleteMany()

  const dc = [
    {
      nickname: 'Superman',
      real_name: 'Clark Kent',
      origin_description:
        'Born Kal-El on Krypton and sent to Earth as an infant; raised in Smallville by the Kents.',
      superpowers: ['flight', 'super strength', 'heat vision', 'invulnerability', 'x-ray vision'],
      catch_phrase: 'Look, up in the sky!',
      img: 'https://picsum.photos/id/237/600/400',
    },
    {
      nickname: 'Batman',
      real_name: 'Bruce Wayne',
      origin_description:
        'After witnessing his parents’ murder, he vowed to fight crime in Gotham as the Dark Knight.',
      superpowers: ['genius intellect', 'martial arts', 'stealth', 'gadgets', 'detective skills'],
      catch_phrase: 'I am Batman.',
      img: 'https://picsum.photos/id/239/600/400',
    },
    {
      nickname: 'Wonder Woman',
      real_name: 'Diana Prince',
      origin_description:
        'Amazonian warrior princess from Themyscira, gifted with divine power and the Lasso of Truth.',
      superpowers: ['super strength', 'agility', 'durability', 'lasso of truth', 'bracelets'],
      catch_phrase: 'For the glory of Themyscira!',
      img: 'https://picsum.photos/id/240/600/400',
    },
    {
      nickname: 'The Flash',
      real_name: 'Barry Allen',
      origin_description:
        'Forensic scientist struck by lightning who taps into the Speed Force.',
      superpowers: ['super speed', 'time travel', 'phasing', 'accelerated healing'],
      catch_phrase: 'Fastest Man Alive!',
      img: 'https://picsum.photos/id/241/600/400',
    },
    {
      nickname: 'Aquaman',
      real_name: 'Arthur Curry',
      origin_description:
        'Half-Atlantean king who communicates with sea life and wields the Trident of Poseidon.',
      superpowers: ['underwater breathing', 'super strength', 'hydrokinesis', 'telepathy (marine)'],
      catch_phrase: 'For Atlantis!',
      img: 'https://picsum.photos/id/242/600/400',
    },
    {
      nickname: 'Green Lantern',
      real_name: 'Hal Jordan',
      origin_description:
        'Test pilot chosen by a power ring to join the Green Lantern Corps.',
      superpowers: ['power ring constructs', 'flight', 'force fields'],
      catch_phrase: 'In brightest day, in blackest night…',
      img: 'https://picsum.photos/id/243/600/400',
    },
    {
      nickname: 'Cyborg',
      real_name: 'Victor Stone',
      origin_description:
        'Athlete saved from a fatal accident with experimental tech; now a cybernetic hero.',
      superpowers: ['technopathy', 'weapon systems', 'flight', 'super strength'],
      catch_phrase: 'Booyah!',
      img: 'https://picsum.photos/id/244/600/400',
    },
    {
      nickname: 'Green Arrow',
      real_name: 'Oliver Queen',
      origin_description:
        'Billionaire archer who became a vigilante after being stranded and training to survive.',
      superpowers: ['archery', 'martial arts', 'stealth', 'acrobatics'],
      catch_phrase: 'You have failed this city.',
      img: 'https://picsum.photos/id/245/600/400',
    },
    {
      nickname: 'Shazam',
      real_name: 'Billy Batson',
      origin_description:
        'Teenager who transforms into a champion by uttering the magic word SHAZAM.',
      superpowers: ['magic lightning', 'strength', 'flight', 'speed'],
      catch_phrase: 'Shazam!',
      img: 'https://picsum.photos/id/246/600/400',
    },
    {
      nickname: 'Martian Manhunter',
      real_name: "J'onn J'onzz",
      origin_description:
        'Last survivor of Mars with vast powers, living on Earth as a protector.',
      superpowers: ['shape-shifting', 'telepathy', 'intangibility', 'flight', 'strength'],
      catch_phrase: "I am J'onn J'onzz of Mars.",
      img: 'https://picsum.photos/id/247/600/400',
    },
  ]

  for (const h of dc) {
    await prisma.superhero.create({
      data: {
        nickname: h.nickname,
        real_name: h.real_name,
        origin_description: h.origin_description,
        superpowers: h.superpowers,
        catch_phrase: h.catch_phrase,
        images: { create: h.img ? [{ url: h.img }] : [] },
      },
    })
  }
}

main()
  .then(() => console.log('Seed completed'))
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
