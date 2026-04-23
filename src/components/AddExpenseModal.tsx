import { useEffect, useState } from 'react'
import Modal from './Modal'
import type { Expense } from '../types/expense'

interface AddExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: { type: Expense['type']; amount: number }) => Promise<void>
  initialValues?: { type: Expense['type']; amount: number }
  title?: string
  description?: string
  submitLabel?: string
}

function AddExpenseModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  title = 'Añadir gasto',
  description = 'Registra un nuevo movimiento para este viaje.',
  submitLabel = 'Guardar gasto',
}: AddExpenseModalProps) {
  const [type, setType] = useState<Expense['type']>(initialValues?.type ?? 'ocio')
  const [amount, setAmount] = useState(initialValues ? String(initialValues.amount) : '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setType(initialValues?.type ?? 'ocio')
    setAmount(initialValues ? String(initialValues.amount) : '')
  }, [initialValues, isOpen])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await onSubmit({ type, amount: Number(amount) })
      setAmount('')
      setType('ocio')
      onClose()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo crear el gasto.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      description={description}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={type}
          onChange={(event) => setType(event.target.value as Expense['type'])}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
        >
          <option value="transporte">Transporte</option>
          <option value="alojamiento">Alojamiento</option>
          <option value="comida">Comida</option>
          <option value="ocio">Ocio</option>
        </select>
        <input
          type="number"
          min="0"
          step="0.01"
          required
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Importe"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {isSubmitting ? 'Guardando...' : submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddExpenseModal
