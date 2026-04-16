import { NavLink } from 'react-router-dom'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${
    isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-200'
  }`

function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <h1 className="text-lg font-semibold">TransitFlow</h1>
        <nav className="flex gap-2">
          <NavLink to="/" className={linkClass} end>
            Inicio
          </NavLink>
          <NavLink to="/trips" className={linkClass}>
            Trayectos
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
