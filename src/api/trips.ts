import { apiGet } from './client'
import type { Trip } from '../types/trip'

const TRIPS_API_PATH = '/api/v1/trips'

export interface CreateTripInput {
  name: string
  destination: string
  startDate: string
  endDate: string
  budget: number
  image?: string
}

export async function getTrips() {
  return apiGet<Trip[]>(TRIPS_API_PATH)
}

export async function getTripById(id: string) {
  return apiGet<Trip>(`${TRIPS_API_PATH}/${id}`)
}

export async function createTrip(input: CreateTripInput) {
  const response = await fetch(TRIPS_API_PATH, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as Trip
}

export async function updateTrip(id: string, input: CreateTripInput) {
  const response = await fetch(`${TRIPS_API_PATH}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }

  return (await response.json()) as Trip
}

export async function deleteTrip(id: string) {
  const response = await fetch(`${TRIPS_API_PATH}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`)
  }
}
