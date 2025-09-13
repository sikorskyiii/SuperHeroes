import { Link } from 'react-router-dom'

export default function HeroCard({ hero }) {
  const img = hero.images?.[0]?.url
  return (
    <div className="card" style={{border:'1px solid #e5e7eb', borderRadius:12, padding:12}}>
      {img ? <img src={img} alt={hero.nickname} style={{width:'100%',height:160,objectFit:'cover',borderRadius:10}} /> : <div style={{height:160,background:'#f3f4f6',borderRadius:10}} />}
      <h3>{hero.nickname}</h3>
      <Link className="btn" to={`/hero/${hero.id}`}>Деталі</Link>
    </div>
  )
}
