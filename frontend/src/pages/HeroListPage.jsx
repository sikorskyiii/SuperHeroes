import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPage } from '../store/superheroesSlice.js'
import HeroCard from '../components/HeroCard.jsx'
import Pagination from '../components/Pagination.jsx'
import Empty from '../components/feedback/Empty.jsx'
import Skeleton from '../components/feedback/Skeleton.jsx'

export default function HeroListPage() {
  const dispatch = useDispatch()
  const { items, page, totalPages, status } = useSelector(s => s.superheroes)

  useEffect(() => {
    dispatch(fetchPage({ page: 1, limit: 5 }))
  }, [dispatch])

  const changePage = (next) => dispatch(fetchPage({ page: next, limit: 5 }))

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Усі герої</h2>
      </div>

      {status === 'loading' && (
        <div className="grid-cards">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card p-3">
              <div className="skeleton h-44 rounded-xl mb-2" />
              <div className="skeleton h-5 w-1/2 rounded" />
            </div>
          ))}
        </div>
      )}

      {status !== 'loading' && items.length === 0 && (
        <Empty
          title="Порожньо"
          subtitle="Додайте свого першого супергероя"
        />
      )}

      {status !== 'loading' && items.length > 0 && (
        <>
          <div className="grid-cards">
            {items.map(hero => <HeroCard key={hero.id} hero={hero} />)}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={changePage} />
        </>
      )}
    </section>
  )
}
