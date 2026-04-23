import { useState } from 'react'

function SettingsPage() {
  const [profileName, setProfileName] = useState('Adrian')
  const [compactMode, setCompactMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

  return (
    <section className="space-y-6">
      <div className="soft-panel p-6">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">Ajustes</h2>
        <p className="mt-2 text-slate-500">
          Configuracion ligera del panel. No persiste aun, pero la interfaz ya es editable.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="widget-card p-6">
          <h3 className="text-lg font-semibold text-slate-950">Perfil</h3>
          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Nombre visible</span>
            <input
              type="text"
              value={profileName}
              onChange={(event) => setProfileName(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            />
          </label>
        </section>

        <section className="widget-card p-6">
          <h3 className="text-lg font-semibold text-slate-950">Preferencias</h3>
          <label className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
            <span className="text-sm text-slate-700">Notificaciones</span>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(event) => setNotifications(event.target.checked)}
            />
          </label>
          <label className="mt-3 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
            <span className="text-sm text-slate-700">Modo compacto</span>
            <input
              type="checkbox"
              checked={compactMode}
              onChange={(event) => setCompactMode(event.target.checked)}
            />
          </label>
        </section>
      </div>
    </section>
  )
}

export default SettingsPage
