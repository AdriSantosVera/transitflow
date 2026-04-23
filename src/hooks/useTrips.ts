import { useCallback, useEffect, useState } from 'react'
import { getTrips } from '../api/trips'
import type { Trip } from '../types/trip'

type TripsStatus = 'idle' | 'loading' | 'success' | 'error'

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<TripsStatus>('idle')

  const reloadTrips = useCallback(async () => {
    let cancelled = false

    async function loadTrips() {
      setLoading(true)
      setError(null)
      setStatus('loading')

      try {
        const data = await getTrips()

        if (!cancelled) {
          setTrips(data)
          setStatus('success')
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'No se pudieron cargar los viajes.'

        if (!cancelled) {
          setError(message)
          setTrips([])
          setStatus('error')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    await loadTrips()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let active = true
    void reloadTrips().then((cleanup) => {
      if (!active) {
        cleanup?.()
      }
    })
    return () => {
      active = false
    }
  }, [reloadTrips])

  return { trips, loading, error, status, reloadTrips }
}
