import { useEffect, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import AddSavingModal from '../components/AddSavingModal'
import EmptyState from '../components/EmptyState'
import SavingsWidget from '../components/SavingsWidget'
import { createSaving, deleteSaving, getSavings, updateSaving } from '../api/savings'
import { useToast } from '../context/ToastContext'
import { useTrips } from '../hooks/useTrips'
import type { Saving } from '../types/saving'

function currency(value: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

function SavingsPage() {
  const { showToast } = useToast()
  const { trips, loading, error, reloadTrips } = useTrips()
  const [selectedTripId, setSelectedTripId] = useState('')
  const [savings, setSavings] = useState<Saving[]>([])
  const [isSavingModalOpen, setIsSavingModalOpen] = useState(false)
  const [editingSaving, setEditingSaving] = useState<Saving | null>(null)

  useEffect(() => {
    if (!selectedTripId && trips[0]) {
      setSelectedTripId(trips[0].id)
    }
  }, [selectedTripId, trips])

  useEffect(() => {
    if (!selectedTripId) {
      setSavings([])
      return
    }

    let cancelled = false

    async function loadSavings() {
      const nextSavings = await getSavings(selectedTripId)
      if (!cancelled) {
        setSavings(nextSavings)
      }
    }

    void loadSavings()

    return () => {
      cancelled = true
    }
  }, [selectedTripId])

  const selectedTrip = trips.find((trip) => trip.id === selectedTripId)
  const totalSaved = savings.reduce((sum, saving) => sum + saving.amount, 0)

  async function handleSavingSubmit(input: { amount: number; date: string }) {
    if (!selectedTrip) {
      throw new Error('Selecciona un viaje antes de guardar ahorro.')
    }

    if (editingSaving) {
      await updateSaving(editingSaving.id, input)
    } else {
      await createSaving({
        tripId: selectedTrip.id,
        amount: input.amount,
        date: input.date,
      })
    }

    const refreshedSavings = await getSavings(selectedTrip.id)
    setSavings(refreshedSavings)
    setEditingSaving(null)
    void reloadTrips()
    showToast(editingSaving ? 'Ahorro actualizado' : 'Ahorro añadido')
  }

  async function handleSavingDelete(savingId: string) {
    if (!selectedTrip || !window.confirm('Se eliminará este movimiento de ahorro.')) {
      return
    }

    await deleteSaving(savingId)
    const refreshedSavings = await getSavings(selectedTrip.id)
    setSavings(refreshedSavings)
    void reloadTrips()
    showToast('Ahorro eliminado')
  }

  if (loading) {
    return <section className="soft-panel p-6 text-slate-500 dark:text-slate-400">Cargando ahorro...</section>
  }

  if (error) {
    return <section className="soft-panel p-6 text-red-600">Error: {error}</section>
  }

  return (
    <section className="space-y-6">
      <div className="soft-panel p-6">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Ahorro</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Registra aportaciones y revisa el progreso del objetivo por viaje.
        </p>
        <select
          value={selectedTripId}
          onChange={(event) => setSelectedTripId(event.target.value)}
          className="mt-4 w-full max-w-sm rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
        >
          {trips.map((trip) => (
            <option key={trip.id} value={trip.id}>
              {trip.name}
            </option>
          ))}
        </select>
      </div>

      {selectedTrip ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <SavingsWidget
            saved={totalSaved}
            target={selectedTrip.budget}
            onAddClick={() => setIsSavingModalOpen(true)}
          />
          <section className="widget-card p-6">
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Movimientos</h3>
            <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">Total acumulado: {currency(totalSaved)}</p>
            {savings.length === 0 ? (
              <div className="mt-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-5 dark:border-slate-700 dark:bg-slate-900/80">
                <p className="text-sm text-slate-500 dark:text-slate-400">Todavia no hay aportaciones registradas.</p>
                <button
                  type="button"
                  onClick={() => setIsSavingModalOpen(true)}
                  className="mt-3 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
                >
                  Añadir ahorro
                </button>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {savings.map((saving) => (
                  <article key={saving.id} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900/80">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{saving.date}</span>
                        <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">
                          {currency(saving.amount)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSaving(saving)
                            setIsSavingModalOpen(true)
                          }}
                          className="rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:text-slate-950 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleSavingDelete(saving.id)}
                          className="rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:text-red-600 dark:border-slate-700 dark:text-slate-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      ) : (
        <EmptyState
          title="Sin viaje"
          description="Selecciona un viaje para registrar nuevas aportaciones."
        />
      )}

      <AddSavingModal
        isOpen={isSavingModalOpen}
        onClose={() => {
          setIsSavingModalOpen(false)
          setEditingSaving(null)
        }}
        onSubmit={handleSavingSubmit}
        initialValues={
          editingSaving
            ? { amount: editingSaving.amount, date: editingSaving.date }
            : undefined
        }
        title={editingSaving ? 'Editar ahorro' : 'Añadir ahorro'}
        description={
          editingSaving
            ? 'Actualiza la aportación seleccionada.'
            : 'Registra una nueva aportación al objetivo del viaje.'
        }
        submitLabel={editingSaving ? 'Guardar cambios' : 'Guardar ahorro'}
      />
    </section>
  )
}

export default SavingsPage
