import { transportsData } from '../data/transports.data'
import type { Transport } from '../types/transport.type'

export function getAllTransports(): Transport[] {
  return transportsData
}

export function getTransportById(id: string): Transport | undefined {
  return transportsData.find((transport) => transport.id === id)
}
