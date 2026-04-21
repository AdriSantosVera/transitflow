import { apiGet } from './client'
import type { Transport } from '../types/transport'

const TRANSPORTS_API_PATH = '/api/v1/transports'

export function getTransports() {
  return apiGet<Transport[]>(TRANSPORTS_API_PATH)
}

export function getTransportById(id: string) {
  return apiGet<Transport>(`${TRANSPORTS_API_PATH}/${id}`)
}

export function filterTransportsByType(
  transports: Transport[],
  type: Transport['type'],
) {
  return transports.filter((transport) => transport.type === type)
}
