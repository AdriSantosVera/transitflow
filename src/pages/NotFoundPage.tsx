import { Compass, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="soft-panel overflow-hidden p-8 sm:p-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Error 404</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">
            Pagina no encontrada
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400">
            La ruta que has abierto no existe o ya no esta disponible. Vuelve al dashboard para
            seguir gestionando viajes, presupuesto, ahorro y notas desde TransitFlow.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-slate-900 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al dashboard
            </Link>
            <Link
              to="/trips"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-all duration-300 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-600"
            >
              <Compass className="h-4 w-4" />
              Ir a mis viajes
            </Link>
          </div>
        </div>

        <aside className="widget-card p-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_20px_40px_-20px_rgba(99,102,241,0.85)]">
            <Compass className="h-7 w-7" />
          </div>
          <h3 className="mt-5 text-xl font-semibold text-slate-950 dark:text-white">Ruta no valida</h3>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Revisa la URL o navega desde el menu lateral para mantener el flujo de la aplicacion.
          </p>
        </aside>
      </div>
    </section>
  )
}

export default NotFoundPage
