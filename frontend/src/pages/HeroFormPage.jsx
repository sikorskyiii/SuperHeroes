import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { createHero, fetchHero, updateHero } from '../store/superheroesSlice.js'

export default function HeroFormPage({ mode }) {
  const { id } = useParams(); const isEdit = mode==='edit'
  const dispatch = useDispatch(); const nav = useNavigate()
  const { current } = useSelector(s => s.superheroes)
  const [form, setForm] = useState({ nickname:'', real_name:'', origin_description:'', catch_phrase:'', superpowers:'' })
  const [images, setImages] = useState([])

  useEffect(()=>{ if(isEdit && id) dispatch(fetchHero(id)) },[dispatch,id,isEdit])
  useEffect(()=>{ if(isEdit && current){ setForm({
    nickname:current.nickname, real_name:current.real_name, origin_description:current.origin_description,
    catch_phrase:current.catch_phrase, superpowers:Array.isArray(current.superpowers)?current.superpowers.join(', '):String(current.superpowers||'')
  }); setImages(current.images?.map(i=>i.url)||[]) }},[current,isEdit])

  const onSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...form, superpowers: form.superpowers.split(',').map(s=>s.trim()).filter(Boolean), images }
    if (isEdit) { await dispatch(updateHero({ id:Number(id), payload })); nav(`/hero/${id}`) }
    else { const res = await dispatch(createHero(payload)); nav(`/hero/${res.payload.id}`) }
  }
  const addImageUrl = () => { const url = prompt('URL зображення'); if(url) setImages(p=>[...p,url]) }
  const removeImageUrl = (url) => setImages(p=>p.filter(u=>u!==url))

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{isEdit?'Редагувати героя':'Створити героя'}</h2>
      <div className="card p-4">
        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div><label className="block text-sm text-gray-600 mb-1">Псевдонім</label>
              <input className="input" value={form.nickname} onChange={e=>setForm(f=>({...f,nickname:e.target.value}))} required />
            </div>
            <div><label className="block text-sm text-gray-600 mb-1">Справжнє ім’я</label>
              <input className="input" value={form.real_name} onChange={e=>setForm(f=>({...f,real_name:e.target.value}))} required />
            </div>
            <div><label className="block text-sm text-gray-600 mb-1">Фраза</label>
              <input className="input" value={form.catch_phrase} onChange={e=>setForm(f=>({...f,catch_phrase:e.target.value}))} required />
            </div>
            <div><label className="block text-sm text-gray-600 mb-1">Суперсили</label>
              <input className="input" placeholder='flight, heat vision, strength'
                     value={form.superpowers} onChange={e=>setForm(f=>({...f,superpowers:e.target.value}))}/>
              <div className="text-xs text-gray-500 mt-1">Через кому</div>
            </div>
          </div>

          <div className="space-y-3">
            <div><label className="block text-sm text-gray-600 mb-1">Походження</label>
              <textarea className="textarea" rows="7" value={form.origin_description}
                        onChange={e=>setForm(f=>({...f,origin_description:e.target.value}))} required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Зображення</label>
              <button type="button" className="btn btn-outline mb-2" onClick={addImageUrl}>Додати URL</button>
              <div className="grid grid-cols-2 gap-2">
                {images.map(url=>(
                  <div key={url} className="relative">
                    <img src={url} alt="" className="w-full h-32 object-cover rounded-xl border"/>
                    <button type="button" className="btn btn-danger absolute right-2 top-2 text-xs px-2 py-1" onClick={()=>removeImageUrl(url)}>×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <button className="btn btn-primary"> {isEdit?'Зберегти зміни':'Створити героя'} </button>
          </div>
        </form>
      </div>
    </section>
  )
}
