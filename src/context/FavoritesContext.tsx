import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  addFavorite as addFavoriteRequest,
  getFavorites,
  removeFavorite as removeFavoriteRequest,
} from '../api/favorites'

interface FavoritesContextValue {
  favoriteIds: string[]
  loading: boolean
  error: string | null
  isFavorite: (id: string) => boolean
  toggleFavorite: (id: string) => Promise<void>
  reloadFavorites: () => Promise<void>
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reloadFavorites = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getFavorites()
      setFavoriteIds(data)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'No se pudieron cargar favoritos.'
      setError(message)
      setFavoriteIds([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void reloadFavorites()
  }, [reloadFavorites])

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds],
  )

  const toggleFavorite = useCallback(
    async (id: string) => {
      try {
        const nextFavorites = isFavorite(id)
          ? await removeFavoriteRequest(id)
          : await addFavoriteRequest(id)

        setFavoriteIds(nextFavorites)
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'No se pudo actualizar favorito.'
        setError(message)
      }
    },
    [isFavorite],
  )

  const value = useMemo(
    () => ({
      favoriteIds,
      loading,
      error,
      isFavorite,
      toggleFavorite,
      reloadFavorites,
    }),
    [error, favoriteIds, isFavorite, loading, reloadFavorites, toggleFavorite],
  )

  return (
    <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)

  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider')
  }

  return context
}
