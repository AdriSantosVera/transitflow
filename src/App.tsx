import { Navigate, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import ThemeToggle from './components/ThemeToggle'
import BudgetPage from './pages/BudgetPage'
import HomePage from './pages/HomePage'
import ItineraryPage from './pages/ItineraryPage'
import NotesPage from './pages/NotesPage'
import TripsPage from './pages/TripsPage'
import PlacesPage from './pages/PlacesPage'
import SavingsPage from './pages/SavingsPage'
import SettingsPage from './pages/SettingsPage'
import TripCreatePage from './pages/TripCreatePage'
import TripDetailPage from './pages/TripDetailPage'
import FavoritesPage from './pages/FavoritesPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-[#0f172a] dark:text-white lg:flex">
      <Header />
      <div className="min-w-0 flex-1">
        <main className="mx-auto w-full max-w-[1720px] px-4 py-6 lg:px-8 lg:py-8 xl:px-10">
          <div className="mb-6 hidden justify-end lg:flex">
            <ThemeToggle />
          </div>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/trips/new" element={<TripCreatePage />} />
            <Route path="/trips/:id" element={<TripDetailPage />} />
            <Route path="/itinerary" element={<ItineraryPage />} />
            <Route path="/places" element={<PlacesPage />} />
            <Route path="/budget" element={<BudgetPage />} />
            <Route path="/savings" element={<SavingsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
