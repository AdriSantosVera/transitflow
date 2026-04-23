import { Link } from 'react-router-dom'
import { MapPin, Sparkles } from 'lucide-react'
import type { Place } from '../types/place'
import type { Trip } from '../types/trip'

interface PlacesPanelProps {
  places: Place[]
  tripsById: Map<string, Trip>
  limit?: number
  actionHref?: string
  actionLabel?: string
}

function PlacesPanel({
  places,
  tripsById,
  limit,
  actionHref,
  actionLabel = 'Ver todos',
}: PlacesPanelProps) {
  const visiblePlaces = typeof limit === 'number' ? places.slice(0, limit) : places

  return (
    <section id="lugares" className="soft-panel p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-slate-950">Lugares favoritos</h3>
          <p className="mt-1 text-sm text-slate-400">
            Espacios destacados para cada viaje en curso
          </p>
        </div>
        {actionHref ? (
          <Link
            to={actionHref}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700"
          >
            <Sparkles className="h-4 w-4" />
            {actionLabel}
          </Link>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700">
            <Sparkles className="h-4 w-4" />
            Curado para ti
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visiblePlaces.map((place) => (
          <article
            key={place.id}
            className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.24)] transition-all duration-300 hover:-translate-y-1"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-sky-100 text-indigo-700">
              <MapPin className="h-5 w-5" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {place.category}
            </p>
            <h4 className="mt-2 text-lg font-semibold text-slate-950">{place.name}</h4>
            <p className="mt-2 text-sm text-slate-500">{place.notes}</p>
            <div className="mt-4 rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
              {tripsById.get(place.tripId)?.name ?? 'Viaje sin asignar'}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default PlacesPanel
