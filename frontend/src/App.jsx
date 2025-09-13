import { Routes, Route, Link } from 'react-router-dom'

function Home() {
  return <p>Home</p>
}
function Create() {
  return <p>Create</p>
}

export default function App() {
  return (
    <div className="container">
      <header className="app-header">
        <h1>🦸 SuperHeroes</h1>
        <nav style={{display:'flex', gap:'1rem'}}>
          <Link to="/">Список</Link>
          <Link to="/create">Створити</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
        </Routes>
      </main>
    </div>
  )
}
