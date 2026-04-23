import { apiGet } from './client'
import type { Saving } from '../types/saving'

const SAVINGS_API_PATH = '/api/v1/savings'

export interface CreateSavingInput {
  tripId: string
  amount: number
  date: string
}

export function getSavings(tripId?: string) {
  const url = tripId
    ? `${SAVINGS_API_PATH}?tripId=${encodeURIComponent(tripId)}`
    : SAVINGS_API_PATH
  return apiGet<Saving[]>(url)
}

export async function createSaving(input: CreateSavingInput) {
  const response = await fetch(SAVINGS_API_PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as Saving
}

export async function updateSaving(id: string, input: Omit<CreateSavingInput, 'tripId'>) {
  const response = await fetch(`${SAVINGS_API_PATH}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as Saving
}

export async function deleteSaving(id: string) {
  const response = await fetch(`${SAVINGS_API_PATH}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
}
