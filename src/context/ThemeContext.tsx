import { useEffect } from 'react'

const STORAGE_KEY = 'transitflow-theme'

function applyDarkTheme() {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.classList.add('dark')
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    applyDarkTheme()

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, 'dark')
    }
  }, [])

  return <>{children}</>
}
