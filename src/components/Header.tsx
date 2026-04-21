import { Link, useLocation } from 'react-router-dom'

type NavItem = {
  label: string
  icon: string
  to: string
  active: (pathname: string, search: URLSearchParams) => boolean
}

const navItems: NavItem[] = [
  {
    label: 'Todos',
    icon: '◦',
    to: '/trips?type=all',
    active: (pathname, search) =>
      pathname === '/trips' && (search.get('type') ?? 'all') === 'all',
  },
  {
    label: 'Bus',
    icon: '🚌',
    to: '/trips?type=bus',
    active: (pathname, search) =>
      pathname === '/trips' && search.get('type') === 'bus',
  },
  {
    label: 'Tren',
    icon: '🚆',
    to: '/trips?type=train',
    active: (pathname, search) =>
      pathname === '/trips' && search.get('type') === 'train',
  },
  {
    label: 'Avión',
    icon: '✈️',
    to: '/trips?type=flight',
    active: (pathname, search) =>
      pathname === '/trips' && search.get('type') === 'flight',
  },
  {
    label: 'Metro',
    icon: 'Ⓜ️',
    to: '/trips?type=metro',
    active: (pathname, search) =>
      pathname === '/trips' && search.get('type') === 'metro',
  },
  {
    label: 'Favoritos',
    icon: '♥',
    to: '/favorites',
    active: (pathname) => pathname === '/favorites',
  },
]

function NavLinks({ compact = false }: { compact?: boolean }) {
  const location = useLocation()
  const search = new URLSearchParams(location.search)

  return (
    <>
      {navItems.map((item) => {
        const isActive = item.active(location.pathname, search)
        return (
          <Link
            key={item.label}
            to={item.to}
            className={`${
              compact
                ? 'rounded-full px-3 py-1.5 text-xs'
                : 'flex items-center gap-2 rounded-lg px-3 py-2 text-sm'
            } font-medium transition ${
              isActive
                ? 'bg-slate-900/95 text-white'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {!compact && (
              <span className="inline-flex w-4 items-center justify-center text-xs opacity-80">
                {item.icon}
              </span>
            )}
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
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mb-3 flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
            TF
          </span>
          <h1 className="text-base font-semibold text-slate-900">TransitFlow</h1>
        </div>
        <nav className="flex gap-2 overflow-x-auto pb-1">
          <NavLinks compact />
        </nav>
      </header>

      <aside className="hidden w-64 shrink-0 border-r border-slate-200/80 bg-white p-6 lg:flex lg:flex-col lg:gap-7">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
            TF
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Newtek
            </p>
            <h1 className="text-lg font-semibold text-slate-900">TransitFlow</h1>
          </div>
        </div>

        <nav className="space-y-1 rounded-xl border border-slate-200/90 bg-slate-50/80 p-2">
          <NavLinks />
        </nav>
      </aside>
    </>
  )
}

export default Header
