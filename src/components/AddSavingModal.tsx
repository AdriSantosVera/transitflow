import { useEffect, useState } from 'react'
import Modal from './Modal'

interface AddSavingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: { amount: number; date: string }) => Promise<void>
  initialValues?: { amount: number; date: string }
  title?: string
  description?: string
  submitLabel?: string
}

function AddSavingModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  title = 'Añadir ahorro',
  description = 'Registra una nueva aportación al objetivo del viaje.',
  submitLabel = 'Guardar ahorro',
}: AddSavingModalProps) {
  const [amount, setAmount] = useState(initialValues ? String(initialValues.amount) : '')
  const [date, setDate] = useState(initialValues?.date ?? new Date().toISOString().slice(0, 10))
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setAmount(initialValues ? String(initialValues.amount) : '')
    setDate(initialValues?.date ?? new Date().toISOString().slice(0, 10))
  }, [initialValues, isOpen])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await onSubmit({ amount: Number(amount), date })
      setAmount('')
      onClose()
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'No se pudo registrar el ahorro.',
      )
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
        <input
          type="number"
          min="0"
          step="0.01"
          required
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Cantidad"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
        />
        <input
          type="date"
          required
          value={date}
          onChange={(event) => setDate(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100"
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
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {isSubmitting ? 'Guardando...' : submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddSavingModal
