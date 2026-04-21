import type { Transport } from '../types/transport.type'

type IRailStationInfo = {
  name?: string
  standardname?: string
}

type IRailDeparture = {
  id?: string
  station?: string
  time?: string
  delay?: string
  vehicle?: string
  platform?: string
  platforminfo?: {
    name?: string
    normal?: string
  }
}

type IRailLiveboardResponse = {
  station?: string
  stationinfo?: IRailStationInfo
  departures?: {
    number?: string
    departure?: IRailDeparture[] | IRailDeparture
  }
}

const TRAINS_API_URL = process.env.TRAINS_API_URL ?? 'https://api.irail.be/v1/liveboard'
const TRAINS_DEFAULT_STATION = process.env.TRAINS_DEFAULT_STATION ?? 'Brussels-Central'
const TRAINS_COMPANY = process.env.TRAINS_COMPANY ?? 'SNCB/NMBS'

const fallbackTrains: Transport[] = [
  {
    id: 'train-fallback-001',
    type: 'train',
    company: 'Renfe',
    origin: 'Madrid Chamartín',
    destination: 'Barcelona Sants',
    scheduledTime: new Date(Date.now() + 12 * 60 * 1000).toISOString(),
    estimatedTime: new Date(Date.now() + 14 * 60 * 1000).toISOString(),
    status: 'delayed',
    locationLabel: 'Andén 3',
  },
  {
    id: 'train-fallback-002',
    type: 'train',
    company: 'Ouigo',
    origin: 'Madrid Puerta de Atocha',
    destination: 'Valencia Joaquín Sorolla',
    scheduledTime: new Date(Date.now() + 22 * 60 * 1000).toISOString(),
    estimatedTime: new Date(Date.now() + 22 * 60 * 1000).toISOString(),
    status: 'on_time',
    locationLabel: 'Andén 1',
  },
]

function parseUnixToIso(unixValue: string | undefined, fallbackIso: string) {
  const unix = Number(unixValue)

  if (!Number.isFinite(unix) || unix <= 0) {
    return fallbackIso
  }

  return new Date(unix * 1000).toISOString()
}

function parseDelayToSeconds(delayValue: string | undefined) {
  const delay = Number(delayValue)

  if (!Number.isFinite(delay) || delay < 0) {
    return 0
  }

  return delay
}

function getStatus(scheduledIso: string, delaySeconds: number): Transport['status'] {
  const scheduledMs = new Date(scheduledIso).getTime()
  const etaMs = scheduledMs + delaySeconds * 1000
  const toDepartureMs = etaMs - Date.now()

  if (toDepartureMs <= 2 * 60 * 1000) {
    return 'boarding'
  }

  if (delaySeconds > 5 * 60) {
    return 'delayed'
  }

  return 'on_time'
}

function mapDepartureToTransport(
  departure: IRailDeparture,
  index: number,
  stationName: string,
): Transport {
  const fallbackScheduled = new Date(Date.now() + (index + 1) * 10 * 60 * 1000).toISOString()
  const scheduledTime = parseUnixToIso(departure.time, fallbackScheduled)
  const delaySeconds = parseDelayToSeconds(departure.delay)
  const estimatedTime = new Date(
    new Date(scheduledTime).getTime() + delaySeconds * 1000,
  ).toISOString()

  const destination = departure.station ?? 'Destino no informado'
  const platform =
    departure.platforminfo?.name ?? departure.platform ?? 'Andén sin informar'

  return {
    id: departure.id ?? departure.vehicle ?? `train-${stationName}-${index}`,
    type: 'train',
    company: TRAINS_COMPANY,
    origin: stationName,
    destination,
    scheduledTime,
    estimatedTime,
    status: getStatus(scheduledTime, delaySeconds),
    locationLabel: `Andén ${platform}`,
  }
}

async function fetchIRailLiveboard(): Promise<IRailLiveboardResponse> {
  const url = `${TRAINS_API_URL}?station=${encodeURIComponent(TRAINS_DEFAULT_STATION)}&format=json`
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'TransitFlow/1.0 (educational project)',
    },
  })

  if (!response.ok) {
    throw new Error(`iRail request failed with status ${response.status}`)
  }

  return (await response.json()) as IRailLiveboardResponse
}

export async function getTrains(): Promise<Transport[]> {
  try {
    const liveboard = await fetchIRailLiveboard()
    const stationName =
      liveboard.stationinfo?.name ??
      liveboard.stationinfo?.standardname ??
      liveboard.station ??
      TRAINS_DEFAULT_STATION

    const rawDepartures = liveboard.departures?.departure ?? []
    const departures = Array.isArray(rawDepartures)
      ? rawDepartures
      : rawDepartures
        ? [rawDepartures]
        : []

    if (departures.length === 0) {
      return fallbackTrains
    }

    return departures.slice(0, 15).map((departure, index) =>
      mapDepartureToTransport(departure, index, stationName),
    )
  } catch {
    return fallbackTrains
  }
}
