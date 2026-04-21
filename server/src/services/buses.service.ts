import type { Transport } from '../types/transport.type'

type EmtApiEnvelope<T> = {
  code?: string
  description?: string
  datetime?: string
  data?: T[]
}

type EmtLoginData = {
  accessToken?: string
  token?: string
  email?: string
  [key: string]: unknown
}

type EmtArriveItem = {
  line?: string
  destination?: string
  estimateArrive?: number | string
  bus?: string | number
  [key: string]: unknown
}

type EmtStopData = {
  stopId?: string | number
  stop?: string | number
  stopName?: string
  name?: string
  line?: string
  arrive?: EmtArriveItem[]
  Arrive?: EmtArriveItem[]
  [key: string]: unknown
}

type LegacyArriveItem = {
  lineId?: string
  destination?: string
  busTimeLeft?: number | string
  busId?: number | string
  [key: string]: unknown
}

type LegacyArriveResponse = {
  arrives?: LegacyArriveItem[]
  [key: string]: unknown
}

const EMT_BASE_URL = process.env.EMT_BASE_URL ?? 'https://openapi.emtmadrid.es'
const EMT_LEGACY_BASE_URL =
  process.env.EMT_LEGACY_BASE_URL ?? 'https://openbus.emtmadrid.es:9443'
const EMT_CLIENT_ID = process.env.EMT_CLIENT_ID ?? ''
const EMT_PASS_KEY = process.env.EMT_PASS_KEY ?? ''
const EMT_API_KEY = process.env.EMT_API_KEY ?? EMT_PASS_KEY
const EMT_STOPS = (process.env.EMT_STOP_IDS ?? '70,1465,1521')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)

const ARRIVES_REQUEST_BODY = {
  Text_EstimationsRequired_YN: 'Y',
  Text_IncidencesRequired_YN: 'N',
  Text_StopRequired_YN: 'Y',
  Text_DistanceRequired_YN: 'N',
}

let tokenCache: { token: string; cachedAt: number } | null = null

function getErrorDetail(error: unknown) {
  if (error instanceof Error) {
    const causeMessage =
      typeof error.cause === 'object' &&
      error.cause !== null &&
      'message' in error.cause &&
      typeof (error.cause as { message?: unknown }).message === 'string'
        ? String((error.cause as { message: string }).message)
        : ''

    return causeMessage ? `${error.message} (cause: ${causeMessage})` : error.message
  }

  return String(error)
}

async function safeFetch(url: string, init?: RequestInit) {
  try {
    return await fetch(url, init)
  } catch (error) {
    const detail = getErrorDetail(error)
    throw new Error(`Network error calling ${url}: ${detail}`)
  }
}

function nowIsoFromOffset(seconds: number) {
  return new Date(Date.now() + Math.max(seconds, 0) * 1000).toISOString()
}

function getSecondsToArrive(value: unknown) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed < 0) {
    return 0
  }

  return parsed
}

function getStatusFromSeconds(seconds: number): Transport['status'] {
  if (seconds <= 60) {
    return 'boarding'
  }

  if (seconds <= 300) {
    return 'on_time'
  }

  return 'delayed'
}

function mapArrivalToTransport(
  arrival: EmtArriveItem,
  stopData: EmtStopData,
  stopId: string,
  index: number,
): Transport {
  const secondsToArrive = getSecondsToArrive(arrival.estimateArrive)
  const estimatedTime = nowIsoFromOffset(secondsToArrive)
  const scheduledTime = nowIsoFromOffset(Math.max(secondsToArrive - 120, 0))

  const origin =
    stopData.stopName ?? stopData.name ?? `Parada ${stopData.stop ?? stopId}`
  const destination = arrival.destination ?? `Línea ${arrival.line ?? 'N/A'}`
  const line = arrival.line ?? 'N/A'
  const busRef = arrival.bus ?? index

  return {
    id: `emt-${stopId}-${line}-${busRef}`,
    type: 'bus',
    company: 'EMT Madrid',
    origin,
    destination,
    scheduledTime,
    estimatedTime,
    status: getStatusFromSeconds(secondsToArrive),
    locationLabel: `Parada ${stopId} · Línea ${line}`,
  }
}

function mapLegacyArrivalToTransport(
  arrival: LegacyArriveItem,
  stopId: string,
  index: number,
): Transport {
  const secondsToArrive = getSecondsToArrive(arrival.busTimeLeft)
  const estimatedTime = nowIsoFromOffset(secondsToArrive)
  const scheduledTime = nowIsoFromOffset(Math.max(secondsToArrive - 120, 0))
  const line = arrival.lineId ?? 'N/A'
  const busRef = arrival.busId ?? index

  return {
    id: `emt-legacy-${stopId}-${line}-${busRef}`,
    type: 'bus',
    company: 'EMT Madrid',
    origin: `Parada ${stopId}`,
    destination: arrival.destination ?? `Línea ${line}`,
    scheduledTime,
    estimatedTime,
    status: getStatusFromSeconds(secondsToArrive),
    locationLabel: `Parada ${stopId} · Línea ${line}`,
  }
}

async function getNewAccessToken() {
  if (!EMT_CLIENT_ID || !EMT_API_KEY) {
    throw new Error(
      'EMT credentials are missing. Configure EMT_CLIENT_ID and EMT_API_KEY (or EMT_PASS_KEY).',
    )
  }

  const loginCandidates = [
    `${EMT_BASE_URL}/user/login`,
    `${EMT_BASE_URL}/mobilitylabs/user/login`,
    `${EMT_BASE_URL}/v2/mobilitylabs/user/login`,
    `${EMT_BASE_URL}/v2/user/login`,
    `${EMT_BASE_URL}/v1/mobilitylabs/user/login`,
    `${EMT_BASE_URL}/v1/user/login`,
    `${EMT_BASE_URL}/ver/mobilitylabs/user/login`,
    `${EMT_BASE_URL}/ver/user/login`,
    `${EMT_BASE_URL}/user/login/`,
    `${EMT_BASE_URL}/mobilitylabs/user/login/`,
    `${EMT_BASE_URL}/v2/mobilitylabs/user/login/`,
    `${EMT_BASE_URL}/v2/user/login/`,
    `${EMT_BASE_URL}/v1/mobilitylabs/user/login/`,
    `${EMT_BASE_URL}/v1/user/login/`,
    `${EMT_BASE_URL}/ver/mobilitylabs/user/login/`,
    `${EMT_BASE_URL}/ver/user/login/`,
  ]

  const authHeaderCandidates = [
    {
      clientId: EMT_CLIENT_ID,
      passKey: EMT_API_KEY,
    },
    {
      'X-ClientId': EMT_CLIENT_ID,
      passKey: EMT_API_KEY,
    },
    {
      'X-ClientId': EMT_CLIENT_ID,
      'X-ApiKey': EMT_API_KEY,
    },
    {
      clientId: EMT_CLIENT_ID,
      'X-ApiKey': EMT_API_KEY,
    },
  ]

  let lastError = 'Unknown EMT login error'

  for (const loginUrl of loginCandidates) {
    for (const authHeaders of authHeaderCandidates) {
      const response = await safeFetch(loginUrl, {
        method: 'GET',
        headers: authHeaders,
      })

      if (!response.ok) {
        lastError = `EMT login failed on ${loginUrl} with status ${response.status}`
        continue
      }

      const payload = (await response.json()) as EmtApiEnvelope<EmtLoginData>

      if (payload.code !== '00') {
        lastError = payload.description
          ? `EMT login failed: ${payload.description}`
          : `EMT login failed with code ${payload.code ?? 'unknown'}`
        continue
      }

      const tokenCandidate =
        payload.data?.[0]?.accessToken ?? payload.data?.[0]?.token ?? ''

      if (!tokenCandidate) {
        lastError = 'EMT login succeeded but no access token was returned.'
        continue
      }

      tokenCache = { token: tokenCandidate, cachedAt: Date.now() }
      return tokenCandidate
    }
  }

  throw new Error(lastError)
}

async function getAccessToken() {
  const tokenAgeMs = tokenCache ? Date.now() - tokenCache.cachedAt : Infinity

  if (tokenCache && tokenAgeMs < 50 * 60 * 1000) {
    return tokenCache.token
  }

  return getNewAccessToken()
}

async function fetchStopArrivals(stopId: string, accessToken: string) {
  const arrivalsCandidates = [
    `${EMT_BASE_URL}/transport/busemtmad/stops/${stopId}/arrives/all`,
    `${EMT_BASE_URL}/v1/transport/busemtmad/stops/${stopId}/arrives/all`,
    `${EMT_BASE_URL}/v2/transport/busemtmad/stops/${stopId}/arrives/all`,
    `${EMT_BASE_URL}/ver/transport/busemtmad/stops/${stopId}/arrives/all`,
    `${EMT_BASE_URL}/transport/busemtmad/stops/${stopId}/arrives`,
    `${EMT_BASE_URL}/v1/transport/busemtmad/stops/${stopId}/arrives`,
    `${EMT_BASE_URL}/v2/transport/busemtmad/stops/${stopId}/arrives`,
    `${EMT_BASE_URL}/ver/transport/busemtmad/stops/${stopId}/arrives`,
    `${EMT_BASE_URL}/transport/busemtmad/stops/${stopId}/arrives/all/`,
    `${EMT_BASE_URL}/v1/transport/busemtmad/stops/${stopId}/arrives/all/`,
    `${EMT_BASE_URL}/v2/transport/busemtmad/stops/${stopId}/arrives/all/`,
    `${EMT_BASE_URL}/ver/transport/busemtmad/stops/${stopId}/arrives/all/`,
    `${EMT_BASE_URL}/transport/busemtmad/stops/${stopId}/arrives/`,
    `${EMT_BASE_URL}/v1/transport/busemtmad/stops/${stopId}/arrives/`,
    `${EMT_BASE_URL}/v2/transport/busemtmad/stops/${stopId}/arrives/`,
    `${EMT_BASE_URL}/ver/transport/busemtmad/stops/${stopId}/arrives/`,
  ]

  let lastError = `EMT buses request failed for stop ${stopId}`

  for (const endpoint of arrivalsCandidates) {
    const response = await safeFetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        accessToken,
      },
      body: JSON.stringify(ARRIVES_REQUEST_BODY),
    })

    if (!response.ok) {
      lastError = `EMT buses request failed on ${endpoint} (${response.status})`
      continue
    }

    const payload = (await response.json()) as EmtApiEnvelope<EmtStopData>

    if (payload.code === '80') {
      throw new Error('EMT token expired or invalid')
    }

    if (payload.code && payload.code !== '00') {
      lastError = payload.description
        ? `EMT buses request error: ${payload.description}`
        : `EMT buses request failed with code ${payload.code}`
      continue
    }

    return payload.data ?? []
  }

  throw new Error(lastError)
}

async function fetchLegacyStopArrivals(stopId: string) {
  const formBody = new URLSearchParams({
    idClient: EMT_CLIENT_ID,
    passKey: EMT_API_KEY,
    cultureInfo: 'ES',
    idStop: stopId,
  })

  const response = await safeFetch(
    `${EMT_LEGACY_BASE_URL}/emt-proxy-server/last/geo/GetArriveStop.php`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody.toString(),
    },
  )

  if (!response.ok) {
    throw new Error(`EMT legacy request failed for stop ${stopId} (${response.status})`)
  }

  const payload = (await response.json()) as LegacyArriveResponse
  return payload.arrives ?? []
}

function dedupeById(items: Transport[]) {
  const dedupedById = new Map<string, Transport>()

  for (const item of items) {
    dedupedById.set(item.id, item)
  }

  return Array.from(dedupedById.values())
}

export async function getMadridBuses(): Promise<Transport[]> {
  if (EMT_STOPS.length === 0) {
    return []
  }

  try {
    let accessToken = await getAccessToken()

    const stopsData: EmtStopData[] = []

    for (const stopId of EMT_STOPS) {
      try {
        const data = await fetchStopArrivals(stopId, accessToken)
        stopsData.push(...data)
      } catch (error) {
        if (error instanceof Error && error.message.includes('token expired')) {
          accessToken = await getNewAccessToken()
          const data = await fetchStopArrivals(stopId, accessToken)
          stopsData.push(...data)
          continue
        }

        throw error
      }
    }

    const mapped = stopsData.flatMap((stopData, stopIndex) => {
      const stopId = String(stopData.stopId ?? stopData.stop ?? EMT_STOPS[stopIndex] ?? 'unknown')
      const arrivals = stopData.Arrive ?? stopData.arrive ?? []

      if (arrivals.length === 0) {
        return [
          {
            id: `emt-${stopId}-empty-${stopIndex}`,
            type: 'bus' as const,
            company: 'EMT Madrid',
            origin: stopData.stopName ?? stopData.name ?? `Parada ${stopId}`,
            destination: 'Sin estimaciones disponibles',
            scheduledTime: new Date().toISOString(),
            estimatedTime: new Date().toISOString(),
            status: 'on_time' as const,
            locationLabel: `Parada ${stopId}`,
          },
        ]
      }

      return arrivals.map((arrival, arrivalIndex) =>
        mapArrivalToTransport(arrival, stopData, stopId, arrivalIndex),
      )
    })

    return dedupeById(mapped)
  } catch (modernError) {
    try {
      const legacyBuses: Transport[] = []

      for (const stopId of EMT_STOPS) {
        const arrivals = await fetchLegacyStopArrivals(stopId)

        if (arrivals.length === 0) {
          legacyBuses.push({
            id: `emt-legacy-${stopId}-empty`,
            type: 'bus',
            company: 'EMT Madrid',
            origin: `Parada ${stopId}`,
            destination: 'Sin estimaciones disponibles',
            scheduledTime: new Date().toISOString(),
            estimatedTime: new Date().toISOString(),
            status: 'on_time',
            locationLabel: `Parada ${stopId}`,
          })
          continue
        }

        for (const [index, arrival] of arrivals.entries()) {
          legacyBuses.push(mapLegacyArrivalToTransport(arrival, stopId, index))
        }
      }

      return dedupeById(legacyBuses)
    } catch (legacyError) {
      throw new Error(
        `EMT modern source failed: ${getErrorDetail(modernError)} | EMT legacy source failed: ${getErrorDetail(legacyError)}`,
      )
    }
  }
}
