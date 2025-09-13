
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'

function Home() {
  return <p className="text-gray-600">Home</p>
}
function Create() {
  return <p className="text-gray-600">Create form here…</p>
}

export default function App() {
  return (
    <div className="min-h-dvh bg-gray-50 text-gray-900">
      <Navbar />
      <main className="container-narrow py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
        </Routes>
      </main>
      <footer className="border-t py-6 mt-8">
        <div className="container-narrow text-sm text-gray-500">
          React + TailwindCSS
        </div>
      </footer>
    </div>
  )
}
