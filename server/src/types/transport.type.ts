export type TransportType = 'bus' | 'train' | 'metro' | 'flight'

export type TransportStatus = 'on_time' | 'delayed' | 'boarding'

export interface Transport {
  id: string
  type: TransportType
  company: string
  origin: string
  destination: string
  scheduledTime: string
  estimatedTime: string
  status: TransportStatus
  locationLabel: string
}
