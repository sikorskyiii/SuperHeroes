import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchHero, deleteHero, addImage, removeImage, uploadImage } from '../store/superheroesSlice.js'

export default function HeroDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const nav = useNavigate()
  const { current } = useSelector(s => s.superheroes)

  useEffect(() => { dispatch(fetchHero(id)) }, [dispatch, id])

  const doDelete = async () => {
    if (!confirm('Видалити героя?')) return
    await dispatch(deleteHero(Number(id)))
    nav('/')
  }

  const onAddImageUrl = async () => {
    const url = prompt('Встав URL зображення')
    if (url) await dispatch(addImage({ id: Number(id), url }))
  }

  const onUploadFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const { payload: url } = await dispatch(uploadImage(file))
    await dispatch(addImage({ id: Number(id), url }))
  }

  if (!current) return <p>Завантаження...</p>

  return (
    <section>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2>{current.nickname}</h2>
        <div style={{display:'flex',gap:8}}>
          <Link className="btn" to={`/edit/${current.id}`}>Редагувати</Link>
          <button className="btn" onClick={doDelete} style={{background:'#ef4444',color:'#fff',border:'1px solid #ef4444'}}>Видалити</button>
        </div>
      </div>

      <p><b>Справжнє ім’я:</b> {current.real_name}</p>
      <p><b>Фраза:</b> {current.catch_phrase}</p>
      <p><b>Опис походження:</b> {current.origin_description}</p>
      <div style={{margin:'0.5rem 0'}}>
        <b>Суперсили:</b>{' '}
        {Array.isArray(current.superpowers)
          ? current.superpowers.map(p => <span key={p} style={{border:'1px solid #ddd',borderRadius:999,padding:'2px 8px',margin:4,display:'inline-block'}}>{p}</span>)
          : String(current.superpowers)}
      </div>

      <h3>Зображення</h3>
      <div style={{display:'flex',gap:12,marginBottom:8}}>
        <button className="btn" onClick={onAddImageUrl}>Додати за URL</button>
        <label className="btn">
          Завантажити
          <input type="file" accept="image/*" style={{display:'none'}} onChange={onUploadFile} />
        </label>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12}}>
        {current.images?.map(img => (
          <div key={img.id} style={{border:'1px solid #eee',borderRadius:12,padding:8}}>
            <img src={img.url} alt="" style={{width:'100%',height:160,objectFit:'cover',borderRadius:10}}/>
            <button className="btn" onClick={() => dispatch(removeImage({ id: current.id, imageId: img.id }))} style={{marginTop:8,background:'#ef4444',color:'#fff',border:'1px solid #ef4444'}}>Прибрати</button>
          </div>
        ))}
      </div>
    </section>
  )
}
