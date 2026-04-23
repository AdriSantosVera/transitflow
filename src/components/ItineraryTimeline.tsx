import { Link } from 'react-router-dom'
import type { Place } from '../types/place'
import type { Trip } from '../types/trip'

interface ItineraryItem {
  id: string
  dayLabel: string
  placeName: string
  description: string
  image?: string
}

interface ItineraryTimelineProps {
  items: ItineraryItem[]
  title?: string
  subtitle?: string
  actionHref?: string
  actionLabel?: string
}

function ItineraryTimeline({
  items,
  title = 'Proximo itinerario',
  subtitle = 'Vista rapida por dias para el viaje principal',
  actionHref,
  actionLabel = 'Ver todo',
}: ItineraryTimelineProps) {
  return (
    <section id="itinerario" className="soft-panel p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-slate-950 dark:text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{subtitle}</p>
        </div>
        {actionHref ? (
          <Link to={actionHref} className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            {actionLabel}
          </Link>
        ) : null}
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-4 pb-2">
          {items.map((item, index) => (
            <article
              key={item.id}
              className="relative w-[240px] rounded-[28px] border border-slate-200/80 bg-white p-4 shadow-[0_14px_32px_-22px_rgba(15,23,42,0.24)] transition-all duration-300 hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-800/90 dark:shadow-[0_18px_38px_-24px_rgba(2,6,23,0.95)]"
            >
              {index < items.length - 1 ? (
                <span className="absolute top-11 left-[calc(100%-4px)] h-px w-6 bg-gradient-to-r from-indigo-200 to-transparent" />
              ) : null}
              <div className="relative mb-4 h-32 overflow-hidden rounded-2xl">
                <img
                  src={
                    item.image ||
                    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80'
                  }
                  alt={item.placeName}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                <div className="absolute right-3 bottom-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 dark:bg-slate-900/85 dark:text-white">
                  {item.dayLabel}
                </div>
              </div>
              <h4 className="text-lg font-semibold text-slate-950 dark:text-white">{item.placeName}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function buildItineraryItems(trip: Trip | undefined, places: Place[]) {
  if (!trip) {
    return []
  }

  return places.slice(0, 4).map((place, index) => ({
    id: place.id,
    dayLabel: `Dia ${index + 1}`,
    placeName: place.name,
    description: place.notes,
    image: trip.image,
  }))
}

export default ItineraryTimeline
