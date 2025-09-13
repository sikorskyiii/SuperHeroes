import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { createHero, fetchHero, updateHero } from '../store/superheroesSlice.js'

export default function HeroFormPage({ mode }) {
  const { id } = useParams()
  const isEdit = mode === 'edit'
  const dispatch = useDispatch()
  const nav = useNavigate()
  const { current } = useSelector(s => s.superheroes)

  const [form, setForm] = useState({
    nickname: '',
    real_name: '',
    origin_description: '',
    catch_phrase: '',
    superpowers: ''
  })
  const [images, setImages] = useState([])

  useEffect(() => {
    if (isEdit && id) dispatch(fetchHero(id))
  }, [dispatch, id, isEdit])

  useEffect(() => {
    if (isEdit && current) {
      setForm({
        nickname: current.nickname,
        real_name: current.real_name,
        origin_description: current.origin_description,
        catch_phrase: current.catch_phrase,
        superpowers: Array.isArray(current.superpowers) ? current.superpowers.join(', ') : String(current.superpowers || '')
      })
      setImages(current.images?.map(i => i.url) || [])
    }
  }, [current, isEdit])

  const onSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      superpowers: form.superpowers.split(',').map(s => s.trim()).filter(Boolean),
      images
    }
    if (isEdit) {
      await dispatch(updateHero({ id: Number(id), payload }))
      nav(`/hero/${id}`)
    } else {
      const res = await dispatch(createHero(payload))
      nav(`/hero/${res.payload.id}`)
    }
  }

  const addImageUrl = () => {
    const url = prompt('URL зображення')
    if (url) setImages(prev => [...prev, url])
  }
  const removeImageUrl = (url) => setImages(prev => prev.filter(u => u !== url))

  return (
    <section>
      <h2>{isEdit ? 'Редагувати' : 'Створити'} героя</h2>
      <form onSubmit={onSubmit}>
        <div className="field">
          <label>Псевдонім</label>
          <input value={form.nickname} onChange={e => setForm(f => ({...f, nickname: e.target.value}))} required />
        </div>
        <div className="field">
          <label>Справжнє ім’я</label>
          <input value={form.real_name} onChange={e => setForm(f => ({...f, real_name: e.target.value}))} required />
        </div>
        <div className="field">
          <label>Походження</label>
          <textarea rows="4" value={form.origin_description} onChange={e => setForm(f => ({...f, origin_description: e.target.value}))} required />
        </div>
        <div className="field">
          <label>Фраза</label>
          <input value={form.catch_phrase} onChange={e => setForm(f => ({...f, catch_phrase: e.target.value}))} required />
        </div>
        <div className="field">
          <label>Суперсили</label>
          <input value={form.superpowers} onChange={e => setForm(f => ({...f, superpowers: e.target.value}))} />
          <div className="hint">Через кому, напр.: "flight, heat vision, strength"</div>
        </div>

        <div className="field">
          <label>Зображення</label>
          <div>
            <button type="button" className="btn" onClick={addImageUrl}>Додати URL</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12,marginTop:8}}>
            {images.map(url => (
              <div key={url} style={{border:'1px solid #eee',borderRadius:12,padding:8}}>
                <img src={url} alt="" style={{width:'100%',height:160,objectFit:'cover',borderRadius:10}} />
                <button type="button" className="btn" onClick={() => removeImageUrl(url)} style={{marginTop:8,background:'#ef4444',color:'#fff',border:'1px solid #ef4444'}}>Прибрати</button>
              </div>
            ))}
          </div>
        </div>

        <button className="btn" style={{background:'#000',color:'#fff',border:'1px solid #000'}} type="submit">
          {isEdit ? 'Зберегти' : 'Створити'}
        </button>
      </form>
    </section>
  )
}
