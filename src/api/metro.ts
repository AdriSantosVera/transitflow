import { apiGet } from './client'
import type { Transport } from '../types/transport'

const METRO_API_PATH = '/api/v1/metro'

export function getMetro() {
  return apiGet<Transport[]>(METRO_API_PATH)
}
