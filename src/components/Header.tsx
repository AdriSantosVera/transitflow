import {
  Bell,
  Bookmark,
  Compass,
  CreditCard,
  LayoutDashboard,
  MapPinned,
  NotebookPen,
  Settings,
  Sparkles,
  Wallet,
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

type NavItem = {
  label: string
  icon: typeof LayoutDashboard
  to: string
  active: (pathname: string, search: URLSearchParams) => boolean
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    to: '/dashboard',
    active: (pathname) => pathname === '/dashboard' || pathname === '/',
  },
  {
    label: 'Mis viajes',
    icon: Compass,
    to: '/trips',
    active: (pathname) => pathname.startsWith('/trips'),
  },
  {
    label: 'Itinerario',
    icon: MapPinned,
    to: '/itinerary',
    active: (pathname) => pathname === '/itinerary',
  },
  {
    label: 'Lugares',
    icon: Sparkles,
    to: '/places',
    active: (pathname) => pathname === '/places',
  },
  {
    label: 'Presupuesto',
    icon: CreditCard,
    to: '/budget',
    active: (pathname) => pathname === '/budget',
  },
  {
    label: 'Ahorro',
    icon: Wallet,
    to: '/savings',
    active: (pathname) => pathname === '/savings',
  },
  {
    label: 'Favoritos',
    icon: Bookmark,
    to: '/favorites',
    active: (pathname) => pathname === '/favorites',
  },
  {
    label: 'Notas',
    icon: NotebookPen,
    to: '/notes',
    active: (pathname) => pathname === '/notes',
  },
  {
    label: 'Ajustes',
    icon: Settings,
    to: '/settings',
    active: (pathname) => pathname === '/settings',
  },
]

function NavLinks({ compact = false }: { compact?: boolean }) {
  const location = useLocation()

  return (
    <>
      {navItems.map((item) => {
        const isActive = item.active(
          location.pathname,
          new URLSearchParams(location.search),
        )
        const Icon = item.icon

        return (
          <Link
            key={item.label}
            to={item.to}
            className={`${
              compact
                ? 'rounded-full px-3 py-2 text-xs'
                : 'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm'
            } group font-medium transition-all duration-300 ${
              isActive
                ? 'glow-ring bg-gradient-to-r from-indigo-500 to-violet-500 text-white'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span
              className={`inline-flex items-center justify-center ${
                compact ? 'h-6 w-6' : 'h-9 w-9 rounded-xl'
              } ${isActive ? 'bg-white/15' : 'bg-white/5 group-hover:bg-white/10'}`}
            >
              <Icon className={`${compact ? 'h-3.5 w-3.5' : 'h-4.5 w-4.5'}`} />
            </span>
            {item.label}
          </Link>
        )
      })}
    </>
  )
}

function Header() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/80 px-4 py-4 backdrop-blur-xl lg:hidden">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white shadow-[0_16px_32px_-18px_rgba(99,102,241,0.7)]">
              TF
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
                Dashboard
              </p>
              <h1 className="text-base font-semibold text-slate-950">TransitFlow</h1>
            </div>
          </div>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm">
            <Bell className="h-4 w-4" />
          </button>
        </div>
        <div className="mb-4 rounded-[24px] bg-gradient-to-r from-indigo-500 to-violet-500 p-4 text-white shadow-[0_20px_40px_-20px_rgba(99,102,241,0.85)]">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-100">Accion rapida</p>
          <Link
            to="/trips/new"
            className="mt-2 block w-full rounded-2xl bg-white/15 px-4 py-3 text-left text-sm font-semibold backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
          >
            + Crear viaje
          </Link>
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1">
          <NavLinks compact />
        </nav>
      </header>

      <aside className="hidden h-screen w-[308px] shrink-0 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 px-6 py-8 text-white lg:sticky lg:top-0 lg:flex lg:flex-col">
        <div className="sidebar-card px-5 py-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white shadow-[0_18px_38px_-20px_rgba(99,102,241,0.9)]">
              TF
            </span>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-indigo-200/70">
                Premium Planner
              </p>
              <h1 className="text-xl font-semibold tracking-tight text-white">TransitFlow</h1>
            </div>
          </div>
          <Link
            to="/trips/new"
            className="mt-6 block w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-[0_20px_36px_-18px_rgba(99,102,241,0.8)] transition-all duration-300 hover:-translate-y-0.5"
          >
            + Crear viaje
          </Link>
        </div>

        <nav className="mt-7 space-y-2 overflow-y-auto pr-1">
          <NavLinks />
        </nav>

        <div className="mt-auto sidebar-card overflow-hidden">
          <div className="relative p-5">
            <div className="pointer-events-none absolute -top-10 right-0 h-28 w-28 rounded-full bg-indigo-400/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-8 left-4 h-24 w-24 rounded-full bg-sky-400/15 blur-2xl" />
            <div className="relative h-36 overflow-hidden rounded-[24px] bg-gradient-to-br from-indigo-500/25 via-violet-500/15 to-sky-400/20">
              <div className="absolute left-5 top-5 h-16 w-16 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-sm" />
              <div className="absolute right-6 top-7 h-20 w-20 rounded-full border border-white/15 bg-white/10 backdrop-blur-sm" />
              <div className="absolute bottom-0 left-0 right-0 h-16 rounded-t-[30px] bg-slate-950/55 backdrop-blur-xl" />
            </div>
            <div className="relative mt-4">
              <p className="text-sm font-semibold text-white">Organiza tu proximo viaje</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Manten itinerario, presupuesto y notas en un mismo panel visual.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Header
