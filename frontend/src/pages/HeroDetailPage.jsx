import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchHero, deleteHero, removeImage, addImageFile } from '../store/superheroesSlice.js'

export default function HeroDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const nav = useNavigate()
  const { current, status } = useSelector(s => s.superheroes)

  useEffect(() => { dispatch(fetchHero(id)) }, [dispatch, id])

  const doDelete = async () => {
    if (!confirm('Видалити героя?')) return
    await dispatch(deleteHero(Number(id)))
    nav('/')
  }

  const onUploadFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    await dispatch(addImageFile({ id: Number(id), file }))
    e.target.value = '' // скинемо інпут, щоб можна було одразу вибрати той самий файл знову
  }

  if (status === 'loading' || !current) {
    return <div className="skeleton h-8 w-56 rounded" />
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{current.nickname}</h2>
        <div className="flex gap-2">
          <Link className="btn btn-outline" to={`/edit/${current.id}`}>Редагувати</Link>
          <button className="btn btn-danger" onClick={doDelete}>Видалити</button>
        </div>
      </div>

      <div className="card p-4 space-y-2">
        <p><b>Справжнє ім’я:</b> {current.real_name}</p>
        <p><b>Фраза:</b> {current.catch_phrase}</p>
        <p><b>Походження:</b> {current.origin_description}</p>
        <div>
          <b>Суперсили:</b>{' '}
          {Array.isArray(current.superpowers)
            ? current.superpowers.map(p => <span key={p} className="badge mr-1">{p}</span>)
            : String(current.superpowers)}
        </div>
      </div>

      <div className="flex gap-2">
        <label className="btn btn-outline cursor-pointer">
          Завантажити файл
          <input type="file" accept="image/*" className="hidden" onChange={onUploadFile} />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {current.images?.map(img => (
          <div key={img.id} className="card p-2">
            <img src={img.url} alt="" className="w-full h-44 object-cover rounded-xl" />
            <button
              className="btn btn-danger w-full mt-2"
              onClick={() => dispatch(removeImage({ id: current.id, imageId: img.id }))}
            >
              Прибрати
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
