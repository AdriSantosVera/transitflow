import { useEffect, useState } from 'react'
import Modal from './Modal'

interface AddNoteModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: { text: string }) => Promise<void> | void
  initialValues?: { text: string }
  title?: string
  description?: string
  submitLabel?: string
}

function AddNoteModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
  title = 'Añadir nota',
  description = 'Guarda un recordatorio o detalle rapido del viaje.',
  submitLabel = 'Guardar nota',
}: AddNoteModalProps) {
  const [text, setText] = useState(initialValues?.text ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setText(initialValues?.text ?? '')
  }, [initialValues, isOpen])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!text.trim()) {
      setError('Escribe una nota antes de guardarla.')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      await onSubmit({ text: text.trim() })
      setText('')
      onClose()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo guardar la nota.')
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
        <textarea
          required
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Escribe una nota"
          className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
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
            className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {isSubmitting ? 'Guardando...' : submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddNoteModal
