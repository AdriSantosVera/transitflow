import { useEffect, useState } from 'react'
import ItineraryTimeline, { buildItineraryItems } from '../components/ItineraryTimeline'
import EmptyState from '../components/EmptyState'
import { getPlaces } from '../api/places'
import { useTrips } from '../hooks/useTrips'
import type { Place } from '../types/place'

function ItineraryPage() {
  const { trips, loading, error } = useTrips()
  const [selectedTripId, setSelectedTripId] = useState('')
  const [places, setPlaces] = useState<Place[]>([])
  const [itineraryLoading, setItineraryLoading] = useState(true)
  const [itineraryError, setItineraryError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedTripId && trips[0]) {
      setSelectedTripId(trips[0].id)
    }
  }, [selectedTripId, trips])

  useEffect(() => {
    if (!selectedTripId) {
      setPlaces([])
      setItineraryLoading(false)
      return
    }

    let cancelled = false

    async function loadPlaces() {
      setItineraryLoading(true)
      setItineraryError(null)

      try {
        const nextPlaces = await getPlaces(selectedTripId)
        if (!cancelled) {
          setPlaces(nextPlaces)
        }
      } catch (loadError) {
        if (!cancelled) {
          setPlaces([])
          setItineraryError(
            loadError instanceof Error
              ? loadError.message
              : 'No se pudo cargar el itinerario.',
          )
        }
      } finally {
        if (!cancelled) {
          setItineraryLoading(false)
        }
      }
    }

    void loadPlaces()

    return () => {
      cancelled = true
    }
  }, [selectedTripId])

  if (loading) {
    return <section className="soft-panel p-6 text-slate-500">Cargando itinerario...</section>
  }

  if (error) {
    return <section className="soft-panel p-6 text-red-600">Error: {error}</section>
  }

  if (itineraryLoading) {
    return <section className="soft-panel p-6 text-slate-500">Cargando itinerario...</section>
  }

  if (itineraryError) {
    return <section className="soft-panel p-6 text-red-600">Error: {itineraryError}</section>
  }

  const selectedTrip = trips.find((trip) => trip.id === selectedTripId)
  const items = buildItineraryItems(selectedTrip, places)

  return (
    <section className="space-y-6">
      <div className="soft-panel p-6">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Itinerario</h2>
        <p className="mt-2 text-slate-500">
          Cambia de viaje y revisa la secuencia visual de dias y lugares.
        </p>
        <select
          value={selectedTripId}
          onChange={(event) => setSelectedTripId(event.target.value)}
          className="mt-4 w-full max-w-sm rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
        >
          {trips.map((trip) => (
            <option key={trip.id} value={trip.id}>
              {trip.name}
            </option>
          ))}
        </select>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Sin itinerario"
          description="Este viaje aun no tiene lugares suficientes para construir una linea temporal."
        />
      ) : (
        <ItineraryTimeline
          items={items}
          title={selectedTrip ? `Itinerario de ${selectedTrip.name}` : 'Itinerario'}
          subtitle="Vista horizontal del plan principal"
        />
      )}
    </section>
  )
}

export default ItineraryPage
