import { useState } from 'react'
import { ArrowLeft, CalendarDays, ImagePlus, MapPinned, Wallet } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { createTrip } from '../api/trips'
import { useToast } from '../context/ToastContext'

function TripCreatePage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    image: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const trimmedName = formData.name.trim()
    const trimmedDestination = formData.destination.trim()
    const numericBudget = Number(formData.budget)

    if (!trimmedName || !trimmedDestination) {
      setError('Nombre y destino son obligatorios.')
      setIsSubmitting(false)
      return
    }

    if (!Number.isFinite(numericBudget) || numericBudget <= 0) {
      setError('El presupuesto debe ser mayor que 0.')
      setIsSubmitting(false)
      return
    }

    if (!formData.startDate || !formData.endDate) {
      setError('Debes indicar una fecha de inicio y una fecha de fin.')
      setIsSubmitting(false)
      return
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError('La fecha de fin no puede ser anterior a la fecha de inicio.')
      setIsSubmitting(false)
      return
    }

    try {
      const trip = await createTrip({
        name: trimmedName,
        destination: trimmedDestination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: numericBudget,
        image: formData.image.trim() || undefined,
      })

      showToast('Viaje creado correctamente')
      void navigate(`/trips/${trip.id}`)
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : 'No se pudo crear el viaje.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
            Nuevo plan
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            Crear viaje
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            Define el destino, el presupuesto y las fechas clave. Al crear el viaje se guardara
            en esta app y se abrira directamente su panel de detalle.
          </p>
        </div>
        <Link
          to="/trips"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <form onSubmit={handleSubmit} className="soft-panel p-6 sm:p-8">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-950">Datos principales</h3>
              <p className="mt-1 text-sm text-slate-500">
                Completa lo minimo necesario para abrir el viaje y seguir editandolo despues.
              </p>
            </div>
            <div className="hidden rounded-2xl bg-slate-50 px-4 py-3 text-right sm:block">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Estado
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">Borrador nuevo</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Nombre del viaje</span>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, name: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                placeholder="Escapada a Ibiza"
              />
              <span className="mt-2 block text-xs text-slate-400">
                Usa un nombre facil de identificar en el dashboard.
              </span>
            </label>

            <label className="block md:col-span-2">
              <span className="mb-2 block text-sm font-medium text-slate-700">Destino</span>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, destination: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                placeholder="Ibiza, Espana"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Inicio</span>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, startDate: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Fin</span>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, endDate: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Presupuesto</span>
              <input
                type="number"
                min="1"
                step="0.01"
                required
                value={formData.budget}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, budget: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                placeholder="1200"
              />
              <span className="mt-2 block text-xs text-slate-400">
                Introduce un importe mayor que cero.
              </span>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Imagen opcional
              </span>
              <input
                type="url"
                value={formData.image}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, image: event.target.value }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                placeholder="https://..."
              />
            </label>
          </div>

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

          <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              El viaje se guardara en esta app y aparecera en “Mis viajes”.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Creando...' : 'Crear viaje'}
            </button>
          </div>
        </form>

        <aside className="widget-card p-6 sm:p-7">
          <div className="overflow-hidden rounded-[28px] border border-slate-100 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-950 p-5 text-white shadow-[0_26px_60px_-28px_rgba(15,23,42,0.55)]">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10 text-indigo-100 backdrop-blur-sm">
              <MapPinned className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-2xl font-semibold tracking-tight">Panel de alta</h3>
            <p className="mt-3 text-sm leading-6 text-slate-200/85">
              Crea un viaje persistente con lo esencial y completa el resto desde el detalle.
            </p>

            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <CalendarDays className="h-4 w-4 text-indigo-100" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Fechas</p>
                    <p className="mt-1 text-sm font-medium text-white">
                      {formData.startDate && formData.endDate
                        ? `${formData.startDate} - ${formData.endDate}`
                        : 'Todavia sin definir'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <Wallet className="h-4 w-4 text-emerald-200" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
                      Presupuesto
                    </p>
                    <p className="mt-1 text-sm font-medium text-white">
                      {formData.budget ? `${formData.budget} EUR` : 'Pendiente'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                <ImagePlus className="h-4 w-4" />
              </span>
              <div>
                <p className="font-medium text-slate-800">Imagen opcional</p>
                <p className="mt-1 leading-6">
                  Si anades una URL valida, el viaje aparecera con una cabecera visual desde el
                  primer momento.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default TripCreatePage
