import { Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState'
import TripCard from '../components/TripCard'
import { useTrips } from '../hooks/useTrips'

function TripsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const { trips, loading, error } = useTrips()

  const filteredTrips = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return trips.filter((trip) => {
      const matchSearch =
        query.length === 0 ||
        trip.name.toLowerCase().includes(query) ||
        trip.destination.toLowerCase().includes(query) ||
        String(trip.budget).includes(query)

      return matchSearch
    })
  }, [searchTerm, trips])

  if (loading) {
    return (
      <section className="soft-panel p-6">
        <h2 className="mb-2 text-2xl font-semibold text-slate-950 dark:text-white">Listado de viajes</h2>
        <p className="text-slate-500 dark:text-slate-400">Cargando planes guardados...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="soft-panel border-red-100 bg-red-50/80 p-6 dark:border-red-500/20 dark:bg-red-950/30">
        <h2 className="mb-2 text-2xl font-semibold text-red-900">Listado de viajes</h2>
        <p className="text-red-700">Error al cargar viajes: {error}</p>
      </section>
    )
  }

  if (trips.length === 0) {
    return (
      <EmptyState
        title="Sin viajes disponibles"
        description="Todavia no hay planes creados en el sistema."
      />
    )
  }

  return (
    <section className="space-y-6">
      <div className="soft-panel p-6 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Biblioteca de viajes</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Mis viajes
            </h2>
            <p className="mt-2 max-w-2xl text-slate-500 dark:text-slate-400">
              Revisa destinos, presupuesto previsto y el avance de ahorro en una vista clara.
            </p>
          </div>

          <label className="block w-full max-w-md">
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Buscar viaje</span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Ej. Ibiza, Paris, 1200..."
                className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
              />
            </span>
          </label>
        </div>
      </div>

      {filteredTrips.length === 0 ? (
        <EmptyState
          title="No hay resultados"
          description="Prueba con otro destino, nombre de viaje o presupuesto."
        />
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </section>
  )
}

export default TripsPage
