import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <section className="space-y-5">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-sm">
        <p className="mb-3 inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
          TransitFlow
        </p>
        <h2 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-900">
          Organiza tus desplazamientos de forma clara y sin estrés
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Consulta trayectos de bus, tren y vuelo en una sola vista. Revisa
          estado, horario estimado y guarda tus rutas favoritas para acceder en
          segundos.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          to="/trips"
          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Acceso rápido
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">
            Ver trayectos
          </h3>
          <p className="mt-2 text-slate-600">
            Explora salidas disponibles y aplica filtros por tipo de transporte.
          </p>
          <span className="mt-4 inline-flex text-sm font-semibold text-sky-700 transition group-hover:translate-x-0.5">
            Ir a Trayectos →
          </span>
        </Link>

        <Link
          to="/favorites"
          className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Acceso rápido
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">
            Mis favoritos
          </h3>
          <p className="mt-2 text-slate-600">
            Consulta tus rutas guardadas y entra directamente a lo que más usas.
          </p>
          <span className="mt-4 inline-flex text-sm font-semibold text-rose-700 transition group-hover:translate-x-0.5">
            Ir a Favoritos →
          </span>
        </Link>
      </div>
    </section>
  )
}

export default HomePage
