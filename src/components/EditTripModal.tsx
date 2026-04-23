import { useEffect, useState } from 'react'
import Modal from './Modal'
import type { Trip } from '../types/trip'

interface EditTripModalProps {
  isOpen: boolean
  onClose: () => void
  trip: Trip | null
  onSubmit: (input: {
    name: string
    destination: string
    startDate: string
    endDate: string
    budget: number
    image?: string
  }) => Promise<void>
}

function EditTripModal({ isOpen, onClose, trip, onSubmit }: EditTripModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    image: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!trip) {
      return
    }

    setFormData({
      name: trip.name,
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      budget: String(trip.budget),
      image: trip.image ?? '',
    })
  }, [trip, isOpen])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const trimmedName = formData.name.trim()
    const trimmedDestination = formData.destination.trim()
    const numericBudget = Number(formData.budget)

    if (!trimmedName || !trimmedDestination) {
      setError('Nombre y destino son obligatorios.')
      setIsSubmitting(false)
      return
    }

    if (!Number.isFinite(numericBudget) || numericBudget <= 0) {
      setError('El presupuesto debe ser mayor que 0.')
      setIsSubmitting(false)
      return
    }

    if (!formData.startDate || !formData.endDate) {
      setError('Debes indicar una fecha de inicio y una fecha de fin.')
      setIsSubmitting(false)
      return
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('La fecha de fin no puede ser anterior a la fecha de inicio.')
      setIsSubmitting(false)
      return
    }

    try {
      await onSubmit({
        name: trimmedName,
        destination: trimmedDestination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: numericBudget,
        image: formData.image.trim() || undefined,
      })
      onClose()
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'No se pudo actualizar el viaje.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Editar viaje"
      description="Actualiza los datos principales sin salir del panel."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          required
          value={formData.name}
          onChange={(event) =>
            setFormData((current) => ({ ...current, name: event.target.value }))
          }
          placeholder="Nombre del viaje"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
        />
        <input
          type="text"
          required
          value={formData.destination}
          onChange={(event) =>
            setFormData((current) => ({ ...current, destination: event.target.value }))
          }
          placeholder="Destino"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="date"
            required
            value={formData.startDate}
            onChange={(event) =>
              setFormData((current) => ({ ...current, startDate: event.target.value }))
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
          />
          <input
            type="date"
            required
            value={formData.endDate}
            onChange={(event) =>
              setFormData((current) => ({ ...current, endDate: event.target.value }))
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            type="number"
            min="1"
            step="0.01"
            required
            value={formData.budget}
            onChange={(event) =>
              setFormData((current) => ({ ...current, budget: event.target.value }))
            }
            placeholder="Presupuesto"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
          />
          <input
            type="url"
            value={formData.image}
            onChange={(event) =>
              setFormData((current) => ({ ...current, image: event.target.value }))
            }
            placeholder="Imagen opcional"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
        />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default EditTripModal
