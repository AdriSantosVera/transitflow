import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-3 text-2xl font-semibold">Página no encontrada</h2>
      <Link to="/" className="text-blue-600 hover:underline">
        Volver al inicio
      </Link>
    </section>
  )
}

export default NotFoundPage
