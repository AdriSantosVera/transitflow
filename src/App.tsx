import { Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import TripsPage from './pages/TripsPage'
import FavoritesPage from './pages/FavoritesPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 lg:px-8 lg:py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/trips?type=all" replace />} />
          <Route path="/trips" element={<TripsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
