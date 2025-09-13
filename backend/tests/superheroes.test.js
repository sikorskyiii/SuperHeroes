import request from 'supertest'
import createApp from './helpers/createAppForTest.js'
import { prisma } from '../src/lib/prisma.js'

let app
const TINY_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO1o5W0AAAAASUVORK5CYII=',
  'base64'
)

beforeAll(() => { app = createApp() })
beforeEach(async () => { await prisma.image.deleteMany(); await prisma.superhero.deleteMany() })
afterAll(async () => { await prisma.$disconnect() })

test('create → upload file → details → delete image → delete hero', async () => {
  const payload = {
    nickname: 'Flash', real_name: 'Barry Allen',
    origin_description: 'Forensic scientist, Speed Force.',
    superpowers: ['speed'], catch_phrase: 'Fastest man alive!',
  }

  const createRes = await request(app).post('/api/superheroes').send(payload).expect(201)
  const id = createRes.body.id

  const uploadRes = await request(app)
    .post(`/api/superheroes/${id}/images`)
    .attach('image', TINY_PNG, 'tiny.png')
    .expect(201)
  expect(uploadRes.body.url).toMatch(/^\/uploads\//)

  const details = await request(app).get(`/api/superheroes/${id}`).expect(200)
  expect(details.body.images.length).toBe(1)

  await request(app).delete(`/api/superheroes/${id}/images/${uploadRes.body.id}`).expect(204)
  const detailsAfter = await request(app).get(`/api/superheroes/${id}`).expect(200)
  expect(detailsAfter.body.images.length).toBe(0)

  await request(app).delete(`/api/superheroes/${id}`).expect(204)
})

test('pagination: returns 5 per page', async () => {
  for (let i = 0; i < 6; i++) {
    await prisma.superhero.create({
      data: { nickname:`H${i}`, real_name:`R${i}`, origin_description:'x', superpowers:[], catch_phrase:'y' }
    })
  }
  const p1 = await request(app).get('/api/superheroes?page=1&limit=5').expect(200)
  expect(p1.body.items).toHaveLength(5)
  expect(p1.body.total).toBe(6)
  expect(p1.body.totalPages).toBe(2)

  const p2 = await request(app).get('/api/superheroes?page=2&limit=5').expect(200)
  expect(p2.body.items).toHaveLength(1)
})
