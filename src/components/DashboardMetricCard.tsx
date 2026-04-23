import type { LucideIcon } from 'lucide-react'

interface DashboardMetricCardProps {
  title: string
  value: string
  detail: string
  icon: LucideIcon
  tone: 'violet' | 'blue' | 'green' | 'orange'
}

const toneMap = {
  violet:
    'from-violet-500/15 via-violet-500/8 to-transparent text-violet-700 ring-violet-200',
  blue: 'from-blue-500/15 via-blue-500/8 to-transparent text-blue-700 ring-blue-200',
  green:
    'from-emerald-500/15 via-emerald-500/8 to-transparent text-emerald-700 ring-emerald-200',
  orange:
    'from-orange-500/15 via-orange-500/8 to-transparent text-orange-700 ring-orange-200',
} as const

function DashboardMetricCard({
  title,
  value,
  detail,
  icon: Icon,
  tone,
}: DashboardMetricCardProps) {
  return (
    <article className="widget-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_-24px_rgba(15,23,42,0.24)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
          <p className="mt-2 text-sm text-slate-400">{detail}</p>
        </div>
        <div
          className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${toneMap[tone]} ring-1`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </article>
  )
}

export default DashboardMetricCard
