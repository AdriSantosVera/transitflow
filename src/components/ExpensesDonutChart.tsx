import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent'
import type { ExpenseType } from '../types/expense'

interface ExpensesDonutChartProps {
  values: Record<ExpenseType | 'otros', number>
}

const palette: Record<ExpenseType | 'otros', string> = {
  transporte: '#6366f1',
  alojamiento: '#f97316',
  comida: '#0ea5e9',
  ocio: '#22c55e',
  otros: '#94a3b8',
}

const labels: Record<ExpenseType | 'otros', string> = {
  transporte: 'Transporte',
  alojamiento: 'Alojamiento',
  comida: 'Comida',
  ocio: 'Ocio',
  otros: 'Otros',
}

function currency(value: number) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

function ExpensesDonutChart({ values }: ExpensesDonutChartProps) {
  const data = Object.entries(values)
    .map(([key, value]) => ({
      key: key as ExpenseType | 'otros',
      name: labels[key as ExpenseType | 'otros'],
      value,
    }))
    .filter((item) => item.value > 0)

  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <section className="widget-card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-950">Gastos por categoria</h3>
        <p className="mt-1 text-sm text-slate-400">Distribucion actual del presupuesto</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr] xl:grid-cols-1">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={68}
                outerRadius={96}
                paddingAngle={4}
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={entry.key} fill={palette[entry.key]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: ValueType | undefined) =>
                  currency(typeof value === 'number' ? value : Number(value ?? 0))
                }
                contentStyle={{
                  borderRadius: '16px',
                  border: '1px solid rgba(226,232,240,0.9)',
                  boxShadow: '0 18px 32px -20px rgba(15,23,42,0.25)',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Total gastado
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{currency(total)}</p>
          </div>

          {data.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: palette[item.key] }}
                />
                <span className="text-sm font-medium text-slate-600">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-slate-950">{currency(item.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExpensesDonutChart
