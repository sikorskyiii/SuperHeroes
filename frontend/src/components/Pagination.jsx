export default function Pagination({ page, totalPages, onChange }) {
  return (
    <div className="pagination" style={{display:'flex',gap:8,justifyContent:'center',marginTop:16}}>
      <button className="btn" disabled={page<=1} onClick={() => onChange(page-1)}>Prev</button>
      <span>Page {page} / {totalPages || 1}</span>
      <button className="btn" disabled={page>=totalPages} onClick={() => onChange(page+1)}>Next</button>
    </div>
  )
}
