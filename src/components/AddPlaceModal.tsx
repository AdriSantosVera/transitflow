import { useEffect, useState } from 'react'
import Modal from './Modal'

interface AddPlaceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: { name: string; category: string; notes: string }) => Promise<void>
  initialValues?: { name: string; category: string; notes: string }
  title?: string
  description?: string
  submitLabel?: string
}

function AddPlaceModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  title = 'Añadir lugar',
  description = 'Guarda un nuevo punto del viaje con categoria y nota.',
  submitLabel = 'Guardar lugar',
}: AddPlaceModalProps) {
  const [form, setForm] = useState(initialValues ?? { name: '', category: '', notes: '' })
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setForm(initialValues ?? { name: '', category: '', notes: '' })
  }, [initialValues, isOpen])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await onSubmit(form)
      setForm({ name: '', category: '', notes: '' })
      onClose()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo crear el lugar.')
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
          type="text"
          required
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          placeholder="Nombre del lugar"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
        />
        <input
          type="text"
          required
          value={form.category}
          onChange={(event) =>
            setForm((current) => ({ ...current, category: event.target.value }))
          }
          placeholder="Categoria"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
        />
        <textarea
          value={form.notes}
          onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
          placeholder="Notas del lugar"
          className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20"
        />
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
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {isSubmitting ? 'Guardando...' : submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddPlaceModal
