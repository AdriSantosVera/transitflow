export type ExpenseType = 'transporte' | 'comida' | 'alojamiento' | 'ocio'

export interface Expense {
  id: string
  tripId: string
  type: ExpenseType
  amount: number
}
