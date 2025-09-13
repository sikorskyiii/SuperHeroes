import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPage } from '../store/superheroesSlice.js'
import HeroCard from '../components/HeroCard.jsx'
import Pagination from '../components/Pagination.jsx'

export default function HeroListPage() {
  const dispatch = useDispatch()
  const { items, page, totalPages, status } = useSelector(s => s.superheroes)
  useEffect(() => { dispatch(fetchPage({ page:1, limit:5 })) }, [dispatch])
  const changePage = (next) => dispatch(fetchPage({ page: next, limit: 5 }))

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Усі герої</h2>
      {status === 'loading' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({length:8}).map((_,i)=><div key={i} className="card p-3"><div className="skeleton h-44 rounded-xl mb-2"/><div className="skeleton h-5 w-1/2 rounded"/></div>)}
        </div>
      )}
      {status !== 'loading' && items.length === 0 && (
        <div className="text-center text-gray-600 py-16">Порожньо — додайте героя.</div>
      )}
      {status !== 'loading' && items.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {items.map(h=> <HeroCard key={h.id} hero={h} />)}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={changePage}/>
        </>
      )}
    </section>
  )
}
