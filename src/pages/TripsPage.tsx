import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import TransportCard from '../components/TransportCard'
import { useTransports } from '../hooks/useTransports'
type SectionKey = 'all' | 'bus' | 'train' | 'metro' | 'flight'

const validTypes: SectionKey[] = ['all', 'bus', 'train', 'metro', 'flight']

const sectionText: Record<SectionKey, { title: string; subtitle: string }> = {
  all: {
    title: 'Todos los trayectos',
    subtitle: 'Vista completa de salidas disponibles en tiempo real simulado.',
  },
  bus: {
    title: 'Trayectos de Bus',
    subtitle: 'Consulta rutas urbanas e interurbanas con su estado actual.',
  },
  train: {
    title: 'Trayectos de Tren',
    subtitle: 'Revisa salidas ferroviarias y cambios de andén rápidamente.',
  },
  metro: {
    title: 'Trayectos de Metro',
    subtitle: 'Consulta salidas de metro y tiempo estimado de paso.',
  },
  flight: {
    title: 'Trayectos de Avión',
    subtitle: 'Visualiza puertas, estado de embarque y horarios estimados.',
  },
}

function TripsPage() {
  const [searchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')

  const typeParam = searchParams.get('type') ?? 'all'
  const section: SectionKey = validTypes.includes(typeParam as SectionKey)
    ? (typeParam as SectionKey)
    : 'all'
  const { transports, loading, error } = useTransports(section)

  const filteredTransports = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return transports.filter((transport) => {
      const matchSearch =
        query.length === 0 ||
        transport.origin.toLowerCase().includes(query) ||
        transport.destination.toLowerCase().includes(query) ||
        transport.company.toLowerCase().includes(query)

      return matchSearch
    })
  }, [searchTerm, transports])

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-2xl font-semibold">Listado de trayectos</h2>
        <p className="text-slate-600">Cargando transportes...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <h2 className="mb-2 text-2xl font-semibold text-red-900">
          Listado de trayectos
        </h2>
        <p className="text-red-700">Error al cargar transportes: {error}</p>
      </section>
    )
  }

  if (transports.length === 0) {
    return (
      <EmptyState
        title="Sin trayectos disponibles"
        description="No hay datos de transporte para mostrar en este momento."
      />
    )
  }

  return (
    <section className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">
          {sectionText[section].title}
        </h2>
        <p className="text-slate-600">{sectionText[section].subtitle}</p>

        <div className="mt-5">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Buscar trayecto
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Ej. Madrid, Barcelona, Renfe..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-2 focus:ring-slate-100"
            />
          </label>
        </div>
      </div>

      {filteredTransports.length === 0 ? (
        <EmptyState
          title="No hay resultados"
          description="Prueba cambiando el texto de búsqueda o el filtro de tipo."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredTransports.map((transport) => (
            <TransportCard key={transport.id} transport={transport} />
          ))}
        </div>
      )}
    </section>
  )
}

export default TripsPage
