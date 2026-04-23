interface EmptyStateProps {
  title: string
  description: string
}

function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <section className="widget-card p-10 text-center">
      <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-slate-100 to-indigo-50 text-lg font-semibold text-slate-500 shadow-inner">
        ✦
      </div>
      <h2 className="mb-2 text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
      <p className="mx-auto max-w-xl text-slate-500">{description}</p>
    </section>
  )
}

export default EmptyState
