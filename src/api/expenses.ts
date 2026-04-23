import { apiGet } from './client'
import type { Expense } from '../types/expense'

const EXPENSES_API_PATH = '/api/v1/expenses'

export interface CreateExpenseInput {
  tripId: string
  type: Expense['type']
  amount: number
}

export function getExpenses(tripId?: string) {
  const url = tripId
    ? `${EXPENSES_API_PATH}?tripId=${encodeURIComponent(tripId)}`
    : EXPENSES_API_PATH
  return apiGet<Expense[]>(url)
}

export async function createExpense(input: CreateExpenseInput) {
  const response = await fetch(EXPENSES_API_PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as Expense
}

export async function updateExpense(id: string, input: Omit<CreateExpenseInput, 'tripId'>) {
  const response = await fetch(`${EXPENSES_API_PATH}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as Expense
}

export async function deleteExpense(id: string) {
  const response = await fetch(`${EXPENSES_API_PATH}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
}
