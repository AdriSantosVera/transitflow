interface SavingsWidgetProps {
  saved: number
  target: number
  onAddClick?: () => void
  actionLabel?: string
}

function currency(value: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

function SavingsWidget({ saved, target, onAddClick, actionLabel = '+ Añadir ahorro' }: SavingsWidgetProps) {
  const percentage = target > 0 ? Math.min(100, Math.round((saved / target) * 100)) : 0
  const missing = Math.max(target - saved, 0)
  const radius = 56
  const circumference = 2 * Math.PI * radius
  const strokeOffset = circumference - (percentage / 100) * circumference

  return (
    <section className="widget-card p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Ahorro del viaje</h3>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Progreso actual frente al presupuesto</p>
        </div>
        <button
          type="button"
          onClick={onAddClick}
          aria-pressed="false"
          className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-[0_14px_28px_-16px_rgba(15,23,42,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-900 dark:bg-indigo-500 dark:hover:bg-indigo-400"
        >
          {actionLabel}
        </button>
      </div>

      <div className="flex flex-col items-center gap-5 xl:flex-row xl:items-center">
        <div className="relative flex h-40 w-40 items-center justify-center">
          <svg className="-rotate-90" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="rgba(226,232,240,0.9)"
              strokeWidth="14"
            />
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="url(#savingGradient)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
            />
            <defs>
              <linearGradient id="savingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#14b8a6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute text-center">
            <div className="text-4xl font-semibold text-slate-950 dark:text-white">{percentage}%</div>
            <div className="text-sm text-slate-400 dark:text-slate-500">completado</div>
          </div>
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-3 xl:grid-cols-1">
          <div className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900/80">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              Objetivo
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{currency(target)}</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 px-4 py-3 dark:bg-emerald-500/12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
              Ahorrado
            </p>
            <p className="mt-2 text-xl font-semibold text-emerald-700 dark:text-emerald-300">{currency(saved)}</p>
          </div>
          <div className="rounded-2xl bg-orange-50 px-4 py-3 dark:bg-orange-500/12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
              Faltan
            </p>
            <p className="mt-2 text-xl font-semibold text-orange-700 dark:text-orange-300">{currency(missing)}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SavingsWidget
