import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

interface ThemeToggleProps {
  compact?: boolean
}

function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-left shadow-sm transition-all duration-300 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/90 dark:hover:border-slate-600 dark:hover:bg-slate-900 ${
        compact ? 'h-10 justify-between' : 'h-12'
      }`}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      aria-pressed={isDark}
    >
      {!compact ? (
        <span className="min-w-0">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
            Tema
          </span>
          <span className="block text-sm font-medium text-slate-900 dark:text-white">
            {isDark ? 'Modo oscuro' : 'Modo claro'}
          </span>
        </span>
      ) : (
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {isDark ? 'Oscuro' : 'Claro'}
        </span>
      )}

      <span
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300 ${
          isDark ? 'bg-indigo-500/80' : 'bg-slate-200'
        }`}
      >
        <span
          className={`absolute left-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm transition-all duration-300 ${
            isDark ? 'translate-x-5 text-indigo-500' : 'translate-x-0'
          }`}
        >
          {isDark ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
        </span>
      </span>
    </button>
  )
}

export default ThemeToggle
