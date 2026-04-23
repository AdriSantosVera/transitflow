import { useEffect, useState } from 'react'
import ExpensesDonutChart from '../components/ExpensesDonutChart'
import EmptyState from '../components/EmptyState'
import { getExpenses } from '../api/expenses'
import { useTrips } from '../hooks/useTrips'
import type { Expense } from '../types/expense'

function currency(value: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

function BudgetPage() {
  const { trips, loading, error } = useTrips()
  const [selectedTripId, setSelectedTripId] = useState('')
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [expensesLoading, setExpensesLoading] = useState(true)
  const [expensesError, setExpensesError] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedTripId && trips[0]) {
      setSelectedTripId(trips[0].id)
    }
  }, [selectedTripId, trips])

  useEffect(() => {
    let cancelled = false

    async function loadExpenses() {
      setExpensesLoading(true)
      setExpensesError(null)

      try {
        const nextExpenses = await getExpenses(selectedTripId || undefined)
        if (!cancelled) {
          setExpenses(nextExpenses)
        }
      } catch (loadError) {
        if (!cancelled) {
          setExpenses([])
          setExpensesError(
            loadError instanceof Error
              ? loadError.message
              : 'No se pudieron cargar los gastos.',
          )
        }
      } finally {
        if (!cancelled) {
          setExpensesLoading(false)
        }
      }
    }

    void loadExpenses()

    return () => {
      cancelled = true
    }
  }, [selectedTripId])

  const selectedTrip = trips.find((trip) => trip.id === selectedTripId)
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const distribution = expenses.reduce<
    Record<'transporte' | 'alojamiento' | 'comida' | 'ocio' | 'otros', number>
  >(
    (acc, expense) => {
      acc[expense.type] += expense.amount
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

  if (loading) {
    return <section className="soft-panel p-6 text-slate-500 dark:text-slate-400">Cargando presupuesto...</section>
  }

  if (error) {
    return <section className="soft-panel p-6 text-red-600">Error: {error}</section>
  }

  if (expensesLoading) {
    return <section className="soft-panel p-6 text-slate-500 dark:text-slate-400">Cargando presupuesto...</section>
  }

  if (expensesError) {
    return <section className="soft-panel p-6 text-red-600">Error: {expensesError}</section>
  }

  return (
    <section className="space-y-6">
      <div className="soft-panel p-6">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Presupuesto</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Analiza el reparto de gasto y el peso actual de cada categoria.
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

      {expenses.length === 0 ? (
        <EmptyState
          title="Sin gastos"
          description="No hay gastos registrados para el viaje seleccionado."
        />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <ExpensesDonutChart values={distribution} />
          <section className="widget-card p-6">
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
              {selectedTrip ? `Detalle de ${selectedTrip.name}` : 'Detalle global'}
            </h3>
            <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">Total gastado: {currency(total)}</p>
            <div className="mt-5 space-y-3">
              {expenses.map((expense) => (
                <article key={expense.id} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900/80">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium capitalize text-slate-700 dark:text-slate-300">
                      {expense.type}
                    </span>
                    <span className="text-sm font-semibold text-slate-950 dark:text-white">
                      {currency(expense.amount)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}
    </section>
  )
}

export default BudgetPage
