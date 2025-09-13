import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const nav = useNavigate()
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="container-narrow py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold cursor-pointer" onClick={() => nav('/')}>🦸 SuperHeroes</h1>
        <nav className="flex items-center gap-2">
          <Link className="btn btn-outline" to="/">Список</Link>
          <Link className="btn btn-primary" to="/create">Створити</Link>
        </nav>
      </div>
    </header>
  )
}
