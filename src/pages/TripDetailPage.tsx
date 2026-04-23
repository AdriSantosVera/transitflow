import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  MapPin,
  Pencil,
  PiggyBank,
  Plus,
  StickyNote,
  Trash2,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AddExpenseModal from '../components/AddExpenseModal'
import AddNoteModal from '../components/AddNoteModal'
import AddPlaceModal from '../components/AddPlaceModal'
import AddSavingModal from '../components/AddSavingModal'
import EditTripModal from '../components/EditTripModal'
import EmptyState from '../components/EmptyState'
import ExpensesDonutChart from '../components/ExpensesDonutChart'
import ItineraryTimeline, { buildItineraryItems } from '../components/ItineraryTimeline'
import SavingsWidget from '../components/SavingsWidget'
import { createExpense, deleteExpense, getExpenses, updateExpense } from '../api/expenses'
import { createNote, deleteNote, getNotes, updateNote } from '../api/notes'
import { createPlace, deletePlace, getPlaces, updatePlace } from '../api/places'
import { createSaving, getSavings } from '../api/savings'
import { deleteTrip, getTripById, updateTrip } from '../api/trips'
import { useToast } from '../context/ToastContext'
import type { Expense } from '../types/expense'
import type { Note } from '../types/note'
import type { Place } from '../types/place'
import type { Saving } from '../types/saving'
import type { Trip } from '../types/trip'

function currency(value: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

function buildTripDayCards(startDate: string, endDate: string, places: Place[]) {
  const dates: string[] = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  const current = new Date(start)

  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10))
    current.setDate(current.getDate() + 1)
  }

  return dates.map((date, index) => ({
    id: `${date}-${index}`,
    dayLabel: `Dia ${index + 1}`,
    dateLabel: new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
    }).format(new Date(date)),
    placeName: places[index]?.name ?? 'Dia libre',
    description: places[index]?.notes || 'Jornada reservada para organizar el plan.',
  }))
}

function TripDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [places, setPlaces] = useState<Place[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [savings, setSavings] = useState<Saving[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isTripEditOpen, setIsTripEditOpen] = useState(false)
  const [isSavingFormOpen, setIsSavingFormOpen] = useState(false)
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false)
  const [isPlaceFormOpen, setIsPlaceFormOpen] = useState(false)
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false)
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [editingPlace, setEditingPlace] = useState<Place | null>(null)
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  async function refreshTripDetail(tripId: string) {
    const [nextTrip, nextPlaces, nextExpenses, nextSavings, nextNotes] = await Promise.all([
      getTripById(tripId),
      getPlaces(tripId),
      getExpenses(tripId),
      getSavings(tripId),
      getNotes(tripId),
    ])

    setTrip(nextTrip)
    setPlaces(nextPlaces)
    setExpenses(nextExpenses)
    setSavings(nextSavings)
    setNotes(nextNotes)
  }

  useEffect(() => {
    if (!id) {
      setLoading(false)
      setError('Viaje no encontrado.')
      return
    }

    const tripId = id

    let cancelled = false

    async function loadTripDetail() {
      setLoading(true)
      setError(null)

      try {
        if (!cancelled) {
          await refreshTripDetail(tripId)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error ? loadError.message : 'No se pudo cargar el viaje.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadTripDetail()

    return () => {
      cancelled = true
    }
  }, [id])

  const totalExpenses = expenses.reduce((total, item) => total + item.amount, 0)
  const totalSavings = savings.reduce((total, item) => total + item.amount, 0)
  const progress = trip?.budget ? Math.min(100, Math.round((totalSavings / trip.budget) * 100)) : 0
  const itineraryItems = buildItineraryItems(trip ?? undefined, places)
  const dayCards = trip ? buildTripDayCards(trip.startDate, trip.endDate, places) : []
  const expenseDistribution = expenses.reduce<
    Record<'transporte' | 'alojamiento' | 'comida' | 'ocio' | 'otros', number>
  >(
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
  )
  const combinedNotes = useMemo(() => notes, [notes])

  async function handleExpenseSubmit(input: {
    type: Expense['type']
    amount: number
  }) {
    if (!trip) {
      return
    }

    try {
      await createExpense({
        tripId: trip.id,
        type: input.type,
        amount: input.amount,
      })
      await refreshTripDetail(trip.id)
      showToast('Gasto añadido')
    } catch (submitError) {
      throw (submitError instanceof Error
        ? submitError
        : new Error('No se pudo crear el gasto.'))
    }
  }

  async function handleSavingSubmit(input: { amount: number; date: string }) {
    if (!trip) {
      return
    }

    try {
      await createSaving({
        tripId: trip.id,
        amount: input.amount,
        date: input.date,
      })
      await refreshTripDetail(trip.id)
      showToast('Ahorro actualizado')
    } catch (submitError) {
      throw (submitError instanceof Error
        ? submitError
        : new Error('No se pudo registrar el ahorro.'))
    }
  }

  async function handlePlaceSubmit(input: {
    name: string
    category: string
    notes: string
  }) {
    if (!trip) {
      return
    }

    try {
      const nextPlace = await createPlace({
        tripId: trip.id,
        name: input.name,
        category: input.category,
        notes: input.notes,
      })
      await refreshTripDetail(trip.id)
      setSelectedPlaceId(nextPlace.id)
      showToast('Lugar añadido')
    } catch (submitError) {
      throw (submitError instanceof Error
        ? submitError
        : new Error('No se pudo crear el lugar.'))
    }
  }

  async function handleNoteSubmit(input: { text: string }) {
    if (!trip) {
      return
    }

    await createNote({
      tripId: trip.id,
      text: input.text,
      createdAt: new Date().toISOString().slice(0, 10),
    })

    await refreshTripDetail(trip.id)
    showToast('Nota añadida')
  }

  async function handleTripUpdate(input: {
    name: string
    destination: string
    startDate: string
    endDate: string
    budget: number
    image?: string
  }) {
    if (!trip) {
      return
    }

    await updateTrip(trip.id, input)
    await refreshTripDetail(trip.id)
    showToast('Viaje actualizado')
  }

  async function handleTripDelete() {
    if (!trip) {
      return
    }

    if (!window.confirm('Se eliminará el viaje y todos sus datos asociados.')) {
      return
    }

    try {
      await deleteTrip(trip.id)
      showToast('Viaje eliminado')
      navigate('/trips')
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'No se pudo eliminar el viaje.',
      )
      showToast('No se pudo eliminar el viaje')
    }
  }

  async function handleExpenseUpdate(input: { type: Expense['type']; amount: number }) {
    if (!trip || !editingExpense) {
      return
    }

    await updateExpense(editingExpense.id, input)
    await refreshTripDetail(trip.id)
    setEditingExpense(null)
    showToast('Gasto actualizado')
  }

  async function handleExpenseDelete(expenseId: string) {
    if (!trip || !window.confirm('Se eliminará este gasto.')) {
      return
    }

    await deleteExpense(expenseId)
    await refreshTripDetail(trip.id)
    showToast('Gasto eliminado')
  }

  async function handlePlaceUpdate(input: { name: string; category: string; notes: string }) {
    if (!trip || !editingPlace) {
      return
    }

    await updatePlace(editingPlace.id, input)
    await refreshTripDetail(trip.id)
    setEditingPlace(null)
    showToast('Lugar actualizado')
  }

  async function handlePlaceDelete(placeId: string) {
    if (!trip || !window.confirm('Se eliminará este lugar.')) {
      return
    }

    await deletePlace(placeId)
    await refreshTripDetail(trip.id)
    if (selectedPlaceId === placeId) {
      setSelectedPlaceId(null)
    }
    showToast('Lugar eliminado')
  }

  async function handleNoteUpdate(input: { text: string }) {
    if (!trip || !editingNote) {
      return
    }

    await updateNote(editingNote.id, {
      text: input.text,
      createdAt: editingNote.createdAt,
    })
    await refreshTripDetail(trip.id)
    setEditingNote(null)
    showToast('Nota actualizada')
  }

  async function handleNoteDelete(noteId: string) {
    if (!trip || !window.confirm('Se eliminará esta nota.')) {
      return
    }

    await deleteNote(noteId)
    await refreshTripDetail(trip.id)
    showToast('Nota eliminada')
  }

  if (loading) {
    return (
      <section className="soft-panel p-6">
        <p className="text-slate-500">Cargando detalle del viaje...</p>
      </section>
    )
  }

  if (error || !trip) {
    return (
      <EmptyState
        title="Viaje no disponible"
        description={error ?? 'No se encontro el detalle solicitado.'}
      />
    )
  }

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-[0_18px_44px_-24px_rgba(15,23,42,0.24)]">
        <div className="relative h-72 overflow-hidden">
          <img
            src={
              trip.image ||
              'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
            }
            alt={trip.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
          <div className="absolute inset-x-0 top-0 flex justify-between p-6">
            <Link
              to="/trips"
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-xl"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a viajes
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsTripEditOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-xl"
              >
                <Pencil className="h-4 w-4" />
                Editar
              </button>
              <button
                type="button"
                onClick={handleTripDelete}
                className="inline-flex items-center gap-2 rounded-full bg-red-500/85 px-4 py-2 text-sm font-medium text-white backdrop-blur-xl"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </button>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <p className="text-sm font-medium text-white/70">Detalle del viaje</p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight">{trip.name}</h2>
            <p className="mt-2 text-sm text-white/80">{trip.destination}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="widget-card p-5">
          <CalendarDays className="h-5 w-5 text-indigo-500" />
          <p className="mt-4 text-sm font-medium text-slate-500">Fechas</p>
          <p className="mt-1 text-xl font-semibold text-slate-950">
            {trip.startDate} - {trip.endDate}
          </p>
        </article>
        <article className="widget-card p-5">
          <CreditCard className="h-5 w-5 text-orange-500" />
          <p className="mt-4 text-sm font-medium text-slate-500">Presupuesto</p>
          <p className="mt-1 text-xl font-semibold text-slate-950">{currency(trip.budget)}</p>
        </article>
        <article className="widget-card p-5">
          <PiggyBank className="h-5 w-5 text-emerald-500" />
          <p className="mt-4 text-sm font-medium text-slate-500">Progreso de ahorro</p>
          <p className="mt-1 text-xl font-semibold text-slate-950">{progress}%</p>
        </article>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <ItineraryTimeline
            items={itineraryItems}
            title="Itinerario basico"
            subtitle="Secuencia principal del viaje segun los lugares guardados"
          />

          <section className="soft-panel p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-orange-500" />
                <div>
                  <h3 className="text-2xl font-semibold text-slate-950">Gastos</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Control del gasto real filtrado por este viaje
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsExpenseFormOpen((current) => !current)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition-all duration-300 ${
                  isExpenseFormOpen ? 'bg-orange-600 shadow-[0_18px_32px_-18px_rgba(249,115,22,0.7)]' : 'bg-slate-950 hover:bg-slate-900'
                }`}
              >
                <Plus className="h-4 w-4" />
                Agregar gasto
              </button>
            </div>

            <div className="mb-4 rounded-3xl bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Total gastado
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">
                {currency(totalExpenses)}
              </p>
            </div>

            <div className="space-y-3">
              {expenses.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-5">
                  <p className="text-sm text-slate-500">Todavia no hay gastos registrados.</p>
                  <button
                    type="button"
                    onClick={() => setIsExpenseFormOpen(true)}
                    className="mt-3 rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white"
                  >
                    Agregar gasto
                  </button>
                </div>
              ) : (
                expenses.map((expense) => (
                  <article
                    key={expense.id}
                    className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-4 py-3"
                  >
                    <div>
                      <span className="text-sm font-medium capitalize text-slate-700">
                        {expense.type}
                      </span>
                      <p className="mt-1 text-sm font-semibold text-slate-950">
                        {currency(expense.amount)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingExpense(expense)
                          setIsExpenseFormOpen(true)
                        }}
                        className="rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:text-slate-950"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleExpenseDelete(expense.id)}
                        className="rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="soft-panel p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-indigo-500" />
                <div>
                  <h3 className="text-2xl font-semibold text-slate-950">Lugares</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Lista de lugares guardados y categoria del viaje
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPlaceFormOpen((current) => !current)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition-all duration-300 ${
                  isPlaceFormOpen ? 'bg-indigo-600 shadow-[0_18px_32px_-18px_rgba(79,70,229,0.7)]' : 'bg-slate-950 hover:bg-slate-900'
                }`}
              >
                <Plus className="h-4 w-4" />
                Añadir lugar
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {places.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-5">
                  <p className="text-sm text-slate-500">Todavia no hay lugares registrados.</p>
                  <button
                    type="button"
                    onClick={() => setIsPlaceFormOpen(true)}
                    className="mt-3 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                  >
                    Añadir lugar
                  </button>
                </div>
              ) : (
                places.map((place) => (
                  <button
                    key={place.id}
                    type="button"
                    onClick={() => setSelectedPlaceId(place.id)}
                    className={`rounded-2xl border bg-white p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_34px_-22px_rgba(15,23,42,0.28)] ${
                      selectedPlaceId === place.id
                        ? 'border-indigo-300 shadow-[0_18px_34px_-22px_rgba(79,70,229,0.35)]'
                        : 'border-slate-200/80'
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {place.category}
                    </p>
                    <h4 className="mt-2 text-lg font-semibold text-slate-950">{place.name}</h4>
                    <p className="mt-2 text-sm text-slate-500">{place.notes || 'Sin notas.'}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          setEditingPlace(place)
                          setIsPlaceFormOpen(true)
                        }}
                        className="rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:text-slate-950"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          void handlePlaceDelete(place.id)
                        }}
                        className="rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </button>
                ))
              )}
            </div>
          </section>

          <section className="soft-panel p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <StickyNote className="h-5 w-5 text-indigo-500" />
                <div>
                  <h3 className="text-2xl font-semibold text-slate-950">Notas</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Notas del viaje y apuntes asociados a lugares
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNoteFormOpen((current) => !current)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition-all duration-300 ${
                  isNoteFormOpen ? 'bg-indigo-600 shadow-[0_18px_32px_-18px_rgba(79,70,229,0.7)]' : 'bg-slate-950 hover:bg-slate-900'
                }`}
              >
                <Plus className="h-4 w-4" />
                Agregar nota
              </button>
            </div>

            <div className="space-y-3">
              {combinedNotes.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-5">
                  <p className="text-sm text-slate-500">Todavia no hay notas disponibles.</p>
                  <button
                    type="button"
                    onClick={() => setIsNoteFormOpen(true)}
                    className="mt-3 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                  >
                    Agregar nota
                  </button>
                </div>
              ) : (
                combinedNotes.map((note) => (
                  <article key={note.id} className="rounded-2xl border border-slate-200/80 bg-white p-4">
                    <p className="text-sm leading-6 text-slate-600">{note.text}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      {note.createdAt}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingNote(note)
                          setIsNoteFormOpen(true)
                        }}
                        className="rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:text-slate-950"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleNoteDelete(note.id)}
                        className="rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="soft-panel p-6">
            <div className="mb-4 flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-indigo-500" />
              <h3 className="text-2xl font-semibold text-slate-950">Dias del viaje</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {dayCards.map((day) => (
                <article key={day.id} className="rounded-3xl border border-slate-200/80 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    {day.dayLabel}
                  </p>
                  <h4 className="mt-2 text-lg font-semibold text-slate-950">{day.placeName}</h4>
                  <p className="mt-1 text-sm font-medium text-slate-400">{day.dateLabel}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{day.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="soft-panel p-6">
            <div className="mb-4 flex items-center gap-3">
              <MapPin className="h-5 w-5 text-indigo-500" />
              <h3 className="text-2xl font-semibold text-slate-950">Resumen general</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Gastado
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {currency(totalExpenses)}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Ahorrado
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {currency(totalSavings)}
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <SavingsWidget
            saved={totalSavings}
            target={trip.budget}
            onAddClick={() => setIsSavingFormOpen(true)}
          />
          <ExpensesDonutChart values={expenseDistribution} />
          <section className="widget-card p-6">
            <div className="flex items-center gap-3">
              <StickyNote className="h-5 w-5 text-indigo-500" />
              <h3 className="text-lg font-semibold text-slate-950">Estado del viaje</h3>
            </div>
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Lugares
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{places.length}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Notas
                </p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">
                  {combinedNotes.length}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <AddExpenseModal
        isOpen={isExpenseFormOpen}
        onClose={() => {
          setIsExpenseFormOpen(false)
          setEditingExpense(null)
        }}
        onSubmit={editingExpense ? handleExpenseUpdate : handleExpenseSubmit}
        initialValues={
          editingExpense
            ? { type: editingExpense.type, amount: editingExpense.amount }
            : undefined
        }
        title={editingExpense ? 'Editar gasto' : 'Añadir gasto'}
        description={
          editingExpense
            ? 'Actualiza el importe o la categoria del gasto.'
            : 'Registra un nuevo movimiento para este viaje.'
        }
        submitLabel={editingExpense ? 'Guardar cambios' : 'Guardar gasto'}
      />
      <AddSavingModal
        isOpen={isSavingFormOpen}
        onClose={() => setIsSavingFormOpen(false)}
        onSubmit={handleSavingSubmit}
      />
      <AddPlaceModal
        isOpen={isPlaceFormOpen}
        onClose={() => {
          setIsPlaceFormOpen(false)
          setEditingPlace(null)
        }}
        onSubmit={editingPlace ? handlePlaceUpdate : handlePlaceSubmit}
        initialValues={
          editingPlace
            ? {
                name: editingPlace.name,
                category: editingPlace.category,
                notes: editingPlace.notes,
              }
            : undefined
        }
        title={editingPlace ? 'Editar lugar' : 'Añadir lugar'}
        description={
          editingPlace
            ? 'Ajusta nombre, categoria o notas del lugar.'
            : 'Guarda un nuevo punto del viaje con categoria y nota.'
        }
        submitLabel={editingPlace ? 'Guardar cambios' : 'Guardar lugar'}
      />
      <AddNoteModal
        isOpen={isNoteFormOpen}
        onClose={() => {
          setIsNoteFormOpen(false)
          setEditingNote(null)
        }}
        onSubmit={editingNote ? handleNoteUpdate : handleNoteSubmit}
        initialValues={editingNote ? { text: editingNote.text } : undefined}
        title={editingNote ? 'Editar nota' : 'Añadir nota'}
        description={
          editingNote
            ? 'Actualiza el contenido de la nota seleccionada.'
            : 'Guarda un recordatorio o detalle rapido del viaje.'
        }
        submitLabel={editingNote ? 'Guardar cambios' : 'Guardar nota'}
      />
      <EditTripModal
        isOpen={isTripEditOpen}
        onClose={() => setIsTripEditOpen(false)}
        trip={trip}
        onSubmit={handleTripUpdate}
      />
    </section>
  )
}

export default TripDetailPage
