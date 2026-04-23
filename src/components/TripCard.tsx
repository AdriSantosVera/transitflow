import { BedDouble, Heart, Plane, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Trip } from '../types/trip'
import { useFavorites } from '../context/FavoritesContext'

interface TripCardProps {
  trip: Trip
}

function formatDateRange(startDate: string, endDate: string) {
  const formatter = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
  })

  return `${formatter.format(new Date(startDate))} - ${formatter.format(new Date(endDate))}`
}

function TripCard({ trip }: TripCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const navigate = useNavigate()
  const favorite = isFavorite(trip.id)
  const spendingPercentage =
    trip.budget > 0 ? Math.min(100, Math.round((trip.totalExpenses / trip.budget) * 100)) : 0
  const savingsPercentage =
    trip.budget > 0 ? Math.min(100, Math.round((trip.totalSavings / trip.budget) * 100)) : 0

  function openTrip() {
    void navigate(`/trips/${trip.id}`)
  }

  return (
    <article
      className="group widget-card cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.015] hover:shadow-[0_28px_54px_-26px_rgba(15,23,42,0.32)]"
      onClick={openTrip}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          openTrip()
        }
      }}
      role="link"
      tabIndex={0}
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={
            trip.image ||
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80'
          }
          alt={trip.name}
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
        <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-xl">
          <Plane className="h-3.5 w-3.5" />
          Escapada premium
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
          <div>
            <p className="text-sm font-medium text-white/70">Plan de viaje</p>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight text-white">{trip.name}</h3>
            <p className="mt-1 text-sm text-white/80">{trip.destination}</p>
          </div>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              void toggleFavorite(trip.id)
            }}
            className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border text-sm font-medium transition-all duration-300 ${
              favorite
                ? 'border-rose-200/60 bg-white text-rose-600'
                : 'border-white/20 bg-white/10 text-white backdrop-blur-xl hover:bg-white/15'
            }`}
            aria-pressed={favorite}
          >
            <Heart className={`h-4.5 w-4.5 ${favorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {savingsPercentage}% del objetivo
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-100">
              <Plane className="h-4 w-4" />
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-100">
              <BedDouble className="h-4 w-4" />
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-slate-100">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 rounded-3xl bg-slate-50 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Fechas
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {formatDateRange(trip.startDate, trip.endDate)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Presupuesto
            </p>
            <p className="mt-1 text-base font-semibold text-slate-900">
              {new Intl.NumberFormat('es-ES', {
                style: 'currency',
                currency: 'EUR',
                maximumFractionDigits: 0,
              }).format(trip.budget)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              <span>Ahorro acumulado</span>
              <span>{savingsPercentage}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-slate-100">
              <div
                className="h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                style={{ width: `${savingsPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-3xl border border-slate-200/80 bg-white px-4 py-4 text-sm text-slate-700">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Gastado
              </span>
              <span className="mt-1 block font-semibold text-slate-900">
                {new Intl.NumberFormat('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0,
                }).format(trip.totalExpenses)}
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ahorrado
              </span>
              <span className="mt-1 block font-semibold text-slate-900">
                {new Intl.NumberFormat('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0,
                }).format(trip.totalSavings)}
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            Gasto actual:{' '}
            <span className="font-semibold text-slate-950">{spendingPercentage}%</span> del
            presupuesto total.
          </p>
        </div>
      </div>
    </article>
  )
}

export default TripCard
