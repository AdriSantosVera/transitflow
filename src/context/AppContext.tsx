import { createContext, useContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

interface AppContextValue {
  favoriteTripIds: string[]
  setFavoriteTripIds: (tripIds: string[]) => void
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [favoriteTripIds, setFavoriteTripIds] = useLocalStorage<string[]>(
    'transitflow:favorites',
    [],
  )

  return (
    <AppContext.Provider value={{ favoriteTripIds, setFavoriteTripIds }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }

  return context
}
