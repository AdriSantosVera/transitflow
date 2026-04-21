import EmptyState from '../components/EmptyState'
import TransportCard from '../components/TransportCard'
import { useFavorites } from '../context/FavoritesContext'
import { useTransports } from '../hooks/useTransports'

function FavoritesPage() {
  const { transports, loading: loadingTransports, error: transportsError } =
    useTransports()
  const { favoriteIds, loading: loadingFavorites, error: favoritesError } =
    useFavorites()

  if (loadingTransports || loadingFavorites) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-2xl font-semibold">Mis favoritos</h2>
        <p className="text-slate-600">Cargando favoritos...</p>
      </section>
    )
  }

  if (transportsError || favoritesError) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <h2 className="mb-2 text-2xl font-semibold text-red-900">Mis favoritos</h2>
        <p className="text-red-700">
          Error: {transportsError ?? favoritesError ?? 'Error desconocido'}
        </p>
      </section>
    )
  }

  const favoriteTransports = transports.filter((transport) =>
    favoriteIds.includes(transport.id),
  )

  if (favoriteTransports.length === 0) {
    return (
      <EmptyState
        title="Sin favoritos"
        description="Aún no has guardado trayectos. Marca el corazón en la pantalla de Trayectos."
      />
    )
  }

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-2xl font-semibold">Mis favoritos</h2>
        <p className="text-slate-600">
          Aquí tienes tus trayectos guardados para acceso rápido.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {favoriteTransports.map((transport) => (
          <TransportCard key={transport.id} transport={transport} />
        ))}
      </div>
    </section>
  )
}

export default FavoritesPage
