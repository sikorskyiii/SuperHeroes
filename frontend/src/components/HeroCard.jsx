import { Link } from 'react-router-dom'
import resolveImageUrl from '../lib/resolveImageUrl.js'

export default function HeroCard({ hero }) {
  const raw = hero.images?.[0]?.url
  const img = raw ? resolveImageUrl(raw) : null
  return (
    <div className="card p-3 flex flex-col gap-2">
      {img
        ? <img
            src={img}
            alt={hero.nickname}
            className="w-full h-44 rounded-xl object-cover"
            onError={(e)=>{ e.currentTarget.src='https://placehold.co/600x400?text=No+Image' }}
          />
        : <div className="w-full h-44 rounded-xl bg-gray-100" />
      }
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{hero.nickname}</h3>
        <Link className="btn btn-outline" to={`/hero/${hero.id}`}>Деталі</Link>
      </div>
    </div>
  )
}
