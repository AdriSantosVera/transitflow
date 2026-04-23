import { useEffect, useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState'
import PlacesPanel from '../components/PlacesPanel'
import { getPlaces } from '../api/places'
import { useTrips } from '../hooks/useTrips'
import type { Place } from '../types/place'

function PlacesPage() {
  const { trips, loading, error } = useTrips()
  const [selectedTripId, setSelectedTripId] = useState('')
  const [places, setPlaces] = useState<Place[]>([])
  const [placesLoading, setPlacesLoading] = useState(true)
  const [placesError, setPlacesError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedTripId && trips[0]) {
      setSelectedTripId(trips[0].id)
    }
  }, [selectedTripId, trips])

  useEffect(() => {
    let cancelled = false

    async function loadPlaces() {
      setPlacesLoading(true)
      setPlacesError(null)

      try {
        const nextPlaces = await getPlaces(selectedTripId || undefined)
        if (!cancelled) {
          setPlaces(nextPlaces)
        }
      } catch (loadError) {
        if (!cancelled) {
          setPlaces([])
          setPlacesError(
            loadError instanceof Error ? loadError.message : 'No se pudieron cargar los lugares.',
          )
        }
      } finally {
        if (!cancelled) {
          setPlacesLoading(false)
        }
      }
    }

    void loadPlaces()

    return () => {
      cancelled = true
    }
  }, [selectedTripId])

  const tripsById = useMemo(() => new Map(trips.map((trip) => [trip.id, trip])), [trips])

  if (loading) {
    return <section className="soft-panel p-6 text-slate-500 dark:text-slate-400">Cargando lugares...</section>
  }

  if (error) {
    return <section className="soft-panel p-6 text-red-600">Error: {error}</section>
  }

  if (placesLoading) {
    return <section className="soft-panel p-6 text-slate-500 dark:text-slate-400">Cargando lugares...</section>
  }

  if (placesError) {
    return <section className="soft-panel p-6 text-red-600">Error: {placesError}</section>
  }

  return (
    <section className="space-y-6">
      <div className="soft-panel p-6">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Lugares</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Filtra por viaje y revisa los lugares guardados con sus notas asociadas.
        </p>
        <select
          value={selectedTripId}
          onChange={(event) => setSelectedTripId(event.target.value)}
          className="mt-4 w-full max-w-sm rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
        >
          <option value="">Todos los viajes</option>
          {trips.map((trip) => (
            <option key={trip.id} value={trip.id}>
              {trip.name}
            </option>
          ))}
        </select>
      </div>

      {places.length === 0 ? (
        <EmptyState
          title="Sin lugares"
          description="No hay lugares guardados para el filtro actual."
        />
      ) : (
        <PlacesPanel places={places} tripsById={tripsById} />
      )}
    </section>
  )
}

export default PlacesPage
