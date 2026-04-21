import type { Transport } from '../types/transport'
import { useFavorites } from '../context/FavoritesContext'
import { formatTime } from '../utils/formatTime'

interface TransportCardProps {
  transport: Transport
}

const statusLabel: Record<Transport['status'], string> = {
  on_time: 'En hora',
  delayed: 'Retrasado',
  boarding: 'Embarcando',
}

const statusClass: Record<Transport['status'], string> = {
  on_time: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  delayed: 'bg-amber-50 text-amber-700 border-amber-200',
  boarding: 'bg-sky-50 text-sky-700 border-sky-200',
}

const typeLabel: Record<Transport['type'], string> = {
  bus: 'Bus',
  train: 'Tren',
  metro: 'Metro',
  flight: 'Vuelo',
}

const typeIcon: Record<Transport['type'], string> = {
  bus: '🚌',
  train: '🚆',
  metro: 'Ⓜ️',
  flight: '✈️',
}

const referenceLabel: Record<Transport['type'], string> = {
  bus: 'Parada',
  train: 'Andén',
  metro: 'Andén',
  flight: 'Puerta',
}

function TransportCard({ transport }: TransportCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(transport.id)

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-lg">
            {typeIcon[transport.type]}
          </span>
          <div>
            <p className="text-sm font-medium text-slate-500">
              {typeLabel[transport.type]}
            </p>
            <h3 className="text-lg font-semibold text-slate-900">
              {transport.origin} → {transport.destination}
            </h3>
            <p className="mt-0.5 text-sm text-slate-600">{transport.company}</p>
          </div>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass[transport.status]}`}
        >
          {statusLabel[transport.status]}
        </span>
      </header>

      <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Salida
          </p>
          <p className="mt-1 text-base font-semibold text-slate-900">
            {formatTime(transport.scheduledTime)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Llegada estimada
          </p>
          <p className="mt-1 text-base font-semibold text-slate-900">
            {formatTime(transport.estimatedTime)}
          </p>
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
        <span className="font-semibold text-slate-900">
          {referenceLabel[transport.type]}:
        </span>{' '}
        {transport.locationLabel}
      </div>

      <footer className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
        <button
          type="button"
          onClick={() => void toggleFavorite(transport.id)}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
            favorite
              ? 'border-rose-200 bg-rose-50 text-rose-700'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
          aria-pressed={favorite}
        >
          <span aria-hidden="true">{favorite ? '♥' : '♡'}</span>
          {favorite ? 'Favorito' : 'Guardar'}
        </button>
      </footer>
    </article>
  )
}

export default TransportCard
