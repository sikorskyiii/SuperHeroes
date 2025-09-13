import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import HeroListPage from './pages/HeroListPage.jsx'
import HeroDetailPage from './pages/HeroDetailPage.jsx'
import HeroFormPage from './pages/HeroFormPage.jsx'

function Navbar(){
  const nav = useNavigate()
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="container-narrow py-3 flex items-center justify-between">
        <h1 className="text-xl font-semibold cursor-pointer" onClick={()=>nav('/')}>🦸 SuperHeroes</h1>
        <nav className="flex gap-2">
          <Link className="btn btn-outline" to="/">Список</Link>
          <Link className="btn btn-primary" to="/create">Створити</Link>
        </nav>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900">
      <Navbar />
      <main className="container-narrow py-6">
        <div className="p-3 bg-black text-white rounded-2xl mb-4">UI alive</div>

        <Routes>
          <Route path="/" element={<HeroListPage />} />
          <Route path="/hero/:id" element={<HeroDetailPage />} />
          <Route path="/create" element={<HeroFormPage mode="create" />} />
          <Route path="/edit/:id" element={<HeroFormPage mode="edit" />} />
        </Routes>
      </main>
      <footer className="border-t py-6 mt-8">
        <div className="container-narrow text-sm text-gray-500">React + Redux Toolkit + TailwindCSS</div>
      </footer>
    </div>
  )
}
