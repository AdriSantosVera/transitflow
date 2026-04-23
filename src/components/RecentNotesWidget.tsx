import { Link } from 'react-router-dom'
import { CalendarDays, StickyNote } from 'lucide-react'

interface NoteItem {
  id: string
  text: string
  date: string
}

interface RecentNotesWidgetProps {
  notes: NoteItem[]
  actionHref?: string
  actionLabel?: string
}

function RecentNotesWidget({
  notes,
  actionHref = '/notes',
  actionLabel = 'Ver todas las notas',
}: RecentNotesWidgetProps) {
  return (
    <section className="widget-card p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Notas recientes</h3>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Ideas y recordatorios de viaje</p>
        </div>
        <Link to={actionHref} className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
          {actionLabel}
        </Link>
      </div>

      <div className="space-y-3">
        {notes.map((note) => (
          <article key={note.id} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900/80">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-indigo-600 dark:bg-slate-800 dark:text-indigo-300">
                <StickyNote className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{note.text}</p>
                <div className="mt-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {note.date}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default RecentNotesWidget
