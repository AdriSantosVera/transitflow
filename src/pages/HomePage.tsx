import {
  Bell,
  Landmark,
  MapPinned,
  PiggyBank,
  WalletCards,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import DashboardMetricCard from '../components/DashboardMetricCard'
import EmptyState from '../components/EmptyState'
import ExpensesDonutChart from '../components/ExpensesDonutChart'
import ItineraryTimeline, { buildItineraryItems } from '../components/ItineraryTimeline'
import PlacesPanel from '../components/PlacesPanel'
import RecentNotesWidget from '../components/RecentNotesWidget'
import SavingsWidget from '../components/SavingsWidget'
import TripCard from '../components/TripCard'
import { getExpenses } from '../api/expenses'
import { getNotes } from '../api/notes'
import { getPlaces } from '../api/places'
import { getSavings } from '../api/savings'
import { useTrips } from '../hooks/useTrips'
import { useEffect, useMemo, useState } from 'react'
import type { Expense } from '../types/expense'
import type { Note } from '../types/note'
import type { Place } from '../types/place'
import type { Saving } from '../types/saving'

function currency(value: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

function HomePage() {
  const navigate = useNavigate()
  const { trips, loading, error } = useTrips()
  const [places, setPlaces] = useState<Place[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [savings, setSavings] = useState<Saving[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [dashboardError, setDashboardError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadDashboardData() {
      setDashboardLoading(true)
      setDashboardError(null)

      try {
        const [nextPlaces, nextExpenses, nextSavings, nextNotes] = await Promise.all([
          getPlaces(),
          getExpenses(),
          getSavings(),
          getNotes(),
        ])

        if (!cancelled) {
          setPlaces(nextPlaces)
          setExpenses(nextExpenses)
          setSavings(nextSavings)
          setNotes(nextNotes)
        }
      } catch (loadError) {
        if (!cancelled) {
          setPlaces([])
          setExpenses([])
          setSavings([])
          setNotes([])
          setDashboardError(
            loadError instanceof Error
              ? loadError.message
              : 'No se pudo cargar el resumen del dashboard.',
          )
        }
      } finally {
        if (!cancelled) {
          setDashboardLoading(false)
        }
      }
    }

    void loadDashboardData()

    return () => {
      cancelled = true
    }
  }, [])

  const primaryTrip = trips[0]
  const tripsById = useMemo(() => new Map(trips.map((trip) => [trip.id, trip])), [trips])
  const totalBudget = trips.reduce((total, trip) => total + trip.budget, 0)
  const totalSaved = savings.reduce((total, item) => total + item.amount, 0)
  const primaryTripSavings = savings
    .filter((item) => item.tripId === primaryTrip?.id)
    .reduce((total, item) => total + item.amount, 0)
  const expenseDistribution = useMemo(
    () =>
      expenses.reduce<Record<'transporte' | 'alojamiento' | 'comida' | 'ocio' | 'otros', number>>(
        (acc, expense) => {
          const key = expense.type in acc ? expense.type : 'otros'
          acc[key as keyof typeof acc] += expense.amount
          return acc
        },
        {
          transporte: 0,
          alojamiento: 0,
          comida: 0,
          ocio: 0,
          otros: 0,
        },
      ),
    [expenses],
  )
  const noteItems = notes.slice(0, 3).map((note) => ({
    id: note.id,
    text: `${tripsById.get(note.tripId)?.name ?? 'Viaje'} - ${note.text}`,
    date: note.createdAt,
  }))
  const itineraryItems = buildItineraryItems(
    primaryTrip,
    places.filter((place) => place.tripId === primaryTrip?.id),
  )

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[32px] border border-white/70 bg-white/68 p-6 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.22)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Lunes, 21 de abril</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            ¡Hola, Adrián! 👋
          </h2>
          <p className="mt-2 max-w-2xl text-slate-500">
            Aqui tienes una vista premium de tus viajes, presupuesto, ahorro y lugares clave.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <Bell className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-semibold text-white">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-950">Adrian</p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Perfil</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardMetricCard
          title="Viajes"
          value={String(trips.length)}
          detail="Planes activos y listos para revisar"
          icon={MapPinned}
          tone="violet"
        />
        <DashboardMetricCard
          title="Lugares guardados"
          value={dashboardLoading ? '...' : String(places.length)}
          detail="Puntos destacados ya seleccionados"
          icon={Landmark}
          tone="blue"
        />
        <DashboardMetricCard
          title="Presupuesto total"
          value={dashboardLoading ? '...' : currency(totalBudget)}
          detail="Suma prevista para los proximos viajes"
          icon={WalletCards}
          tone="orange"
        />
        <DashboardMetricCard
          title="Ahorrado"
          value={dashboardLoading ? '...' : currency(totalSaved)}
          detail="Capital acumulado para cumplir objetivos"
          icon={PiggyBank}
          tone="green"
        />
      </div>

      {dashboardError ? (
        <section className="soft-panel border-red-100 bg-red-50/80 p-6">
          <h3 className="text-lg font-semibold text-red-900">No se pudo cargar el resumen</h3>
          <p className="mt-2 text-sm text-red-700">{dashboardError}</p>
        </section>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section id="viajes" className="soft-panel p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-slate-950">Mis viajes</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Tarjetas visuales con presupuesto, progreso y detalles clave
                </p>
              </div>
              <Link
                to="/trips"
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-[0_18px_32px_-16px_rgba(15,23,42,0.6)] transition-all duration-300 hover:-translate-y-0.5"
              >
                Ver todos
              </Link>
            </div>

            {loading ? (
              <p className="text-slate-500">Cargando viajes...</p>
            ) : error ? (
              <p className="text-red-600">Error al cargar viajes: {error}</p>
            ) : trips.length === 0 ? (
              <EmptyState
                title="Sin viajes"
                description="Todavia no hay viajes cargados en la aplicacion."
              />
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">
                {trips.slice(0, 2).map((trip) => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            )}
          </section>

          <ItineraryTimeline items={itineraryItems} actionHref="/itinerary" />
          <PlacesPanel places={places} tripsById={tripsById} limit={3} actionHref="/places" />
        </div>

        <div className="space-y-6">
          <div id="ahorro">
            <SavingsWidget
              saved={primaryTripSavings}
              target={primaryTrip?.budget ?? 0}
              onAddClick={() => navigate('/savings')}
              actionLabel="Ir a ahorro"
            />
          </div>
          <div id="presupuesto">
            <ExpensesDonutChart values={expenseDistribution} />
          </div>
          <div id="notas">
            <RecentNotesWidget notes={noteItems} actionHref="/notes" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomePage
