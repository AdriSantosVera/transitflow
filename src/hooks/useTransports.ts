import { useCallback, useEffect, useState } from 'react'
import { getBuses } from '../api/buses'
import { getMetro } from '../api/metro'
import { filterTransportsByType, getTransports } from '../api/transports'
import { getTrains } from '../api/trains'
import type { Transport } from '../types/transport'

type TransportSection = 'all' | 'bus' | 'train' | 'metro' | 'flight'

async function getBySection(section: TransportSection) {
  if (section === 'all') {
    return getTransports()
  }

  if (section === 'bus') {
    return getBuses()
  }

  if (section === 'train') {
    return getTrains()
  }

  if (section === 'flight') {
    const all = await getTransports()
    return filterTransportsByType(all, 'flight')
  }

  return getMetro()
}

export function useTransports(section: TransportSection = 'all') {
  const [transports, setTransports] = useState<Transport[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTransports = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getBySection(section)
      setTransports(data)
    } catch {
      try {
        // Fallback al agregador para no romper UI si un endpoint específico no existe todavía.
        const all = await getTransports()
        const data =
          section === 'all' ? all : filterTransportsByType(all, section)
        setTransports(data)
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'No se pudieron cargar los transportes.'
        setError(message)
        setTransports([])
      }
    } finally {
      setLoading(false)
    }
  }, [section])

  useEffect(() => {
    void loadTransports()
  }, [loadTransports])

  return {
    transports,
    loading,
    error,
    reload: loadTransports,
  }
}
