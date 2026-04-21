import { apiGet } from './client'
import type { Transport } from '../types/transport'

const BUSES_API_PATH = '/api/v1/buses'

export function getBuses() {
  return apiGet<Transport[]>(BUSES_API_PATH)
}
