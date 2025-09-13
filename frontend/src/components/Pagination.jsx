export default function Pagination({ page, totalPages, onChange }) {
  const canPrev = page > 1, canNext = page < (totalPages || 1)
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button className="btn btn-outline disabled:opacity-50" disabled={!canPrev} onClick={() => onChange(page-1)}>‹ Попередня</button>
      <span className="text-sm text-gray-600">Сторінка <b>{page}</b> / {totalPages || 1}</span>
      <button className="btn btn-outline disabled:opacity-50" disabled={!canNext} onClick={() => onChange(page+1)}>Наступна ›</button>
    </div>
  )
}
