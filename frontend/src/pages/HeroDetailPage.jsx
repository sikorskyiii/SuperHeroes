import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchHero, deleteHero, addImage, removeImage, uploadImage } from '../store/superheroesSlice.js'
import Badge from '../components/ui/Badge.jsx'
import Card from '../components/ui/Card.jsx'

export default function HeroDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const nav = useNavigate()
  const { current, status } = useSelector(s => s.superheroes)

  useEffect(() => { dispatch(fetchHero(id)) }, [dispatch, id])

  const doDelete = async () => {
    if (!confirm('Видалити цього героя?')) return
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

  if (status === 'loading' || !current) {
    return (
      <section>
        <div className="skeleton h-8 w-56 rounded mb-3" />
        <div className="skeleton h-5 w-80 rounded mb-1" />
        <div className="skeleton h-5 w-64 rounded mb-6" />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-44 rounded-xl" />)}
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{current.nickname}</h2>
        <div className="flex items-center gap-2">
          <Link className="btn btn-outline" to={`/edit/${current.id}`}>Редагувати</Link>
          <button className="btn btn-danger" onClick={doDelete}>Видалити</button>
        </div>
      </div>

      <Card className="space-y-2">
        <p><b>Справжнє ім’я:</b> {current.real_name}</p>
        <p><b>Фраза:</b> {current.catch_phrase}</p>
        <p><b>Походження:</b> {current.origin_description}</p>
        <div>
          <b>Суперсили:</b>{' '}
          {Array.isArray(current.superpowers)
            ? current.superpowers.map(p => <Badge key={p} className="mr-1">{p}</Badge>)
            : String(current.superpowers)}
        </div>
      </Card>

      <div className="flex items-center gap-2">
        <button className="btn btn-outline" onClick={onAddImageUrl}>Додати зображення за URL</button>
        <label className="btn btn-outline cursor-pointer">
          Завантажити файл
          <input type="file" accept="image/*" className="hidden" onChange={onUploadFile} />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {current.images?.map(img => (
          <Card key={img.id} className="p-2">
            <img src={img.url} alt="" className="w-full h-44 object-cover rounded-xl" />
            <button
              className="btn btn-danger w-full mt-2"
              onClick={() => dispatch(removeImage({ id: current.id, imageId: img.id }))}
            >
              Прибрати
            </button>
          </Card>
        ))}
      </div>
    </section>
  )
}
