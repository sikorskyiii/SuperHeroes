import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPage } from '../store/superheroesSlice.js'
import HeroCard from '../components/HeroCard.jsx'
import Pagination from '../components/Pagination.jsx'

export default function HeroListPage() {
  const dispatch = useDispatch()
  const { items, page, totalPages, status } = useSelector(s => s.superheroes)

  useEffect(() => { dispatch(fetchPage({ page: 1, limit: 5 })) }, [dispatch])

  const changePage = (next) => {
    dispatch(fetchPage({ page: next, limit: 5 }))
  }

  return (
    <section>
      <h2>Усі герої</h2>
      {status === 'loading' && <p>Завантаження...</p>}
      <div className="grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:16}}>
        {items.map(hero => <HeroCard key={hero.id} hero={hero} />)}
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={changePage} />
    </section>
  )
}
