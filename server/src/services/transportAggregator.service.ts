import { transportsData } from '../data/transports.data'
import { getMadridBuses } from './buses.service'
import { getTrains } from './trains.service'
import type { Transport, TransportStatus, TransportType } from '../types/transport.type'

const validStatuses: TransportStatus[] = ['on_time', 'delayed', 'boarding']
const validTypes: TransportType[] = ['bus', 'train', 'metro', 'flight']

const metroFallback: Transport[] = [
  {
    id: 'metro-fallback-001',
    type: 'metro',
    company: 'Metro de Madrid',
    origin: 'Sol',
    destination: 'Nuevos Ministerios',
    scheduledTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    estimatedTime: new Date(Date.now() + 6 * 60 * 1000).toISOString(),
    status: 'on_time',
    locationLabel: 'Andén 2',
  },
  {
    id: 'metro-fallback-002',
    type: 'metro',
    company: 'Metro de Madrid',
    origin: 'Moncloa',
    destination: 'Príncipe Pío',
    scheduledTime: new Date(Date.now() + 9 * 60 * 1000).toISOString(),
    estimatedTime: new Date(Date.now() + 9 * 60 * 1000).toISOString(),
    status: 'boarding',
    locationLabel: 'Andén 1',
  },
]

function normalizeIsoDate(value: string | undefined, fallbackMsOffset = 0) {
  if (value) {
    const date = new Date(value)

    if (!Number.isNaN(date.getTime())) {
      return date.toISOString()
    }
  }

  return new Date(Date.now() + fallbackMsOffset).toISOString()
}

function normalizeStatus(value: string | undefined): TransportStatus {
  if (value && validStatuses.includes(value as TransportStatus)) {
    return value as TransportStatus
  }

  return 'on_time'
}

function normalizeTransport(transport: Partial<Transport>, index: number): Transport {
  const safeType =
    transport.type && validTypes.includes(transport.type) ? transport.type : 'bus'

  return {
    id: transport.id?.trim() || `transport-${safeType}-${index}`,
    type: safeType,
    company: transport.company?.trim() || 'Operador no informado',
    origin: transport.origin?.trim() || 'Origen no informado',
    destination: transport.destination?.trim() || 'Destino no informado',
    scheduledTime: normalizeIsoDate(transport.scheduledTime, index * 60_000),
    estimatedTime: normalizeIsoDate(transport.estimatedTime, index * 60_000),
    status: normalizeStatus(transport.status),
    locationLabel: transport.locationLabel?.trim() || 'Ubicación no informada',
  }
}

function getFlights(): Transport[] {
  return transportsData.filter((transport) => transport.type === 'flight')
}

function getMetro(): Transport[] {
  const fromData = transportsData.filter((transport) => transport.type === 'metro')

  if (fromData.length > 0) {
    return fromData
  }

  return metroFallback
}

function sortByScheduledTime(transports: Transport[]) {
  return [...transports].sort((a, b) => {
    const aTime = new Date(a.scheduledTime).getTime()
    const bTime = new Date(b.scheduledTime).getTime()

    if (Number.isNaN(aTime) && Number.isNaN(bTime)) {
      return a.id.localeCompare(b.id)
    }

    if (Number.isNaN(aTime)) {
      return 1
    }

    if (Number.isNaN(bTime)) {
      return -1
    }

    return aTime - bTime
  })
}

function byTypeFilter(transports: Transport[], type?: string) {
  if (!type) {
    return transports
  }

  if (!validTypes.includes(type as TransportType)) {
    return []
  }

  return transports.filter((transport) => transport.type === type)
}

export async function getAggregatedTransports(type?: string) {
  const [busesResult, trainsResult] = await Promise.allSettled([
    getMadridBuses(),
    getTrains(),
  ])

  const buses = busesResult.status === 'fulfilled' ? busesResult.value : []
  const trains = trainsResult.status === 'fulfilled' ? trainsResult.value : []
  const flights = getFlights()
  const metro = getMetro()

  const merged = [...buses, ...trains, ...metro, ...flights].map((transport, index) =>
    normalizeTransport(transport, index),
  )

  const deduped = Array.from(new Map(merged.map((item) => [item.id, item])).values())
  const filtered = byTypeFilter(deduped, type)

  return sortByScheduledTime(filtered)
}

export async function getAggregatedTransportById(id: string) {
  const transports = await getAggregatedTransports()
  return transports.find((transport) => transport.id === id)
}
