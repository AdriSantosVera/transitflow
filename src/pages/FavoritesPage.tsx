import EmptyState from '../components/EmptyState'
import TripCard from '../components/TripCard'
import { useFavorites } from '../context/FavoritesContext'
import { useTrips } from '../hooks/useTrips'

function FavoritesPage() {
  const { trips, loading: loadingTrips, error: tripsError } = useTrips()
  const { favoriteIds, loading: loadingFavorites, error: favoritesError } =
    useFavorites()

  if (loadingTrips || loadingFavorites) {
    return (
      <section className="soft-panel p-6">
        <h2 className="mb-2 text-2xl font-semibold text-slate-950">Mis favoritos</h2>
        <p className="text-slate-500">Cargando favoritos...</p>
      </section>
    )
  }

  if (tripsError || favoritesError) {
    return (
      <section className="soft-panel border-red-100 bg-red-50/80 p-6">
        <h2 className="mb-2 text-2xl font-semibold text-red-900">Mis favoritos</h2>
        <p className="text-red-700">
          Error: {tripsError ?? favoritesError ?? 'Error desconocido'}
        </p>
      </section>
    )
  }

  const favoriteTrips = trips.filter((trip) =>
    favoriteIds.includes(trip.id),
  )

  if (favoriteTrips.length === 0) {
    return (
      <EmptyState
        title="Sin favoritos"
        description="Aun no has guardado viajes. Marca el corazon en la pantalla principal."
      />
    )
  }

  return (
    <section className="space-y-6">
      <div className="soft-panel p-6 sm:p-7">
        <p className="text-sm font-medium text-slate-500">Acceso rapido</p>
        <h2 className="mb-2 mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Favoritos
        </h2>
        <p className="max-w-2xl text-slate-500">
          Aqui tienes los viajes que has marcado para volver rapido a cada plan.
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {favoriteTrips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </section>
  )
}

export default FavoritesPage
