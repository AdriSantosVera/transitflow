import { apiGet } from './client'
import type { Transport } from '../types/transport'

const TRAINS_API_PATH = '/api/v1/trains'

export function getTrains() {
  return apiGet<Transport[]>(TRAINS_API_PATH)
}
