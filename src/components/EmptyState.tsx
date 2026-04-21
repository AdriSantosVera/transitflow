interface EmptyStateProps {
  title: string
  description: string
}

function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-lg text-slate-500">
        ·
      </div>
      <h2 className="mb-2 text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="mx-auto max-w-xl text-slate-600">{description}</p>
    </section>
  )
}

export default EmptyState
