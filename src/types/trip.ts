export type TransportType = 'bus' | 'train' | 'flight'

export interface Trip {
  id: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  status: 'on-time' | 'delayed' | 'boarding' | 'finished'
  type: TransportType
}
