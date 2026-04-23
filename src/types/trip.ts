export interface Trip {
  id: string
  name: string
  destination: string
  startDate: string
  endDate: string
  budget: number
  image?: string
  totalExpenses: number
  totalSavings: number
  progressPercentage: number
}
