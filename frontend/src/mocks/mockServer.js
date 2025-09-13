import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

let AUTO_ID = 100
const now = () => new Date().toISOString()

let HEROES = [
  { id:1, nickname:'Superman', real_name:'Clark Kent',
    origin_description:'Born as Kal-El on Krypton...',
    superpowers:['flight','heat vision','invulnerability','strength'],
    catch_phrase:'Look, up in the sky!',
    images:[{ id:11, url:'https://picsum.photos/id/237/600/400', createdAt: now() }],
    createdAt: now(), updatedAt: now()
  },
  { id:2, nickname:'Batman', real_name:'Bruce Wayne',
    origin_description:'After witnessing the murder of his parents...',
    superpowers:['genius intellect','martial arts','gadgets'],
    catch_phrase:'I am Batman.',
    images:[{ id:21, url:'https://picsum.photos/id/239/600/400', createdAt: now() }],
    createdAt: now(), updatedAt: now()
  },
  { id:3, nickname:'Wonder Woman', real_name:'Diana Prince',
    origin_description:'Amazonian demigoddess from Themyscira',
    superpowers:['strength','agility','lasso of truth'],
    catch_phrase:'For the glory!',
    images:[{ id:31, url:'https://picsum.photos/id/240/600/400', createdAt: now() }],
    createdAt: now(), updatedAt: now()
  },
  { id:4, nickname:'Flash', real_name:'Barry Allen',
    origin_description:'Struck by lightning in a lab accident',
    superpowers:['super speed','time travel'],
    catch_phrase:'Fastest man alive',
    images:[{ id:41, url:'https://picsum.photos/id/241/600/400', createdAt: now() }],
    createdAt: now(), updatedAt: now()
  }
]

const paginate = (arr, page=1, limit=5) => {
  const total = arr.length
  const totalPages = Math.max(1, Math.ceil(total/limit))
  const start = (page-1)*limit
  const items = arr.slice(start, start+limit).map(h => ({...h, images: h.images?.[0] ? [h.images[0]] : []}))
  return { items, page, pageSize:limit, total, totalPages }
}

export default function setupMockServer() {
  const mock = new MockAdapter(axios, { delayResponse: 300 })

  mock.onGet(/\/api\/superheroes(\?.*)?$/).reply(cfg => {
    const url = new URL(cfg.url, 'http://x')
    const page = Number(url.searchParams.get('page')||1)
    const limit = Number(url.searchParams.get('limit')||5)
    return [200, paginate(HEROES, page, limit)]
  })

  mock.onGet(/\/api\/superheroes\/\d+$/).reply(cfg => {
    const id = Number(cfg.url.split('/').pop())
    const hero = HEROES.find(h=>h.id===id)
    return hero ? [200, hero] : [404, {message:'Not found'}]
  })

  mock.onPost('/api/superheroes').reply(cfg => {
    const b = JSON.parse(cfg.data||'{}')
    const id = ++AUTO_ID
    const imgs = (b.images||[]).map((url, idx)=>({ id:id*10+idx, url, createdAt: now() }))
    const hero = { id, nickname:b.nickname, real_name:b.real_name, origin_description:b.origin_description,
      superpowers:Array.isArray(b.superpowers)?b.superpowers:[], catch_phrase:b.catch_phrase,
      images: imgs, createdAt: now(), updatedAt: now() }
    HEROES.unshift(hero)
    return [201, hero]
  })

  mock.onPut(/\/api\/superheroes\/\d+$/).reply(cfg => {
    const id = Number(cfg.url.split('/').pop())
    const b = JSON.parse(cfg.data||'{}')
    const i = HEROES.findIndex(h=>h.id===id)
    if (i === -1) return [404, {message:'Not found'}]
    const powers = b.superpowers === undefined ? HEROES[i].superpowers : b.superpowers
    HEROES[i] = { ...HEROES[i], ...b, superpowers:powers, updatedAt: now() }
    return [200, HEROES[i]]
  })

  mock.onDelete(/\/api\/superheroes\/\d+$/).reply(cfg => {
    const id = Number(cfg.url.split('/').pop())
    const before = HEROES.length
    HEROES = HEROES.filter(h=>h.id!==id)
    return before === HEROES.length ? [404,{message:'Not found'}] : [204]
  })

  mock.onPost(/\/api\/superheroes\/\d+\/images$/).reply(cfg => {
    const id = Number(cfg.url.split('/')[3])
    const { url } = JSON.parse(cfg.data||'{}')
    const hero = HEROES.find(h=>h.id===id)
    if (!hero) return [404, {message:'Not found'}]
    const image = { id: ++AUTO_ID, url, createdAt: now() }
    hero.images.push(image); hero.updatedAt=now()
    return [201, image]
  })

  mock.onDelete(/\/api\/superheroes\/\d+\/images\/\d+$/).reply(cfg => {
    const parts = cfg.url.split('/')
    const heroId = Number(parts[3]); const imgId = Number(parts[5])
    const hero = HEROES.find(h=>h.id===heroId)
    if (!hero) return [404,{message:'Not found'}]
    const before = hero.images.length
    hero.images = hero.images.filter(i=>i.id!==imgId)
    return before===hero.images.length ? [404,{message:'Image not found'}] : [204]
  })

  mock.onPost('/api/upload').reply(()=> {
    const id = Math.floor(200 + Math.random()*200)
    return [201, { url: `https://picsum.photos/id/${id}/600/400` }]
  })
}
