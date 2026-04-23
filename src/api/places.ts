import { apiGet } from './client'
import type { Place } from '../types/place'

const PLACES_API_PATH = '/api/v1/places'

export interface CreatePlaceInput {
  tripId: string
  name: string
  category: string
  notes: string
}

export function getPlaces(tripId?: string) {
  const url = tripId ? `${PLACES_API_PATH}?tripId=${encodeURIComponent(tripId)}` : PLACES_API_PATH
  return apiGet<Place[]>(url)
}

export async function createPlace(input: CreatePlaceInput) {
  const response = await fetch(PLACES_API_PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as Place
}

export async function updatePlace(id: string, input: Omit<CreatePlaceInput, 'tripId'>) {
  const response = await fetch(`${PLACES_API_PATH}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as Place
}

export async function deletePlace(id: string) {
  const response = await fetch(`${PLACES_API_PATH}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
}
