import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { createHero, fetchHero, updateHero, removeImage, addImageFile } from '../store/superheroesSlice.js'
import resolveImageUrl from '../lib/resolveImageUrl.js'

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
    superpowers: '',
  })
  const [newFiles, setNewFiles] = useState([])     
  const [submitting, setSubmitting] = useState(false)

  const previews = useMemo(
    () => newFiles.map(f => ({ file: f, url: URL.createObjectURL(f) })),
    [newFiles]
  )
  useEffect(() => () => { previews.forEach(p => URL.revokeObjectURL(p.url)) }, [previews])

  useEffect(() => { if (isEdit && id) dispatch(fetchHero(id)) }, [dispatch, id, isEdit])
  useEffect(() => {
    if (isEdit && current) {
      setForm({
        nickname: current.nickname || '',
        real_name: current.real_name || '',
        origin_description: current.origin_description || '',
        catch_phrase: current.catch_phrase || '',
        superpowers: Array.isArray(current.superpowers) ? current.superpowers.join(', ') : String(current.superpowers || '')
      })
    }
  }, [current, isEdit])

  const onPickFiles = (e) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'))
    if (!files.length) return
    setNewFiles(prev => [...prev, ...files])
    e.target.value = ''
  }
  const removeNewFile = (url) => {
    setNewFiles(prev => prev.filter(f => URL.createObjectURL(f) !== url)) 
  }
  const removeNewFileByIndex = (idx) => {
    const url = previews[idx]?.url
    if (url) URL.revokeObjectURL(url)
    setNewFiles(prev => prev.filter((_, i) => i !== idx))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      const payload = {
        nickname: form.nickname.trim(),
        real_name: form.real_name.trim(),
        origin_description: form.origin_description.trim(),
        catch_phrase: form.catch_phrase.trim(),
        superpowers: form.superpowers.split(',').map(s => s.trim()).filter(Boolean),
      }

      let heroId
      if (isEdit) {
        await dispatch(updateHero({ id: Number(id), payload }))
        heroId = Number(id)
      } else {
        const res = await dispatch(createHero(payload))
        heroId = res?.payload?.id
      }

      if (heroId && newFiles.length) {
        await Promise.all(newFiles.map(f => dispatch(addImageFile({ id: heroId, file: f }))))
      }

      nav(`/hero/${heroId}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{isEdit ? 'Редагувати героя' : 'Створити героя'}</h2>

      <div className="card p-4">
        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Псевдонім</label>
              <input className="input" value={form.nickname} onChange={e => setForm(f => ({ ...f, nickname: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Справжнє ім’я</label>
              <input className="input" value={form.real_name} onChange={e => setForm(f => ({ ...f, real_name: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Фраза</label>
              <input className="input" value={form.catch_phrase} onChange={e => setForm(f => ({ ...f, catch_phrase: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Суперсили</label>
              <input
                className="input"
                placeholder="flight, heat vision, strength"
                value={form.superpowers}
                onChange={e => setForm(f => ({ ...f, superpowers: e.target.value }))}
              />
              <div className="text-xs text-gray-500 mt-1">Перелічуй через кому</div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Походження</label>
              <textarea
                className="textarea"
                rows="7"
                value={form.origin_description}
                onChange={e => setForm(f => ({ ...f, origin_description: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Додати зображення (файли)</label>
              <label className="btn btn-outline cursor-pointer">
                Обрати файли
                <input type="file" accept="image/*" multiple className="hidden" onChange={onPickFiles} />
              </label>

              {previews.length > 0 && (
                <>
                  <div className="text-sm text-gray-600 mt-3">Готуються до завантаження:</div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {previews.map((p, idx) => (
                      <div key={p.url} className="relative">
                        <img src={p.url} alt="" className="w-full h-32 object-cover rounded-xl border" />
                        <button
                          type="button"
                          className="btn btn-danger absolute right-2 top-2 text-xs px-2 py-1"
                          onClick={() => removeNewFileByIndex(idx)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          {isEdit && current?.images?.length > 0 && (
            <div className="md:col-span-2">
              <div className="text-sm text-gray-600 mb-2">Зображення героя:</div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {current.images.map(img => (
                  <div key={img.id} className="card p-2">
                    <img
                      src={resolveImageUrl(img.url)}
                      alt=""
                      className="w-full h-44 object-cover rounded-xl"
                      onError={(e)=>{ e.currentTarget.src='https://placehold.co/600x400?text=No+Image' }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger w-full mt-2"
                      onClick={() => dispatch(removeImage({ id: current.id, imageId: img.id }))}
                    >
                      Прибрати
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <button className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Збереження…' : isEdit ? 'Зберегти зміни' : 'Створити героя'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
