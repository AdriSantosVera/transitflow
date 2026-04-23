import { useEffect, useMemo, useState } from 'react'
import AddNoteModal from '../components/AddNoteModal'
import EmptyState from '../components/EmptyState'
import RecentNotesWidget from '../components/RecentNotesWidget'
import { createNote, getNotes } from '../api/notes'
import { useToast } from '../context/ToastContext'
import { useTrips } from '../hooks/useTrips'
import type { Note } from '../types/note'

function NotesPage() {
  const { showToast } = useToast()
  const { trips, loading, error } = useTrips()
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedTripId, setSelectedTripId] = useState('')
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
  const [notesLoading, setNotesLoading] = useState(true)
  const [notesError, setNotesError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadNotes() {
      setNotesLoading(true)
      setNotesError(null)

      try {
        const nextNotes = await getNotes(selectedTripId || undefined)
        if (!cancelled) {
          setNotes(nextNotes)
        }
      } catch (loadError) {
        if (!cancelled) {
          setNotes([])
          setNotesError(
            loadError instanceof Error ? loadError.message : 'No se pudieron cargar las notas.',
          )
        }
      } finally {
        if (!cancelled) {
          setNotesLoading(false)
        }
      }
    }

    void loadNotes()

    return () => {
      cancelled = true
    }
  }, [selectedTripId])

  const tripNames = useMemo(() => new Map(trips.map((trip) => [trip.id, trip.name])), [trips])
  const noteItems = notes.map((note) => ({
    id: note.id,
    text: `${tripNames.get(note.tripId) ?? 'Viaje'} - ${note.text}`,
    date: note.createdAt,
  }))

  async function handleCreateNote(input: { text: string }) {
    if (!selectedTripId) {
      throw new Error('Selecciona un viaje antes de crear una nota.')
    }

    await createNote({
      tripId: selectedTripId,
      text: input.text,
      createdAt: new Date().toISOString().slice(0, 10),
    })

    const refreshedNotes = await getNotes(selectedTripId)
    setNotes(refreshedNotes)
    showToast('Nota añadida')
  }

  if (loading) {
    return <section className="soft-panel p-6 text-slate-500">Cargando notas...</section>
  }

  if (error) {
    return <section className="soft-panel p-6 text-red-600">Error: {error}</section>
  }

  if (notesLoading) {
    return <section className="soft-panel p-6 text-slate-500">Cargando notas...</section>
  }

  if (notesError) {
    return <section className="soft-panel p-6 text-red-600">Error: {notesError}</section>
  }

  return (
    <section className="space-y-6">
      <div className="soft-panel p-6">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Notas</h2>
        <p className="mt-2 text-slate-500">
          Resumen centralizado de notas persistidas por viaje.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <select
            value={selectedTripId}
            onChange={(event) => setSelectedTripId(event.target.value)}
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
          >
            <option value="">Todos los viajes</option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setIsNoteModalOpen(true)}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white"
          >
            Agregar nota
          </button>
        </div>
      </div>

      {noteItems.length === 0 ? (
        <EmptyState
          title="Sin notas"
          description="Todavia no hay notas persistidas para el filtro actual."
        />
      ) : (
        <RecentNotesWidget notes={noteItems} actionLabel="Vista completa" />
      )}

      <AddNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        onSubmit={handleCreateNote}
      />
    </section>
  )
}

export default NotesPage
