export interface Trip {
  id: string
  name: string
  destination: string
  startDate: string
  endDate: string
  budget: number
  image?: string
}

export interface Place {
  id: string
  tripId: string
  name: string
  category: string
  notes: string
}

export interface Expense {
  id: string
  tripId: string
  type: 'transporte' | 'comida' | 'alojamiento' | 'ocio'
  amount: number
}

export interface Saving {
  id: string
  tripId: string
  amount: number
  date: string
}

export interface Note {
  id: string
  tripId: string
  text: string
  createdAt: string
}

export interface TripWithMetrics extends Trip {
  totalExpenses: number
  totalSavings: number
  progressPercentage: number
}
